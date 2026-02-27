import { Pokemon, PokemonStats } from '@/types/pokemon'

export interface NatureRecommendation {
  name: string
  increasedStat: string
  decreasedStat: string
  score: number
  reasoning: string
  role: string
  effectiveness: number
  description: string
}

export interface NatureAnalysis {
  pokemon: string
  baseStats: PokemonStats
  role: string
  recommendations: NatureRecommendation[]
  optimalNature: NatureRecommendation
}

export class NatureOptimizationService {
  // Nature stat modifications (increased stat, decreased stat, multiplier)
  private static readonly NATURE_STATS: Record<string, { 
    increased: string; 
    decreased: string; 
    increasedMultiplier: number; 
    decreasedMultiplier: number 
  }> = {
    'hardy': { increased: 'attack', decreased: 'attack', increasedMultiplier: 1.0, decreasedMultiplier: 1.0 },
    'lonely': { increased: 'attack', decreased: 'defense', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'brave': { increased: 'attack', decreased: 'speed', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'adamant': { increased: 'attack', decreased: 'special-attack', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'naughty': { increased: 'attack', decreased: 'special-defense', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'bold': { increased: 'defense', decreased: 'attack', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'docile': { increased: 'defense', decreased: 'defense', increasedMultiplier: 1.0, decreasedMultiplier: 1.0 },
    'relaxed': { increased: 'defense', decreased: 'speed', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'impish': { increased: 'defense', decreased: 'special-attack', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'lax': { increased: 'defense', decreased: 'special-defense', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'timid': { increased: 'speed', decreased: 'attack', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'hasty': { increased: 'speed', decreased: 'defense', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'serious': { increased: 'speed', decreased: 'speed', increasedMultiplier: 1.0, decreasedMultiplier: 1.0 },
    'jolly': { increased: 'speed', decreased: 'special-attack', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'naive': { increased: 'speed', decreased: 'special-defense', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'modest': { increased: 'special-attack', decreased: 'attack', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'mild': { increased: 'special-attack', decreased: 'defense', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'bashful': { increased: 'special-attack', decreased: 'special-attack', increasedMultiplier: 1.0, decreasedMultiplier: 1.0 },
    'rash': { increased: 'special-attack', decreased: 'special-defense', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'quiet': { increased: 'special-attack', decreased: 'speed', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'calm': { increased: 'special-defense', decreased: 'attack', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'gentle': { increased: 'special-defense', decreased: 'defense', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'sassy': { increased: 'special-defense', decreased: 'speed', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'careful': { increased: 'special-defense', decreased: 'special-attack', increasedMultiplier: 1.1, decreasedMultiplier: 0.9 },
    'quirky': { increased: 'special-defense', decreased: 'special-defense', increasedMultiplier: 1.0, decreasedMultiplier: 1.0 }
  }

  static async analyzeOptimalNatures(pokemon: Pokemon): Promise<NatureAnalysis> {
    const baseStats = this.getBaseStats(pokemon)
    const role = this.determinePokemonRole(baseStats)
    
    // Generate nature recommendations
    const recommendations = this.generateNatureRecommendations(baseStats, role)
    
    // Find optimal nature
    const optimalNature = this.findOptimalNature(recommendations, role)
    
    return {
      pokemon: pokemon.name,
      baseStats,
      role,
      recommendations,
      optimalNature
    }
  }

  private static getBaseStats(pokemon: Pokemon): PokemonStats {
    return {
      hp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
      attack: pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
      defense: pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
      specialAttack: pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
      specialDefense: pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
      speed: pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0
    }
  }

  private static determinePokemonRole(baseStats: PokemonStats): string {
    const { attack, specialAttack, defense, specialDefense, speed } = baseStats
    
    // Calculate offensive and defensive potential
    const offensive = Math.max(attack, specialAttack)
    const defensive = Math.max(defense, specialDefense)
    
    // Determine role based on stat distribution
    if (speed > 100 && offensive > 80) return 'fast-attacker'
    if (offensive > 100) return 'sweeper'
    if (defensive > 100 && offensive > 70) return 'tank'
    if (defensive > 100) return 'wall'
    if (speed > 90) return 'speed-support'
    
    return 'balanced'
  }

  private static generateNatureRecommendations(baseStats: PokemonStats, role: string): NatureRecommendation[] {
    const recommendations: NatureRecommendation[] = []
    
    Object.entries(this.NATURE_STATS).forEach(([natureName, stats]) => {
      if (stats.increased === stats.decreased) {
        // Skip neutral natures for now, but could include with low priority
        return
      }
      
      const score = this.calculateNatureScore(stats, baseStats, role)
      const reasoning = this.generateNatureReasoning(stats, baseStats, role)
      
      recommendations.push({
        name: natureName,
        increasedStat: stats.increased,
        decreasedStat: stats.decreased,
        score,
        reasoning,
        role,
        effectiveness: score / 100,
        description: this.getNatureDescription(natureName, stats)
      })
    })
    
    return recommendations.sort((a, b) => b.score - a.score)
  }

  private static calculateNatureScore(
    natureStats: { increased: string; decreased: string; increasedMultiplier: number; decreasedMultiplier: number },
    baseStats: PokemonStats,
    role: string
  ): number {
    const increasedStat = baseStats[natureStats.increased as keyof PokemonStats]
    const decreasedStat = baseStats[natureStats.decreased as keyof PokemonStats]
    
    let score = 50 // Base score
    
    // Bonus for boosting highest stats
    if (increasedStat >= 90) score += 20
    if (increasedStat >= 80) score += 15
    if (increasedStat >= 70) score += 10
    
    // Penalty for reducing important stats
    if (decreasedStat >= 80) score -= 15
    if (decreasedStat >= 70) score -= 10
    
    // Role-specific bonuses
    switch (role) {
      case 'fast-attacker':
        if (natureStats.increased === 'speed') score += 25
        if (natureStats.increased === 'attack' || natureStats.increased === 'special-attack') score += 20
        if (natureStats.decreased === 'speed') score -= 30
        break
        
      case 'sweeper':
        if (natureStats.increased === 'attack' || natureStats.increased === 'special-attack') score += 25
        if (natureStats.increased === 'speed') score += 15
        if (natureStats.decreased === 'attack' || natureStats.decreased === 'special-attack') score -= 25
        break
        
      case 'tank':
        if (natureStats.increased === 'defense' || natureStats.increased === 'special-defense') score += 25
        if (natureStats.decreased === 'defense' || natureStats.decreased === 'special-defense') score -= 25
        break
        
      case 'wall':
        if (natureStats.increased === 'defense' || natureStats.increased === 'special-defense') score += 30
        if (natureStats.increased === 'hp') score += 15
        if (natureStats.decreased === 'defense' || natureStats.decreased === 'special-defense') score -= 30
        break
        
      case 'speed-support':
        if (natureStats.increased === 'speed') score += 30
        if (natureStats.increased === 'special-defense') score += 15
        if (natureStats.decreased === 'speed') score -= 30
        break
        
      case 'balanced':
        // Prefer balanced natures that don't hurt key stats
        if (natureStats.increased === 'attack' || natureStats.increased === 'special-attack') score += 15
        if (natureStats.increased === 'speed') score += 10
        break
    }
    
    return Math.max(0, Math.min(100, score))
  }

  private static generateNatureReasoning(
    natureStats: { increased: string; decreased: string },
    baseStats: PokemonStats,
    role: string
  ): string {
    const reasons = []
    
    const increasedStat = baseStats[natureStats.increased as keyof PokemonStats]
    const decreasedStat = baseStats[natureStats.decreased as keyof PokemonStats]
    
    if (increasedStat >= 90) {
      reasons.push(`Boosts excellent ${natureStats.increased}`)
    } else if (increasedStat >= 80) {
      reasons.push(`Boosts strong ${natureStats.increased}`)
    } else {
      reasons.push(`Boosts ${natureStats.increased}`)
    }
    
    if (decreasedStat <= 60) {
      reasons.push(`Minimal impact on ${natureStats.decreased}`)
    } else if (decreasedStat <= 70) {
      reasons.push(`Acceptable impact on ${natureStats.decreased}`)
    } else {
      reasons.push(`Reduces ${natureStats.decreased}`)
    }
    
    return reasons.join(', ')
  }

  private static getNatureDescription(natureName: string, stats: { increased: string; decreased: string }): string {
    const statNames: Record<string, string> = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Special Attack',
      'special-defense': 'Special Defense',
      'speed': 'Speed'
    }
    
    const increasedName = statNames[stats.increased] || stats.increased
    const decreasedName = statNames[stats.decreased] || stats.decreased
    
    if (stats.increased === stats.decreased) {
      return 'Neutral nature - no stat changes'
    }
    
    return `+10% ${increasedName}, -10% ${decreasedName}`
  }

  private static findOptimalNature(recommendations: NatureRecommendation[], role: string): NatureRecommendation {
    return recommendations[0] // Already sorted by score
  }

  // Helper method to get nature effect on stats
  static getNatureEffect(natureName: string): { increased: string; decreased: string; multiplier: Record<string, number> } {
    const natureStats = this.NATURE_STATS[natureName.toLowerCase()]
    if (!natureStats) {
      return { increased: 'none', decreased: 'none', multiplier: {} }
    }
    
    const multiplier: Record<string, number> = {}
    multiplier[natureStats.increased] = natureStats.increasedMultiplier
    multiplier[natureStats.decreased] = natureStats.decreasedMultiplier
    
    // Set neutral multiplier for other stats
    const allStats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
    allStats.forEach(stat => {
      if (!multiplier[stat]) {
        multiplier[stat] = 1.0
      }
    })
    
    return {
      increased: natureStats.increased,
      decreased: natureStats.decreased,
      multiplier
    }
  }
}
