// Generation ranges and constants for Pokemon selection

export const GENERATION_RANGES = {
  1: [1, 151],    // Kanto
  2: [152, 251],  // Johto  
  3: [252, 386],  // Hoenn
  4: [387, 493],  // Sinnoh
  5: [494, 649],  // Unova
  6: [650, 721],  // Kalos
  7: [722, 809],  // Alola
  8: [810, 905]   // Galar
} as const

export const GENERATION_NAMES = {
  1: 'Kanto',
  2: 'Johto',
  3: 'Hoenn', 
  4: 'Sinnoh',
  5: 'Unova',
  6: 'Kalos',
  7: 'Alola',
  8: 'Galar'
} as const

export type GenerationNumber = keyof typeof GENERATION_RANGES

// Generation filter probabilities
export const GENERATION_FILTER_PROBABILITIES = {
  CURRENT: 0.7,    // 70% chance for current generation
  PREVIOUS: 0.2,  // 20% chance for previous generation
  OTHER: 0.1      // 10% chance for other generations
} as const

// Generation weight multipliers
export const GENERATION_WEIGHTS = {
  CURRENT: 3.0,           // Highest weight for current generation
  PREVIOUS_HIGH: 1.5,     // High weight for immediate previous (Gen 2 in Gen 3)
  PREVIOUS_MEDIUM: 1.2,   // Medium weight for previous (Gen 3 in Gen 4)
  PREVIOUS_LOW: 1.0,     // Low weight for previous (Gen 4 in Gen 5)
  REDUCED_PREV_1: 0.8,    // Reduced previous (Gen 2 in Gen 4+)
  REDUCED_PREV_2: 0.6,    // Reduced previous (Gen 3 in Gen 5+)
  REDUCED_PREV_3: 0.5,    // Reduced previous (Gen 4 in Gen 5+)
  SECOND_PREV_HIGH: 0.3,  // Second previous (Gen 2 in Gen 4)
  SECOND_PREV_LOW: 0.2,   // Second previous (Gen 2 in Gen 5)
  THIRD_PREV: 0.2,        // Third previous (Gen 2 in Gen 5)
  OTHER: 0.5,            // Low weight for other generations (Gen 1-2)
  VERY_LOW: 0.1          // Very low weight for distant generations
} as const

// Helper function to get generation by Pokemon ID
export const getGenerationByPokemonId = (pokemonId: number): GenerationNumber => {
  for (const [gen, range] of Object.entries(GENERATION_RANGES)) {
    if (pokemonId >= range[0] && pokemonId <= range[1]) {
      return parseInt(gen) as GenerationNumber
    }
  }
  return 1 // Default to Kanto
}

// Helper function to get generation range
export const getGenerationRange = (gen: GenerationNumber): [number, number] => {
  const range = GENERATION_RANGES[gen] || GENERATION_RANGES[1]
  return [range[0], range[1]] as [number, number]
}

// Helper function to get generation name
export const getGenerationName = (gen: GenerationNumber): string => {
  return GENERATION_NAMES[gen] || 'Unknown'
}
