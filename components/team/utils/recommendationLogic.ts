import { Pokemon } from '@/types/pokemon'
import { fetchCobblemonData } from '@/lib/api'
import { calculateTypeStrengths } from '@/lib/utils'
import {
  GENERATION_FILTER_PROBABILITIES, 
  GENERATION_WEIGHTS,
  getGenerationRange,
  GenerationNumber 
} from '../constants/generations'
import {
  getTrainerRarityConfig,
  TrainerType
} from '../constants/trainerTypes'
import {
  getPokemonSpriteUrl,
  getPokemonDataFromAPI
} from '../constants/pokemonMapping'

// Create a simplified Pokemon object that matches the Pokemon interface
export const createSimplePokemon = async (cobblemon: any, index: number, types: Record<string, string[]>): Promise<Pokemon> => {
  const pokemonName = cobblemon.POKÉMON.toLowerCase()
  
  // Get Pokemon data from API with better error handling
  const pokemonData = await getPokemonDataFromAPI(pokemonName)
  const pokemonId = pokemonData?.id || 1
  
  return {
    id: pokemonId,
    name: pokemonName,
    order: pokemonId,
    height: 0,
    weight: 0,
    base_experience: 0,
    is_default: true,
    location_area_encounters: '',
    sprites: {
      front_default: getPokemonSpriteUrl(pokemonId),
      front_shiny: '',
      back_default: '',
      back_shiny: ''
    },
    stats: [],
    types: (types[pokemonName] || []).map((type: string, typeIndex: number) => ({
      slot: typeIndex + 1,
      type: {
        name: type,
        url: `https://pokeapi.co/api/v2/type/${type}/`
      }
    })),
    abilities: [],
    moves: [],
    species: {
      name: pokemonName,
      url: `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
    }
  }
}

// Get Pokemon rarity from Cobblemon data
export const getPokemonRarity = async (pokemonName: string): Promise<string> => {
  try {
    if (!pokemonName) return 'Common'
    
    const cobblemonData = await fetchCobblemonData()
    const pokemon = cobblemonData.find((p: any) => 
      p.POKÉMON && p.POKÉMON.toLowerCase() === pokemonName.toLowerCase()
    )
    return pokemon?.RARITY || 'Common'
  } catch (error) {
    console.error('Error getting Pokemon rarity:', error)
    return 'Common'
  }
}

// Level scaling: cap at 100, scale recommendations based on level
export const getLevelScaling = (level: number): number => {
  const cappedLevel = Math.min(level, 100)
  return Math.max(0.5, cappedLevel / 100) // 0.5x to 1.0x scaling
}

// Get generation filter for Pokemon with bias towards current generation
export const getGenerationFilter = (gen: GenerationNumber): ((pokemon: any) => boolean) => {
  const currentRange = getGenerationRange(gen)
  
  return (pokemon: any) => {
    const id = parseInt(pokemon.id || pokemon['N.']?.replace('#', '') || '0')
    
    // Primary: Current generation (70% chance)
    if (id >= currentRange[0] && id <= currentRange[1]) {
      return Math.random() <= GENERATION_FILTER_PROBABILITIES.CURRENT
    }
    
    // Secondary: Previous generation (20% chance)
    if (gen > 1) {
      const prevRange = getGenerationRange((gen - 1) as GenerationNumber)
      if (id >= prevRange[0] && id <= prevRange[1]) {
        return Math.random() <= GENERATION_FILTER_PROBABILITIES.PREVIOUS
      }
    }
    
    // Tertiary: Other generations (10% chance)
    return Math.random() <= GENERATION_FILTER_PROBABILITIES.OTHER
  }
}

// Get generation weight for Pokemon selection with cascading reduction
export const getGenerationWeight = (pokemonId: number, targetGen: GenerationNumber): number => {
  const currentRange = getGenerationRange(targetGen)
  
  // Current generation: highest weight
  if (pokemonId >= currentRange[0] && pokemonId <= currentRange[1]) {
    return GENERATION_WEIGHTS.CURRENT
  }
  
  // Previous generations with cascading reduction
  if (targetGen >= 3) {
    // For Gen 3+: reduce previous generations progressively
    const prevGen1Weight = targetGen === 3 ? GENERATION_WEIGHTS.PREVIOUS_HIGH : GENERATION_WEIGHTS.REDUCED_PREV_1
    const prevGen2Weight = targetGen === 4 ? GENERATION_WEIGHTS.PREVIOUS_MEDIUM : GENERATION_WEIGHTS.REDUCED_PREV_2
    const prevGen3Weight = targetGen === 5 ? GENERATION_WEIGHTS.PREVIOUS_LOW : GENERATION_WEIGHTS.REDUCED_PREV_3
    
    // Check immediate previous generation
    if (targetGen > 1) {
      const prevRange = getGenerationRange((targetGen - 1) as GenerationNumber)
      if (pokemonId >= prevRange[0] && pokemonId <= prevRange[1]) {
        if (targetGen === 3) return prevGen1Weight      // Gen 2 in Gen 3
        if (targetGen === 4) return prevGen2Weight      // Gen 3 in Gen 4
        if (targetGen === 5) return prevGen3Weight      // Gen 4 in Gen 5
        return GENERATION_WEIGHTS.REDUCED_PREV_3  // Very low for higher gens
      }
    }
    
    // Check second previous generation (for Gen 4+)
    if (targetGen >= 4) {
      const prevPrevRange = getGenerationRange((targetGen - 2) as GenerationNumber)
      if (pokemonId >= prevPrevRange[0] && pokemonId <= prevPrevRange[1]) {
        if (targetGen === 4) return prevGen1Weight      // Gen 2 in Gen 4
        if (targetGen === 5) return prevGen2Weight      // Gen 3 in Gen 5
        return GENERATION_WEIGHTS.SECOND_PREV_LOW  // Very low for higher gens
      }
    }
    
    // Check third previous generation (for Gen 5+)
    if (targetGen >= 5) {
      const prevPrevPrevRange = getGenerationRange((targetGen - 3) as GenerationNumber)
      if (pokemonId >= prevPrevPrevRange[0] && pokemonId <= prevPrevPrevRange[1]) {
        if (targetGen === 5) return prevGen1Weight      // Gen 2 in Gen 5
        return GENERATION_WEIGHTS.THIRD_PREV  // Extremely low for higher gens
      }
    }
    
    // All other generations: very low weight
    return GENERATION_WEIGHTS.VERY_LOW
  } else {
    // For Gen 1-2: simple previous generation logic
    if (targetGen > 1) {
      const prevRange = getGenerationRange((targetGen - 1) as GenerationNumber)
      if (pokemonId >= prevRange[0] && pokemonId <= prevRange[1]) {
        return GENERATION_WEIGHTS.PREVIOUS_HIGH
      }
    }
    
    return GENERATION_WEIGHTS.OTHER
  }
}

// Enforce rarity distribution based on trainer type targets
export const enforceRarityDistribution = (recommendations: any[], trainerType: TrainerType): any[] => {
  const rarityCount: Record<string, number> = {
    'Common': 0,
    'Uncommon': 0,
    'Rare': 0,
    'Ultra-Rare': 0,
    'Legendary': 0
  }
  
  // Count current rarities
  recommendations.forEach((rec: any) => {
    if (rec.rarity) {
      rarityCount[rec.rarity] = (rarityCount[rec.rarity] || 0) + 1
    }
  })
  
  // Get targets for current trainer type
  const targets: Record<string, { min: number, max: number }> = {}
  const allRarities = ['Common', 'Uncommon', 'Rare', 'Ultra-Rare', 'Legendary']
  
  allRarities.forEach(rarity => {
    const config = getTrainerRarityConfig(trainerType || 'gym', rarity)
    targets[rarity] = config.targets
  })
  
  // Filter to meet targets
  const filtered = recommendations.filter((rec: any) => {
    if (!rec.rarity) return true
    
    const target = targets[rec.rarity]
    const currentCount = rarityCount[rec.rarity]
    
    // Keep if within max range
    return currentCount <= target.max
  })
  
  // Ensure minimums are met by adjusting if needed
  const final = [...filtered]
  
  allRarities.forEach(rarity => {
    const target = targets[rarity]
    const currentCount = final.filter((r: any) => r.rarity === rarity).length
    
    if (currentCount < target.min) {
      // Need to add more of this rarity
      const needed = target.min - currentCount
      const candidates = recommendations
        .filter((r: any) => r.rarity === rarity && !final.includes(r))
        .slice(0, needed)
      
      final.push(...candidates)
    }
  })
  
  // If still not 6, fill with any remaining
  if (final.length < 6) {
    const remaining = recommendations
      .filter((r: any) => !final.includes(r))
      .slice(0, 6 - final.length)
    
    final.push(...remaining)
  }
  
  return final.slice(0, 6)
}
