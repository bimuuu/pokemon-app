import { Pokemon, TeamAnalysis, TypeStrength, TypeWeakness } from '@/types/pokemon'
import { calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'

export class TeamAnalysisService {
  static analyzeTeam(team: (Pokemon | null)[]): TeamAnalysis | null {
    const validTeam = team.filter(p => p !== null) as Pokemon[]
    
    if (validTeam.length === 0) {
      return null
    }

    const allTypes = validTeam.flatMap(p => p.types.map(t => t.type.name))
    const typeCount: Record<string, number> = {}
    
    allTypes.forEach(type => {
      typeCount[type] = (typeCount[type] || 0) + 1
    })

    const allWeaknesses: Record<string, number> = {}
    const allStrengths: Record<string, number> = {}
    
    validTeam.forEach(pokemon => {
      const weaknesses = calculateTypeWeaknesses(pokemon.types.map(t => t.type.name))
      const strengths = calculateTypeStrengths(pokemon.types.map(t => t.type.name))
      
      Object.entries(weaknesses).forEach(([type, multiplier]) => {
        if (multiplier > 1) {
          allWeaknesses[type] = (allWeaknesses[type] || 0) + multiplier
        }
      })
      
      Object.entries(strengths).forEach(([type, multiplier]) => {
        if (multiplier > 1) {
          allStrengths[type] = Math.max(allStrengths[type] || 0, multiplier)
        }
      })
    })

    // Calculate average multipliers for weaknesses
    const weaknessCounts: Record<string, number> = {}
    validTeam.forEach(pokemon => {
      const weaknesses = calculateTypeWeaknesses(pokemon.types.map(t => t.type.name))
      Object.entries(weaknesses).forEach(([type, multiplier]) => {
        if (multiplier > 1) {
          weaknessCounts[type] = (weaknessCounts[type] || 0) + 1
        }
      })
    })

    const sortedWeaknesses: TypeWeakness[] = Object.entries(allWeaknesses)
      .map(([type, totalMultiplier]) => ({
        type,
        multiplier: Number((totalMultiplier / weaknessCounts[type]).toFixed(2)),
        count: weaknessCounts[type]
      }))
      .sort((a, b) => b.multiplier - a.multiplier)
      .slice(0, 5)

    const sortedStrengths: TypeStrength[] = Object.entries(allStrengths)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type, multiplier]) => ({
        type,
        multiplier: Number(multiplier.toFixed(2))
      }))

    const recommendations = this.generateRecommendations(validTeam, typeCount, sortedWeaknesses)

    return {
      strengths: sortedStrengths,
      weaknesses: sortedWeaknesses,
      coverage: Object.keys(allStrengths),
      recommendations
    }
  }

  private static generateRecommendations(
    validTeam: Pokemon[], 
    typeCount: Record<string, number>, 
    sortedWeaknesses: TypeWeakness[]
  ): (string | { text: string; types: string[] })[] {
    const recommendations: (string | { text: string; types: string[] })[] = []
    
    if (validTeam.length < 6) {
      recommendations.push('Add more Pokemon to complete your team')
    }
    
    const typeVariety = Object.keys(typeCount).length
    if (typeVariety < 3) {
      recommendations.push('Add more type variety for better coverage')
    }
    
    if (sortedWeaknesses.length > 0) {
      const weaknessTypes = sortedWeaknesses.slice(0, 3).map(w => w.type)
      
      recommendations.push({
        text: 'Be careful against these types:',
        types: weaknessTypes
      })
    }

    return recommendations
  }
}
