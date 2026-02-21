'use client'

import { useState, useEffect } from 'react'
import { Pokemon } from '@/types/pokemon'
import { fetchCobblemonData } from '@/lib/api'
import { calculateTypeStrengths } from '@/lib/utils'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { 
  GENERATION_RANGES, 
  GENERATION_FILTER_PROBABILITIES, 
  GENERATION_WEIGHTS,
  getGenerationRange,
  GenerationNumber 
} from './constants/generations'
import {
  getTrainerRarityConfig,
  TrainerType
} from './constants/trainerTypes'
import { TeamRecommendationCard } from './ui'
import {
  createSimplePokemon,
  getPokemonRarity,
  getLevelScaling,
  getGenerationFilter,
  getGenerationWeight,
  enforceRarityDistribution
} from './utils'
import { getBattleStrategy } from './utils/battleStrategy'

interface TeamRecommendationProps {
  trainerTeam: any[]
  trainerWeaknesses: string[]
  trainerStrengths: string[]
  averageLevel: number
  trainerType?: TrainerType  // New trainer type
  generation?: GenerationNumber  // New generation (1-8)
}

interface RecommendedPokemon {
  pokemon: any  // Use any to avoid type conflicts
  reason: string
  effectiveness: number
  types: string[]
  coveredWeaknesses?: string[]
  rarity?: string
}

export function TeamRecommendation({ 
  trainerTeam, 
  trainerWeaknesses, 
  trainerStrengths, 
  averageLevel,
  trainerType = 'gym',
  generation = 1
}: TeamRecommendationProps) {
  const [recommendedPokemon, setRecommendedPokemon] = useState<RecommendedPokemon[]>([])
  const [loading, setLoading] = useState(false)
  const { getCachedTypes } = usePokemonCache()

  useEffect(() => {
    generateRecommendations()
  }, [trainerTeam, trainerWeaknesses, trainerStrengths, averageLevel])

  const generateRecommendations = async () => {
    setLoading(true)
    try {
      const recommendations = await getRecommendedPokemon()
      setRecommendedPokemon(recommendations)
    } catch (error) {
      console.error('Error generating recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRecommendedPokemon = async (): Promise<RecommendedPokemon[]> => {
    try {
      const cobblemonData = await fetchCobblemonData()
      const types = await getCachedTypes()
      
      if (!types || !cobblemonData) return []
      
      // Apply generation filter
      const generationFilter = getGenerationFilter(generation)
      const filteredCobblemonData = cobblemonData.filter(generationFilter)
      
      // Apply level scaling to effectiveness requirements
      const levelScaling = getLevelScaling(averageLevel)
      const minEffectiveness = 1.0 * levelScaling
      
      // Create Pokemon data from filtered Cobblemon data
      const pokemonData = await Promise.all(
        filteredCobblemonData.map(async (cobblemon, index) => 
          createSimplePokemon(cobblemon, index, types)
        )
      )
      
      const finalRecommendations: RecommendedPokemon[] = []
      const selectedWeaknesses = new Set<string>()
      
      // Get Pokemon that cover each weakness with enhanced logic
      for (const weakness of trainerWeaknesses) {
        let bestForWeakness: RecommendedPokemon | null = null
        
        for (const pokemon of pokemonData) {
          const pokemonTypes = pokemon.types?.map((t: any) => t.type?.name).filter(Boolean) || []
          const strengths = calculateTypeStrengths(pokemonTypes)
          const multiplier = strengths[weakness] || 1
          
          // Apply level scaling and generation weight to effectiveness
          const pokemonId = pokemon.id || 0
          const generationWeight = getGenerationWeight(pokemonId, generation)
          const scaledEffectiveness = multiplier * levelScaling * generationWeight
          
          if (scaledEffectiveness >= minEffectiveness) {
            const candidate: RecommendedPokemon = {
              pokemon,
              reason: `Strong against ${weakness}`,
              effectiveness: scaledEffectiveness,
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
      
      // Fill remaining slots with random diverse Pokemon with trainer type rarity bias
      const remainingCount = 6 - finalRecommendations.length
      if (remainingCount > 0) {
        const otherPokemon = pokemonData.filter(pokemon => {
          const pokemonTypes = pokemon.types?.map((t: any) => t.type?.name).filter(Boolean) || []
          
          // Check if Pokemon covers any remaining weakness
          const coversWeakness = trainerWeaknesses.some(weakness => {
            const strengths = calculateTypeStrengths(pokemonTypes)
            return strengths[weakness] > 1
          })
          
          // Avoid duplicate types
          const hasDuplicateType = finalRecommendations.some(rec => 
            rec.types.some(rt => pokemonTypes.some((pt: string) => pt === rt))
          )
          
          return coversWeakness && !hasDuplicateType
        })
        
        // Apply trainer type rarity bias with generation weights
        const weightedPokemon = otherPokemon.map(pokemon => {
          const pokemonTypes = pokemon.types?.map((t: any) => t.type?.name).filter(Boolean) || []
          const strengths = calculateTypeStrengths(pokemonTypes)
          let totalEffectiveness = 0
          
          for (const weakness of trainerWeaknesses) {
            const multiplier = strengths[weakness] || 1
            if (multiplier > 1) {
              totalEffectiveness += multiplier
            }
          }
          
          // Apply generation weight
          const pokemonId = pokemon.id || 0
          const generationWeight = getGenerationWeight(pokemonId, generation)
          
          return {
            pokemon,
            reason: 'Diverse team member',
            effectiveness: totalEffectiveness * levelScaling * generationWeight,
            types: pokemonTypes
          }
        })
        
        // Sort by effectiveness with trainer type bias
        const sorted = weightedPokemon.sort((a, b) => {
          // For now, use basic effectiveness (async rarity will be applied later)
          return b.effectiveness - a.effectiveness
        })
        
        // Add random Pokemon to fill team
        for (let i = 0; i < remainingCount && i < sorted.length; i++) {
          const pokemon = sorted[i]
          const pokemonTypes = pokemon.pokemon?.types?.map((t: any) => t.type?.name).filter(Boolean) || []
          
          finalRecommendations.push({
            pokemon: pokemon.pokemon,
            reason: 'Diverse team member',
            effectiveness: pokemon.effectiveness,
            types: pokemonTypes
          })
        }
      }
      
      // Add rarity information with trainer type bias
      const recommendationsWithRarity = await Promise.all(
        finalRecommendations.map(async (rec) => {
          const pokemonName = rec.pokemon?.name
          if (!pokemonName) {
            return {
              ...rec,
              rarity: 'Common'
            }
          }
          
          const rarity = await getPokemonRarity(pokemonName)
          const trainerConfig = getTrainerRarityConfig(trainerType || 'gym', rarity)
          
          // Apply trainer type bias to rarity selection
          const shouldInclude = Math.random() <= (trainerConfig.multiplier / 2.0) // Higher chance for rarer trainers
          
          return {
            ...rec,
            rarity: shouldInclude || trainerType === 'champion' ? rarity : 
                     (trainerType === 'elite' && Math.random() > 0.3 ? 'Ultra-Rare' : rarity)
          }
        })
      )
      
      // Ensure Ultra-Rare limit for non-champion trainers
      let filteredRecommendations = trainerType === 'champion' ? 
        recommendationsWithRarity :
        recommendationsWithRarity.filter(rec => {
          const ultraRareCount = recommendationsWithRarity.filter(r => r.rarity === 'Ultra-Rare').length
          const isUltraRare = rec.rarity === 'Ultra-Rare'
          return !isUltraRare || ultraRareCount <= 1
        })
      
      // Ensure we always have exactly 6 Pokemon
      if (filteredRecommendations.length < 6) {
        // Get more Pokemon from the same generation to fill the team using randomization
        const remainingSlots = 6 - filteredRecommendations.length
        const availablePokemon = pokemonData
          .filter(pokemon => !filteredRecommendations.some(rec => rec.pokemon.id === pokemon.id))
        
        // Apply the same randomization logic as the main selection
        const randomizedPokemon = availablePokemon
          .sort(() => Math.random() - 0.5) // Fisher-Yates shuffle
          .slice(0, remainingSlots)
          .map(pokemon => {
            const pokemonTypes = pokemon.types?.map((t: any) => t.type?.name).filter(Boolean) || []
            const strengths = calculateTypeStrengths(pokemonTypes)
            let totalEffectiveness = 0
            
            // Calculate effectiveness against weaknesses
            for (const weakness of trainerWeaknesses) {
              const multiplier = strengths[weakness] || 1
              if (multiplier > 1) {
                totalEffectiveness += multiplier
              }
            }
            
            // Apply generation weight
            const pokemonId = pokemon.id || 0
            const generationWeight = getGenerationWeight(pokemonId, generation)
            
            return {
              pokemon,
              reason: 'Random team member',
              effectiveness: totalEffectiveness * levelScaling * generationWeight,
              types: pokemonTypes
            }
          })
        
        // Add rarity to additional Pokemon with trainer type bias
        const additionalWithRarity = await Promise.all(
          randomizedPokemon.map(async (rec) => {
            const pokemonName = rec.pokemon?.name
            if (!pokemonName) {
              return {
                ...rec,
                rarity: 'Common'
              }
            }
            
            const rarity = await getPokemonRarity(pokemonName)
            const trainerConfig = getTrainerRarityConfig(trainerType || 'gym', rarity)
            
            // Apply trainer type bias to rarity selection (same logic as main)
            const shouldInclude = Math.random() <= (trainerConfig.multiplier / 2.0)
            
            return {
              ...rec,
              rarity: shouldInclude || trainerType === 'champion' ? rarity : 
                       (trainerType === 'elite' && Math.random() > 0.3 ? 'Ultra-Rare' : rarity)
            }
          })
        )
        
        filteredRecommendations = [...filteredRecommendations, ...additionalWithRarity]
      }
      
      // If we have more than 6, take the best 6
      if (filteredRecommendations.length > 6) {
        filteredRecommendations = filteredRecommendations
          .sort((a, b) => b.effectiveness - a.effectiveness)
          .slice(0, 6)
      }
      
      // Apply rarity distribution enforcement
      const distributedRecommendations = enforceRarityDistribution(filteredRecommendations, trainerType || 'gym')
      
      return distributedRecommendations
        
    } catch (error) {
      console.error('Error getting recommended Pokemon:', error)
      return []
    }
  }

  if (loading) {
    return (
      <TeamRecommendationCard
        loading={loading}
        battleStrategy={getBattleStrategy(trainerWeaknesses, trainerStrengths, averageLevel)}
        trainerWeaknesses={trainerWeaknesses}
        trainerStrengths={trainerStrengths}
      />
    )
  }

  return (
    <div>
      <TeamRecommendationCard
        loading={loading}
        battleStrategy={getBattleStrategy(trainerWeaknesses, trainerStrengths, averageLevel)}
        trainerWeaknesses={trainerWeaknesses}
        trainerStrengths={trainerStrengths}
        recommendedPokemon={recommendedPokemon}
        onRandomize={generateRecommendations}
      />
    </div>
  )
}
