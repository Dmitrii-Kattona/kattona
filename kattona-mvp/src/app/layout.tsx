import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { TestModeBanner } from '@/components/layout/TestModeBanner'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? 'https://kattona.fi'),
  title: {
    default: 'Kattona – Rent a Roof Box in Helsinki',
    template: '%s | Kattona',
  },
  description:
    'Peer-to-peer roof box rental in Helsinki, Espoo, Vantaa and Kauniainen. Find a compatible box in 60 seconds. No registration needed to search.',
  keywords: ['roof box rental', 'kattoboksi vuokraus', 'Helsinki', 'Thule', 'Hapro', 'ski box'],
  openGraph: {
    type: 'website',
    locale: 'en_FI',
    alternateLocale: ['fi_FI'],
    siteName: 'Kattona',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#007AFF',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Kattona',
              url: 'https://kattona.fi',
              description: 'Peer-to-peer roof box rental marketplace in Helsinki metropolitan area',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://kattona.fi/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <TestModeBanner />
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
