// Team-specific constants and configurations

export * from './trainerTypes'
export * from './generations'
export * from './pokemonMapping'

export const TEAM_RECOMMENDATION_CONFIG = {
  MAX_TEAM_SIZE: 6,
  MIN_EFFECTIVENESS_MULTIPLIER: 1.0,
  LEVEL_CAP: 100,
  MIN_LEVEL_SCALING: 0.5
} as const

export const BATTLE_STRATEGY_LIMITS = {
  MAX_STRATEGIES: 3,
  MAX_WEAKNESSES_TO_TARGET: 2,
  MAX_STRENGTHS_TO_AVOID: 2,
  LEVEL_RECOMMENDATION_OFFSET: 3
} as const

export const POKEMON_DISPLAY_CONFIG = {
  GRID_COLS: {
    xs: 2,
    sm: 3,
    lg: 4,
    xl: 6
  },
  IMAGE_SIZE: {
    width: 'w-12',
    height: 'h-12'
  },
  CARD_MIN_WIDTH: 'min-w-[80px]'
} as const

export const LOADING_MESSAGES = {
  GENERATING_RECOMMENDATIONS: 'Loading recommendations...',
  FETCHING_POKEMON_DATA: 'Fetching Pokemon data...',
  CALCULATING_EFFECTIVENESS: 'Calculating team effectiveness...'
} as const

export const UI_MESSAGES = {
  NO_RECOMMENDATIONS: 'No recommendations available',
  ERROR_GENERATING: 'Error generating recommendations',
  TEAM_COMPLETE: 'Team recommendation complete'
} as const
