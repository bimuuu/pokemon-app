import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { PokemonCacheProvider } from '@/contexts/PokemonCacheContext'
import { ClientLayoutContent } from '@/components/layout/ClientLayoutContent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pokemon Cobbleverse Planner',
  description: 'A comprehensive planning tool for Pokemon Cobbleverse modpack',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <PokemonCacheProvider>
        <html lang="en">
          <body className={inter.className}>
            <ClientLayoutContent>{children}</ClientLayoutContent>
          </body>
        </html>
      </PokemonCacheProvider>
    </LanguageProvider>
  )
}
