'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Pokemon, CobblemonPokemon, EvolutionChain } from '@/types/pokemon'
import { fetchPokemonByName, fetchEvolutionChainBySpeciesName, fetchCobblemonData, fetchPokemonById } from '@/lib/api'

interface CachedPokemonData {
  pokemon: Pokemon
  cobblemonData: CobblemonPokemon | null
  evolutionChain: EvolutionChain | null
  timestamp: number
}

interface CachedPokemonListData {
  cobblemonData: CobblemonPokemon[]
  pokemonTypes: Record<string, string[]>
  timestamp: number
}

interface CachedTypesData {
  types: Record<string, string[]>
  timestamp: number
}

interface PokemonCacheContextType {
  getCachedPokemon: (name: string) => Promise<CachedPokemonData | null>
  getCachedPokemonList: () => Promise<CachedPokemonListData | null>
  getCachedTypes: () => Promise<Record<string, string[]> | null>
  clearCache: () => void
  isCached: (name: string) => boolean
}

const PokemonCacheContext = createContext<PokemonCacheContextType | undefined>(undefined)

const CACHE_EXPIRY_TIME = 30 * 60 * 1000 // 30 minutes
const TYPES_CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000 // 24 hours for types (longer expiry)
const STORAGE_KEYS = {
  POKEMON_TYPES: 'pokemon_types_cache',
  TYPES_TIMESTAMP: 'pokemon_types_timestamp'
} as const

export function PokemonCacheProvider({ children }: { children: React.ReactNode }) {
  const [cache, setCache] = useState<Map<string, CachedPokemonData>>(new Map())
  const [listCache, setListCache] = useState<CachedPokemonListData | null>(null)
  const [typesCache, setTypesCache] = useState<Record<string, string[]> | null>(null)
  const [pendingRequests, setPendingRequests] = useState<Map<string, Promise<any>>>(new Map())
  const [pendingListRequest, setPendingListRequest] = useState<Promise<CachedPokemonListData | null> | null>(null)
  const [pendingTypesRequest, setPendingTypesRequest] = useState<Promise<Record<string, string[]> | null> | null>(null)

  // Load types from localStorage on mount
  useEffect(() => {
    try {
      const cachedTypes = localStorage.getItem(STORAGE_KEYS.POKEMON_TYPES)
      const cachedTimestamp = localStorage.getItem(STORAGE_KEYS.TYPES_TIMESTAMP)
      
      if (cachedTypes && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp)
        const isExpired = Date.now() - timestamp > TYPES_CACHE_EXPIRY_TIME
        
        if (!isExpired) {
          setTypesCache(JSON.parse(cachedTypes))
        }
      }
    } catch (error) {
      console.warn('Failed to load types from localStorage:', error)
    }
  }, [])

  const getCachedTypes = useCallback(async (): Promise<Record<string, string[]> | null> => {
    // Check if types are cached in memory and not expired
    if (typesCache) {
      return typesCache
    }

    // Check if there's already a pending request for types
    if (pendingTypesRequest) {
      return pendingTypesRequest
    }

    try {
      // Create and store the pending request
      const requestPromise = (async () => {
        // Fetch fresh Cobblemon data
        const cobblemonData = await fetchCobblemonData()
        
        // Fetch Pokemon types with maximum concurrent processing
        // But batch them to avoid rate limiting
        const batchSize = 50 // Process 50 Pokemon at a time
        const typesMap: Record<string, string[]> = {}
        
        for (let i = 0; i < cobblemonData.length; i += batchSize) {
          const batch = cobblemonData.slice(i, i + batchSize)
          const batchPromises = batch.map(async (pokemon) => {
            const id = parseInt(pokemon['N.'].replace('#', ''))
            try {
              const pokemonData = await fetchPokemonById(id)
              if (pokemonData && pokemonData.types) {
                return {
                  name: pokemon.POKÉMON,
                  types: pokemonData.types.map(t => t.type.name)
                }
              }
              return null
            } catch (error) {
              console.warn(`Failed to fetch types for ${pokemon.POKÉMON}:`, error)
              return null
            }
          })
          
          const batchResults = await Promise.allSettled(batchPromises)
          batchResults.forEach((result) => {
            if (result.status === 'fulfilled' && result.value) {
              typesMap[result.value.name] = result.value.types
            }
          })
          
          // Small delay between batches to avoid rate limiting
          if (i + batchSize < cobblemonData.length) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        }

        // Store in memory cache
        setTypesCache(typesMap)
        
        // Store in localStorage for persistence
        try {
          localStorage.setItem(STORAGE_KEYS.POKEMON_TYPES, JSON.stringify(typesMap))
          localStorage.setItem(STORAGE_KEYS.TYPES_TIMESTAMP, Date.now().toString())
        } catch (error) {
          console.warn('Failed to save types to localStorage:', error)
        }
        
        // Clear pending request
        setPendingTypesRequest(null)
        
        return typesMap
      })()

      // Store the pending request
      setPendingTypesRequest(requestPromise)
      
      return await requestPromise
    } catch (error) {
      console.error('Error fetching Pokemon types for cache:', error)
      setPendingTypesRequest(null)
      return null
    }
  }, [typesCache, pendingTypesRequest])

  const isCached = useCallback((name: string): boolean => {
    const cached = cache.get(name.toLowerCase())
    if (!cached) return false
    
    const isExpired = Date.now() - cached.timestamp > CACHE_EXPIRY_TIME
    if (isExpired) {
      setCache(prev => {
        const newCache = new Map(prev)
        newCache.delete(name.toLowerCase())
        return newCache
      })
      return false
    }
    
    return true
  }, [cache])

  const getCachedPokemon = useCallback(async (name: string): Promise<CachedPokemonData | null> => {
    const normalizedName = name.toLowerCase()
    
    // Check if data is already cached and not expired
    if (isCached(normalizedName)) {
      return cache.get(normalizedName) || null
    }

    // Check if there's already a pending request for this Pokemon
    if (pendingRequests.has(normalizedName)) {
      return pendingRequests.get(normalizedName) || null
    }

    try {
      // Create and store the pending request
      const requestPromise = (async () => {
        // Get Cobblemon data from list cache if available, otherwise fetch it
        let allCobblemonData: CobblemonPokemon[]
        if (listCache && Date.now() - listCache.timestamp < CACHE_EXPIRY_TIME) {
          allCobblemonData = listCache.cobblemonData
        } else {
          // AVOID INFINITE LOOP: Don't call getCachedPokemonList here
          // Fetch directly instead
          allCobblemonData = await fetchCobblemonData()
        }

        // Fetch all data concurrently using Promise.all for maximum speed
        // Use base name (without form suffix) for species lookup
        const baseName = name.split('-')[0]
        const [pokemonData, evolutionData] = await Promise.all([
          fetchPokemonByName(name),
          fetchEvolutionChainBySpeciesName(baseName).catch(() => null) // Don't fail if evolution chain fails
        ])

        if (!pokemonData) {
          return null
        }

        // Find cobblemon data
        const cobblemon = allCobblemonData.find(p => 
          p.POKÉMON.toLowerCase() === normalizedName
        )

        const cachedData: CachedPokemonData = {
          pokemon: {
            ...pokemonData,
            sprites: {
              front_default: pokemonData.sprites.front_default || '',
              front_shiny: pokemonData.sprites.front_shiny || '',
              back_default: pokemonData.sprites.back_default || '',
              back_shiny: pokemonData.sprites.back_shiny || ''
            }
          },
          cobblemonData: cobblemon || null,
          evolutionChain: evolutionData,
          timestamp: Date.now()
        }

        // Store in cache
        setCache(prev => {
          const newCache = new Map(prev)
          newCache.set(normalizedName, cachedData)
          return newCache
        })

        // Remove from pending requests
        setPendingRequests(prev => {
          const newPending = new Map(prev)
          newPending.delete(normalizedName)
          return newPending
        })

        return cachedData
      })()

      // Store the pending request
      setPendingRequests(prev => {
        const newPending = new Map(prev)
        newPending.set(normalizedName, requestPromise)
        return newPending
      })

      return await requestPromise
    } catch (error) {
      console.error('Error fetching Pokemon data for cache:', error)
      // Remove from pending requests on error
      setPendingRequests(prev => {
        const newPending = new Map(prev)
        newPending.delete(normalizedName)
        return newPending
      })
      return null
    }
  }, [isCached, cache, listCache, pendingRequests])

  const clearCache = useCallback(() => {
    setCache(new Map())
    setListCache(null)
    setTypesCache(null)
    setPendingRequests(new Map())
    setPendingListRequest(null)
    setPendingTypesRequest(null)
    
    // Clear localStorage
    try {
      localStorage.removeItem(STORAGE_KEYS.POKEMON_TYPES)
      localStorage.removeItem(STORAGE_KEYS.TYPES_TIMESTAMP)
    } catch (error) {
      console.warn('Failed to clear types from localStorage:', error)
    }
  }, [])

  const getCachedPokemonList = useCallback(async (): Promise<CachedPokemonListData | null> => {
    // Check if list data is cached and not expired
    if (listCache && Date.now() - listCache.timestamp < CACHE_EXPIRY_TIME) {
      return listCache
    }

    // Check if there's already a pending request for the list
    if (pendingListRequest) {
      return pendingListRequest
    }

    try {
      // Create and store the pending request
      const requestPromise = (async () => {
        // Fetch fresh Cobblemon data
        const cobblemonData = await fetchCobblemonData()
        
        // Get types from cache or fetch them
        const pokemonTypes = await getCachedTypes() || {}
        
        const cachedListData: CachedPokemonListData = {
          cobblemonData,
          pokemonTypes,
          timestamp: Date.now()
        }

        // Store in cache
        setListCache(cachedListData)
        
        // Clear pending request
        setPendingListRequest(null)
        
        return cachedListData
      })()

      // Store the pending request
      setPendingListRequest(requestPromise)
      
      return await requestPromise
    } catch (error) {
      console.error('Error fetching Pokemon list data for cache:', error)
      setPendingListRequest(null)
      return null
    }
  }, [listCache, pendingListRequest, getCachedTypes])

  return (
    <PokemonCacheContext.Provider value={{
      getCachedPokemon,
      getCachedPokemonList,
      getCachedTypes,
      clearCache,
      isCached
    }}>
      {children}
    </PokemonCacheContext.Provider>
  )
}

export function usePokemonCache() {
  const context = useContext(PokemonCacheContext)
  if (context === undefined) {
    throw new Error('usePokemonCache must be used within a PokemonCacheProvider')
  }
  return context
}
