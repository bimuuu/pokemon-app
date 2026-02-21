import { TeamAnalysis, TypeStrength, TypeWeakness } from '@/types/pokemon'

export interface TrainerTeamData {
  team: any[]
  weaknesses: string[]
  strengths: string[]
  averageLevel: number
}

export class TeamAnalysisService {
  static analyzeTrainerTeam(data: TrainerTeamData): TeamAnalysis {
    const { team, weaknesses, strengths, averageLevel } = data
    const allTypes = team.flatMap((p: any) => p.types || [])
    const typeCount: Record<string, number> = {}
    
    allTypes.forEach((type: string) => {
      typeCount[type] = (typeCount[type] || 0) + 1
    })

    // Convert trainer weaknesses to our format
    const typeWeaknesses: TypeWeakness[] = weaknesses.map(type => ({
      type,
      multiplier: 2, // Default multiplier for weaknesses
      count: 1
    }))

    // Convert trainer strengths to our format  
    const typeStrengths: TypeStrength[] = strengths.map(type => ({
      type,
      multiplier: 2 // Default multiplier for strengths
    }))

    const recommendations = []
    
    // Add specific recommendations based on team composition
    if (team.length >= 4) {
      recommendations.push('Trainer has a full team - prepare for a long battle')
    }
    
    if (averageLevel > 50) {
      recommendations.push('High-level team - bring your strongest Pokemon')
    }

    return {
      strengths: typeStrengths,
      weaknesses: typeWeaknesses,
      coverage: strengths,
      recommendations
    }
  }

  static generateBattleStrategies(data: TrainerTeamData): string[] {
    const { weaknesses, strengths, averageLevel } = data
    const strategies: string[] = []
    
    // Focus on the most important weaknesses
    if (weaknesses.length > 0) {
      strategies.push(`Target ${weaknesses.slice(0, 2).join('/')} types`)
    }
    
    if (strengths.length > 0) {
      strategies.push(`Avoid ${strengths.slice(0, 2).join('/')} types`)
    }
    
    // Simple level recommendation
    const recommendedLevel = averageLevel + 3
    strategies.push(`Level ${recommendedLevel}+ recommended`)
    
    return strategies.slice(0, 3) // Keep it short
  }
}
