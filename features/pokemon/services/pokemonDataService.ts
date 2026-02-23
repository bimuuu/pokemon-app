import { Pokemon } from '@/types/pokemon'
import { fetchCobblemonData } from '@/lib/api'
import { PokemonDataTransformer } from '../utils/pokemonDataTransformer'

export class PokemonDataService {
  static async loadBasicPokemonData(): Promise<Pokemon[]> {
    try {
      const cobblemonData = await fetchCobblemonData()
      return PokemonDataTransformer.createBasicPokemonFromCobblemon(cobblemonData)
    } catch (error) {
      console.error('Error loading Pokemon data:', error)
      return []
    }
  }

  static async loadPokemonDataWithTypes(types: Record<string, string[]>): Promise<Pokemon[]> {
    try {
      const cobblemonData = await fetchCobblemonData()
      return PokemonDataTransformer.createPokemonFromCobblemon(cobblemonData, types)
    } catch (error) {
      console.error('Error loading Pokemon data with types:', error)
      return []
    }
  }

  static updatePokemonWithTypes(
    pokemon: Pokemon[], 
    cobblemonData: any[], 
    types: Record<string, string[]>
  ): Pokemon[] {
    return PokemonDataTransformer.updatePokemonWithTypes(pokemon, cobblemonData, types)
  }

  static filterPokemon(
    pokemon: Pokemon[],
    searchTerm: string,
    selectedType: string,
    selectedGeneration: string,
    selectedRarity: string
  ): Pokemon[] {
    return pokemon.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesType = true
      if (selectedType) {
        matchesType = p.types.some(t => t.type.name.toLowerCase() === selectedType.toLowerCase())
      }
      
      let matchesGeneration = true
      if (selectedGeneration) {
        const genRanges: Record<string, { start: number; end: number }> = {
          'Gen 1': { start: 1, end: 151 },
          'Gen 2': { start: 152, end: 251 },
          'Gen 3': { start: 252, end: 386 },
          'Gen 4': { start: 387, end: 493 },
          'Gen 5': { start: 495, end: 649 },
          'Gen 6': { start: 650, end: 721 },
          'Gen 7': { start: 722, end: 809 },
          'Gen 8': { start: 810, end: 898 },
          'Gen 9': { start: 906, end: 1025 }
        }
        
        const range = genRanges[selectedGeneration]
        if (range) {
          matchesGeneration = p.id >= range.start && p.id <= range.end
        }
      }
      
      let matchesRarity = true
      
      return matchesSearch && matchesType && matchesGeneration && matchesRarity
    })
  }
}
