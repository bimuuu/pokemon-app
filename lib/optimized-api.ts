import { CobblemonPokemon } from '@/types/pokemon'
import { debounce } from './performance'

// Simple Pokemon data structure with only what we need
export interface SimplePokemonData {
  id: number
  name: string
  types: string[]
  sprite: string
}

// Cache for Pokemon types to avoid repeated API calls
const pokemonTypesCache = new Map<string, string[]>()

// Optimized function to fetch only Pokemon types (no extra data)
export async function fetchPokemonTypesOnly(pokemonIds: number[]): Promise<Record<string, string[]>> {
  const results: Record<string, string[]> = {}
  
  // Batch requests in groups of 20 to avoid overwhelming the API
  const batchSize = 20
  for (let i = 0; i < pokemonIds.length; i += batchSize) {
    const batch = pokemonIds.slice(i, i + batchSize)
    
    const promises = batch.map(async (id) => {
      // Check cache first
      const cacheKey = id.toString()
      if (pokemonTypesCache.has(cacheKey)) {
        return { id, types: pokemonTypesCache.get(cacheKey)! }
      }
      
      try {
        // Fetch only the essential data we need
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        if (!response.ok) return null
        
        const data = await response.json()
        const types = data.types?.map((t: any) => t.type.name) || []
        
        // Cache the result
        pokemonTypesCache.set(cacheKey, types)
        
        return { id, types }
      } catch (error) {
        console.warn(`Failed to fetch types for Pokemon ${id}:`, error)
        return null
      }
    })
    
    const batchResults = await Promise.allSettled(promises)
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        results[result.value.id] = result.value.types
      }
    })
  }
  
  return results
}

// Get Pokemon sprite URL with fallback
export function getPokemonSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

// Get fallback sprite URL
export function getFallbackSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

// Optimized Pokemon data structure for cards
export function createOptimizedPokemonData(pokemon: CobblemonPokemon, types: string[] = []): SimplePokemonData {
  const id = parseInt(pokemon['N.'].replace('#', ''))
  
  return {
    id,
    name: pokemon.POKÉMON,
    types,
    sprite: getPokemonSpriteUrl(id)
  }
}

// Preload critical Pokemon images
export function preloadPokemonImages(pokemonIds: number[]): void {
  pokemonIds.forEach(id => {
    const img = new Image()
    img.src = getPokemonSpriteUrl(id)
    
    // Also preload fallback
    const fallbackImg = new Image()
    fallbackImg.src = getFallbackSpriteUrl(id)
  })
}
