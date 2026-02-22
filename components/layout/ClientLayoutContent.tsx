'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { Dropdown } from '@/components/ui/dropdown'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  const pathname = usePathname()

  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href
    return `text-sm font-medium transition-all duration-200 relative ${
      isActive 
        ? 'text-primary' 
        : 'hover:text-primary text-muted-foreground'
    }`
  }

  const getActiveIndicator = (href: string) => {
    const isActive = pathname === href
    if (!isActive) return null
    return (
      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Cobbleverse Planner
            </h1>
          </div>
          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/" className={getNavLinkClass('/')}>
                {t('navigation.pokemon')}
                {getActiveIndicator('/')}
              </Link>
            </li>
            <li>
              <Link href="/team" className={getNavLinkClass('/team')}>
                {t('navigation.teamBuilder')}
                {getActiveIndicator('/team')}
              </Link>
            </li>
            <li>
              <Link href="/types" className={getNavLinkClass('/types')}>
                {t('navigation.typeChart')}
                {getActiveIndicator('/types')}
              </Link>
            </li>
            <li>
              <Link href="/gyms" className={getNavLinkClass('/gyms')}>
                {t('navigation.gymsAndElites')}
                {getActiveIndicator('/gyms')}
              </Link>
            </li>
            <li>
              <Link href="/items" className={getNavLinkClass('/items')}>
                {t('navigation.items')}
                {getActiveIndicator('/items')}
              </Link>
            </li>
            <li>
              <Dropdown
                trigger={t('navigation.gameData')}
                items={[
                  { label: t('navigation.moves'), href: '/moves' },
                  { label: t('navigation.abilities'), href: '/abilities' },
                  { label: t('navigation.natures'), href: '/natures' }
                ]}
              />
            </li>
          </ul>
          <LanguageSwitcher />
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
