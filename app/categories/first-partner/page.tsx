'use client'

import { useState, useEffect, useMemo } from 'react'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { CategoryHeader } from '@/components/pokemon/CategoryHeader'
import { Pagination } from '@/components/common/Pagination'
import { CategoryPageLoadingSkeletonWithFilters } from '@/components/loading/CategoryPageLoadingSkeleton'
import { TypeBadge } from '@/components/ui'
import { CobblemonPokemon } from '@/types/pokemon'
import { fetchCobblemonData } from '@/lib/api'
import { fetchPokemonTypesOnly } from '@/lib/optimized-api'
import { POKEMON_PER_PAGE } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { pokemonCategories, getAllCategoryPokemon } from '@/data/pokemonCategories'

const regionTypes: Record<string, string[]> = {
  'Kanto': ['Grass', 'Fire', 'Water'],
  'Johto': ['Grass', 'Fire', 'Water'],
  'Hoenn': ['Grass', 'Fire', 'Water'],
  'Sinnoh': ['Grass', 'Fire', 'Water'],
  'Unova': ['Grass', 'Fire', 'Water'],
  'Kalos': ['Grass', 'Fire', 'Water'],
  'Alola': ['Grass', 'Fire', 'Water'],
  'Galar': ['Grass', 'Fire', 'Water'],
  'Paldea': ['Grass', 'Fire', 'Water']
}

export default function FirstPartnerPokemonPage() {
  const { t } = useLanguage()
  const { getCachedTypes } = usePokemonCache()
  const [pokemonData, setPokemonData] = useState<CobblemonPokemon[]>([])
  const [pokemonTypes, setPokemonTypes] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  const category = pokemonCategories.firstPartner
  const categoryPokemon = useMemo(() => getAllCategoryPokemon('firstPartner'), [])

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

    if (selectedRegion !== 'all' && category.subcategories) {
      const selectedSubcategory = category.subcategories.find(sub => sub.name === selectedRegion)
      if (selectedSubcategory) {
        filtered = filtered.filter(pokemon => 
          selectedSubcategory.pokemon.includes(pokemon.POKÉMON)
        )
      }
    }

    return filtered
  }, [pokemonData, categoryPokemon, selectedRegion, category])

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

      {/* Region Filter */}
      {category.subcategories && (
        <section className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Filter by Region</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedRegion === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Regions ({categoryPokemon.length})
            </button>
            {category.subcategories.map((subcategory) => (
              <button
                key={subcategory.name}
                onClick={() => setSelectedRegion(subcategory.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedRegion === subcategory.name
                    ? 'bg-green-600 text-white'
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
          {/* Region Type Display */}
          {selectedRegion !== 'all' && category.subcategories && regionTypes[selectedRegion] && (
            <section className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold mb-3 text-green-900">
                {selectedRegion} Starter Types
              </h3>
              <div className="flex flex-wrap gap-4">
                {category.subcategories
                  .find(sub => sub.name === selectedRegion)
                  ?.pokemon.map((pokemonName, index) => {
                    const types = pokemonTypes[pokemonName] || []
                    return (
                      <div key={pokemonName} className="flex items-center gap-2">
                        <span className="font-medium text-green-800">{pokemonName}</span>
                        <div className="flex gap-1">
                          {types.map((type, typeIndex) => (
                            <TypeBadge key={typeIndex} type={type} className="text-xs" />
                          ))}
                        </div>
                      </div>
                    )
                  })}
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
