import { cache } from 'react'
import { unstable_cache, revalidateTag } from 'next/cache'
import { CobblemonPokemon } from '@/types/pokemon'
import { fetchCobblemonData, fetchPokemonByName } from './api'
import { fetchPokemonTypesOnly } from './optimized-api'

// Cache duration constants
export const CACHE_DURATIONS = {
  SHORT: 60 * 5,      // 5 minutes
  MEDIUM: 60 * 30,    // 30 minutes
  LONG: 60 * 60,      // 1 hour
  VERY_LONG: 60 * 60 * 24, // 24 hours
} as const

// Server-side cached data fetching with Next.js cache
export const getCachedCobblemonData = unstable_cache(
  async (): Promise<CobblemonPokemon[]> => {
    try {
      const data = await fetchCobblemonData()
      return data
    } catch (error) {
      console.error('Error fetching Cobblemon data:', error)
      return []
    }
  },
  ['cobblemon-data'],
  {
    revalidate: CACHE_DURATIONS.LONG,
    tags: ['cobblemon-data'],
  }
)

export const getCachedPokemon = unstable_cache(
  async (name: string) => {
    try {
      const pokemon = await fetchPokemonByName(name)
      return pokemon
    } catch (error) {
      console.error(`Error fetching Pokemon ${name}:`, error)
      return null
    }
  },
  ['pokemon-detail'],
  {
    revalidate: CACHE_DURATIONS.VERY_LONG,
    tags: ['pokemon-detail'],
  }
)

export const getCachedPokemonTypes = unstable_cache(
  async (pokemonIds: number[]) => {
    try {
      const types = await fetchPokemonTypesOnly(pokemonIds)
      return types
    } catch (error) {
      console.error('Error fetching Pokemon types:', error)
      return {}
    }
  },
  ['pokemon-types'],
  {
    revalidate: CACHE_DURATIONS.MEDIUM,
    tags: ['pokemon-types'],
  }
)

// Client-side cached data fetching with React cache
export const useCachedPokemonData = cache(async (): Promise<CobblemonPokemon[]> => {
  return getCachedCobblemonData()
})

export const useCachedPokemon = cache(async (name: string) => {
  return getCachedPokemon(name)
})

// Batch data fetching utilities
export async function batchFetchPokemonData(names: string[]) {
  const promises = names.map(name => getCachedPokemon(name))
  const results = await Promise.allSettled(promises)
  
  return results.map((result, index) => ({
    name: names[index],
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null,
  }))
}

// Progressive data loading utility
export async function loadProgressively<T>(
  items: T[],
  batchSize: number = 20,
  delay: number = 100
): Promise<T[]> {
  const results: T[] = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    results.push(...batch)
    
    // Add small delay between batches to prevent overwhelming the server
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  return results
}

// Cache invalidation utilities
export async function revalidatePokemonCache(pokemonName?: string) {
  if (pokemonName) {
    await revalidateTag(`pokemon-${pokemonName}`, 'pokemon-detail')
  }
  
  await revalidateTag('pokemon-detail', 'pokemon-types')
}

export async function revalidateCobblemonData() {
  await revalidateTag('cobblemon-data', 'cobblemon-data')
}
