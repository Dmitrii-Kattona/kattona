import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { differenceInCalendarDays, parseISO } from 'date-fns'

// TEST VERSION: no Stripe. Booking is a manual request — the renter and
// owner arrange payment and pickup between themselves outside the platform.

const CreateBookingSchema = z.object({
  listingId:       z.string().cuid(),
  startDate:       z.string(),
  endDate:         z.string(),
  safetyConfirmed: z.boolean().refine(v => v === true, 'Safety checklist must be confirmed'),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const renterId = (session.user as any).id
  const body     = await req.json()

  const parsed = CreateBookingSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { listingId, startDate, endDate, safetyConfirmed } = parsed.data

  const listing = await db.listing.findUnique({ where: { id: listingId, status: 'ACTIVE' } })
  if (!listing) return NextResponse.json({ error: 'Listing not found or unavailable' }, { status: 404 })

  const conflict = await db.booking.findFirst({
    where: {
      listingId,
      status: { in: ['CONFIRMED', 'ACTIVE'] },
      AND: [{ startDate: { lt: new Date(endDate) } }, { endDate: { gt: new Date(startDate) } }],
    },
  })
  if (conflict) return NextResponse.json({ error: 'Dates not available' }, { status: 409 })

  if (listing.userId === renterId) {
    return NextResponse.json({ error: 'You cannot book your own listing' }, { status: 400 })
  }

  const days       = Math.max(1, differenceInCalendarDays(parseISO(endDate), parseISO(startDate)))
  const totalPrice = listing.pricePerDay * days

  try {
    const booking = await db.booking.create({
      data: {
        listingId,
        renterId,
        startDate:      new Date(startDate),
        endDate:        new Date(endDate),
        totalPrice,
        depositAmount:  0,     // no deposit collected in test mode
        platformFee:    0,     // no platform fee collected in test mode
        ownerAmount:    totalPrice,
        status:         'CONFIRMED', // auto-confirmed; payment is arranged manually
        safetyConfirmed,
      },
    })

    return NextResponse.json({ bookingId: booking.id }, { status: 201 })
  } catch (err) {
    console.error('POST /api/bookings error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── GET /api/bookings — list user's bookings ──────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const role   = req.nextUrl.searchParams.get('role') ?? 'renter'

  const bookings = await db.booking.findMany({
    where: role === 'owner' ? { listing: { userId } } : { renterId: userId },
    include: {
      listing: { select: { brand: true, model: true, photos: true, city: true, pricePerDay: true, user: { select: { name: true, email: true, phone: true } } } },
      renter:  { select: { name: true, image: true, email: true } },
      reviews: { select: { rating: true, comment: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ bookings })
}
