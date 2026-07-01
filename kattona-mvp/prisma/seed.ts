import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Kattona database…')

  // Demo owner
  const owner = await db.user.upsert({
    where: { email: 'demo-owner@kattona.fi' },
    update: {},
    create: {
      email:      'demo-owner@kattona.fi',
      name:       'Mikael V.',
      idVerified: true,
      phoneVerified: true,
    },
  })

  // Demo admin
  await db.user.upsert({
    where: { email: 'admin@kattona.fi' },
    update: {},
    create: {
      email: 'admin@kattona.fi',
      name:  'Admin',
      role:  'ADMIN',
    },
  })

  const listings = [
    {
      brand: 'Thule', model: 'Motion XT XL', volume: 520, maxSkis: 6, maxLoad: 75,
      pricePerDay: 20, city: 'HELSINKI' as const, lat: 60.1766, lng: 24.9408,
      compatibleBars:   ['Thule WingBar Evo', 'Thule SquareBar', 'OEM Aero Bars'],
      compatibleMounts: ['PowerClick', 'FastGrip'],
      photos: ['https://images.unsplash.com/photo-1519619091416-f5d671ea5c5e?w=800&q=80'],
    },
    {
      brand: 'Hapro', model: 'Traxer 6.6', volume: 400, maxSkis: 4, maxLoad: 50,
      pricePerDay: 15, city: 'ESPOO' as const, lat: 60.2041, lng: 24.6559,
      compatibleBars:   ['Thule WingBar Evo', 'OEM Square Bars', 'OEM Aero Bars'],
      compatibleMounts: ['Universal Clamp', 'U-bolt'],
      photos: [],
    },
    {
      brand: 'Thule', model: 'Motion XT XXL', volume: 610, maxSkis: 7, maxLoad: 75,
      pricePerDay: 25, city: 'VANTAA' as const, lat: 60.2934, lng: 25.0378,
      compatibleBars:   ['Thule WingBar Evo', 'Thule ProBar', 'OEM Aero Bars'],
      compatibleMounts: ['PowerClick'],
      photos: [],
    },
    {
      brand: 'Calix', model: '460 Pro', volume: 460, maxSkis: 5, maxLoad: 60,
      pricePerDay: 18, city: 'KAUNIAINEN' as const, lat: 60.2124, lng: 24.7261,
      compatibleBars:   ['OEM Aero Bars', 'OEM Square Bars', 'Other / Unknown'],
      compatibleMounts: ['Universal Clamp', 'EasySnap'],
      photos: [],
    },
  ]

  for (const l of listings) {
    await db.listing.create({
      data: {
        ...l,
        userId:       owner.id,
        status:       'ACTIVE',
        availability: { blocked: [] },
      },
    })
  }

  console.log(`✅ Seeded ${listings.length} listings and 2 users.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
