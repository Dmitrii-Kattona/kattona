# Kattona — Peer-to-Peer Roof Box Rental (TEST VERSION)

**Kattona** (Finnish: "as a roof") connects roof box owners and renters in the
Helsinki metropolitan area.

> 🧪 **This is a test deployment for friends & family.** No payments are
> processed through this site. No Google/Apple login. Bookings are manual
> requests — renter and owner arrange pickup and payment directly. All legal
> pages carry a draft disclaimer. See `WHAT'S DISABLED` below before sharing
> this build further.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS (custom design system) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js — **email magic link only** |
| Payments | **None** — manual arrangement between owner and renter |
| State | Zustand (persisted search context) |
| Email | Resend / SMTP |

---

## What's disabled in this build

- ❌ Stripe / any payment processing — removed entirely (no `stripe` package, no PaymentIntents, no webhooks)
- ❌ Google sign-in
- ❌ Apple sign-in
- ❌ Stripe Connect owner onboarding
- ✅ Email magic-link sign-in — only auth method
- ✅ A sticky orange "TEST VERSION" banner appears on every page
- ✅ Booking flow ends with a request + the owner's contact details, not a charge
- ✅ All legal pages show a test-disclaimer notice at the top

When you're ready to go live for real, re-introduce `@stripe/stripe-js`,
`stripe`, the `/api/stripe/*` routes, and the Google/Apple providers in
`src/lib/auth.ts` (all of this was present in the prior production-track
version and can be restored).

---

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/your-org/kattona.git
cd kattona
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

**Minimum required for local dev:**
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000`
- Email server settings (or leave blank — magic links will log to console in dev with most providers)

### 3. Database setup

```bash
npm run db:push       # Push schema to DB
npm run db:generate   # Generate Prisma client
npm run db:seed       # Seed demo listings
```

### 4. Run dev server

```bash
npm run dev
# Open http://localhost:3000
```

---

## Project structure

```
src/
├── app/
│   ├── (auth)/          login page (email only)
│   ├── (main)/           home, search, listing/[id], list-your-box
│   │                     bookings, brands/[brand], legal/[doc]
│   ├── admin/            admin panel (role-protected)
│   └── api/              boxes, bookings, auth, admin
├── components/
│   ├── layout/           Nav, Footer, TestModeBanner
│   ├── home/             HowItWorks, TrustSection, OwnerCTA, FeaturedListings
│   ├── search/           HeroSearch, DateRangePicker, SearchResults, CitySelect
│   ├── listing/          ListingCard, ListingGallery, ListingSpecs, OwnerProfile
│   ├── booking/          BookingWidget (request flow), CompatibilityCheck
│   └── admin/            AdminDashboard
├── lib/                  db.ts, auth.ts, compatibility.ts
├── store/                searchStore.ts (Zustand)
├── types/                index.ts (all shared types + constants)
└── prisma/               schema.prisma, seed.ts
```

---

## Key flows

### Renter journey
1. Browse the catalog by city + dates → no car info needed to search
2. Open a listing → see specs, owner profile, the box's declared compatible bars/mounts
3. Click "Request to book" → compatibility self-check: a couple of quick questions about your roof bars → self-reported yes/check result
4. Confirm and continue → 6-point safety checklist (all required)
5. If not logged in → email magic-link sign-in
6. **Booking request sent** — no charge. Confirmation screen shows the owner's email (and phone, if provided) so you can arrange pickup and payment directly.

### Owner journey
1. "List your box" → 8-step flow (brand, bars, mounts, photos, price, calendar, location, declaration)
2. Submit → listing enters PENDING state, no bank details required
3. Admin approves → status → ACTIVE
4. Owner receives booking requests by email and arranges payment manually

### Compatibility model
Kattona never identifies a renter's vehicle automatically — there's no reliable
data source for "which roof bars are mounted on this specific car" (it's an
aftermarket accessory, not a registry field). Instead:
- Renters self-report their roof bar type via `CompatibilityCheck` at booking time
- The stated bar is compared against the listing's declared `compatibleBars`
- Result is always advisory (`yes` / `check`) — Kattona never blocks a booking outright
- The renter explicitly acknowledges in the safety checklist that fitment is self-certified, not verified by Kattona

---

## Security

- All API routes are authenticated via `getServerSession(authOptions)`
- Admin routes check `role: ADMIN | MODERATOR`
- GDPR: no vehicle identification data is collected at all in this version

---

## Legal notice

All legal documents in `/src/app/(main)/legal/` carry a test-version
disclaimer and are **not legally binding**. They must be reviewed and
approved by a qualified Finnish lawyer (asianajaja) before any real
transactions take place on this platform.

---

## Deployment (Vercel)

```bash
vercel deploy --prod
npx prisma migrate deploy
```

Recommended Vercel settings:
- Region: `fra1` (Frankfurt, EU)
- PostgreSQL: Vercel Postgres or Supabase (EU region)
- Node.js: 20.x

This test build has no payment provider, so there's nothing else to
configure before sharing the URL with friends and family for testing.
