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

export default function MythicalPokemonPage() {
  const { t } = useLanguage()
  const { getCachedTypes } = usePokemonCache()
  const [pokemonData, setPokemonData] = useState<CobblemonPokemon[]>([])
  const [pokemonTypes, setPokemonTypes] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const category = pokemonCategories.mythical
  const categoryPokemon = useMemo(() => getAllCategoryPokemon('mythical'), [])

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
    return pokemonData.filter(pokemon => 
      categoryPokemon.includes(pokemon.POKÉMON)
    )
  }, [pokemonData, categoryPokemon])

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
        totalCount={filteredData.length}
      />

      {paginatedData.length === 0 ? (
        <section className="text-center py-12">
          <p className="text-gray-500">{t('common.noDataFound')}</p>
        </section>
      ) : (
        <>
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
