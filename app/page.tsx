'use client'

import { useState, useEffect, useMemo } from 'react'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { Pagination } from '@/components/common/Pagination'
import { PokemonFilters } from '@/components/filters/PokemonFilters'
import { FilterTags } from '@/components/filters/FilterTags'
import { PokemonPageLoading } from '@/components/loading/PokemonPageLoading'
import { CobblemonPokemon } from '@/types/pokemon'
import { fetchCobblemonData } from '@/lib/api'
import { fetchPokemonTypesOnly, preloadPokemonImages } from '@/lib/optimized-api'
import { debounce } from '@/lib/performance'
import { POKEMON_PER_PAGE } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { usePokemonFilter } from '@/hooks/usePokemonFilter'

export default function HomePage() {
  const { t } = useLanguage()
  const { getCachedPokemonList, getCachedTypes } = usePokemonCache()
  const [pokemonData, setPokemonData] = useState<CobblemonPokemon[]>([])
  const [pokemonTypes, setPokemonTypes] = useState<Record<string, string[]>>({})
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const pokemonFilter = usePokemonFilter({ pokemonData, pokemonTypes })

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Pokemon data first without waiting for types
        const cobblemonData = await fetchCobblemonData()
        setPokemonData(cobblemonData)
        setLoading(false)
        
        // Load types in background progressively
        setLoadingTypes(true)
        getCachedTypes().then((types) => {
          if (types) {
            setPokemonTypes(types)
          }
          setLoadingTypes(false)
        })
      } catch (error) {
        console.error('Error loading Pokemon data:', error)
        setLoading(false)
        setLoadingTypes(false)
      }
    }
    
    loadData()
  }, [getCachedTypes])

  // Reset to page 1 when filters change to prevent empty results
  useEffect(() => {
    setCurrentPage(1)
  }, [pokemonFilter.searchTerm, pokemonFilter.selectedType, pokemonFilter.selectedGeneration, pokemonFilter.selectedRarity, pokemonFilter.selectedLocation])

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
    
    if (!loading && pokemonFilter.filteredData.length > 0) {
      loadVisibleTypes()
    }
  }, [currentPage, pokemonFilter.filteredData, loading, pokemonTypes])


  const totalPages = Math.ceil(pokemonFilter.filteredData.length / POKEMON_PER_PAGE)
  const startIndex = (currentPage - 1) * POKEMON_PER_PAGE
  const paginatedData = pokemonFilter.filteredData.slice(startIndex, startIndex + POKEMON_PER_PAGE)

  if (loading) {
    return <PokemonPageLoading />
  }

  return (
    <section className="space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('home.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-sm border">
        <PokemonFilters
          searchTerm={pokemonFilter.searchTerm}
          selectedType={pokemonFilter.selectedType}
          selectedGeneration={pokemonFilter.selectedGeneration}
          selectedRarity={pokemonFilter.selectedRarity}
          selectedLocation={pokemonFilter.selectedLocation}
          loadingTypes={loadingTypes}
          onSearchChange={pokemonFilter.setSearchTerm}
          onTypeChange={pokemonFilter.setSelectedType}
          onGenerationChange={pokemonFilter.setSelectedGeneration}
          onRarityChange={pokemonFilter.setSelectedRarity}
          onLocationChange={pokemonFilter.setSelectedLocation}
        />
        
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
    </section>
  )
}
