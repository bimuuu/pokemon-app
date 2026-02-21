import { Pokemon } from '@/types/pokemon'
import { fetchCobblemonData } from '@/lib/api'

export class PokemonDataTransformer {
  static async createPokemonFromCobblemon(cobblemonData: any[], types: Record<string, string[]>): Promise<Pokemon[]> {
    return cobblemonData.map((cobblemon, index) => {
      const pokemonTypes = types[cobblemon.POKÉMON] || []
      
      return {
        id: index + 1,
        name: cobblemon.POKÉMON.toLowerCase(),
        order: index + 1,
        height: 0,
        weight: 0,
        base_experience: 0,
        is_default: true,
        location_area_encounters: '',
        sprites: {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`,
          front_shiny: '',
          back_default: '',
          back_shiny: ''
        },
        stats: [],
        types: pokemonTypes.map((type: string, typeIndex: number) => ({
          slot: typeIndex + 1,
          type: {
            name: type,
            url: `https://pokeapi.co/api/v2/type/${type}/`
          }
        })),
        abilities: [],
        moves: [],
        species: {
          name: cobblemon.POKÉMON.toLowerCase(),
          url: ''
        }
      }
    })
  }

  static createBasicPokemonFromCobblemon(cobblemonData: any[]): Pokemon[] {
    return cobblemonData.map((cobblemon, index) => ({
      id: index + 1,
      name: cobblemon.POKÉMON.toLowerCase(),
      order: index + 1,
      height: 0,
      weight: 0,
      base_experience: 0,
      is_default: true,
      location_area_encounters: '',
      sprites: {
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`,
        front_shiny: '',
        back_default: '',
        back_shiny: ''
      },
      stats: [],
      types: [], // Start with empty types, will load in background
      abilities: [],
      moves: [],
      species: {
        name: cobblemon.POKÉMON.toLowerCase(),
        url: ''
      }
    }))
  }

  static updatePokemonWithTypes(
    pokemon: Pokemon[], 
    cobblemonData: any[], 
    types: Record<string, string[]>
  ): Pokemon[] {
    return pokemon.map(p => {
      // Try multiple matching strategies
      let cobblemon = cobblemonData.find(c => c.POKÉMON.toLowerCase() === p.name)
      
      // If not found, try exact match
      if (!cobblemon) {
        cobblemon = cobblemonData.find(c => c.POKÉMON === p.name)
      }
      
      // If still not found, try with capitalized name
      if (!cobblemon) {
        const capitalizedName = p.name.charAt(0).toUpperCase() + p.name.slice(1)
        cobblemon = cobblemonData.find(c => c.POKÉMON === capitalizedName)
      }
      
      const pokemonTypes = types[cobblemon?.POKÉMON] || []
      
      if (!cobblemon && pokemonTypes.length === 0) {
        console.warn(`No match found for ${p.name}`)
      }
      
      return {
        ...p,
        types: pokemonTypes.map((type, index) => ({
          slot: index + 1,
          type: {
            name: type,
            url: `https://pokeapi.co/api/v2/type/${type}/`
          }
        }))
      }
    })
  }
}
