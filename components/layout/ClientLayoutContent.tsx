'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { Dropdown } from '@/components/ui/dropdown'
import { CategoryNavigation } from '@/components/navigation/CategoryNavigation'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
      <motion.div 
        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
        layoutId="activeIndicator"
        initial={false}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </motion.div>
            <motion.h1 
              className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
            >
              Cobbleverse Planner
            </motion.h1>
          </motion.div>
          <motion.ul 
            className="flex items-center space-x-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className={getNavLinkClass('/')}>
                {t('navigation.pokemon')}
                {getActiveIndicator('/')}
              </Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Dropdown
                trigger="Categories"
                items={[
                  { label: 'All Categories', href: '/categories' },
                  { label: 'First Partner', href: '/categories/first-partner' },
                  { label: 'Pseudo-Legendary', href: '/categories/pseudo-legendary' },
                  { label: 'Legendary Pokémon', href: '/categories/legendary' },
                  { label: 'Mythical Pokémon', href: '/categories/mythical' },
                  { label: 'Ultra Beasts', href: '/categories/ultra-beast' },
                  { label: 'Fossil Pokémon', href: '/categories/fossil' },
                  { label: 'Paradox Pokémon', href: '/categories/paradox' }
                ]}
              />
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/team" className={getNavLinkClass('/team')}>
                {t('navigation.teamBuilder')}
                {getActiveIndicator('/team')}
              </Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/types" className={getNavLinkClass('/types')}>
                {t('navigation.typeChart')}
                {getActiveIndicator('/types')}
              </Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/gyms" className={getNavLinkClass('/gyms')}>
                {t('navigation.gymsAndElites')}
                {getActiveIndicator('/gyms')}
              </Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/items" className={getNavLinkClass('/items')}>
                {t('navigation.items')}
                {getActiveIndicator('/items')}
              </Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Dropdown
                trigger={t('navigation.gameData')}
                items={[
                  { label: t('navigation.moves'), href: '/moves' },
                  { label: t('navigation.abilities'), href: '/abilities' },
                  { label: t('navigation.natures'), href: '/natures' },
                  { label: t('navigation.heldItems'), href: '/held-items' }
                ]}
              />
            </motion.li>
          </motion.ul>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <LanguageSwitcher />
          </motion.div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
