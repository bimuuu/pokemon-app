import { Pokemon, PokemonMove } from '@/types/pokemon'
import { PokemonMovesService, MoveLearnMethod } from '@/services/pokemonMovesService'
import { calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'

export interface MoveRecommendation {
  name: string
  power: number
  type: string
  learnMethod: string
  level?: number
  score: number
  isStab: boolean
  reason: string
  category: 'attacking' | 'buff' | 'debuff' | 'support' | 'recovery' | 'weather' | 'terrain'
  strategicValue: number
  synergyScore: number
}

export interface MovesetAnalysis {
  pokemon: string
  types: string[]
  recommendations: MoveRecommendation[]
  coverage: Record<string, number>
  weaknesses: Record<string, number>
  role: 'physical' | 'special' | 'mixed'
}

export class MovesetRecommendationService {
  // Strategic moves database with priorities and descriptions
  private static readonly STRATEGIC_MOVES: Record<string, { type: 'attacking' | 'buff' | 'debuff' | 'support' | 'recovery' | 'weather' | 'terrain', priority: number, description: string }> = {
    // Stat Boosting Moves
    'swords-dance': { type: 'buff', priority: 9, description: 'Attack +2' },
    'dragon-dance': { type: 'buff', priority: 10, description: 'Attack +1, Speed +1' },
    'nasty-plot': { type: 'buff', priority: 9, description: 'Special Attack +2' },
    'calm-mind': { type: 'buff', priority: 8, description: 'Special Attack +1, Special Defense +1' },
    'bulk-up': { type: 'buff', priority: 8, description: 'Attack +1, Defense +1' },
    'coil': { type: 'buff', priority: 7, description: 'Attack +1, Defense +1, Accuracy +1' },
    'growth': { type: 'buff', priority: 6, description: 'Attack +1, Special Attack +1 (sun: +2 each)' },
    'work-up': { type: 'buff', priority: 6, description: 'Attack +1, Special Attack +1' },
    'agility': { type: 'buff', priority: 7, description: 'Speed +2' },
    'rock-polish': { type: 'buff', priority: 7, description: 'Speed +2' },
    'autotomize': { type: 'buff', priority: 6, description: 'Speed +2, Weight -100kg' },
    'shell-smash': { type: 'buff', priority: 9, description: 'Attack +2, Special Attack +2, Speed +2, Defense -1, Special Defense -1' },
    
    // Debuff Moves
    'will-o-wisp': { type: 'debuff', priority: 8, description: 'Burn - Attack halved' },
    'thunder-wave': { type: 'debuff', priority: 8, description: 'Paralysis - Speed quartered' },
    'toxic': { type: 'debuff', priority: 9, description: 'Badly poison' },
    'taunt': { type: 'debuff', priority: 7, description: 'Blocks status moves' },
    'stealth-rock': { type: 'debuff', priority: 9, description: 'Entry hazard' },
    'spikes': { type: 'debuff', priority: 7, description: 'Entry hazard' },
    'sticky-web': { type: 'debuff', priority: 6, description: 'Speed reduction on switch' },
    'toxic-spikes': { type: 'debuff', priority: 7, description: 'Poison entry hazard' },
    'scald': { type: 'attacking', priority: 6, description: 'Burn chance' },
    'discharge': { type: 'attacking', priority: 5, description: 'Paralysis chance' },
    'sludge-wave': { type: 'attacking', priority: 5, description: 'Poison chance' },
    
    // Support/Recovery
    'roost': { type: 'recovery', priority: 8, description: 'Heal 50%, remove Flying type' },
    'recover': { type: 'recovery', priority: 8, description: 'Heal 50%' },
    'rest': { type: 'recovery', priority: 7, description: 'Full heal, sleep 2 turns' },
    'wish': { type: 'support', priority: 7, description: 'Delayed healing' },
    'protect': { type: 'support', priority: 6, description: 'Block damage' },
    'substitute': { type: 'support', priority: 7, description: 'Create substitute' },
    'baton-pass': { type: 'support', priority: 8, description: 'Pass stat boosts' },
    'defog': { type: 'support', priority: 6, description: 'Remove hazards' },
    'rapid-spin': { type: 'support', priority: 6, description: 'Remove hazards, damage' },
    
    // Weather/Terrain
    'rain-dance': { type: 'weather', priority: 5, description: 'Rain weather' },
    'sunny-day': { type: 'weather', priority: 5, description: 'Sun weather' },
    'sandstorm': { type: 'weather', priority: 5, description: 'Sandstorm weather' },
    'hail': { type: 'weather', priority: 5, description: 'Hail weather' },
    'snowscape': { type: 'weather', priority: 5, description: 'Snow weather' },
    'electric-terrain': { type: 'terrain', priority: 4, description: 'Electric terrain' },
    'psychic-terrain': { type: 'terrain', priority: 4, description: 'Psychic terrain' },
    'grassy-terrain': { type: 'terrain', priority: 4, description: 'Grassy terrain' },
    'misty-terrain': { type: 'terrain', priority: 4, description: 'Misty terrain' }
  }

  static async analyzePokemonMoves(pokemon: Pokemon): Promise<MovesetAnalysis> {
    // Get learnable moves
    const movesData = await PokemonMovesService.fetchPokemonMoves(pokemon.name)
    const processedMoves = PokemonMovesService.processMovesByMethod(movesData)
    
    // Get Pokemon types
    const pokemonTypes = pokemon.types.map(t => t.type.name)
    
    // Determine role based on stats
    const role = this.determinePokemonRole(pokemon)
    
    // Get weaknesses for coverage analysis
    const weaknesses = calculateTypeWeaknesses(pokemonTypes)
    const significantWeaknesses = Object.entries(weaknesses)
      .filter(([_, multiplier]) => multiplier > 1.5)
      .map(([type, _]) => type)
    
    // Generate move recommendations
    const recommendations = await this.generateMoveRecommendations(
      pokemon, 
      processedMoves, 
      pokemonTypes, 
      role,
      significantWeaknesses
    )
    
    // Calculate coverage
    const coverage = this.calculateMovesetCoverage(recommendations.slice(0, 4))
    
    return {
      pokemon: pokemon.name,
      types: pokemonTypes,
      recommendations,
      coverage,
      weaknesses: weaknesses,
      role
    }
  }

  private static determinePokemonRole(pokemon: Pokemon): 'physical' | 'special' | 'mixed' {
    const attack = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0
    const specialAttack = pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0
    
    if (attack > specialAttack * 1.2) return 'physical'
    if (specialAttack > attack * 1.2) return 'special'
    return 'mixed'
  }

  private static async generateMoveRecommendations(
    pokemon: Pokemon,
    processedMoves: {
      levelUp: MoveLearnMethod[]
      tm: MoveLearnMethod[]
      egg: MoveLearnMethod[]
      tutor: MoveLearnMethod[]
      other: MoveLearnMethod[]
    },
    pokemonTypes: string[],
    role: 'physical' | 'special' | 'mixed',
    weaknesses: string[]
  ): Promise<MoveRecommendation[]> {
    const allMoves = [
      ...processedMoves.levelUp,
      ...processedMoves.tm,
      ...processedMoves.tutor,
      ...processedMoves.egg,
      ...processedMoves.other
    ]

    const recommendations: MoveRecommendation[] = []

    for (const moveData of allMoves) {
      try {
        // Fetch move details for power and type
        const response = await fetch(`https://pokeapi.co/api/v2/move/${moveData.name.replace(' ', '-')}`)
        if (!response.ok) continue
        
        const moveDetail = await response.json()
        
        const power = moveDetail.power || 0
        const moveType = moveDetail.type?.name || ''
        
        // Categorize move
        const category = this.categorizeMove(moveDetail, moveData.name)
        
        // Calculate STAB bonus
        const isStab = pokemonTypes.includes(moveType)
        
        // Calculate type effectiveness against weaknesses
        let coverageBonus = 0
        for (const weakness of weaknesses) {
          const effectiveness = this.getTypeEffectiveness(moveType, weakness)
          if (effectiveness > 1) {
            coverageBonus += effectiveness
          }
        }
        
        // Learn method priority
        const methodBonus = this.getMethodBonus(moveData.method)
        
        // Role-based bonus
        const roleBonus = this.getRoleBonus(moveDetail.damage_class?.name || '', role)
        
        // Strategic value calculation
        const strategicValue = this.getStrategicValue(moveData.name, pokemon, role)
        
        // Category score based on role preferences
        const categoryScore = this.getCategoryScore(category, role, pokemonTypes)
        
        // Final score calculation
        const score = power * (isStab ? 1.5 : 1) * 
                      (1 + coverageBonus * 0.3) * 
                      methodBonus * 
                      roleBonus * 
                      categoryScore * 
                      (1 + strategicValue * 0.4)
        
        // Generate reason
        const reasons = []
        if (isStab) reasons.push('STAB')
        if (coverageBonus > 0) reasons.push('Covers weaknesses')
        if (power >= 80) reasons.push('High power')
        if (methodBonus >= 1.2) reasons.push('Easy to learn')
        if (strategicValue > 0.7) reasons.push('High strategic value')
        
        recommendations.push({
          name: moveData.name,
          power,
          type: moveType,
          learnMethod: moveData.method,
          level: moveData.level,
          score,
          isStab,
          reason: reasons.join(', ') || 'Good coverage',
          category,
          strategicValue,
          synergyScore: 0 // Will be calculated later based on selected moves
        })
      } catch (error) {
        console.warn(`Failed to fetch move details for ${moveData.name}:`, error)
      }
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 12) // Return top 12 for selection
  }

  private static getMethodBonus(method: string): number {
    const bonuses: Record<string, number> = {
      'level-up': 1.3,
      'machine': 1.2,
      'tutor': 1.1,
      'egg': 0.9,
      'other': 0.8
    }
    return bonuses[method] || 1.0
  }

  private static getRoleBonus(moveClass: string, role: 'physical' | 'special' | 'mixed'): number {
    if (role === 'mixed') return 1.0
    
    if ((role === 'physical' && moveClass === 'physical') ||
        (role === 'special' && moveClass === 'special')) {
      return 1.2
    }
    
    return 0.8
  }

  private static categorizeMove(moveDetail: any, moveName: string): 'attacking' | 'buff' | 'debuff' | 'support' | 'recovery' | 'weather' | 'terrain' {
    // Check strategic moves database first
    const strategicMove = this.STRATEGIC_MOVES[moveName]
    if (strategicMove) {
      return strategicMove.type
    }
    
    // Categorize based on move effects and stats
    if (moveDetail.stat_changes?.length > 0) {
      return moveDetail.stat_changes.some((change: any) => change.change > 0) ? 'buff' : 'debuff'
    }
    
    if (moveDetail.meta?.healing) return 'recovery'
    if (moveDetail.weather) return 'weather'
    if (moveDetail.terrain) return 'terrain'
    if (moveDetail.damage_class?.name === 'status') return 'support'
    
    return 'attacking'
  }

  private static getStrategicValue(moveName: string, pokemon: Pokemon, role: string): number {
    const moveData = this.STRATEGIC_MOVES[moveName]
    if (!moveData) return 0
    
    let value = moveData.priority
    
    // Role-specific bonuses
    if (role === 'physical' && ['swords-dance', 'dragon-dance', 'bulk-up'].includes(moveName)) {
      value += 2
    }
    
    if (role === 'special' && ['nasty-plot', 'calm-mind'].includes(moveName)) {
      value += 2
    }
    
    // Pokemon-specific bonuses
    if (pokemon.name.includes('dragon') && moveName === 'dragon-dance') value += 3
    if (pokemon.types.some(t => t.type.name === 'fire') && moveName === 'will-o-wisp') value += 2
    if (pokemon.types.some(t => t.type.name === 'water') && moveName === 'scald') value += 2
    if (pokemon.types.some(t => t.type.name === 'electric') && moveName === 'thunder-wave') value += 2
    
    return Math.min(value / 10, 1) // Normalize to 0-1 scale
  }

  private static getCategoryScore(category: 'attacking' | 'buff' | 'debuff' | 'support' | 'recovery' | 'weather' | 'terrain', role: string, pokemonTypes: string[]): number {
    const baseScores: Record<string, number> = {
      attacking: 1.0,
      buff: 0.9,
      debuff: 0.8,
      support: 0.7,
      recovery: 0.6,
      weather: 0.5,
      terrain: 0.4
    }
    
    let score = baseScores[category] || 0.5
    
    // Role-specific preferences
    if (role === 'physical' || role === 'special') {
      if (category === 'buff') score *= 1.3
      if (category === 'attacking') score *= 1.2
    }
    
    if (role === 'mixed') {
      if (category === 'buff') score *= 1.2
      if (category === 'support') score *= 1.1
    }
    
    // Type-specific bonuses
    if (pokemonTypes.includes('water') && category === 'weather') score *= 1.2
    if (pokemonTypes.includes('fire') && category === 'weather') score *= 1.2
    if (pokemonTypes.includes('grass') && category === 'terrain') score *= 1.2
    
    return score
  }

  private static getTypeEffectiveness(attackingType: string, defendingType: string): number {
    // Simplified type effectiveness - in production, use the existing TYPE_EFFECTIVENESS
    const effectivenessChart: Record<string, Record<string, number>> = {
      'fire': { 'grass': 2, 'ice': 2, 'bug': 2, 'steel': 2, 'water': 0.5, 'fire': 0.5, 'rock': 0.5, 'dragon': 0.5 },
      'water': { 'fire': 2, 'ground': 2, 'rock': 2, 'water': 0.5, 'grass': 0.5, 'dragon': 0.5 },
      'grass': { 'water': 2, 'ground': 2, 'rock': 2, 'fire': 0.5, 'grass': 0.5, 'dragon': 0.5, 'flying': 0.5, 'bug': 0.5, 'poison': 0.5, 'steel': 0.5 },
      'electric': { 'water': 2, 'flying': 2, 'electric': 0.5, 'grass': 0.5, 'dragon': 0.5 },
      'psychic': { 'fighting': 2, 'poison': 2, 'psychic': 0.5, 'steel': 0.5 },
      'fighting': { 'normal': 2, 'rock': 2, 'steel': 2, 'ice': 2, 'dark': 2, 'poison': 0.5, 'flying': 0.5, 'psychic': 0.5, 'bug': 0.5, 'fairy': 0.5, 'ghost': 0 },
      'dark': { 'psychic': 2, 'ghost': 2, 'fighting': 0.5, 'dark': 0.5, 'fairy': 0.5 },
      'fairy': { 'fighting': 2, 'dragon': 2, 'dark': 2, 'poison': 0.5, 'steel': 0.5, 'fire': 0.5 },
      'normal': { 'rock': 0.5, 'steel': 0.5, 'ghost': 0 },
      'flying': { 'fighting': 2, 'bug': 2, 'grass': 2, 'electric': 0.5, 'rock': 0.5, 'steel': 0.5 },
      'ground': { 'fire': 2, 'electric': 2, 'poison': 2, 'rock': 2, 'steel': 2, 'grass': 0.5, 'bug': 0.5, 'flying': 0 },
      'rock': { 'fire': 2, 'ice': 2, 'flying': 2, 'bug': 2, 'fighting': 0.5, 'ground': 0.5, 'steel': 0.5 },
      'bug': { 'grass': 2, 'psychic': 2, 'dark': 2, 'fire': 0.5, 'fighting': 0.5, 'poison': 0.5, 'flying': 0.5, 'steel': 0.5, 'ghost': 0.5, 'fairy': 0.5 },
      'ghost': { 'psychic': 2, 'ghost': 2, 'normal': 0, 'dark': 0.5 },
      'steel': { 'ice': 2, 'rock': 2, 'fairy': 2, 'fire': 0.5, 'water': 0.5, 'electric': 0.5, 'steel': 0.5 },
      'ice': { 'grass': 2, 'ground': 2, 'flying': 2, 'dragon': 2, 'steel': 0.5, 'fire': 0.5, 'water': 0.5, 'ice': 0.5 },
      'dragon': { 'dragon': 2, 'steel': 0.5, 'fairy': 0 },
      'poison': { 'grass': 2, 'fairy': 2, 'poison': 0.5, 'ground': 0.5, 'rock': 0.5, 'ghost': 0.5 }
    }
    
    return effectivenessChart[attackingType]?.[defendingType] || 1
  }

  private static calculateMovesetCoverage(moves: MoveRecommendation[]): Record<string, number> {
    const coverage: Record<string, number> = {}
    
    moves.forEach(move => {
      // Calculate coverage against all types
      const allTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
      
      allTypes.forEach(targetType => {
        const effectiveness = this.getTypeEffectiveness(move.type, targetType)
        if (effectiveness > 1) {
          coverage[targetType] = Math.max(coverage[targetType] || 0, effectiveness)
        }
      })
    })
    
    return coverage
  }

  static generateBasicMoveset(analysis: MovesetAnalysis): MoveRecommendation[] {
    const moves = analysis.recommendations
    
    // Ensure at least 1-2 STAB moves
    const stabMoves = moves.filter(m => m.isStab)
    const coverageMoves = moves.filter(m => !m.isStab)
    
    const selectedMoves: MoveRecommendation[] = []
    
    // Add 1-2 STAB moves
    selectedMoves.push(...stabMoves.slice(0, 2))
    
    // Add coverage moves
    selectedMoves.push(...coverageMoves.slice(0, 4 - selectedMoves.length))
    
    // Fill remaining slots with highest scoring moves
    const remainingMoves = moves.filter(m => !selectedMoves.includes(m))
    selectedMoves.push(...remainingMoves.slice(0, 4 - selectedMoves.length))
    
    return selectedMoves.slice(0, 4)
  }

  static generateBalancedMoveset(analysis: MovesetAnalysis): MoveRecommendation[] {
    const { recommendations, role } = analysis
    const selectedMoves: MoveRecommendation[] = []
    
    // Categorize moves
    const attackingMoves = recommendations.filter(m => m.category === 'attacking')
    const buffMoves = recommendations.filter(m => m.category === 'buff')
    const debuffMoves = recommendations.filter(m => m.category === 'debuff')
    const supportMoves = recommendations.filter(m => ['support', 'recovery'].includes(m.category))
    
    // 1. Add best setup move (buff) if available
    if (buffMoves.length > 0) {
      selectedMoves.push(buffMoves[0])
    }
    
    // 2. Add 1-2 attacking moves (prioritize STAB)
    const stabMoves = attackingMoves.filter(m => m.isStab)
    if (stabMoves.length >= 2) {
      selectedMoves.push(...stabMoves.slice(0, 2))
    } else {
      selectedMoves.push(...stabMoves)
      const nonStabMoves = attackingMoves.filter(m => !m.isStab)
      selectedMoves.push(...nonStabMoves.slice(0, 2 - stabMoves.length))
    }
    
    // 3. Add utility move (debuff/support)
    const utilityMoves = [...debuffMoves, ...supportMoves]
      .sort((a, b) => b.strategicValue - a.strategicValue)
    
    if (utilityMoves.length > 0 && selectedMoves.length < 4) {
      selectedMoves.push(utilityMoves[0])
    }
    
    // 4. Fill remaining slot with highest scoring move
    if (selectedMoves.length < 4) {
      const remainingMoves = recommendations.filter(m => !selectedMoves.includes(m))
      selectedMoves.push(...remainingMoves.slice(0, 4 - selectedMoves.length))
    }
    
    return selectedMoves.slice(0, 4)
  }

  static getMoveDescription(moveName: string): string {
    const strategicMove = this.STRATEGIC_MOVES[moveName]
    return strategicMove?.description || ''
  }
}
