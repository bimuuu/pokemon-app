'use client'

import { useState, useEffect, useMemo } from 'react'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { CategoryHeader } from '@/components/pokemon/CategoryHeader'
import { Pagination } from '@/components/common/Pagination'
import { CategoryPageLoadingSkeleton } from '@/components/loading/CategoryPageLoadingSkeleton'
import { CobblemonPokemon } from '@/types/pokemon'
import { fetchCobblemonData } from '@/lib/api'
import { fetchPokemonTypesOnly } from '@/lib/optimized-api'
import { POKEMON_PER_PAGE } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { pokemonCategories, getAllCategoryPokemon } from '@/data/pokemonCategories'

const fossilInfo: Record<string, { description: string; fossilType?: string }> = {
  'Generation I': {
    description: 'Original fossil Pokémon from the Kanto region',
    fossilType: 'Classic Fossils'
  },
  'Generation III': {
    description: 'Ancient Pokémon revived from the Hoenn region fossils',
    fossilType: 'Hoenn Fossils'
  },
  'Generation IV': {
    description: 'Prehistoric Pokémon from the Sinnoh region',
    fossilType: 'Sinnoh Fossils'
  },
  'Generation V': {
    description: 'Ancient sea and flying creatures from Unova',
    fossilType: 'Unova Fossils'
  },
  'Generation VI': {
    description: 'Dinosaurs and ice age creatures from Kalos',
    fossilType: 'Kalos Fossils'
  },
  'Generation VIII': {
    description: 'Galarian fossil combinations with unique mechanics',
    fossilType: 'Galar Fossil Combinations'
  }
}

export default function FossilPokemonPage() {
  const { t } = useLanguage()
  const { getCachedTypes } = usePokemonCache()
  const [pokemonData, setPokemonData] = useState<CobblemonPokemon[]>([])
  const [pokemonTypes, setPokemonTypes] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedGeneration, setSelectedGeneration] = useState<string>('all')

  const category = pokemonCategories.fossil
  const categoryPokemon = useMemo(() => getAllCategoryPokemon('fossil'), [])

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

    if (selectedGeneration !== 'all' && category.subcategories) {
      const selectedSubcategory = category.subcategories.find(sub => sub.name === selectedGeneration)
      if (selectedSubcategory) {
        filtered = filtered.filter(pokemon => 
          selectedSubcategory.pokemon.includes(pokemon.POKÉMON)
        )
      }
    }

    return filtered
  }, [pokemonData, categoryPokemon, selectedGeneration, category])

  const totalPages = Math.ceil(filteredData.length / POKEMON_PER_PAGE)
  const startIndex = (currentPage - 1) * POKEMON_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, startIndex + POKEMON_PER_PAGE)

  if (loading) {
    return <CategoryPageLoadingSkeleton />
  }

  return (
    <section className="space-y-6">
      <CategoryHeader 
        category={category} 
        totalCount={categoryPokemon.length}
      />

      {/* Generation Filter */}
      {category.subcategories && (
        <section className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Filter by Generation</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGeneration('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedGeneration === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Generations ({categoryPokemon.length})
            </button>
            {category.subcategories.map((subcategory) => (
              <button
                key={subcategory.name}
                onClick={() => setSelectedGeneration(subcategory.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGeneration === subcategory.name
                    ? 'bg-amber-600 text-white'
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
          {/* Fossil Information */}
          {selectedGeneration !== 'all' && category.subcategories && fossilInfo[selectedGeneration] && (
            <section className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold mb-2 text-amber-900">
                {fossilInfo[selectedGeneration].fossilType}
              </h3>
              <p className="text-amber-700 mb-3">
                {fossilInfo[selectedGeneration].description}
              </p>
              <div className="flex flex-wrap gap-2">
                {category.subcategories
                  .find(sub => sub.name === selectedGeneration)
                  ?.pokemon.map((pokemonName) => (
                    <span 
                      key={pokemonName}
                      className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                    >
                      {pokemonName}
                    </span>
                  ))}
              </div>
              {selectedGeneration === 'Generation VIII' && (
                <div className="mt-3 p-3 bg-amber-100 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Galarian fossils are unique combinations that require specific fossil pairs to revive.
                  </p>
                </div>
              )}
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
