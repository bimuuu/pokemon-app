import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TYPE_COLORS, TYPE_EFFECTIVENESS, RARITY_COLORS } from "./constants"

export { RARITY_COLORS }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

export function formatPokemonName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type as keyof typeof TYPE_COLORS] || '#68A090'
}

export function getTypeEffectiveness(attackingType: string, defendingType: string): number {
  const attacker = TYPE_EFFECTIVENESS[attackingType as keyof typeof TYPE_EFFECTIVENESS]
  if (!attacker) return 1
  
  return attacker.attacking[defendingType as keyof typeof attacker.attacking] || 1
}

export function calculateTypeWeaknesses(types: string[]): Record<string, number> {
  const weaknesses: Record<string, number> = {}
  
  types.forEach(type => {
    const typeData = TYPE_EFFECTIVENESS[type as keyof typeof TYPE_EFFECTIVENESS]
    if (typeData?.defending) {
      Object.entries(typeData.defending).forEach(([defendingType, multiplier]) => {
        weaknesses[defendingType] = (weaknesses[defendingType] || 1) * multiplier
      })
    }
  })
  
  return weaknesses
}

export function calculateTypeStrengths(types: string[]): Record<string, number> {
  const strengths: Record<string, number> = {}
  
  types.forEach(type => {
    const typeData = TYPE_EFFECTIVENESS[type as keyof typeof TYPE_EFFECTIVENESS]
    if (typeData?.attacking) {
      Object.entries(typeData.attacking).forEach(([targetType, multiplier]) => {
        if (multiplier > 1) {
          strengths[targetType] = Math.max(strengths[targetType] || 0, multiplier)
        }
      })
    }
  })
  
  return strengths
}

export function getStatAbbreviation(statName: string): string {
  const abbreviations: Record<string, string> = {
    'hp': 'HP',
    'attack': 'ATK',
    'defense': 'DEF',
    'special-attack': 'SPA',
    'special-defense': 'SPD',
    'speed': 'SPE'
  }
  return abbreviations[statName] || statName.toUpperCase()
}

export function getStatColor(statName: string): string {
  const colors: Record<string, string> = {
    'hp': '#ef4444',
    'attack': '#f97316', 
    'defense': '#eab308',
    'special-attack': '#3b82f6',
    'special-defense': '#8b5cf6',
    'speed': '#10b981'
  }
  return colors[statName] || '#6b7280'
}

export function paginate<T>(array: T[], page: number, itemsPerPage: number): T[] {
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return array.slice(startIndex, endIndex)
}

export function getTotalPages(totalItems: number, itemsPerPage: number): number {
  return Math.ceil(totalItems / itemsPerPage)
}
