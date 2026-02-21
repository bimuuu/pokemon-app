'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function TestPage() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>Test Page</h1>
      <p>Testing i18n functionality:</p>
      <p>Language context working: {typeof t === 'function' ? 'YES' : 'NO'}</p>
      <p>Current language test:</p>
      <p>Common: {t('rarities.common')}</p>
      <p>Uncommon: {t('rarities.uncommon')}</p>
      <p>Rare: {t('rarities.rare')}</p>
      <p>Ultra-rare: {t('rarities.ultra-rare')}</p>
    </div>
  )
}
