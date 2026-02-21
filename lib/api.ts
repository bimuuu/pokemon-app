// Re-export all Pokemon API functions from dedicated module
export {
  pokemonClient,
  evolutionClient,
  normalizePokemonName,
  fetchPokemonSpeciesByName,
  fetchPokemonSpeciesById,
  fetchPokemonByName,
  fetchPokemonById,
  fetchEvolutionChain,
  fetchEvolutionChainBySpeciesName
} from './pokemon-api'

// Keep other API functions that are not Pokemon-related
import { CobblemonPokemon } from '@/types/pokemon'
import { getServerTranslation } from './i18n'

export async function fetchCobblemonData(): Promise<CobblemonPokemon[]> {
  try {
    const response = await fetch('/data/cobbleverseData.json')
    if (!response.ok) {
      throw new Error(getServerTranslation('errors.failedToFetchCobblemonData'))
    }
    return await response.json()
  } catch (error) {
    console.error(getServerTranslation('errors.errorFetchingCobblemonData'), error)
    return []
  }
}

export async function fetchTrainerData(region: string, trainerName: string) {
  try {
    const response = await fetch(`/data/poketrainer/${region}/${trainerName}`)
    if (!response.ok) {
      throw new Error(getServerTranslation('errors.failedToFetchTrainerData', { trainerName, region }))
    }
    return await response.json()
  } catch (error) {
    console.error(getServerTranslation('errors.errorFetchingTrainerData'), error)
    return null
  }
}

export async function fetchAllTrainers(region: string) {
  try {
    const response = await fetch(`/data/poketrainer/${region}/`)
    if (!response.ok) {
      throw new Error(getServerTranslation('errors.failedToFetchTrainers', { region }))
    }
    return await response.json()
  } catch (error) {
    console.error(getServerTranslation('errors.errorFetchingTrainers'), error)
    return []
  }
}

export function getPokemonSpriteUrl(name: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${name}.png`
}

export function getTypeIconUrl(type: string): string {
  return `https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/${type}.png`
}
