import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!role || !['ADMIN', 'MODERATOR'].includes(role)) redirect('/')

  const [userCount, listingCount, bookingCount, pendingListings, recentBookings] = await Promise.all([
    db.user.count(),
    db.listing.count({ where: { status: 'ACTIVE' } }),
    db.booking.count({ where: { status: { in: ['CONFIRMED', 'ACTIVE', 'COMPLETED'] } } }),
    db.listing.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    db.booking.findMany({
      include: {
        listing: { select: { brand: true, model: true } },
        renter:  { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const stats = { userCount, listingCount, bookingCount }

  return (
    <AdminDashboard
      stats={stats}
      pendingListings={JSON.parse(JSON.stringify(pendingListings))}
      recentBookings={JSON.parse(JSON.stringify(recentBookings))}
    />
  )
}
