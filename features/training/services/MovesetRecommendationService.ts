import { Pokemon, PokemonMove, MoveRecommendation, MovesetAnalysis, DefensiveRecommendation } from '@/types/pokemon'
import { PokemonMovesService, MoveLearnMethod } from '@/services/pokemonMovesService'
import { calculateTypeWeaknesses, calculateTypeStrengths, calculateCounterTypes } from '@/lib/utils'

export class MovesetRecommendationService {
  // Strategic moves database with priorities and descriptions
  private static readonly STRATEGIC_MOVES: Record<string, { type: 'attacking' | 'buff' | 'debuff' | 'support' | 'recovery' | 'weather' | 'terrain', priority: number, description: string }> = {
    // Special Attacker Priority Moves (for Pokemon like Charizard Mega Y)
    'flamethrower': { type: 'attacking', priority: 9, description: 'Reliable special Fire STAB' },
    'fire-blast': { type: 'attacking', priority: 8, description: 'High power special Fire STAB' },
    'heat-wave': { type: 'attacking', priority: 7, description: 'Special Fire STAB with burn chance' },
    'solar-beam': { type: 'attacking', priority: 8, description: 'Powerful special Grass coverage' },
    'focus-blast': { type: 'attacking', priority: 7, description: 'Special Fighting coverage' },
    'air-slash': { type: 'attacking', priority: 6, description: 'Special Flying STAB with flinch chance' },
    'hurricane': { type: 'attacking', priority: 7, description: 'High power special Flying STAB' },
    'dragon-pulse': { type: 'attacking', priority: 7, description: 'Special Dragon coverage' },
    'psychic': { type: 'attacking', priority: 6, description: 'Special Psychic coverage' },
    'shadow-ball': { type: 'attacking', priority: 6, description: 'Special Ghost coverage' },
    'energy-ball': { type: 'attacking', priority: 6, description: 'Special Grass coverage' },
    'dark-pulse': { type: 'attacking', priority: 7, description: 'Special Dark coverage with flinch chance' },
    'sludge-wave': { type: 'attacking', priority: 5, description: 'Special Poison with poison chance' },
    
    // Physical Attacker Priority Moves (for Pokemon like Charizard Mega X)
    'flare-blitz': { type: 'attacking', priority: 9, description: 'High power physical Fire STAB with recoil' },
    'fire-punch': { type: 'attacking', priority: 7, description: 'Reliable physical Fire STAB' },
    'dragon-claw': { type: 'attacking', priority: 8, description: 'Reliable physical Dragon STAB' },
    'outrage': { type: 'attacking', priority: 7, description: 'High power physical Dragon STAB' },
    'earthquake': { type: 'attacking', priority: 9, description: 'Powerful physical Ground coverage' },
    'rock-slide': { type: 'attacking', priority: 8, description: 'Physical Rock coverage with flinch chance' },
    'stone-edge': { type: 'attacking', priority: 7, description: 'High power physical Rock coverage' },
    'brick-break': { type: 'attacking', priority: 6, description: 'Physical Fighting coverage' },
    
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
    
    // Status/Debuff moves - reduced priority for offensive builds
    'toxic': { type: 'debuff', priority: 6, description: 'Badly poison - lower priority for offensive builds' },
    'will-o-wisp': { type: 'debuff', priority: 7, description: 'Burn - Attack halved' },
    'thunder-wave': { type: 'debuff', priority: 7, description: 'Paralysis - Speed quartered' },
    'taunt': { type: 'debuff', priority: 6, description: 'Blocks status moves - situational' },
    'stealth-rock': { type: 'debuff', priority: 8, description: 'Entry hazard - high utility' },
    'spikes': { type: 'debuff', priority: 6, description: 'Entry hazard - situational' },
    'sticky-web': { type: 'debuff', priority: 5, description: 'Speed reduction on switch - niche' },
    'toxic-spikes': { type: 'debuff', priority: 6, description: 'Poison entry hazard - situational' },
    'scald': { type: 'attacking', priority: 7, description: 'Burn chance + decent damage' },
    'discharge': { type: 'attacking', priority: 6, description: 'Paralysis chance + decent damage' },
    
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
    
    // Calculate counter types (types that are strong against this Pokemon)
    const counterTypes = calculateCounterTypes(pokemonTypes)
    
    // Generate move recommendations
    const recommendations = await this.generateMoveRecommendations(
      pokemon, 
      processedMoves, 
      pokemonTypes, 
      role,
      significantWeaknesses,
      counterTypes
    )
    
    // Calculate coverage
    const coverage = this.calculateMovesetCoverage(recommendations.slice(0, 4))
    
    // Calculate defensive coverage against counter types
    const defensiveCoverage = this.calculateDefensiveCoverage(recommendations.slice(0, 4), counterTypes)
    
    // Assess overall threat level
    const threatLevel = this.assessThreatLevel(counterTypes, defensiveCoverage)
    
    // Identify coverage gaps
    const coverageGaps = this.identifyCoverageGaps(counterTypes, defensiveCoverage)
    
    return {
      pokemon: pokemon.name,
      types: pokemonTypes,
      recommendations,
      coverage,
      weaknesses: weaknesses,
      role,
      counterTypes,
      defensiveCoverage,
      threatLevel,
      coverageGaps
    }
  }

  private static determinePokemonRole(pokemon: Pokemon): 'physical' | 'special' | 'mixed' {
    const attack = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0
    const specialAttack = pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0
    
    // Special cases for known forms
    const pokemonName = pokemon.name.toLowerCase()
    
    // Mega Evolution forms with known stat distributions
    const megaForms: Record<string, 'physical' | 'special'> = {
      // Mega X forms (Physical attackers)
      'charizard-mega-x': 'physical',
      'mewtwo-mega-x': 'physical', 
      'blaziken-mega': 'physical',
      'groudon-primal': 'physical',
      'salamence-mega': 'physical',
      'garchomp-mega': 'physical',
      'tyranitar-mega': 'physical',
      'metagross-mega': 'physical',
      'latios-mega': 'physical',
      'rayquaza-mega': 'physical',
      'scizor-mega': 'physical',
      'heracross-mega': 'physical',
      'pinsir-mega': 'physical',
      'gyarados-mega': 'physical',
      'aerodactyl-mega': 'physical',
      
      // Mega Y forms (Special attackers)  
      'charizard-mega-y': 'special',
      'mewtwo-mega-y': 'special',
      'venusaur-mega': 'special',
      'blastoise-mega': 'special',
      'alakazam-mega': 'special',
      'gengar-mega': 'special',
      'kangaskhan-mega': 'special',
      'pidgeot-mega': 'special',
      'slowbro-mega': 'special',
      'steelix-mega': 'special',
      'sableye-mega': 'special',
      'absol-mega': 'special',
      'glalie-mega': 'special',
      'sceptile-mega': 'special',
      'swampert-mega': 'special',
      'gardevoir-mega': 'special',
      'medicham-mega': 'special',
      'latias-mega': 'special',
      'kyogre-primal': 'special',
      'lucario-mega': 'special',
      'abomasnow-mega': 'special',
      'gallade-mega': 'special',
      'audino-mega': 'special',
      'diancie-mega': 'special'
    }
    
    // Arceus forms - determine role based on type
    const arceusForms: Record<string, 'physical' | 'special'> = {
      'arceus-fighting': 'physical',
      'arceus-flying': 'physical',
      'arceus-poison': 'physical',
      'arceus-ground': 'physical',
      'arceus-rock': 'physical',
      'arceus-bug': 'physical',
      'arceus-ghost': 'special',
      'arceus-steel': 'physical',
      'arceus-fire': 'special',
      'arceus-water': 'special',
      'arceus-grass': 'special',
      'arceus-electric': 'special',
      'arceus-psychic': 'special',
      'arceus-ice': 'special',
      'arceus-dragon': 'physical',
      'arceus-dark': 'physical',
      'arceus-fairy': 'special'
    }
    
    // Regional forms with different stat distributions
    const regionalForms: Record<string, 'physical' | 'special'> = {
      // Alolan forms
      'rattata-alola': 'physical',
      'raticate-alola': 'physical',
      'raichu-alola': 'special',
      'sandshrew-alola': 'physical',
      'sandslash-alola': 'physical',
      'vulpix-alola': 'special',
      'ninetales-alola': 'special',
      'diglett-alola': 'physical',
      'dugtrio-alola': 'physical',
      'meowth-alola': 'physical',
      'persian-alola': 'physical',
      'geodude-alola': 'special',
      'graveler-alola': 'special',
      'golem-alola': 'physical',
      'grimer-alola': 'physical',
      'muk-alola': 'physical',
      'exeggutor-alola': 'special',
      'marowak-alola': 'physical',
      
      // Galarian forms
      'meowth-galar': 'physical',
      'ponyta-galar': 'physical',
      'rapidash-galar': 'special',
      'farfetchd-galar': 'physical',
      'weezing-galar': 'special',
      'mr-mime-galar': 'special',
      'corsola-galar': 'special',
      'zigzagoon-galar': 'physical',
      'linoone-galar': 'physical',
      'yamask-galar': 'special',
      'cursola-galar': 'special',
      'stunfisk-galar': 'special',
      
      // Hisuian forms
      'typhlosion-hisui': 'special',
      'growlithe-hisui': 'physical',
      'arcanine-hisui': 'physical',
      'voltorb-hisui': 'special',
      'electrode-hisui': 'special',
      'qwilfish-hisui': 'physical',
      'sneasel-hisui': 'physical',
      'weavile-hisui': 'physical',
      'sneasler-hisui': 'physical',
      'braviary-hisui': 'physical',
      'avalugg-hisui': 'physical',
      'decidueye-hisui': 'physical',
      'samurott-hisui': 'physical',
      'lilligant-hisui': 'physical',
      
      // Paldean forms
      'wooper-paldea': 'physical',
      'quagsire-paldea': 'physical',
      'tauros-paldea': 'physical',
      'tauros-paldea-aqua': 'physical',
      'tauros-paldea-blaze': 'physical',
      'tauros-paldea-combat': 'physical'
    }
    
    // Gigantamax forms - generally maintain base role but with emphasis
    const gmaxForms: Record<string, 'physical' | 'special'> = {
      'charizard-gmax': 'special',
      'venusaur-gmax': 'special',
      'blastoise-gmax': 'special',
      'butterfree-gmax': 'special',
      'pikachu-gmax': 'physical',
      'meowth-gmax': 'physical',
      'machamp-gmax': 'physical',
      'gengar-gmax': 'special',
      'kingler-gmax': 'physical',
      'lapras-gmax': 'special',
      'eevee-gmax': 'physical',
      'snorlax-gmax': 'physical',
      'garbodor-gmax': 'physical',
      'melmetal-gmax': 'physical',
      'corviknight-gmax': 'physical',
      'duraludon-gmax': 'special',
      'coalossal-gmax': 'physical',
      'flapple-gmax': 'physical',
      'appletun-gmax': 'special',
      'sandaconda-gmax': 'physical',
      'toxtricity-gmax': 'special',
      'centiskorch-gmax': 'physical',
      'hatterene-gmax': 'special',
      'grimmsnarl-gmax': 'special',
      'alcremie-gmax': 'special',
      'copperajah-gmax': 'physical',
      'urshifu-gmax': 'physical',
      'urshifu-rapid-gmax': 'physical'
    }
    
    // Check special form mappings
    if (megaForms[pokemonName]) {
      return megaForms[pokemonName]
    }
    
    if (arceusForms[pokemonName]) {
      return arceusForms[pokemonName]
    }
    
    if (regionalForms[pokemonName]) {
      return regionalForms[pokemonName]
    }
    
    if (gmaxForms[pokemonName]) {
      return gmaxForms[pokemonName]
    }
    
    // General stat-based determination
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
    weaknesses: string[],
    counterTypes: Record<string, number>
  ): Promise<MoveRecommendation[]> {
    // Filter moves based on learnability and prioritize reliable methods
    const reliableMoves = [
      ...processedMoves.levelUp, // Most reliable - always learnable
      ...processedMoves.tm,      // Very reliable - TM moves are widely available
      ...processedMoves.tutor,   // Less reliable - version dependent
      ...processedMoves.egg,     // Least reliable - breeding dependent
      ...processedMoves.other    // Special cases - lowest priority
    ]

    // Additional validation for egg moves (many Pokemon can't learn them)
    const filteredMoves = reliableMoves.filter(move => {
      // Skip egg moves for Pokemon that typically can't breed (legendary, mythical, etc.)
      if (move.method === 'egg') {
        return !this.isLegendaryOrMythical(pokemon.name)
      }
      return true
    })

    const recommendations: MoveRecommendation[] = []
    const processedMoveNames = new Set<string>() // Track to avoid duplicates
    const categoryCounts = {
      attacking: 0,
      buff: 0,
      debuff: 0,
      support: 0,
      recovery: 0,
      weather: 0,
      terrain: 0
    }

    for (const moveData of filteredMoves) {
      // Skip if we've already processed this move name (avoid duplicates)
      if (processedMoveNames.has(moveData.name)) {
        continue
      }
      
      try {
        // Fetch move details for power and type
        const response = await fetch(`https://pokeapi.co/api/v2/move/${moveData.name.replace(' ', '-')}`)
        if (!response.ok) continue
        
        const moveDetail = await response.json()
        
        const power = moveDetail.power || 0
        const moveType = moveDetail.type?.name || ''
        
        // Categorize move
        const category = this.categorizeMove(moveDetail, moveData.name)
        
        // Limit status moves for offensive builds
        if (categoryCounts.debuff >= 1 && (category === 'debuff' || category === 'support')) {
          continue // Skip additional status moves
        }
        
        // Limit recovery moves
        if (categoryCounts.recovery >= 1 && category === 'recovery') {
          continue // Skip additional recovery moves
        }
        
        // Limit weather/terrain moves
        if ((categoryCounts.weather >= 1 && category === 'weather') ||
            (categoryCounts.terrain >= 1 && category === 'terrain')) {
          continue // Skip additional weather/terrain moves
        }
        
        processedMoveNames.add(moveData.name)
        categoryCounts[category]++
        
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
        
        // Calculate defensive coverage bonus against counter types
        const defensiveCoverageBonus = this.calculateDefensiveCoverageBonus(moveType, counterTypes)
        
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
                      (1 + defensiveCoverageBonus * 0.5) * 
                      methodBonus * 
                      roleBonus * 
                      categoryScore * 
                      (1 + strategicValue)
        
        // Skip very low scoring moves for offensive builds
        if (score < 30 && (role === 'physical' || role === 'special')) {
          continue
        }
        
        recommendations.push({
          name: moveData.name,
          type: moveType,
          power,
          category,
          learnMethod: moveData.method,
          score: Math.round(score),
          isStab,
          reason: this.generateMoveReasoning(moveDetail, moveData, isStab, coverageBonus, role, category),
          strategicValue: strategicValue,
          synergyScore: strategicValue // Use strategicValue as synergyScore for now
        })
      } catch (error) {
        console.warn(`Failed to fetch move details for ${moveData.name}:`, error)
      }
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 100) // Return top 100 for maximum variety
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
      return 1.4 // Increased from 1.2 for stronger role emphasis
    }
    
    return 0.6 // Decreased from 0.8 to discourage wrong-type moves
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

  private static generateMoveReasoning(
    moveDetail: any,
    moveData: MoveLearnMethod,
    isStab: boolean,
    coverageBonus: number,
    role: string,
    category: string
  ): string {
    const reasons = []
    const power = moveDetail.power || 0
    const moveType = moveDetail.type?.name || ''
    
    if (isStab) {
      reasons.push('STAB move')
    }
    
    if (power >= 80) {
      reasons.push('High power')
    } else if (power >= 60) {
      reasons.push('Moderate power')
    }
    
    if (coverageBonus > 1.5) {
      reasons.push('Excellent type coverage')
    } else if (coverageBonus > 0.5) {
      reasons.push('Good type coverage')
    }
    
    if (category === 'attacking' && (role === 'physical' || role === 'special')) {
      reasons.push('Fits offensive playstyle')
    }
    
    if (moveDetail.damage_class?.name === role) {
      reasons.push(`Matches ${role} role`)
    }
    
    if (moveData.method === 'level-up') {
      reasons.push('Reliable level-up move')
    } else if (moveData.method === 'tm') {
      reasons.push('Widely available TM')
    }
    
    return reasons.join(', ') || 'Standard move'
  }

  private static getCategoryScore(category: 'attacking' | 'buff' | 'debuff' | 'support' | 'recovery' | 'weather' | 'terrain', role: string, pokemonTypes: string[]): number {
    const baseScores: Record<string, number> = {
      attacking: 1.0,
      buff: 0.7,     // Reduced from 0.9 - less priority in offensive builds
      debuff: 0.4,   // Reduced from 0.8 - status moves like toxic should be lower priority
      support: 0.5,   // Reduced from 0.7
      recovery: 0.6,  // Keep moderate for recovery moves
      weather: 0.3,   // Reduced from 0.5
      terrain: 0.3    // Reduced from 0.4
    }
    
    let score = baseScores[category] || 0.5
    
    // Role-specific preferences - more aggressive for offensive builds
    if (role === 'physical' || role === 'special') {
      if (category === 'attacking') score *= 1.3  // Increased from 1.2
      if (category === 'buff') score *= 1.1       // Reduced from 1.3
      if (category === 'debuff') score *= 0.5     // Heavy penalty for status moves
      if (category === 'support') score *= 0.6     // Penalty for support moves
    }
    
    if (role === 'mixed') {
      if (category === 'attacking') score *= 1.2
      if (category === 'buff') score *= 1.0       // Reduced from 1.2
      if (category === 'debuff') score *= 0.6
      if (category === 'support') score *= 0.8     // Reduced from 1.1
    }
    
    // Type-specific bonuses - keep these reasonable
    if (pokemonTypes.includes('water') && category === 'weather') score *= 1.1  // Reduced from 1.2
    if (pokemonTypes.includes('fire') && category === 'weather') score *= 1.1   // Reduced from 1.2
    if (pokemonTypes.includes('grass') && category === 'terrain') score *= 1.1   // Reduced from 1.2
    
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

  // Helper method to check if a Pokemon is legendary or mythical (can't learn egg moves)
  private static isLegendaryOrMythical(pokemonName: string): boolean {
    const legendaryMythical = [
      'mewtwo', 'mew', 'raikou', 'entei', 'suicune', 'lugia', 'ho-oh', 'celebi',
      'regirock', 'regice', 'registeel', 'latias', 'latios', 'kyogre', 'groudon',
      'rayquaza', 'jirachi', 'deoxys', 'uxie', 'mesprit', 'azelf', 'dialga',
      'palkia', 'heatran', 'regigigas', 'giratina', 'cresselia', 'phione',
      'manaphy', 'darkrai', 'shaymin', 'arceus', 'victini', 'cobalion',
      'terrakion', 'virizion', 'keldeo', 'meloetta', 'genesect', 'xerneas',
      'yveltal', 'zygarde', 'diancie', 'hoopa', 'volcanion', 'magearna',
      'marshadow', 'zeraora', 'meltan', 'melmetal', 'zacian', 'zamazenta',
      'eternatus', 'kubfu', 'urshifu', 'regieleki', 'regidrago', 'glastrier',
      'spectrier', 'calyrex', 'enamorus', 'chien-pao', 'ting-lu', 'chi-yu',
      'wo-chien', 'roaring-moon', 'iron-valiant', 'great-tusk', 'scream-tail',
      'brute-bonnet', 'flutter-mane', 'slither-wing', 'iron-hands', 'iron-jugulis',
      'iron-moth', 'iron-thorns', 'walking-wake', 'iron-leaves', 'wo-chien',
      'chien-pao', 'ting-lu', 'chi-yu', 'ogerpon', 'okidogi', 'munkidori',
      'fezandipiti', 'archaludon', 'hydrapple', 'gouging-fire', 'raging-bolt',
      'iron-boulder', 'iron-crown', 'iron-bundle'
    ]
    return legendaryMythical.includes(pokemonName.toLowerCase())
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
    const usedMoveNames = new Set<string>() // Track to avoid duplicates
    
    // Categorize moves
    const attackingMoves = recommendations.filter(m => m.category === 'attacking')
    const buffMoves = recommendations.filter(m => m.category === 'buff')
    const debuffMoves = recommendations.filter(m => m.category === 'debuff')
    const supportMoves = recommendations.filter(m => ['support', 'recovery'].includes(m.category))
    
    // Helper function to add move without duplicates
    const addMoveWithoutDuplicate = (move: MoveRecommendation): boolean => {
      if (usedMoveNames.has(move.name)) {
        return false
      }
      usedMoveNames.add(move.name)
      selectedMoves.push(move)
      return true
    }
    
    // 1. Add best setup move (buff) if available
    if (buffMoves.length > 0 && selectedMoves.length < 4) {
      for (const move of buffMoves) {
        if (addMoveWithoutDuplicate(move)) break
      }
    }
    
    // 2. Add 1-2 attacking moves (prioritize STAB)
    const stabMoves = attackingMoves.filter(m => m.isStab)
    if (stabMoves.length >= 2) {
      for (const move of stabMoves.slice(0, 2)) {
        if (selectedMoves.length >= 4) break
        addMoveWithoutDuplicate(move)
      }
    } else {
      // Add available STAB moves
      for (const move of stabMoves) {
        if (selectedMoves.length >= 4) break
        addMoveWithoutDuplicate(move)
      }
      // Add non-STAB moves to fill remaining slots
      const nonStabMoves = attackingMoves.filter(m => !m.isStab)
      for (const move of nonStabMoves) {
        if (selectedMoves.length >= 4) break
        addMoveWithoutDuplicate(move)
      }
    }
    
    // 3. Add utility move (debuff/support)
    const utilityMoves = [...debuffMoves, ...supportMoves]
      .sort((a, b) => b.strategicValue - a.strategicValue)
    
    if (utilityMoves.length > 0 && selectedMoves.length < 4) {
      for (const move of utilityMoves) {
        if (selectedMoves.length >= 4) break
        if (addMoveWithoutDuplicate(move)) break
      }
    }
    
    // 4. Fill remaining slot with highest scoring move
    if (selectedMoves.length < 4) {
      const remainingMoves = recommendations.filter(m => !usedMoveNames.has(m.name))
      for (const move of remainingMoves) {
        if (selectedMoves.length >= 4) break
        addMoveWithoutDuplicate(move)
      }
    }
    
    return selectedMoves.slice(0, 4)
  }

  static getMoveDescription(moveName: string): string {
    const strategicMove = this.STRATEGIC_MOVES[moveName]
    return strategicMove?.description || ''
  }

  // Defensive Coverage Methods
  
  static calculateDefensiveCoverageBonus(moveType: string, counterTypes: Record<string, number>): number {
    let bonus = 0
    
    Object.entries(counterTypes).forEach(([counterType, multiplier]) => {
      const effectiveness = this.getTypeEffectiveness(moveType, counterType)
      if (effectiveness > 1) {
        // Higher bonus for countering more dangerous counter types
        bonus += effectiveness * multiplier
      }
    })
    
    return Math.min(bonus, 3) // Cap the bonus to prevent over-weighting
  }

  static calculateDefensiveCoverage(moves: MoveRecommendation[], counterTypes: Record<string, number>): Record<string, number> {
    const coverage: Record<string, number> = {}
    
    moves.forEach(move => {
      Object.entries(counterTypes).forEach(([counterType, threatMultiplier]) => {
        const effectiveness = this.getTypeEffectiveness(move.type, counterType)
        if (effectiveness > 1) {
          coverage[counterType] = Math.max(coverage[counterType] || 0, effectiveness)
        }
      })
    })
    
    return coverage
  }

  static assessThreatLevel(counterTypes: Record<string, number>, defensiveCoverage: Record<string, number>): 'low' | 'medium' | 'high' {
    let totalThreatScore = 0
    let coveredThreatScore = 0
    
    Object.entries(counterTypes).forEach(([type, multiplier]) => {
      totalThreatScore += multiplier
      if (defensiveCoverage[type] && defensiveCoverage[type] > 1) {
        coveredThreatScore += multiplier * 0.8 // 80% threat reduction if covered
      }
    })
    
    const uncoveredThreatRatio = (totalThreatScore - coveredThreatScore) / totalThreatScore
    
    if (uncoveredThreatRatio > 0.6) return 'high'
    if (uncoveredThreatRatio > 0.3) return 'medium'
    return 'low'
  }

  static identifyCoverageGaps(counterTypes: Record<string, number>, defensiveCoverage: Record<string, number>): string[] {
    const gaps: string[] = []
    
    Object.entries(counterTypes).forEach(([type, multiplier]) => {
      if (!defensiveCoverage[type] || defensiveCoverage[type] <= 1) {
        gaps.push(type)
      }
    })
    
    // Sort by threat level (highest multiplier first)
    return gaps.sort((a, b) => (counterTypes[b] || 0) - (counterTypes[a] || 0))
  }

  // New Defensive Moveset Generation Methods
  
  static generateDefensiveMoveset(analysis: MovesetAnalysis): MoveRecommendation[] {
    const { recommendations, counterTypes } = analysis
    const selectedMoves: MoveRecommendation[] = []
    const usedMoveNames = new Set<string>() // Track to avoid duplicates
    
    // Helper function to add move without duplicates
    const addMoveWithoutDuplicate = (move: MoveRecommendation): boolean => {
      if (usedMoveNames.has(move.name)) {
        return false
      }
      usedMoveNames.add(move.name)
      selectedMoves.push(move)
      return true
    }
    
    // 1. Prioritize moves that cover the most dangerous counter types
    const defensiveMoves = recommendations
      .filter(m => m.category === 'attacking')
      .map(move => ({
        ...move,
        counteredTypes: Object.keys(counterTypes).filter(type => 
          this.getTypeEffectiveness(move.type, type) > 1
        ),
        coverageScore: Object.keys(counterTypes).reduce((score, type) => {
          const effectiveness = this.getTypeEffectiveness(move.type, type)
          return effectiveness > 1 ? score + (effectiveness * (counterTypes[type] || 1)) : score
        }, 0)
      }))
      .sort((a, b) => b.coverageScore - a.coverageScore)
    
    // 2. Add best defensive coverage moves
    for (const move of defensiveMoves) {
      if (selectedMoves.length >= 3) break
      addMoveWithoutDuplicate(move)
    }
    
    // 3. Add 1 STAB move for offensive capability
    const stabMoves = recommendations.filter(m => m.isStab && !usedMoveNames.has(m.name))
    if (stabMoves.length > 0 && selectedMoves.length < 4) {
      addMoveWithoutDuplicate(stabMoves[0])
    }
    
    // 4. Fill remaining slot with highest scoring defensive move
    if (selectedMoves.length < 4) {
      const remainingMoves = defensiveMoves.filter(m => !usedMoveNames.has(m.name))
      for (const move of remainingMoves) {
        if (selectedMoves.length >= 4) break
        addMoveWithoutDuplicate(move)
      }
    }
    
    return selectedMoves.slice(0, 4)
  }

  static generateBalancedDefensiveMoveset(analysis: MovesetAnalysis): MoveRecommendation[] {
    const { recommendations, role } = analysis
    const selectedMoves: MoveRecommendation[] = []
    const usedMoveNames = new Set<string>() // Track to avoid duplicates
    
    // Helper function to add move without duplicates
    const addMoveWithoutDuplicate = (move: MoveRecommendation): boolean => {
      if (usedMoveNames.has(move.name)) {
        return false
      }
      usedMoveNames.add(move.name)
      selectedMoves.push(move)
      return true
    }
    
    // 1. Add 1 STAB move for consistent damage
    const stabMoves = recommendations.filter(m => m.isStab && m.category === 'attacking')
    if (stabMoves.length > 0) {
      addMoveWithoutDuplicate(stabMoves[0])
    }
    
    // 2. Add 2 defensive coverage moves
    const defensiveMoves = recommendations
      .filter(m => m.category === 'attacking' && !m.isStab && !usedMoveNames.has(m.name))
      .sort((a, b) => b.score - a.score)
    
    for (const move of defensiveMoves.slice(0, 2)) {
      if (selectedMoves.length >= 4) break
      addMoveWithoutDuplicate(move)
    }
    
    // 3. Add utility move based on role
    const utilityMoves = recommendations.filter(m => 
      ['buff', 'debuff', 'support', 'recovery'].includes(m.category) && !usedMoveNames.has(m.name)
    ).sort((a, b) => b.strategicValue - a.strategicValue)
    
    if (utilityMoves.length > 0 && selectedMoves.length < 4) {
      addMoveWithoutDuplicate(utilityMoves[0])
    }
    
    // 4. Fill remaining slot with highest scoring move
    if (selectedMoves.length < 4) {
      const remainingMoves = recommendations.filter(m => !usedMoveNames.has(m.name))
      for (const move of remainingMoves) {
        if (selectedMoves.length >= 4) break
        addMoveWithoutDuplicate(move)
      }
    }
    
    return selectedMoves.slice(0, 4)
  }

  static suggestCoverageMoves(analysis: MovesetAnalysis, maxSuggestions: number = 3): DefensiveRecommendation[] {
    const { recommendations, coverageGaps, counterTypes } = analysis
    const suggestions: DefensiveRecommendation[] = []
    const usedMoveNames = new Set<string>()
    
    // Get all potential defensive moves sorted by score
    const allDefensiveMoves: Array<{
      move: any
      counteredTypes: string[]
      priority: 'high' | 'medium' | 'low'
      coverageScore: number
    }> = []
    
    // For each coverage gap, find the best move
    coverageGaps.forEach((gapType: string) => {
      const effectiveMoves = recommendations.filter(move => 
        this.getTypeEffectiveness(move.type, gapType) > 1 &&
        !usedMoveNames.has(move.name) // Avoid duplicates
      ).sort((a, b) => b.score - a.score)
      
      if (effectiveMoves.length > 0) {
        const bestMove = effectiveMoves[0]
        const counteredTypes = Object.keys(counterTypes).filter(type => 
          this.getTypeEffectiveness(bestMove.type, type) > 1
        )
        
        const priority = counterTypes[gapType] >= 2 ? 'high' : 
                       counterTypes[gapType] >= 1.5 ? 'medium' : 'low'
        
        const coverageScore = counteredTypes.reduce((score, type) => 
          score + (this.getTypeEffectiveness(bestMove.type, type) * (counterTypes[type] || 1)), 0
        )
        
        allDefensiveMoves.push({
          move: bestMove,
          counteredTypes,
          priority,
          coverageScore
        })
        
        usedMoveNames.add(bestMove.name)
      }
    })
    
    // Sort by coverage score and return top unique suggestions
    return allDefensiveMoves
      .sort((a, b) => b.coverageScore - a.coverageScore)
      .slice(0, maxSuggestions)
      .map(item => ({
        move: item.move,
        counteredTypes: item.counteredTypes,
        coverageScore: item.coverageScore,
        priority: item.priority
      }))
  }
}
