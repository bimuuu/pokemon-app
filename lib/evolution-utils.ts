import { formatPokemonName } from './utils'

export interface EvolutionDetail {
  min_level?: number | null
  item?: {
    name: string
    url: string
  } | null
  held_item?: {
    name: string
    url: string
  } | null
  trigger?: {
    name: string
    url: string
  } | null
  trade_species?: {
    name: string
    url: string
  } | null
  time_of_day?: string
  min_happiness?: number | null
  location?: {
    name: string
    url: string
  } | null
  gender?: number | null
  known_move?: {
    name: string
    url: string
  } | null
  known_move_type?: {
    name: string
    url: string
  } | null
  needs_overworld_rain?: boolean
  party_species?: {
    name: string
    url: string
  } | null
  party_type?: {
    name: string
    url: string
  } | null
  relative_physical_stats?: number | null
  min_beauty?: number | null
  min_affection?: number | null
}

export interface ParsedEvolutionCondition {
  type: 'level' | 'item' | 'trade' | 'time' | 'friendship' | 'location' | 'gender' | 'move' | 'weather' | 'party' | 'stats' | 'beauty' | 'affection' | 'other'
  description: string
  icon: string
  priority: number
}

/**
 * Parses evolution details from the Pokemon API into human-readable conditions
 */
export function parseEvolutionConditions(details: EvolutionDetail[], pokemonName?: string): ParsedEvolutionCondition[] {
  if (!details || details.length === 0) return []
  
  // Special cases for Pokemon with incomplete API data
  if (pokemonName) {
    const lowerPokemonName = pokemonName.toLowerCase()
    
    // Vikavolt - should evolve with Thunder Stone from Charjabug
    if (lowerPokemonName === 'vikavolt') {
      return [{
        type: 'item',
        description: 'Use Thunder Stone',
        icon: '⚡',
        priority: 2
      }]
    }
    
    // Other common cases with incomplete data
    if (lowerPokemonName === 'raichu-alola') {
      return [{
        type: 'item',
        description: 'Use Thunder Stone',
        icon: '⚡',
        priority: 2
      }]
    }
    
    if (lowerPokemonName === 'ninetales-alola') {
      return [{
        type: 'item',
        description: 'Use Ice Stone',
        icon: '🧊',
        priority: 2
      }]
    }
    
    if (lowerPokemonName === 'sandslash-alola') {
      return [{
        type: 'item',
        description: 'Use Ice Stone',
        icon: '🧊',
        priority: 2
      }]
    }
    
    if (lowerPokemonName === 'exeggutor-alola') {
      return [{
        type: 'item',
        description: 'Use Leaf Stone',
        icon: '🍃',
        priority: 2
      }]
    }
    
    // Add more special cases here as needed
    // Example:
    // if (lowerPokemonName === 'some-pokemon') {
    //   return [{
    //     type: 'item',
    //     description: 'Use Some Item',
    //     icon: '💎',
    //     priority: 2
    //   }]
    // }
  }
  
  const detail = details[0]
  const conditions: ParsedEvolutionCondition[] = []
  
  // Level evolution (priority: 1 - most common)
  if (detail.min_level) {
    conditions.push({
      type: 'level',
      description: `Level ${detail.min_level}`,
      icon: '📈',
      priority: 1
    })
  }
  
  // Item evolution (priority: 2)
  if (detail.item) {
    const itemName = formatPokemonName(detail.item.name.replace('-', ' '))
    conditions.push({
      type: 'item',
      description: `Use ${itemName}`,
      icon: getItemIcon(detail.item.name),
      priority: 2
    })
  }
  
  // Trade evolution (priority: 3)
  if (detail.trigger?.name === 'trade') {
    if (detail.trade_species) {
      conditions.push({
        type: 'trade',
        description: `Trade with ${formatPokemonName(detail.trade_species.name)}`,
        icon: '🔄',
        priority: 3
      })
    } else if (detail.held_item) {
      const heldItemName = formatPokemonName(detail.held_item.name.replace('-', ' '))
      conditions.push({
        type: 'trade',
        description: `Trade holding ${heldItemName}`,
        icon: '🔄',
        priority: 3
      })
    } else {
      conditions.push({
        type: 'trade',
        description: 'Trade',
        icon: '🔄',
        priority: 3
      })
    }
  }
  
  // Time-based evolution (priority: 4)
  if (detail.time_of_day) {
    const timeMap: Record<string, { description: string; icon: string }> = {
      'day': { description: 'during the day', icon: '☀️' },
      'night': { description: 'during the night', icon: '🌙' }
    }
    const timeData = timeMap[detail.time_of_day] || { description: detail.time_of_day, icon: '🕐' }
    conditions.push({
      type: 'time',
      description: timeData.description,
      icon: timeData.icon,
      priority: 4
    })
  }
  
  // Friendship evolution (priority: 5)
  if (detail.min_happiness) {
    conditions.push({
      type: 'friendship',
      description: `${detail.min_happiness} Friendship`,
      icon: '❤️',
      priority: 5
    })
  }
  
  // Location-based evolution (REMOVED - not displayed)
  // if (detail.location) {
  //   const locationName = formatPokemonName(detail.location.name.replace('-', ' '))
  //   conditions.push({
  //     type: 'location',
  //     description: `At ${locationName}`,
  //     icon: '📍',
  //     priority: 6
  //   })
  // }
  
  // Gender-based evolution (priority: 7)
  if (detail.gender) {
    conditions.push({
      type: 'gender',
      description: detail.gender === 1 ? 'Female' : 'Male',
      icon: detail.gender === 1 ? '♀️' : '♂️',
      priority: 7
    })
  }
  
  // Move-based evolution (priority: 8)
  if (detail.known_move) {
    const moveName = formatPokemonName(detail.known_move.name.replace('-', ' '))
    conditions.push({
      type: 'move',
      description: `Knows ${moveName}`,
      icon: '📚',
      priority: 8
    })
  }
  
  if (detail.known_move_type) {
    const typeName = formatPokemonName(detail.known_move_type.name)
    conditions.push({
      type: 'move',
      description: `Knows ${typeName} move`,
      icon: '📚',
      priority: 8
    })
  }
  
  // Weather-based evolution (priority: 9)
  if (detail.needs_overworld_rain) {
    conditions.push({
      type: 'weather',
      description: 'During rain',
      icon: '🌧️',
      priority: 9
    })
  }
  
  // Party-based evolution (priority: 10)
  if (detail.party_species) {
    const speciesName = formatPokemonName(detail.party_species.name)
    conditions.push({
      type: 'party',
      description: `With ${speciesName} in party`,
      icon: '👥',
      priority: 10
    })
  }
  
  if (detail.party_type) {
    const typeName = formatPokemonName(detail.party_type.name)
    conditions.push({
      type: 'party',
      description: `With ${typeName} type in party`,
      icon: '👥',
      priority: 10
    })
  }
  
  // Physical stats evolution (REMOVED - not displayed)
  // if (detail.relative_physical_stats !== undefined) {
  //   let description = ''
  //   if (detail.relative_physical_stats === 1) {
  //     description = 'Attack > Defense'
  //   } else if (detail.relative_physical_stats === -1) {
  //     description = 'Defense > Attack'
  //   } else {
  //     description = 'Attack = Defense'
  //   }
  //   conditions.push({
  //     type: 'stats',
  //     description,
  //     icon: '⚔️',
  //     priority: 11
  //   })
  // }
  
  // Beauty evolution (priority: 12)
  if (detail.min_beauty) {
    conditions.push({
      type: 'beauty',
      description: `${detail.min_beauty} Beauty`,
      icon: '✨',
      priority: 12
    })
  }
  
  // Affection evolution (priority: 13)
  if (detail.min_affection) {
    conditions.push({
      type: 'affection',
      description: `${detail.min_affection} Affection`,
      icon: '💕',
      priority: 13
    })
  }
  
  // If no specific conditions, use trigger name (priority: 99 - lowest)
  if (conditions.length === 0) {
    const triggerName = detail.trigger?.name || 'Unknown'
    const formattedTrigger = triggerName.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    conditions.push({
      type: 'other',
      description: formattedTrigger,
      icon: '⭐',
      priority: 99
    })
  }
  
  // Sort by priority
  return conditions.sort((a, b) => a.priority - b.priority)
}

/**
 * Gets an appropriate icon for evolution items
 */
function getItemIcon(itemName: string): string {
  const lowerItem = itemName.toLowerCase()
  
  if (lowerItem.includes('stone')) return '💎'
  if (lowerItem.includes('mail')) return '📧'
  if (lowerItem.includes('berry')) return '🫐'
  if (lowerItem.includes('ball')) return '⚪'
  if (lowerItem.includes('fossil')) return '🦴'
  if (lowerItem.includes('scarf') || lowerItem.includes('band')) return '🧣'
  if (lowerItem.includes('incense')) return '🌿'
  
  return '🛍️'
}

/**
 * Formats evolution conditions for display
 */
export function formatEvolutionConditions(details: EvolutionDetail[], pokemonName?: string): string {
  const conditions = parseEvolutionConditions(details, pokemonName)
  return conditions.map(c => c.description).join(' + ')
}

/**
 * Gets evolution condition with icon for display
 */
export function getEvolutionConditionWithIcon(details: EvolutionDetail[], pokemonName?: string): string {
  const conditions = parseEvolutionConditions(details, pokemonName)
  return conditions.map(c => `${c.icon} ${c.description}`).join(' + ')
}
