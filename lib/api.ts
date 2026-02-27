// Re-export all Pokemon API functions from dedicated module
export {
  // Move API functions
  fetchMoveByName,
  fetchMoveById,
  fetchAllMoves,
  fetchAllMovesComplete,
  
  // Ability API functions
  fetchAbilityByName,
  fetchAbilityById,
  fetchAllAbilities,
  
  // Item API functions
  fetchItemByName,
  fetchItemById,
  fetchAllItems,
  fetchItemsByCategory,
  fetchHoldableItems,
  
  // Nature API functions
  fetchNatureByName,
  fetchNatureById,
  fetchAllNatures,
  
  // Pokemon API functions
  fetchPokemonByName,
  fetchPokemonById,
  fetchPokemonSpeciesByName,
  fetchPokemonSpeciesById,
  fetchEvolutionChain,
  fetchEvolutionChainBySpeciesName,
} from './pokemon-api'

// Keep other API functions that are not Pokemon-related
import { CobblemonPokemon } from '@/types/pokemon'
import { getServerTranslation } from './i18n'
import { cache } from 'react'

export const fetchCobblemonData = cache(async (): Promise<CobblemonPokemon[]> => {
  try {
    const response = await fetch('/data/cobbleverseData.json', {
      next: { 
        revalidate: 3600, // Cache for 1 hour
        tags: ['cobblemon-data']
      }
    })
    if (!response.ok) {
      throw new Error(getServerTranslation('errors.failedToFetchCobblemonData'))
    }
    return await response.json()
  } catch (error) {
    console.error(getServerTranslation('errors.errorFetchingCobblemonData'), error)
    return []
  }
})

export const fetchTrainerData = cache(async (region: string, trainerName: string) => {
  try {
    const response = await fetch(`/data/trainers/${trainerName}`, {
      next: { 
        revalidate: 86400, // Cache for 24 hours
        tags: ['trainer-data', `trainer-${region}-${trainerName}`]
      }
    })
    if (!response.ok) {
      throw new Error(getServerTranslation('errors.failedToFetchTrainerData', { trainerName, region }))
    }
    return await response.json()
  } catch (error) {
    console.error(getServerTranslation('errors.errorFetchingTrainerData'), error)
    return null
  }
})

export const fetchTrainersByType = cache(async (trainerType: 'gym_leaders' | 'elite_four' | 'champions') => {
  try {
    const response = await fetch(`/data/trainers/${trainerType}.json`, {
      next: { 
        revalidate: 86400, // Cache for 24 hours
        tags: ['trainer-data', `trainers-${trainerType}`]
      }
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch ${trainerType}`)
    }
    
    const data = await response.json()
    const cleanedData = JSON.parse(JSON.stringify(data).replace(/mega_showdown:/g, ''))

    return cleanedData
  } catch (error) {
    console.error(`Error fetching ${trainerType}:`, error)
    return {}
  }
})

export const fetchAllTrainers = cache(async (region: string) => {
  try {
    const response = await fetch(`/data/poketrainer/${region}/`, {
      next: { 
        revalidate: 86400, // Cache for 24 hours
        tags: ['trainer-data', `trainers-${region}`]
      }
    })
    if (!response.ok) {
      throw new Error(getServerTranslation('errors.failedToFetchTrainers', { region }))
    }
    return await response.json()
  } catch (error) {
    console.error(getServerTranslation('errors.errorFetchingTrainers'), error)
    return []
  }
})

export function getPokemonSpriteUrl(name: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${name}.png`
}

export function getTypeIconUrl(type: string): string {
  return `https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/${type}.png`
}
