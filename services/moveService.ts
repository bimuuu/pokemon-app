import { fetchMoveByName } from '@/lib/api'
import type { Move } from 'pokenode-ts'

export interface PokemonWithMove {
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
}

export class MoveService {
  static async fetchPokemonWithMove(moveName: string): Promise<PokemonWithMove[]> {
    try {
      // Use the learned_by_pokemon field from the move data
      const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`)
      if (response.ok) {
        const moveData = await response.json()
        
        // Get detailed Pokemon data for each Pokemon that can learn the move
        const pokemonData = await Promise.all(
          moveData.learned_by_pokemon.slice(0, 200).map(async (pokemonInfo: any) => {
            try {
              const pokemonResponse = await fetch(pokemonInfo.url)
              if (pokemonResponse.ok) {
                const pokemon = await pokemonResponse.json()
                return {
                  id: pokemon.id,
                  name: pokemon.name,
                  sprites: pokemon.sprites,
                  types: pokemon.types
                }
              }
              return null
            } catch (error) {
              return null
            }
          })
        )
        
        return pokemonData.filter(Boolean) as PokemonWithMove[]
      }
      return []
    } catch (error) {
      console.error('Failed to fetch Pokemon with move:', error)
      return []
    }
  }

  static async fetchMoveDetails(moveName: string): Promise<Move | null> {
    try {
      return await fetchMoveByName(moveName)
    } catch (error) {
      console.error('Failed to fetch move details:', error)
      return null
    }
  }
}
