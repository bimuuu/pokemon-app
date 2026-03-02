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

const ultraBeastInfo: Record<string, { description: string; ability?: string }> = {
  'Generation VII': {
    description: 'Powerful creatures from Ultra Space introduced in the Alola region',
    ability: 'Beast Boost - Raises the highest stat when knocking out a foe'
  },
  'Generation VIII': {
    description: 'Ultra Beast that evolves and was introduced in the Galar region',
    ability: 'Beast Boost - Raises the highest stat when knocking out a foe'
  }
}

export default function UltraBeastPage() {
  const { t } = useLanguage()
  const { getCachedTypes } = usePokemonCache()
  const [pokemonData, setPokemonData] = useState<CobblemonPokemon[]>([])
  const [pokemonTypes, setPokemonTypes] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedGeneration, setSelectedGeneration] = useState<string>('all')

  const category = pokemonCategories.ultraBeast
  const categoryPokemon = useMemo(() => getAllCategoryPokemon('ultraBeast'), [])

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
                  ? 'bg-purple-600 text-white'
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
                    ? 'bg-purple-600 text-white'
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
          {/* Ultra Beast Information */}
          {selectedGeneration !== 'all' && category.subcategories && ultraBeastInfo[selectedGeneration] && (
            <section className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold mb-2 text-purple-900">
                {selectedGeneration} Ultra Beasts
              </h3>
              <p className="text-purple-700 mb-3">
                {ultraBeastInfo[selectedGeneration].description}
              </p>
              {ultraBeastInfo[selectedGeneration].ability && (
                <div className="mb-3 p-3 bg-purple-100 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-1">Signature Ability:</p>
                  <p className="text-sm text-purple-800">
                    {ultraBeastInfo[selectedGeneration].ability}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {category.subcategories
                  .find(sub => sub.name === selectedGeneration)
                  ?.pokemon.map((pokemonName) => (
                    <span 
                      key={pokemonName}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {pokemonName}
                    </span>
                  ))}
              </div>
              {selectedGeneration === 'Generation VII' && (
                <div className="mt-3 p-3 bg-purple-100 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Ultra Wormholes:</strong> These Pokémon can be encountered through Ultra Wormholes in the Alola region.
                  </p>
                </div>
              )}
              {selectedGeneration === 'Generation VIII' && (
                <div className="mt-3 p-3 bg-purple-100 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Evolution:</strong> Poipole evolves into Naganadel, making it the only Ultra Beast with an evolution.
                  </p>
                </div>
              )}
            </section>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 grid-container relative z-10">
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
