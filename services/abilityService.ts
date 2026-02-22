import { fetchAbilityByName } from '@/lib/api'
import type { Ability } from 'pokenode-ts'

export interface PokemonWithAbility {
  id: number
  name: string
  sprites: {
    front_default: string
  }
  types: Array<{
    type: {
      name: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
    slot: number
  }>
}

export class AbilityService {
  static async fetchPokemonWithAbility(abilityName: string): Promise<PokemonWithAbility[]> {
    try {
      // First, get the ability data to find Pokemon that have this ability
      const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`)
      if (response.ok) {
        const abilityData = await response.json()
        
        // Get detailed Pokemon data for each Pokemon that has this ability
        const pokemonData = await Promise.all(
          abilityData.pokemon.slice(0, 200).map(async (pokemonInfo: any) => {
            try {
              const pokemonResponse = await fetch(pokemonInfo.pokemon.url)
              if (pokemonResponse.ok) {
                const pokemon = await pokemonResponse.json()
                return {
                  id: pokemon.id,
                  name: pokemon.name,
                  sprites: pokemon.sprites,
                  types: pokemon.types,
                  abilities: pokemon.abilities
                }
              }
              return null
            } catch (error) {
              return null
            }
          })
        )
        
        return pokemonData.filter(Boolean) as PokemonWithAbility[]
      }
      return []
    } catch (error) {
      console.error('Failed to fetch Pokemon with ability:', error)
      return []
    }
  }

  static async fetchAbilityDetails(abilityName: string): Promise<Ability | null> {
    try {
      return await fetchAbilityByName(abilityName)
    } catch (error) {
      console.error('Failed to fetch ability details:', error)
      return null
    }
  }
}
