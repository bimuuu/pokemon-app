import { Pokemon, PokemonStats, TrainingPokemon } from '@/types/pokemon'

export interface EVSpread {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}

export interface EVRecommendation {
  spread: EVSpread
  role: string
  reasoning: string
  statChanges: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  effectiveness: number
}

export interface EVAnalysis {
  pokemon: string
  baseStats: PokemonStats
  recommendedSpreads: EVRecommendation[]
  optimalSpread: EVRecommendation
  customSpreads: EVSpread[]
}

export class EVCalculationService {
  static readonly MAX_EVS = 510
  static readonly EVS_PER_STAT = 252
  static readonly MIN_EVS = 0

  static analyzeEVOptimization(pokemon: Pokemon): EVAnalysis {
    const baseStats = this.getBaseStats(pokemon)
    const role = this.determinePokemonRole(baseStats)
    
    // Generate recommended spreads based on role
    const recommendedSpreads = this.generateRecommendedSpreads(baseStats, role)
    
    // Find optimal spread
    const optimalSpread = this.findOptimalSpread(recommendedSpreads)
    
    return {
      pokemon: pokemon.name,
      baseStats,
      recommendedSpreads,
      optimalSpread,
      customSpreads: []
    }
  }

  private static getBaseStats(pokemon: Pokemon): PokemonStats {
    return pokemon.stats.reduce((acc, stat) => {
      acc[stat.stat.name as keyof PokemonStats] = stat.base_stat
      return acc
    }, {} as PokemonStats)
  }

  private static determinePokemonRole(stats: PokemonStats): string {
    const totalOffense = stats.attack + stats.specialAttack
    const totalDefense = stats.hp + stats.defense + stats.specialDefense
    
    // Speed-based roles
    if (stats.speed >= 100) {
      return 'fast-attacker'
    }
    
    // Bulk-based roles
    if (totalDefense > totalOffense * 1.5) {
      return stats.speed >= 60 ? 'tank' : 'wall'
    }
    
    // Offense-based roles
    if (stats.attack > stats.specialAttack * 1.3) {
      return 'physical-attacker'
    } else if (stats.specialAttack > stats.attack * 1.3) {
      return 'special-attacker'
    } else if (totalOffense > totalDefense) {
      return 'mixed-attacker'
    }
    
    return 'balanced'
  }

  private static generateRecommendedSpreads(baseStats: PokemonStats, role: string): EVRecommendation[] {
    const spreads: EVRecommendation[] = []
    
    switch (role) {
      case 'fast-attacker':
        spreads.push(...this.generateFastAttackerSpreads(baseStats))
        break
      case 'physical-attacker':
        spreads.push(...this.generatePhysicalAttackerSpreads(baseStats))
        break
      case 'special-attacker':
        spreads.push(...this.generateSpecialAttackerSpreads(baseStats))
        break
      case 'mixed-attacker':
        spreads.push(...this.generateMixedAttackerSpreads(baseStats))
        break
      case 'tank':
        spreads.push(...this.generateTankSpreads(baseStats))
        break
      case 'wall':
        spreads.push(...this.generateWallSpreads(baseStats))
        break
      default:
        spreads.push(...this.generateBalancedSpreads(baseStats))
    }
    
    return spreads
  }

  private static generateFastAttackerSpreads(stats: PokemonStats): EVRecommendation[] {
    const spreads: EVRecommendation[] = []
    
    // Max speed + max offense
    if (stats.attack > stats.specialAttack) {
      spreads.push(this.createSpread(
        { hp: 4, attack: 252, defense: 0, specialAttack: 0, specialDefense: 0, speed: 252 },
        'fast-physical',
        'Max Speed and Attack for fast physical sweepers',
        stats
      ))
    } else {
      spreads.push(this.createSpread(
        { hp: 4, attack: 0, defense: 0, specialAttack: 252, specialDefense: 0, speed: 252 },
        'fast-special',
        'Max Speed and Special Attack for fast special sweepers',
        stats
      ))
    }
    
    // Balanced fast attacker
    spreads.push(this.createSpread(
      { hp: 76, attack: 252, defense: 0, specialAttack: 0, specialDefense: 0, speed: 180 },
      'fast-balanced',
      'High Speed and Attack with some HP bulk',
      stats
    ))
    
    return spreads
  }

  private static generatePhysicalAttackerSpreads(stats: PokemonStats): EVRecommendation[] {
    const spreads: EVRecommendation[] = []
    
    // Standard physical attacker
    spreads.push(this.createSpread(
      { hp: 4, attack: 252, defense: 0, specialAttack: 0, specialDefense: 0, speed: 252 },
      'physical-standard',
      'Max Attack and Speed for standard physical attackers',
      stats
    ))
    
    // Bulky physical attacker
    spreads.push(this.createSpread(
      { hp: 76, attack: 252, defense: 0, specialAttack: 0, specialDefense: 76, speed: 104 },
      'physical-bulky',
      'Max Attack with balanced bulk and decent Speed',
      stats
    ))
    
    // Choice band user
    spreads.push(this.createSpread(
      { hp: 0, attack: 252, defense: 76, specialAttack: 0, specialDefense: 76, speed: 104 },
      'physical-choice',
      'Max Attack with bulk for Choice Band users',
      stats
    ))
    
    return spreads
  }

  private static generateSpecialAttackerSpreads(stats: PokemonStats): EVRecommendation[] {
    const spreads: EVRecommendation[] = []
    
    // Standard special attacker
    spreads.push(this.createSpread(
      { hp: 4, attack: 0, defense: 0, specialAttack: 252, specialDefense: 0, speed: 252 },
      'special-standard',
      'Max Special Attack and Speed for standard special attackers',
      stats
    ))
    
    // Bulky special attacker
    spreads.push(this.createSpread(
      { hp: 76, attack: 0, defense: 0, specialAttack: 252, specialDefense: 76, speed: 104 },
      'special-bulky',
      'Max Special Attack with balanced bulk and decent Speed',
      stats
    ))
    
    // Specs user
    spreads.push(this.createSpread(
      { hp: 0, attack: 0, defense: 76, specialAttack: 252, specialDefense: 76, speed: 104 },
      'special-specs',
      'Max Special Attack with bulk for Choice Specs users',
      stats
    ))
    
    return spreads
  }

  private static generateMixedAttackerSpreads(stats: PokemonStats): EVRecommendation[] {
    const spreads: EVRecommendation[] = []
    
    // Balanced mixed attacker
    spreads.push(this.createSpread(
      { hp: 76, attack: 128, defense: 0, specialAttack: 128, specialDefense: 0, speed: 176 },
      'mixed-balanced',
      'Balanced offenses with Speed and HP bulk',
      stats
    ))
    
    // Physical-leaning mixed
    spreads.push(this.createSpread(
      { hp: 76, attack: 252, defense: 0, specialAttack: 76, specialDefense: 0, speed: 104 },
      'mixed-physical',
      'Physical-focused mixed attacker with bulk',
      stats
    ))
    
    // Special-leaning mixed
    spreads.push(this.createSpread(
      { hp: 76, attack: 76, defense: 0, specialAttack: 252, specialDefense: 0, speed: 104 },
      'mixed-special',
      'Special-focused mixed attacker with bulk',
      stats
    ))
    
    return spreads
  }

  private static generateTankSpreads(stats: PokemonStats): EVRecommendation[] {
    const spreads: EVRecommendation[] = []
    
    // Standard tank
    spreads.push(this.createSpread(
      { hp: 252, attack: 0, defense: 128, specialAttack: 0, specialDefense: 128, speed: 0 },
      'tank-balanced',
      'Max HP with balanced defensive investments',
      stats
    ))
    
    // Physical tank
    spreads.push(this.createSpread(
      { hp: 252, attack: 0, defense: 252, specialAttack: 0, specialDefense: 0, speed: 4 },
      'tank-physical',
      'Max HP and Defense for physical tanks',
      stats
    ))
    
    // Special tank
    spreads.push(this.createSpread(
      { hp: 252, attack: 0, defense: 0, specialAttack: 0, specialDefense: 252, speed: 4 },
      'tank-special',
      'Max HP and Special Defense for special tanks',
      stats
    ))
    
    return spreads
  }

  private static generateWallSpreads(stats: PokemonStats): EVRecommendation[] {
    const spreads: EVRecommendation[] = []
    
    // Physical wall
    spreads.push(this.createSpread(
      { hp: 252, attack: 0, defense: 252, specialAttack: 0, specialDefense: 0, speed: 4 },
      'wall-physical',
      'Max HP and Defense for physical walls',
      stats
    ))
    
    // Special wall
    spreads.push(this.createSpread(
      { hp: 252, attack: 0, defense: 0, specialAttack: 0, specialDefense: 252, speed: 4 },
      'wall-special',
      'Max HP and Special Defense for special walls',
      stats
    ))
    
    // Specially defensive wall
    spreads.push(this.createSpread(
      { hp: 244, attack: 0, defense: 0, specialAttack: 0, specialDefense: 252, speed: 14 },
      'wall-special-offense',
      'Special wall with some Speed for utility',
      stats
    ))
    
    return spreads
  }

  private static generateBalancedSpreads(stats: PokemonStats): EVRecommendation[] {
    const spreads: EVRecommendation[] = []
    
    // All-around balanced
    spreads.push(this.createSpread(
      { hp: 76, attack: 76, defense: 76, specialAttack: 76, specialDefense: 76, speed: 130 },
      'balanced-all',
      'Balanced investment across all stats',
      stats
    ))
    
    // Offensive balanced
    spreads.push(this.createSpread(
      { hp: 76, attack: 128, defense: 0, specialAttack: 128, specialDefense: 76, speed: 102 },
      'balanced-offensive',
      'Balanced offenses with decent bulk and Speed',
      stats
    ))
    
    // Defensive balanced
    spreads.push(this.createSpread(
      { hp: 252, attack: 0, defense: 76, specialAttack: 0, specialDefense: 76, speed: 106 },
      'balanced-defensive',
      'Defensive investment with decent Speed',
      stats
    ))
    
    return spreads
  }

  private static createSpread(
    spread: EVSpread,
    role: string,
    reasoning: string,
    baseStats: PokemonStats
  ): EVRecommendation {
    // Validate spread doesn't exceed 510 EVs
    const total = Object.values(spread).reduce((sum, evs) => sum + evs, 0)
    if (total > 510) {
      console.warn(`Invalid spread generated: ${total} EVs exceeds 510`, spread)
    }
    
    const statChanges = this.calculateStatChanges(spread, baseStats)
    const effectiveness = this.calculateEffectiveness(spread, role, baseStats)
    
    return {
      spread,
      role,
      reasoning,
      statChanges,
      effectiveness
    }
  }

  private static calculateStatChanges(spread: EVSpread, baseStats: PokemonStats): PokemonStats {
    const changes: Partial<PokemonStats> = {}
    
    Object.entries(spread).forEach(([stat, evs]) => {
      if (evs > 0) {
        const baseStat = baseStats[stat as keyof PokemonStats]
        // Calculate stat increase (simplified formula)
        const increase = Math.floor((evs / 4) * (baseStat / 100))
        changes[stat as keyof PokemonStats] = increase
      } else {
        changes[stat as keyof PokemonStats] = 0
      }
    })
    
    return changes as PokemonStats
  }

  private static calculateEffectiveness(spread: EVSpread, role: string, baseStats: PokemonStats): number {
    let effectiveness = 50 // Base effectiveness
    
    // Role-specific effectiveness
    const roleMultipliers: Record<string, Partial<Record<keyof EVSpread, number>>> = {
      'fast-physical': { attack: 2, speed: 2 },
      'fast-special': { specialAttack: 2, speed: 2 },
      'physical-standard': { attack: 2, speed: 1.5 },
      'special-standard': { specialAttack: 2, speed: 1.5 },
      'tank-balanced': { hp: 1.5, defense: 1, specialDefense: 1 },
      'wall-physical': { hp: 2, defense: 2 },
      'wall-special': { hp: 2, specialDefense: 2 }
    }
    
    const multipliers = roleMultipliers[role] || {}
    
    Object.entries(spread).forEach(([stat, evs]) => {
      if (evs > 0) {
        const multiplier = multipliers[stat as keyof EVSpread] || 1
        effectiveness += (evs / 510) * 20 * multiplier
      }
    })
    
    return Math.min(100, Math.round(effectiveness))
  }

  private static findOptimalSpread(spreads: EVRecommendation[]): EVRecommendation {
    return spreads.reduce((best, current) => 
      current.effectiveness > best.effectiveness ? current : best
    )
  }

  static validateEVSpread(spread: EVSpread): boolean {
    const total = Object.values(spread).reduce((sum, evs) => sum + evs, 0)
    
    // Check total EVs
    if (total > this.MAX_EVS) return false
    
    // Check individual stat EVs
    return Object.values(spread).every(evs => 
      evs >= this.MIN_EVS && evs <= this.EVS_PER_STAT && evs % 4 === 0
    )
  }

  static optimizeSpreadForTarget(
    baseStats: PokemonStats,
    targetStats: Partial<PokemonStats>
  ): EVSpread {
    const spread: EVSpread = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0
    }
    
    let remainingEvs = this.MAX_EVS
    
    // Prioritize stats based on target
    const statPriority = Object.entries(targetStats)
      .sort(([, a], [, b]) => b - a)
      .map(([stat]) => stat as keyof EVSpread)
    
    for (const stat of statPriority) {
      if (remainingEvs <= 0) break
      
      const evs = Math.min(this.EVS_PER_STAT, remainingEvs)
      spread[stat] = evs - (evs % 4) // Round down to nearest 4
      remainingEvs -= spread[stat]
    }
    
    return spread
  }
}
