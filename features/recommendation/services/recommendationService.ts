import { Pokemon } from '@/types/pokemon'
import { fetchCobblemonData } from '@/lib/api'
import { calculateTypeStrengths } from '@/lib/utils'
import { PokemonDataTransformer } from '@/features/pokemon/utils/pokemonDataTransformer'
import { TrainerTeamData } from './teamAnalysisService'

export interface RecommendedPokemon {
  pokemon: Pokemon
  reason: string
  effectiveness: number
  types: string[]
  coveredWeaknesses?: string[]
}

export class RecommendationService {
  static async generateRecommendations(data: TrainerTeamData): Promise<RecommendedPokemon[]> {
    try {
      const cobblemonData = await fetchCobblemonData()
      
      // Create Pokemon data with types (we'll need to get types from cache)
      const pokemonData = PokemonDataTransformer.createBasicPokemonFromCobblemon(cobblemonData)
      
      // Create diverse team recommendations covering all weaknesses
      const recommendations: RecommendedPokemon[] = []
      
      // For now, return empty array - this will be enhanced when types are available
      // In a real implementation, we would get types from cache and calculate recommendations
      
      return recommendations.slice(0, 6)
        
    } catch (error) {
      console.error('Error getting recommended Pokemon:', error)
      return []
    }
  }

  static async generateRecommendationsWithTypes(
    data: TrainerTeamData,
    types: Record<string, string[]>
  ): Promise<RecommendedPokemon[]> {
    try {
      const cobblemonData = await fetchCobblemonData()
      const pokemonData = await PokemonDataTransformer.createPokemonFromCobblemon(cobblemonData, types)
      
      // Create diverse team recommendations covering all weaknesses
      const recommendations: RecommendedPokemon[] = []
      const weaknessCoverage = new Set<string>()
      
      pokemonData.forEach(pokemon => {
        if (pokemon.types.length === 0) return
        
        const pokemonTypes = pokemon.types.map(t => t.type.name)
        const strengths = calculateTypeStrengths(pokemonTypes)
        
        // Calculate coverage of opponent's weaknesses
        let coveredWeaknesses: string[] = []
        let totalEffectiveness = 0
        
        data.weaknesses.forEach(weakness => {
          const multiplier = strengths[weakness] || 1
          if (multiplier > 1) {
            coveredWeaknesses.push(weakness)
            totalEffectiveness += multiplier
          }
        })
        
        // Prioritize Pokemon that cover multiple weaknesses
        if (coveredWeaknesses.length > 0) {
          const diversityBonus = coveredWeaknesses.length > 1 ? 1.5 : 1
          const finalEffectiveness = totalEffectiveness * diversityBonus
          
          recommendations.push({
            pokemon,
            reason: `Covers ${coveredWeaknesses.length} weaknesses`,
            effectiveness: finalEffectiveness,
            types: pokemonTypes,
            coveredWeaknesses: coveredWeaknesses
          })
        }
      })
      
      // Sort by coverage diversity first, then effectiveness
      const sortedRecommendations = recommendations.sort((a, b) => {
        // Prioritize by number of weaknesses covered
        const coverageDiff = (b.coveredWeaknesses?.length || 0) - (a.coveredWeaknesses?.length || 0)
        if (coverageDiff !== 0) return coverageDiff
        
        // Then by overall effectiveness
        return b.effectiveness - a.effectiveness
      })
      
      // Select diverse team covering all weaknesses - exactly 6 Pokemon
      const finalRecommendations: RecommendedPokemon[] = []
      const selectedWeaknesses = new Set<string>()
      
      // First, find Pokemon that cover each weakness
      for (const weakness of data.weaknesses) {
        let bestForWeakness: RecommendedPokemon | null = null
        
        for (const pokemon of pokemonData) {
          if (pokemon.types.length === 0) continue
          
          const pokemonTypes = pokemon.types.map(t => t.type.name)
          const strengths = calculateTypeStrengths(pokemonTypes)
          
          const multiplier = strengths[weakness] || 1
          if (multiplier > 1) {
            const candidate = {
              pokemon,
              reason: `Strong against ${weakness}`,
              effectiveness: multiplier,
              types: pokemonTypes,
              coveredWeaknesses: [weakness]
            }
            
            if (!bestForWeakness || candidate.effectiveness > bestForWeakness.effectiveness) {
              bestForWeakness = candidate
            }
          }
        }
        
        if (bestForWeakness && !selectedWeaknesses.has(bestForWeakness.coveredWeaknesses![0])) {
          finalRecommendations.push(bestForWeakness)
          bestForWeakness.coveredWeaknesses!.forEach(w => selectedWeaknesses.add(w))
        }
      }
      
      // Fill remaining slots with diverse Pokemon that cover uncovered weaknesses
      const remainingWeaknesses = data.weaknesses.filter(w => !selectedWeaknesses.has(w))
      
      if (remainingWeaknesses.length > 0 && finalRecommendations.length < 6) {
        for (const weakness of remainingWeaknesses) {
          if (finalRecommendations.length >= 6) break
          
          let bestForRemainingWeakness: RecommendedPokemon | null = null
          
          for (const pokemon of pokemonData) {
            if (pokemon.types.length === 0) continue
            
            const pokemonTypes = pokemon.types.map(t => t.type.name)
            const strengths = calculateTypeStrengths(pokemonTypes)
            
            // Check if this Pokemon covers the remaining weakness
            const coversWeakness = strengths[weakness] || 1
            if (coversWeakness > 1) {
              // Avoid duplicate types in team
              const hasDuplicateType = finalRecommendations.some(rec => 
                rec.types.some(rt => pokemonTypes.some(pt => pt === rt))
              )
              
              if (!hasDuplicateType) {
                const candidate = {
                  pokemon,
                  reason: `Covers ${weakness}`,
                  effectiveness: coversWeakness,
                  types: pokemonTypes,
                  coveredWeaknesses: [weakness]
                }
                
                if (!bestForRemainingWeakness || candidate.effectiveness > bestForRemainingWeakness.effectiveness) {
                  bestForRemainingWeakness = candidate
                }
              }
            }
          }
          
          if (bestForRemainingWeakness) {
            finalRecommendations.push(bestForRemainingWeakness)
            bestForRemainingWeakness.coveredWeaknesses!.forEach(w => selectedWeaknesses.add(w))
          }
        }
      }
      
      return finalRecommendations.slice(0, 6)
        
    } catch (error) {
      console.error('Error getting recommended Pokemon:', error)
      return []
    }
  }
}
