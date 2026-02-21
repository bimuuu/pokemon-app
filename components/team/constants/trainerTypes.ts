// Trainer type rarity distribution targets and multipliers

export type TrainerType = 'gym' | 'elite' | 'champion'

export interface RarityTarget {
  min: number
  max: number
}

export interface TrainerRarityConfig {
  multiplier: number
  targets: RarityTarget
}

// Trainer type rarity distribution targets
export const TRAINER_RARITY_TARGETS = {
  gym: {
    targets: {
      'Common': { min: 1, max: 3 },
      'Uncommon': { min: 1, max: 2 },
      'Rare': { min: 1, max: 1 },
      'Ultra-Rare': { min: 0, max: 0 },
      'Legendary': { min: 0, max: 0 }
    },
    multiplier: 1.0
  },
  elite: {
    targets: {
      'Common': { min: 0, max: 1 },
      'Uncommon': { min: 1, max: 3 },
      'Rare': { min: 2, max: 3 },
      'Ultra-Rare': { min: 1, max: 1 },
      'Legendary': { min: 0, max: 0 }
    },
    multiplier: 1.5
  },
  champion: {
    targets: {
      'Common': { min: 0, max: 1 },
      'Uncommon': { min: 0, max: 2 },
      'Rare': { min: 1, max: 2 },
      'Ultra-Rare': { min: 2, max: 3 },
      'Legendary': { min: 0, max: 1 }
    },
    multiplier: 2.0
  }
}

// Helper function to get trainer rarity config
export const getTrainerRarityConfig = (trainerType: TrainerType, rarity: string): TrainerRarityConfig => {
  const trainerConfig = TRAINER_RARITY_TARGETS[trainerType]
  
  if (!trainerConfig) {
    return {
      multiplier: 1.0,
      targets: { min: 0, max: 6 }
    }
  }
  
  return {
    multiplier: trainerConfig.multiplier,
    targets: (trainerConfig.targets as Record<string, RarityTarget>)[rarity] || { min: 0, max: 0 }
  }
}

// Helper function to get all rarity targets for a trainer type
export const getTrainerRarityTargets = (trainerType: TrainerType): Record<string, RarityTarget> => {
  const trainerConfig = TRAINER_RARITY_TARGETS[trainerType]
  
  if (!trainerConfig) {
    return {}
  }
  
  return trainerConfig.targets
}

// Helper function to get trainer multiplier
export const getTrainerMultiplier = (trainerType: TrainerType): number => {
  return TRAINER_RARITY_TARGETS[trainerType]?.multiplier || 1.0
}

// Helper function to validate trainer type
export const isValidTrainerType = (type: string): type is TrainerType => {
  return ['gym', 'elite', 'champion'].includes(type)
}
