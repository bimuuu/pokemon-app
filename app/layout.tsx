import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { PokemonCacheProvider } from '@/contexts/PokemonCacheContext'
import { ClientLayoutContent } from '@/components/layout/ClientLayoutContent'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Pokemon Cobbleverse Planner',
    template: '%s | Pokemon Cobbleverse Planner'
  },
  description: 'A comprehensive planning tool for Pokemon Cobbleverse modpack with team builder, type charts, and game data.',
  keywords: ['pokemon', 'cobbleverse', 'planner', 'team builder', 'type chart', 'minecraft'],
  authors: [{ name: 'Pokemon Cobbleverse Planner Team' }],
  creator: 'Pokemon Cobbleverse Planner Team',
  publisher: 'Pokemon Cobbleverse Planner',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pokemon-cobbleverse-planner.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pokemon-cobbleverse-planner.vercel.app',
    title: 'Pokemon Cobbleverse Planner',
    description: 'A comprehensive planning tool for Pokemon Cobbleverse modpack with team builder, type charts, and game data.',
    siteName: 'Pokemon Cobbleverse Planner',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pokemon Cobbleverse Planner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon Cobbleverse Planner',
    description: 'A comprehensive planning tool for Pokemon Cobbleverse modpack with team builder, type charts, and game data.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ef4444',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <PokemonCacheProvider>
            <ClientLayoutContent>{children}</ClientLayoutContent>
          </PokemonCacheProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
