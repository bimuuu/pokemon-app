'use client'

import { useState } from 'react'
import { PokemonFilters } from '@/components/filters/PokemonFilters'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePokemonFilter } from '@/hooks/usePokemonFilter'

export function PokemonFiltersServer() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedGeneration, setSelectedGeneration] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border">
      <PokemonFilters
        searchTerm={searchTerm}
        selectedType={selectedType}
        selectedGeneration={selectedGeneration}
        selectedRarity={selectedRarity}
        selectedLocation={selectedLocation}
        loadingTypes={false}
        onSearchChange={setSearchTerm}
        onTypeChange={setSelectedType}
        onGenerationChange={setSelectedGeneration}
        onRarityChange={setSelectedRarity}
        onLocationChange={setSelectedLocation}
      />
    </section>
  )
}
