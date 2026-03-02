'use client'

import { useState, useEffect, useMemo } from 'react'
import { Pagination } from '@/components/common/Pagination'
import { useLanguage } from '@/contexts/LanguageContext'
import pastureLootData from '@/public/data/pasture block/pasture-loot.json'
import { PastureLootEntry } from '@/types'
import { getPokemonSpriteUrl, getFallbackSpriteUrl } from '@/lib/optimized-api'
import Image from 'next/image'
import { LocationTooltip } from '@/components/common/LocationTooltip'

export default function PastureLootPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'number-asc' | 'number-desc' | 'name-asc' | 'name-desc'>('number-asc')
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [imageLoaded, setImageLoaded] = useState<Set<string>>(new Set())

  const itemsPerPage = 20

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const allPokemon = useMemo(() => {
    return pastureLootData as PastureLootEntry[]
  }, [])

  const filteredAndSortedPokemon = useMemo(() => {
    let filtered = allPokemon.filter(pokemon =>
      pokemon["Pokémon"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon["Drops"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon["Spawn Specific Drops"].toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort based on sort order
    filtered.sort((a, b) => {
      const aNum = parseInt(a["No."])
      const bNum = parseInt(b["No."])
      
      switch (sortOrder) {
        case 'number-asc':
          return aNum - bNum
        case 'number-desc':
          return bNum - aNum
        case 'name-asc':
          return a["Pokémon"].localeCompare(b["Pokémon"])
        case 'name-desc':
          return b["Pokémon"].localeCompare(a["Pokémon"])
        default:
          return aNum - bNum
      }
    })

    return filtered
  }, [allPokemon, searchTerm, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedPokemon.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPokemon = filteredAndSortedPokemon.slice(startIndex, startIndex + itemsPerPage)

  const formatDrops = (drops: string) => {
    if (!drops) return []
    return drops.split(', ').map((drop, index) => (
      <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
        {drop}
      </span>
    ))
  }

  const formatSpawnDrops = (spawnDrops: string) => {
    if (!spawnDrops) return null
    return (
      <div className="mt-2 p-2 bg-blue-900 bg-opacity-30 rounded text-xs">
        <span className="text-blue-400 font-semibold">Spawn Specific: </span>
        <span className="text-gray-300">{spawnDrops}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('pastureLoot.title')}</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          {t('pastureLoot.subtitle')}
        </p>
      </header>

      <section className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('pastureLoot.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="number-asc">Number: Low to High</option>
              <option value="number-desc">Number: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
          <div>
            Total Pokémon: {filteredAndSortedPokemon.length}
          </div>
        </div>
      </section>

      {/* Pokemon Display */}
      {paginatedPokemon.length === 0 ? (
        <section className="text-center py-12">
          <p className="text-gray-400">No Pokémon found matching your criteria.</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedPokemon.map((pokemon, index) => {
                const pokemonKey = `${pokemon["No."]}-${pokemon["Pokémon"]}`
                const id = parseInt(pokemon["No."])
                const hasError = imageErrors.has(pokemonKey)
                const isLoaded = imageLoaded.has(pokemonKey)
                const spriteUrl = getPokemonSpriteUrl(id)
                const fallbackUrl = getFallbackSpriteUrl(id)
                const imageSrc = hasError ? fallbackUrl : spriteUrl
                
                return (
                  <LocationTooltip pokemonName={pokemon["Pokémon"]}>
                  <article className="pokemon-card p-4 hover:scale-105 hover:shadow-lg transition-all duration-200 relative z-10 cursor-help">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-bold text-gray-500">#{pokemon["No."]}</span>
                      <div className="flex gap-1">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Pasture
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center relative">
                      {hasError ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <>
                          {!isLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                          )}
                          <Image 
                            src={imageSrc}
                            alt={pokemon["Pokémon"]}
                            width={64}
                            height={64}
                            className={`object-contain transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onError={() => {
                              if (!hasError) {
                                setImageErrors(prev => new Set(prev).add(pokemonKey))
                              }
                            }}
                            onLoad={() => setImageLoaded(prev => new Set(prev).add(pokemonKey))}
                            placeholder="empty"
                          />
                        </>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-center mb-2">
                      {pokemon["Pokémon"]}
                    </h3>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Drops:</div>
                        <div className="flex flex-wrap gap-1">
                          {formatDrops(pokemon["Drops"])}
                        </div>
                      </div>
                      
                      {pokemon["Spawn Specific Drops"] && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Special:</div>
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {pokemon["Spawn Specific Drops"]}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                </LocationTooltip>
                )
              })}
            </section>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </nav>
      )}
    </section>
  )
}
