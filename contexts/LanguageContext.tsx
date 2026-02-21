'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, useTranslation, getBrowserLanguage } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getBrowserLanguage())

  const t = useTranslation(language)

  useEffect(() => {
    const storedLanguage = localStorage.getItem('pokemon-app-language') as Language
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'th')) {
      setLanguage(storedLanguage)
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('pokemon-app-language', lang)
  }

  const contextValue: LanguageContextType = {
    language,
    setLanguage: changeLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
