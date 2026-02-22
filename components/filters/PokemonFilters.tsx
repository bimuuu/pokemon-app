'use client'

import { Search } from 'lucide-react'
import { POKEMON_TYPES } from '@/lib/constants'
import { debounce } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface PokemonFiltersProps {
  searchTerm: string
  selectedType: string
  selectedGeneration: string
  selectedRarity: string
  selectedLocation: string
  loadingTypes: boolean
  onSearchChange: (term: string) => void
  onTypeChange: (type: string) => void
  onGenerationChange: (generation: string) => void
  onRarityChange: (rarity: string) => void
  onLocationChange: (location: string) => void
}

export function PokemonFilters({
  searchTerm,
  selectedType,
  selectedGeneration,
  selectedRarity,
  selectedLocation,
  loadingTypes,
  onSearchChange,
  onTypeChange,
  onGenerationChange,
  onRarityChange,
  onLocationChange
}: PokemonFiltersProps) {
  const { t } = useLanguage()

  const commonLocations = [
    'All Overworld biomes',
    'The End',
    'Swamp, Mangrove Swamp',
    'Desert',
    'Jungle, Sparse Jungle, Bamboo Jungle',
    'All Ocean biomes',
    'Plains, Sunflower Plains',
    'Dark Forest',
    'Deep Dark',
    'River',
    'Savanna, Savanna Plateau',
    'Beach',
    'Lush Caves',
    'Badlands, Savanna',
    'Jungle',
    'Desert, Badlands',
    'Frozen Ocean, Deep Frozen Ocean',
    'Cherry Grove, Flower Forest',
    'All Forest biomes'
  ]

  const debouncedSearch = debounce((term: string) => {
    onSearchChange(term)
  }, 300)

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={t('home.searchPlaceholder')}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue={searchTerm}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>
      
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        disabled={loadingTypes}
      >
        <option value="">
          {loadingTypes ? t('home.loadingTypes') : t('home.allTypes')}
        </option>
        {!loadingTypes && POKEMON_TYPES.map(type => (
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
        <option value="">{t('home.allGenerations')}</option>
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
      
      <select
        value={selectedRarity}
        onChange={(e) => onRarityChange(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{t('home.allRarities')}</option>
        {['common', 'uncommon', 'rare', 'ultra-rare'].map(rarity => (
          <option key={rarity} value={rarity}>{t(`rarities.${rarity}`)}</option>
        ))}
      </select>

      <select
        value={selectedLocation}
        onChange={(e) => onLocationChange(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{t('home.allLocations')}</option>
        {commonLocations.map(location => (
          <option key={location} value={location}>{location}</option>
        ))}
      </select>
    </div>
  )
}
