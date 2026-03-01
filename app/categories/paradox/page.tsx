'use client'

import { useState, useEffect, useMemo } from 'react'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { CategoryHeader } from '@/components/pokemon/CategoryHeader'
import { Pagination } from '@/components/common/Pagination'
import { CategoryPageLoadingSkeletonWithFilters } from '@/components/loading/CategoryPageLoadingSkeleton'
import { CobblemonPokemon } from '@/types/pokemon'
import { fetchCobblemonData } from '@/lib/api'
import { fetchPokemonTypesOnly } from '@/lib/optimized-api'
import { POKEMON_PER_PAGE } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { pokemonCategories, getAllCategoryPokemon } from '@/data/pokemonCategories'

export default function ParadoxPokemonPage() {
  const { t } = useLanguage()
  const { getCachedTypes } = usePokemonCache()
  const [pokemonData, setPokemonData] = useState<CobblemonPokemon[]>([])
  const [pokemonTypes, setPokemonTypes] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>('all')

  const category = pokemonCategories.paradox
  const categoryPokemon = useMemo(() => getAllCategoryPokemon('paradox'), [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const cobblemonData = await fetchCobblemonData()
        setPokemonData(cobblemonData)
        setLoading(false)
        
        getCachedTypes().then((types) => {
          if (types) {
            setPokemonTypes(types)
          }
        })
      } catch (error) {
        console.error('Error loading Pokemon data:', error)
        setLoading(false)
      }
    }
    
    loadData()
  }, [getCachedTypes])

  const filteredData = useMemo(() => {
    let filtered = pokemonData.filter(pokemon => 
      categoryPokemon.includes(pokemon.POKÉMON)
    )

    if (selectedTimePeriod !== 'all' && category.subcategories) {
      const selectedSubcategory = category.subcategories.find(sub => sub.name === selectedTimePeriod)
      if (selectedSubcategory) {
        filtered = filtered.filter(pokemon => 
          selectedSubcategory.pokemon.includes(pokemon.POKÉMON)
        )
      }
    }

    return filtered
  }, [pokemonData, categoryPokemon, selectedTimePeriod, category])

  const totalPages = Math.ceil(filteredData.length / POKEMON_PER_PAGE)
  const startIndex = (currentPage - 1) * POKEMON_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, startIndex + POKEMON_PER_PAGE)

  if (loading) {
    return <CategoryPageLoadingSkeletonWithFilters />
  }

  return (
    <section className="space-y-6">
      <CategoryHeader 
        category={category} 
        totalCount={categoryPokemon.length}
      />

      {/* Time Period Filter */}
      {category.subcategories && (
        <section className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Filter by Time Period</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTimePeriod('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTimePeriod === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Time Periods ({categoryPokemon.length})
            </button>
            {category.subcategories.map((subcategory) => (
              <button
                key={subcategory.name}
                onClick={() => setSelectedTimePeriod(subcategory.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTimePeriod === subcategory.name
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subcategory.name} ({subcategory.pokemon.length})
              </button>
            ))}
          </div>
        </section>
      )}

      {paginatedData.length === 0 ? (
        <section className="text-center py-12">
          <p className="text-gray-500">{t('common.noDataFound')}</p>
        </section>
      ) : (
        <>
          {/* Time Period Description */}
          {selectedTimePeriod !== 'all' && category.subcategories && (
            <section className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold mb-2 text-indigo-900">
                {category.subcategories.find(sub => sub.name === selectedTimePeriod)?.name}
              </h3>
              {category.subcategories.find(sub => sub.name === selectedTimePeriod)?.description && (
                <p className="text-indigo-700 mb-3">
                  {category.subcategories.find(sub => sub.name === selectedTimePeriod)?.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {category.subcategories
                  .find(sub => sub.name === selectedTimePeriod)
                  ?.pokemon.map((pokemonName) => (
                    <span 
                      key={pokemonName}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      {pokemonName}
                    </span>
                  ))}
              </div>
            </section>
          )}

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
