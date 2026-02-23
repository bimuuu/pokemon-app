'use client'

import { useState, useEffect, useMemo } from 'react'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { Pagination } from '@/components/common/Pagination'
import { FilterTags } from '@/components/filters/FilterTags'
import { PokemonPageLoading } from '@/components/loading/PokemonPageLoading'
import { CobblemonPokemon } from '@/types/pokemon'
import { fetchPokemonTypesOnly } from '@/lib/optimized-api'
import { POKEMON_PER_PAGE } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePokemonFilter } from '@/hooks/usePokemonFilter'

interface PokemonGridProps {
  initialData: CobblemonPokemon[]
}

export function PokemonGrid({ initialData }: PokemonGridProps) {
  const { t } = useLanguage()
  const [pokemonData, setPokemonData] = useState(initialData)
  const [pokemonTypes, setPokemonTypes] = useState<Record<string, string[]>>({})
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const pokemonFilter = usePokemonFilter({ pokemonData, pokemonTypes })

  // Optimized type loading with better batching
  useEffect(() => {
    const loadVisibleTypes = async () => {
      const startIndex = (currentPage - 1) * POKEMON_PER_PAGE
      const endIndex = startIndex + POKEMON_PER_PAGE
      const visiblePokemon = pokemonFilter.filteredData.slice(startIndex, endIndex)
      
      // Get Pokemon IDs that need types
      const pokemonToLoad = visiblePokemon.filter(p => !pokemonTypes[p.POKÉMON])
      
      if (pokemonToLoad.length > 0) {
        setLoadingTypes(true)
        
        try {
          // Extract IDs and fetch types in optimized batches
          const pokemonIds = pokemonToLoad.slice(0, 20).map(p => parseInt(p['N.'].replace('#', '')))
          const typesData = await fetchPokemonTypesOnly(pokemonIds)
          
          // Map types back to Pokemon names
          const newTypes: Record<string, string[]> = {}
          pokemonToLoad.slice(0, 20).forEach(pokemon => {
            const id = parseInt(pokemon['N.'].replace('#', ''))
            const types = typesData[id]
            if (types) {
              newTypes[pokemon.POKÉMON] = types
            }
          })
          
          // Update types progressively
          setPokemonTypes(prev => ({ ...prev, ...newTypes }))
        } catch (error) {
          console.error('Error loading visible types:', error)
        } finally {
          setLoadingTypes(false)
        }
      }
    }
    
    if (pokemonFilter.filteredData.length > 0) {
      loadVisibleTypes()
    }
  }, [currentPage, pokemonFilter.filteredData, pokemonTypes])

  const totalPages = Math.ceil(pokemonFilter.filteredData.length / POKEMON_PER_PAGE)
  const startIndex = (currentPage - 1) * POKEMON_PER_PAGE
  const paginatedData = pokemonFilter.filteredData.slice(startIndex, startIndex + POKEMON_PER_PAGE)

  return (
    <>
      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="mt-4 flex justify-between items-center">
          <FilterTags
            loadingTypes={loadingTypes}
            selectedType={pokemonFilter.selectedType}
            selectedGeneration={pokemonFilter.selectedGeneration}
            selectedRarity={pokemonFilter.selectedRarity}
            selectedLocation={pokemonFilter.selectedLocation}
            onClearType={() => pokemonFilter.setSelectedType('')}
            onClearGeneration={() => pokemonFilter.setSelectedGeneration('')}
            onClearRarity={() => pokemonFilter.setSelectedRarity('')}
            onClearLocation={() => pokemonFilter.setSelectedLocation('')}
            onClearAll={pokemonFilter.clearAllFilters}
          />
          <div className="text-sm text-gray-600">
            {pokemonFilter.filteredData.length} {t('common.found')} Pokemon
          </div>
        </div>
      </section>

      {paginatedData.length === 0 ? (
        <section className="text-center py-12">
          <p className="text-gray-500">{t('common.noDataFound')}</p>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 grid-container">
            {paginatedData.map((pokemon, index) => (
              <PokemonCard 
                key={`${pokemon['N.']}-${index}`} 
                pokemon={pokemon} 
                types={pokemonTypes[pokemon.POKÉMON]}
              />
            ))}
          </section>
          
          {totalPages > 1 && (
            <nav aria-label="Pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </nav>
          )}
        </>
      )}
    </>
  )
}
