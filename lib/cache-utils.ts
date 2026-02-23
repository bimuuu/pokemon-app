import { cache } from 'react'

// Cache utility functions for common data patterns

export const cachedPokemonTypes = cache(async (pokemonIds: number[]) => {
  // This would typically fetch from an API
  const typesData: Record<number, string[]> = {}
  
  for (const id of pokemonIds) {
    // Mock data - in real app, fetch from API
    typesData[id] = ['Normal'] // Default type
  }
  
  return typesData
})

export const cachedPokemonStats = cache(async (pokemonId: number) => {
  // Mock stats data
  return {
    hp: 100,
    attack: 75,
    defense: 75,
    specialAttack: 75,
    specialDefense: 75,
    speed: 75,
  }
})

export const cachedMoveData = cache(async (moveName: string) => {
  // Mock move data
  return {
    name: moveName,
    type: 'Normal',
    power: 50,
    accuracy: 100,
    pp: 35,
    category: 'Physical',
  }
})

// Cache invalidation helper
export function invalidatePokemonCache(pokemonId?: string) {
  // In a real app, you would use revalidateTag or revalidatePath
  // This is a placeholder for cache invalidation logic
  console.log(`Invalidating cache for pokemon: ${pokemonId || 'all'}`)
}
