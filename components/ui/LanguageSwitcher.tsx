'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Languages } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          language === 'en' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('th')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          language === 'th' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        TH
      </button>
    </div>
  )
}
