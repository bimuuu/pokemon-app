'use client'

import { Search, X } from 'lucide-react'
import { POKEMON_TYPES } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'

interface TeamFiltersProps {
  searchTerm: string
  selectedType: string
  selectedGeneration: string
  onSearchChange: (term: string) => void
  onTypeChange: (type: string) => void
  onGenerationChange: (generation: string) => void
  onClearFilters: () => void
}

export function TeamFilters({
  searchTerm,
  selectedType,
  selectedGeneration,
  onSearchChange,
  onTypeChange,
  onGenerationChange,
  onClearFilters
}: TeamFiltersProps) {
  const { t } = useLanguage()

  const hasActiveFilters = searchTerm || selectedType || selectedGeneration

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={t('team.searchPlaceholder')}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{t('team.allTypes')}</option>
        {POKEMON_TYPES.map(type => (
          <option key={type} value={type}>
            {t(`types.${type}`)}
          </option>
        ))}
      </select>
      
      <select
        value={selectedGeneration}
        onChange={(e) => onGenerationChange(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{t('team.allGenerations')}</option>
        <option value="Gen 1">{t('generations.gen1')}</option>
        <option value="Gen 2">{t('generations.gen2')}</option>
        <option value="Gen 3">{t('generations.gen3')}</option>
        <option value="Gen 4">{t('generations.gen4')}</option>
        <option value="Gen 5">{t('generations.gen5')}</option>
        <option value="Gen 6">{t('generations.gen6')}</option>
        <option value="Gen 7">{t('generations.gen7')}</option>
        <option value="Gen 8">{t('generations.gen8')}</option>
        <option value="Gen 9">{t('generations.gen9')}</option>
      </select>
      
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center"
        >
          <X className="w-4 h-4 mr-2" />
          {t('team.clearFilters')}
        </button>
      )}
    </div>
  )
}
