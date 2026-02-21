'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h1 className="text-xl font-bold">Cobbleverse Planner</h1>
          </div>
          <ul className="flex items-center space-x-6">
            <li>
              <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
                {t('navigation.pokemon')}
              </a>
            </li>
            <li>
              <a href="/team" className="text-sm font-medium hover:text-primary transition-colors">
                {t('navigation.teamBuilder')}
              </a>
            </li>
            <li>
              <a href="/types" className="text-sm font-medium hover:text-primary transition-colors">
                {t('navigation.typeChart')}
              </a>
            </li>
            <li>
              <a href="/gyms" className="text-sm font-medium hover:text-primary transition-colors">
                {t('navigation.gymsAndElites')}
              </a>
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
