import { Pokemon, PokemonStats } from '@/types/pokemon'
import { megaGmaxData } from '@/services/mega-gmax-data'
import { transformationData } from '@/services/transformation-data'
import { calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'

export interface ItemRecommendation {
  name: string
  category: string
  reason: string
  effectiveness: number
  synergy: number
  role: string
  transformation?: {
    type: 'mega' | 'gmax' | 'plate' | 'form'
    result: string
  }
}

export interface ItemOptimizationAnalysis {
  pokemon: string
  types: string[]
  role: 'physical' | 'special' | 'mixed' | 'tank' | 'support'
  recommendations: ItemRecommendation[]
  megaStones: ItemRecommendation[]
  plates: ItemRecommendation[]
  standardItems: ItemRecommendation[]
}

export class HeldItemOptimizationService {
  static async analyzeOptimalItems(pokemon: Pokemon): Promise<ItemOptimizationAnalysis> {
    const pokemonTypes = pokemon.types.map(t => t.type.name)
    const role = this.determinePokemonRole(pokemon)
    const weaknesses = calculateTypeWeaknesses(pokemonTypes)
    
    // Get all recommendations
    const megaStones = this.getMegaStoneRecommendations(pokemon, role)
    const plates = this.getPlateRecommendations(pokemon, role)
    const standardItems = this.getStandardItemRecommendations(pokemon, role, weaknesses)
    
    // Combine and sort all recommendations
    const allRecommendations = [
      ...megaStones,
      ...plates,
      ...standardItems
    ].sort((a, b) => b.effectiveness - a.effectiveness)
    
    return {
      pokemon: pokemon.name,
      types: pokemonTypes,
      role,
      recommendations: allRecommendations,
      megaStones,
      plates,
      standardItems
    }
  }

  private static determinePokemonRole(pokemon: Pokemon): 'physical' | 'special' | 'mixed' | 'tank' | 'support' {
    const stats = pokemon.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat
      return acc
    }, {} as Record<string, number>)
    
    const attack = stats.attack || 0
    const specialAttack = stats['special-attack'] || 0
    const defense = stats.defense || 0
    const specialDefense = stats['special-defense'] || 0
    const hp = stats.hp || 0
    const speed = stats.speed || 0
    
    // Tank role: High HP and defenses
    if ((hp + defense + specialDefense) > (attack + specialAttack) * 1.5) {
      return 'tank'
    }
    
    // Support: Balanced stats with lower offenses
    if (speed < 60 && (attack + specialAttack) < 200) {
      return 'support'
    }
    
    // Attacker roles
    if (attack > specialAttack * 1.2) return 'physical'
    if (specialAttack > attack * 1.2) return 'special'
    return 'mixed'
  }

  private static getMegaStoneRecommendations(pokemon: Pokemon, role: string): ItemRecommendation[] {
    const recommendations: ItemRecommendation[] = []
    const pokemonName = pokemon.name.toLowerCase()
    
    // Check for mega evolution data
    const megaData = megaGmaxData[pokemonName]
    if (megaData) {
      megaData.forEach(condition => {
        if (condition.type === 'mega') {
          const itemName = condition.trigger
          recommendations.push({
            name: itemName,
            category: 'mega-stone',
            reason: `Enables ${itemName.replace('-ite', '').replace('-', ' ')} Mega Evolution`,
            effectiveness: 95,
            synergy: 90,
            role,
            transformation: {
              type: 'mega',
              result: `Transform to ${pokemon.name}-mega`
            }
          })
        }
      })
    }
    
    return recommendations
  }

  private static getPlateRecommendations(pokemon: Pokemon, role: string): ItemRecommendation[] {
    const recommendations: ItemRecommendation[] = []
    const pokemonName = pokemon.name.toLowerCase()
    
    // Check if this is Arceus
    if (pokemonName === 'arceus') {
      const plateData = transformationData[pokemonName]
      if (plateData) {
        plateData.forEach(condition => {
          if (condition.type === 'item') {
            const itemName = condition.trigger
            const typeName = itemName.replace('-plate', '')
            
            recommendations.push({
              name: itemName,
              category: 'plate',
              reason: `Changes Arceus to ${typeName} type and boosts ${typeName} moves`,
              effectiveness: 85,
              synergy: 95,
              role,
              transformation: {
                type: 'plate',
                result: `${typeName}-type Arceus`
              }
            })
          }
        })
      }
    }
    
    return recommendations
  }

  private static getStandardItemRecommendations(
    pokemon: Pokemon, 
    role: string, 
    weaknesses: Record<string, number>
  ): ItemRecommendation[] {
    const recommendations: ItemRecommendation[] = []
    const stats = pokemon.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat
      return acc
    }, {} as Record<string, number>)
    
    const speed = stats.speed || 0
    const attack = stats.attack || 0
    const specialAttack = stats['special-attack'] || 0
    const defense = stats.defense || 0
    const specialDefense = stats['special-defense'] || 0
    
    // Choice Items
    if (role === 'physical' || role === 'special') {
      const isPhysical = role === 'physical'
      const choiceItem = isPhysical ? 'choice-band' : 'choice-specs'
      
      recommendations.push({
        name: choiceItem,
        category: 'choice-item',
        reason: `Maximizes ${isPhysical ? 'physical' : 'special'} attack power but locks to one move`,
        effectiveness: 85,
        synergy: 75,
        role
      })
      
      if (speed >= 70) {
        recommendations.push({
          name: 'choice-scarf',
          category: 'choice-item',
          reason: 'Boosts speed to outpace opponents, locks to one move',
          effectiveness: 80,
          synergy: 70,
          role
        })
      }
    }
    
    // Life Orb
    if (role === 'physical' || role === 'special' || role === 'mixed') {
      recommendations.push({
        name: 'life-orb',
        category: 'offensive-item',
        reason: 'Boosts all attack power at cost of HP each turn',
        effectiveness: 80,
        synergy: 80,
        role
      })
    }
    
    // Defensive Items
    if (role === 'tank' || role === 'support') {
      recommendations.push({
        name: 'leftovers',
        category: 'recovery-item',
        reason: 'Restores HP each turn, great for defensive Pokemon',
        effectiveness: 75,
        synergy: 85,
        role
      })
      
      if (specialDefense > defense) {
        recommendations.push({
          name: 'assault-vest',
          category: 'defensive-item',
          reason: 'Boosts special defense but prevents status moves',
          effectiveness: 80,
          synergy: 70,
          role
        })
      }
    }
    
    // Type-specific coverage items
    const significantWeaknesses = Object.entries(weaknesses)
      .filter(([_, multiplier]) => multiplier > 2)
      .map(([type, _]) => type)
    
    if (significantWeaknesses.length > 0) {
      const weakType = significantWeaknesses[0]
      const berryMap: Record<string, string> = {
        'fire': 'occas-berry',
        'water': 'passho-berry',
        'electric': 'wacan-berry',
        'grass': 'rindo-berry',
        'ice': 'yache-berry',
        'fighting': 'chople-berry',
        'poison': 'kebia-berry',
        'ground': 'shuca-berry',
        'flying': 'coban-berry',
        'psychic': 'payapa-berry',
        'bug': 'tanga-berry',
        'rock': 'chople-berry',
        'ghost': 'colbur-berry',
        'dragon': 'haban-berry',
        'dark': 'babiri-berry',
        'steel': 'shuca-berry',
        'fairy': 'roseli-berry'
      }
      
      const berry = berryMap[weakType]
      if (berry) {
        recommendations.push({
          name: berry,
          category: 'resist-berry',
          reason: `Reduces damage from ${weakType}-type super effective moves`,
          effectiveness: 70,
          synergy: 60,
          role
        })
      }
    }
    
    // Focus Sash for frail Pokemon
    const totalBulk = (stats.hp || 0) + (stats.defense || 0) + (stats['special-defense'] || 0)
    if (totalBulk < 300 && speed >= 80) {
      recommendations.push({
        name: 'focus-sash',
        category: 'survival-item',
        reason: 'Guarantees survival from one hit at full HP',
        effectiveness: 75,
        synergy: 65,
        role
      })
    }
    
    return recommendations.sort((a, b) => b.effectiveness - a.effectiveness)
  }

  static getBestItemForRole(analysis: ItemOptimizationAnalysis, preferredRole?: string): ItemRecommendation | null {
    const role = preferredRole || analysis.role
    const roleRecommendations = analysis.recommendations.filter(item => item.role === role)
    
    if (roleRecommendations.length > 0) {
      return roleRecommendations[0]
    }
    
    return analysis.recommendations[0] || null
  }

  static getItemSynergyWithMoveset(item: ItemRecommendation, moves: string[]): number {
    // Basic synergy calculation between item and moveset
    let synergy = item.synergy || 50
    
    // Boost synergy if item matches move types
    if (item.category === 'plate' && moves.some(move => 
      move.toLowerCase().includes(item.name.replace('-plate', '')))) {
      synergy += 20
    }
    
    // Reduce synergy for choice items with status-heavy movesets
    if (item.category === 'choice-item' && moves.some(move => 
      ['protect', 'substitute', 'will-o-wisp', 'toxic', 'stealth-rock'].includes(move.toLowerCase()))) {
      synergy -= 15
    }
    
    return Math.min(100, Math.max(0, synergy))
  }
}
