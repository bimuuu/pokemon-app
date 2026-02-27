import { Pokemon, PokemonAbility } from '@/types/pokemon'

export interface AbilityRecommendation {
  name: string
  isHidden: boolean
  score: number
  reasoning: string
  synergy: number
  role: string
  effectiveness: number
  description: string
  strategicValue: number
}

export interface AbilityAnalysis {
  pokemon: string
  availableAbilities: PokemonAbility[]
  recommendations: AbilityRecommendation[]
  optimalAbility: AbilityRecommendation
  hiddenAbility: AbilityRecommendation | null
}

export interface BattleContext {
  role: string
  teamTypes: string[]
  commonCounters: string[]
  weather?: string
  terrain?: string
}

export class AbilityOptimizationService {
  // Strategic abilities database with effectiveness ratings
  private static readonly STRATEGIC_ABILITIES: Record<string, { 
    power: number; 
    synergy: number; 
    description: string; 
    bestRoles: string[] 
  }> = {
    // Offensive Abilities
    'blaze': { power: 8, synergy: 6, description: 'Boosts Fire moves in pinch', bestRoles: ['sweeper', 'fast-attacker'] },
    'overgrow': { power: 4, synergy: 5, description: 'Boosts Grass moves in pinch', bestRoles: ['sweeper'] },
    'torrent': { power: 8, synergy: 6, description: 'Boosts Water moves in pinch', bestRoles: ['sweeper', 'fast-attacker'] },
    'swarm': { power: 5, synergy: 5, description: 'Boosts Bug moves in pinch', bestRoles: ['sweeper'] },
    'technician': { power: 9, synergy: 8, description: 'Powers up weak moves', bestRoles: ['sweeper', 'fast-attacker'] },
    'skill-link': { power: 7, synergy: 7, description: 'Prevents secondary effects', bestRoles: ['tank', 'wall'] },
    'serene-grace': { power: 8, synergy: 7, description: 'Increases secondary effect chance', bestRoles: ['support', 'speed-support'] },
    'super-luck': { power: 6, synergy: 6, description: 'Increases critical hit ratio', bestRoles: ['sweeper', 'fast-attacker'] },
    'sniper': { power: 8, synergy: 7, description: 'Maxes critical hit damage', bestRoles: ['sweeper'] },
    
    // Defensive Abilities
    'levitate': { power: 9, synergy: 8, description: 'Immune to Ground moves', bestRoles: ['wall', 'tank'] },
    'flash-fire': { power: 8, synergy: 7, description: 'Immune to Fire damage', bestRoles: ['wall', 'tank'] },
    'water-veil': { power: 7, synergy: 6, description: 'Halves Fire damage', bestRoles: ['wall', 'tank'] },
    'thick-fat': { power: 8, synergy: 7, description: 'Halves Fire/Ice damage', bestRoles: ['wall', 'tank'] },
    'marvel-scale': { power: 7, synergy: 6, description: 'Prevents stat drops', bestRoles: ['tank', 'wall'] },
    'clear-body': { power: 6, synergy: 6, description: 'Prevents stat drops', bestRoles: ['tank', 'sweeper'] },
    'white-smoke': { power: 6, synergy: 6, description: 'Prevents stat drops', bestRoles: ['tank', 'support'] },
    'intimidate': { power: 9, synergy: 8, description: 'Lowers opponent Attack', bestRoles: ['tank', 'support'] },
    'unaware': { power: 9, synergy: 8, description: 'Ignores stat changes', bestRoles: ['wall', 'sweeper'] },
    'magic-bounce': { power: 8, synergy: 7, description: 'Bounces status moves', bestRoles: ['tank', 'support'] },
    
    // Utility/Support Abilities
    'regenerator': { power: 9, synergy: 8, description: 'Heals 33% on switch', bestRoles: ['wall', 'tank', 'support'] },
    'natural-cure': { power: 7, synergy: 6, description: 'Cures status on switch', bestRoles: ['support', 'tank'] },
    'poison-heal': { power: 8, synergy: 7, description: 'Cures poison', bestRoles: ['support', 'tank'] },
    'immunity': { power: 6, synergy: 5, description: 'Prevents poison', bestRoles: ['tank', 'wall'] },
    'volt-absorb': { power: 8, synergy: 7, description: 'Heals from Electric moves', bestRoles: ['tank', 'wall'] },
    'water-absorb': { power: 8, synergy: 7, description: 'Heals from Water moves', bestRoles: ['tank', 'wall'] },
    'flash-change': { power: 7, synergy: 6, description: 'Changes type to resist moves', bestRoles: ['tank', 'wall'] },
    'protean': { power: 10, synergy: 9, description: 'Changes type to match moves', bestRoles: ['sweeper', 'fast-attacker'] },
    'libero': { power: 9, synergy: 8, description: 'Changes type on first hit', bestRoles: ['sweeper', 'fast-attacker'] },
    'contrary': { power: 8, synergy: 7, description: 'Reverses stat changes', bestRoles: ['sweeper', 'support'] },
    'prankster': { power: 9, synergy: 8, description: 'Priority status moves', bestRoles: ['support', 'speed-support'] },
    'magic-guard': { power: 7, synergy: 6, description: 'Prevents indirect damage', bestRoles: ['wall', 'support'] },
    'simple': { power: 8, synergy: 7, description: 'Doubles stat changes', bestRoles: ['sweeper', 'support'] },
    'unburden': { power: 5, synergy: 4, description: 'Speed boost when item removed', bestRoles: ['sweeper', 'fast-attacker'] },
    'speed-boost': { power: 9, synergy: 8, description: 'Boosts Speed on KO', bestRoles: ['sweeper', 'fast-attacker'] },
    'moxie': { power: 8, synergy: 7, description: 'Boosts Attack on KO', bestRoles: ['sweeper', 'fast-attacker'] },
    'guts': { power: 7, synergy: 6, description: 'Attack boost when statused', bestRoles: ['tank', 'sweeper'] },
    'quick-feet': { power: 6, synergy: 5, description: 'Prevents status on ground', bestRoles: ['tank', 'support'] },
    'synchronize': { power: 5, synergy: 4, description: 'Shares status with opponent', bestRoles: ['support', 'tank'] },
    'trace': { power: 7, synergy: 6, description: 'Copies opponent ability', bestRoles: ['support', 'tank'] },
    
    // Weather/Terrain Abilities
    'drizzle': { power: 9, synergy: 8, description: 'Sets rain permanently', bestRoles: ['support', 'tank'] },
    'drought': { power: 9, synergy: 8, description: 'Sets sun permanently', bestRoles: ['support', 'tank'] },
    'sand-stream': { power: 8, synergy: 7, description: 'Sets sandstorm permanently', bestRoles: ['tank', 'support'] },
    'snow-warning': { power: 7, synergy: 6, description: 'Sets hail permanently', bestRoles: ['support', 'tank'] },
    'electric-surge': { power: 7, synergy: 6, description: 'Sets electric terrain', bestRoles: ['support'] },
    'psychic-surge': { power: 7, synergy: 6, description: 'Sets psychic terrain', bestRoles: ['support'] },
    'grassy-surge': { power: 7, synergy: 6, description: 'Sets grassy terrain', bestRoles: ['support'] },
    'misty-surge': { power: 7, synergy: 6, description: 'Sets misty terrain', bestRoles: ['support'] },
    'swift-swim': { power: 6, synergy: 5, description: 'No speed penalty in water', bestRoles: ['tank', 'support'] },
    
    // Unique/Mega Abilities
    hugePower: { power: 9, synergy: 7, description: '1.5x Attack, 0.8x accuracy', bestRoles: ['sweeper', 'fast-attacker'] },
    purePower: { power: 9, synergy: 7, description: '1.5x Special Attack, 0.8x accuracy', bestRoles: ['sweeper', 'fast-attacker'] },
    wonderGuard: { power: 9, synergy: 8, description: 'Immune to indirect damage', bestRoles: ['wall', 'tank'] },
    multiscale: { power: 8, synergy: 7, description: '2x Defense when full HP', bestRoles: ['wall', 'tank'] },
    furCoat: { power: 7, synergy: 6, description: '2x Defense when statused', bestRoles: ['tank', 'wall'] },
    magicGuard: { power: 7, synergy: 6, description: 'Immune to indirect damage', bestRoles: ['wall', 'tank'] }
  }

  static async analyzeOptimalAbilities(
    pokemon: Pokemon, 
    context?: Partial<BattleContext>
  ): Promise<AbilityAnalysis> {
    const availableAbilities = pokemon.abilities
    
    // Generate ability recommendations
    const recommendations = await this.generateAbilityRecommendations(pokemon, context)
    
    // Find optimal ability
    const optimalAbility = this.findOptimalAbility(recommendations)
    
    // Find hidden ability recommendation
    const hiddenAbility = recommendations.find(r => r.isHidden)
    
    return {
      pokemon: pokemon.name,
      availableAbilities,
      recommendations,
      optimalAbility,
      hiddenAbility: hiddenAbility || null
    }
  }

  private static async generateAbilityRecommendations(
    pokemon: Pokemon, 
    context?: Partial<BattleContext>
  ): Promise<AbilityRecommendation[]> {
    const recommendations: AbilityRecommendation[] = []
    const pokemonTypes = pokemon.types.map(t => t.type.name)
    const role = this.determinePokemonRole(pokemon)
    
    for (const ability of pokemon.abilities) {
      const abilityName = ability.ability.name
      const isHidden = ability.is_hidden
      
      // Get ability details
      const abilityData = this.STRATEGIC_ABILITIES[abilityName.toLowerCase()]
      
      if (!abilityData) {
        // For unknown abilities, give basic rating
        recommendations.push({
          name: abilityName,
          isHidden,
          score: 50,
          reasoning: 'Basic ability',
          synergy: 5,
          role,
          effectiveness: 0.5,
          description: 'Standard Pokemon ability',
          strategicValue: 5
        })
        continue
      }
      
      // Calculate effectiveness scores
      const roleScore = this.calculateRoleScore(abilityData, role)
      const typeScore = this.calculateTypeSynergy(abilityName, pokemonTypes)
      const contextScore = this.calculateContextSynergy(abilityData, context)
      
      // Overall score
      const score = (roleScore * 0.4) + (typeScore * 0.3) + (contextScore * 0.3)
      const synergy = roleScore + typeScore + contextScore
      
      recommendations.push({
        name: abilityName,
        isHidden,
        score,
        reasoning: this.generateAbilityReasoning(abilityData, role, pokemonTypes, score),
        synergy,
        role,
        effectiveness: score / 100,
        description: abilityData.description,
        strategicValue: abilityData.power
      })
    }
    
    return recommendations.sort((a, b) => b.score - a.score)
  }

  private static determinePokemonRole(pokemon: Pokemon): string {
    const attack = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0
    const specialAttack = pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0
    const defense = pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0
    const specialDefense = pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0
    const speed = pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0
    
    const offensive = Math.max(attack, specialAttack)
    const defensive = Math.max(defense, specialDefense)
    
    if (speed > 100 && offensive > 80) return 'fast-attacker'
    if (offensive > 100) return 'sweeper'
    if (defensive > 100 && offensive > 70) return 'tank'
    if (defensive > 100) return 'wall'
    if (speed > 90) return 'speed-support'
    
    return 'balanced'
  }

  private static calculateRoleScore(abilityData: any, role: string): number {
    if (!abilityData.bestRoles.includes(role)) {
      return 30 // Poor role match
    }
    
    switch (role) {
      case 'sweeper':
      case 'fast-attacker':
        return abilityData.power * 8 + abilityData.synergy * 4
      case 'tank':
      case 'wall':
        return abilityData.power * 6 + abilityData.synergy * 6
      case 'support':
      case 'speed-support':
        return abilityData.power * 5 + abilityData.synergy * 8
      default:
        return abilityData.power * 7 + abilityData.synergy * 5
    }
  }

  private static calculateTypeSynergy(abilityName: string, pokemonTypes: string[]): number {
    let synergy = 50 // Base synergy
    
    // Type-specific ability bonuses
    if (pokemonTypes.includes('fire') && ['blaze', 'flash-fire', 'drought'].includes(abilityName.toLowerCase())) {
      synergy += 30
    }
    if (pokemonTypes.includes('water') && ['torrent', 'water-absorb', 'drizzle', 'water-veil'].includes(abilityName.toLowerCase())) {
      synergy += 30
    }
    if (pokemonTypes.includes('grass') && ['overgrow', 'grassy-surge'].includes(abilityName.toLowerCase())) {
      synergy += 25
    }
    if (pokemonTypes.includes('electric') && ['volt-absorb', 'electric-surge', 'motor-drive'].includes(abilityName.toLowerCase())) {
      synergy += 25
    }
    if (pokemonTypes.includes('psychic') && ['synchronize', 'psychic-surge', 'trace'].includes(abilityName.toLowerCase())) {
      synergy += 25
    }
    if (pokemonTypes.includes('dragon') && ['multiscale', 'marvel-scale'].includes(abilityName.toLowerCase())) {
      synergy += 20
    }
    
    // Universal good abilities
    if (['regenerator', 'intimidate', 'unaware', 'magic-bounce', 'skill-link'].includes(abilityName.toLowerCase())) {
      synergy += 20
    }
    
    return Math.min(100, synergy)
  }

  private static calculateContextSynergy(abilityData: any, context?: Partial<BattleContext>): number {
    if (!context) return 50
    
    let synergy = 50
    
    // Weather synergy
    if (context.weather) {
      if (context.weather === 'rain' && ['drizzle', 'swift-swim', 'rain-dish'].some(a => abilityData.description.toLowerCase().includes(a))) {
        synergy += 20
      }
      if (context.weather === 'sun' && ['drought', 'solar-power', 'chlorophyll'].some(a => abilityData.description.toLowerCase().includes(a))) {
        synergy += 20
      }
      if (context.weather === 'sand' && ['sand-stream', 'sand-veil', 'sand-force'].some(a => abilityData.description.toLowerCase().includes(a))) {
        synergy += 20
      }
    }
    
    // Terrain synergy
    if (context.terrain) {
      if (['electric-surge', 'motor-drive'].some(a => abilityData.description.toLowerCase().includes(a)) && context.terrain === 'electric') {
        synergy += 15
      }
      if (['psychic-surge', 'telepathy'].some(a => abilityData.description.toLowerCase().includes(a)) && context.terrain === 'psychic') {
        synergy += 15
      }
      if (['grassy-surge', 'grass-pelt'].some(a => abilityData.description.toLowerCase().includes(a)) && context.terrain === 'grassy') {
        synergy += 15
      }
    }
    
    // Team composition synergy
    if (context.teamTypes) {
      if (abilityData.description.toLowerCase().includes('intimidate') && context.teamTypes.some(t => ['fighting', 'dark'].includes(t))) {
        synergy += 15
      }
      if (abilityData.description.toLowerCase().includes('regenerator') && context.teamTypes.includes('water')) {
        synergy += 15
      }
    }
    
    return Math.min(100, synergy)
  }

  private static generateAbilityReasoning(
    abilityData: any, 
    role: string, 
    pokemonTypes: string[], 
    score: number
  ): string {
    const reasons = []
    
    if (score >= 85) {
      reasons.push('Excellent ability match')
    } else if (score >= 70) {
      reasons.push('Good ability match')
    } else if (score >= 55) {
      reasons.push('Decent ability match')
    } else {
      reasons.push('Basic ability')
    }
    
    if (abilityData.bestRoles.includes(role)) {
      reasons.push('Perfect for role')
    }
    
    // Type-specific benefits
    if (pokemonTypes.includes('fire') && abilityData.description.toLowerCase().includes('fire')) {
      reasons.push('Type synergy')
    }
    if (pokemonTypes.includes('water') && abilityData.description.toLowerCase().includes('water')) {
      reasons.push('Type synergy')
    }
    
    return reasons.join(', ')
  }

  private static findOptimalAbility(recommendations: AbilityRecommendation[]): AbilityRecommendation {
    return recommendations[0] // Already sorted by score
  }

  // Helper method to get ability effectiveness in battle context
  static getAbilityEffectiveness(abilityName: string, context?: BattleContext): {
    power: number
    synergy: number
    description: string
    bestRoles: string[]
  } {
    const abilityData = this.STRATEGIC_ABILITIES[abilityName.toLowerCase()]
    
    if (!abilityData) {
      return {
        power: 5,
        synergy: 5,
        description: 'Standard Pokemon ability',
        bestRoles: ['balanced']
      }
    }
    
    return {
      power: abilityData.power,
      synergy: abilityData.synergy,
      description: abilityData.description,
      bestRoles: abilityData.bestRoles
    }
  }
}
