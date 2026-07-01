// src/types/index.ts

export type City = 'HELSINKI' | 'ESPOO' | 'VANTAA' | 'KAUNIAINEN'
export type ListingStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'INACTIVE'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'
export type Role = 'USER' | 'MODERATOR' | 'ADMIN'

export interface BoxListing {
  id: string
  brand: string
  model: string
  compatibleBars: string[]
  compatibleMounts: string[]
  volume?: number
  maxSkis: number
  maxLoad: number
  pricePerDay: number
  photos: string[]
  city: City
  lat: number
  lng: number
  availability: { blocked: string[] }
  status: ListingStatus
  createdAt: Date
  updatedAt: Date
  userId: string
  user: PublicUser
  _avgRating?: number
  _reviewCount?: number
  _distance?: number
}

export interface PublicUser {
  id: string
  name: string | null
  image: string | null
  idVerified: boolean
  phoneVerified: boolean
  createdAt: Date
  _avgRating?: number
  _reviewCount?: number
  _completedRentals?: number
}

// Renter no longer identifies their car. They pick a box from the catalog,
// then confirm compatibility themselves at booking time.
export interface RenterContext {
  selectedBars: string[]
}

export interface CompatibilityCheckAnswers {
  hasRoofBars: boolean   // "Do you already have roof bars installed?"
  barsType: string       // which bars, from ROOF_BAR_OPTIONS
  understandsRisk: boolean // explicit acknowledgement of responsibility
}

export interface SearchParams {
  city?: City
  startDate?: string
  endDate?: string
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'distance'
}

export interface CompatibilityResult {
  compatible: 'yes' | 'no' | 'check'
  reason?: string
}

export interface BookingCreateInput {
  listingId: string
  startDate: string
  endDate: string
  safetyConfirmed: boolean
}

export interface PriceSummary {
  days: number
  pricePerDay: number
  subtotal: number
  platformFee: number   // included in subtotal (15%)
  deposit: number       // 200 € hold
  total: number         // charged immediately
}

// ── Compatibility data ──────────────────────────────────────────

export const ROOF_BOX_BRANDS = [
  'Thule', 'Hapro', 'Calix', 'Packline', 'Northline',
  'Yakima', 'Kamei', 'Farad', 'Menabo', 'Cruz', 'Mont Blanc', 'Autoform',
] as const

export const ROOF_BAR_OPTIONS = [
  'Thule WingBar Evo',
  'Thule SquareBar',
  'Thule ProBar',
  'Yakima StreamLine',
  'Mont Blanc Xplore',
  'Cruz Airo',
  'OEM Aero Bars',
  'OEM Square Bars',
  'Other / Unknown',
] as const

export const MOUNT_OPTIONS = [
  'PowerClick',
  'FastGrip',
  'EasySnap',
  'QuickGrip',
  'T-slot',
  'U-bolt',
  'Universal Clamp',
] as const

export const CAR_MAKES = [
  'Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Kia',
  'Mazda', 'Mercedes', 'Nissan', 'Peugeot', 'Renault',
  'Skoda', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo',
] as const

export const CITIES: { value: City; label: string; labelFi: string }[] = [
  { value: 'HELSINKI',    label: 'Helsinki',    labelFi: 'Helsinki' },
  { value: 'ESPOO',       label: 'Espoo',       labelFi: 'Espoo' },
  { value: 'VANTAA',      label: 'Vantaa',      labelFi: 'Vantaa' },
  { value: 'KAUNIAINEN',  label: 'Kauniainen',  labelFi: 'Kauniainen' },
]

export const SAFETY_CHECKLIST = [
  { id: 'compat',   en: 'I have checked that this box is compatible with my roof bars — Kattona does not verify this for me.', fi: 'Olen tarkistanut, että tämä boksi on yhteensopiva kattopalkkieni kanssa — Kattona ei tarkista tätä puolestani.' },
  { id: 'bars',     en: 'I confirm I own compatible roof bars installed on my car.',                              fi: 'Vahvistan, että minulla on yhteensopivat kattopalkit asennettuna autooni.' },
  { id: 'manual',   en: 'I have read the manufacturer\'s installation instructions.',                            fi: 'Olen lukenut valmistajan asennusohjeet.' },
  { id: 'install',  en: 'I am responsible for installation and will check all mounting points before driving.',  fi: 'Olen vastuussa asennuksesta ja tarkistan kaikki kiinnityspisteet ennen ajoa.' },
  { id: 'retighten',en: 'I will re-tighten after 50 km and respect the maximum speed recommendation.',           fi: 'Kiristän kiinnitykset 50 km jälkeen ja noudatan enimmäisnopeussuositusta.' },
  { id: 'accept',   en: 'I accept full responsibility for installation after pickup.',                           fi: 'Hyväksyn täyden vastuun asennuksesta noudon jälkeen.' },
] as const

export type SafetyCheckId = typeof SAFETY_CHECKLIST[number]['id']
