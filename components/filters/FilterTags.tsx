'use client'

import { useLanguage } from '@/contexts/LanguageContext'

interface FilterTagsProps {
  loadingTypes: boolean
  selectedType: string
  selectedGeneration: string
  selectedRarity: string
  selectedLocation: string
  onClearType: () => void
  onClearGeneration: () => void
  onClearRarity: () => void
  onClearLocation: () => void
  onClearAll: () => void
}

export function FilterTags({
  loadingTypes,
  selectedType,
  selectedGeneration,
  selectedRarity,
  selectedLocation,
  onClearType,
  onClearGeneration,
  onClearRarity,
  onClearLocation,
  onClearAll
}: FilterTagsProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {loadingTypes && (
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
          {t('home.loadingTypes')} 
          <div className="inline-block ml-2 w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
        </span>
      )}
      {selectedType && (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
          {t('home.type')}: {t(`types.${selectedType}`)} 
          <button 
            onClick={onClearType}
            className="ml-1 text-blue-600 hover:text-blue-800"
          >
            ×
          </button>
        </span>
      )}
      {selectedGeneration && (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
          {t(`generations.gen${selectedGeneration.replace('Gen ', '')}`)}
          <button 
            onClick={onClearGeneration}
            className="ml-1 text-green-600 hover:text-green-800"
          >
            ×
          </button>
        </span>
      )}
      {selectedRarity && (
        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
          {t('home.rarity')}: {t(`rarities.${selectedRarity}`)}
          <button 
            onClick={onClearRarity}
            className="ml-1 text-orange-600 hover:text-orange-800"
          >
            ×
          </button>
        </span>
      )}
      {selectedLocation && (
        <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full">
          {t('home.location')}: {selectedLocation}
          <button 
            onClick={onClearLocation}
            className="ml-1 text-teal-600 hover:text-teal-800"
          >
            ×
          </button>
        </span>
      )}
      {(selectedType || selectedGeneration || selectedRarity || selectedLocation) && (
        <button
          onClick={onClearAll}
          className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
        >
          {t('common.clearAll')}
        </button>
      )}
    </div>
  )
}
