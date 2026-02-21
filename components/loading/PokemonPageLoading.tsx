'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { FiltersSkeleton } from './FiltersSkeleton'
import { LoadingGrid } from './LoadingSkeleton'

interface PokemonPageLoadingProps {
  showFilters?: boolean
}

export function PokemonPageLoading({ showFilters = true }: PokemonPageLoadingProps) {
  const { t } = useLanguage()

  return (
    <section className="space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('home.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </header>

      {showFilters && (
        <section className="bg-white p-6 rounded-lg shadow-sm border">
          <FiltersSkeleton />
        </section>
      )}

      <LoadingGrid />
    </section>
  )
}
