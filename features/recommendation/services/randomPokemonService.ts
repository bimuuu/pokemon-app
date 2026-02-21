import { Pokemon } from '@/types/pokemon'
import { fetchCobblemonData } from '@/lib/api'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { PokemonDataTransformer } from '@/features/pokemon/utils/pokemonDataTransformer'
import { calculateTypeStrengths } from '@/lib/utils'

// Simple interface for cobblemon data
interface CobblemonData {
  POKÉMON: string
  RARITY?: string
}

// Rarity weights for randomization (higher = more common)
const RARITY_WEIGHTS: Record<string, number> = {
  'Common': 200,      // Most common - heavily favored
  'Uncommon': 80,     // Less common but still frequent
  'Rare': 25,         // Rare - limited appearance
  'Ultra-Rare': 8,    // Very rare - minimal appearance
  'Legendary': 2      // Extremely rare - very minimal
}

// Rarity distribution targets for team of 6
const RARITY_DISTRIBUTION_TARGETS = {
  'Common': { min: 1, max: 4, priority: 1 },
  'Uncommon': { min: 1, max: 3, priority: 2 },
  'Rare': { min: 0, max: 1, priority: 3 },
  'Ultra-Rare': { min: 0, max: 1, priority: 4 },
  'Legendary': { min: 0, max: 1, priority: 5 }
}

// Default rarity for Pokemon without explicit rarity
const DEFAULT_RARITY = 'Common'

export class RandomPokemonService {
  /**
   * Get Pokemon rarity from Cobblemon data
   */
  private static async getPokemonRarity(pokemonName: string): Promise<string> {
    try {
      const cobblemonData = await fetchCobblemonData()
      const pokemon = cobblemonData.find((p: CobblemonData) => 
        p.POKÉMON.toLowerCase() === pokemonName.toLowerCase()
      )
      return pokemon?.RARITY || DEFAULT_RARITY
    } catch (error) {
      console.error('Error getting Pokemon rarity:', error)
      return DEFAULT_RARITY
    }
  }

  /**
   * Get rarity weight for randomization
   */
  private static getRarityWeight(rarity: string): number {
    return RARITY_WEIGHTS[rarity] || RARITY_WEIGHTS[DEFAULT_RARITY]
  }

  /**
   * Fisher-Yates shuffle algorithm for better randomization
   */
  private static fisherYatesShuffle<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Weighted random selection based on effectiveness and rarity
   */
  private static weightedRandomSelection<T>(items: T[], weights: number[], count: number): T[] {
    if (items.length === 0) return []
    
    const selected: T[] = []
    const availableItems = [...items]
    const availableWeights = [...weights]
    
    for (let i = 0; i < count && availableItems.length > 0; i++) {
      const totalWeight = availableWeights.reduce((sum, weight) => sum + weight, 0)
      let random = Math.random() * totalWeight
      
      for (let j = 0; j < availableItems.length; j++) {
        random -= availableWeights[j]
        if (random <= 0) {
          selected.push(availableItems[j])
          availableItems.splice(j, 1)
          availableWeights.splice(j, 1)
          break
        }
      }
    }
    
    return selected
  }

  /**
   * Get random Pokemon of specific type(s) with enhanced randomization including rarity
   */
  static async getRandomPokemonByTypes(types: string[], count: number = 1): Promise<Pokemon[]> {
    try {
      const cobblemonData = await fetchCobblemonData()
      const cachedTypes = await usePokemonCache().getCachedTypes()
      
      if (!cachedTypes) return []
      
      // Filter Pokemon by specified types
      const filteredPokemon = cobblemonData.filter((cobblemon: CobblemonData) => {
        const pokemonTypes = cachedTypes[cobblemon.POKÉMON] || []
        return types.some(requiredType => 
          pokemonTypes.some(pokemonType => pokemonType.toLowerCase() === requiredType.toLowerCase())
        )
      })
      
      // Convert filtered CobblemonData to Pokemon format
      const pokemonData = await PokemonDataTransformer.createPokemonFromCobblemon(filteredPokemon, cachedTypes)
      
      if (pokemonData.length === 0) return []
      
      // Calculate weights based on type effectiveness, variety, and rarity
      const weights = await Promise.all(pokemonData.map(async (pokemon) => {
        const pokemonTypes = pokemon.types.map(t => t.type.name)
        let weight = 1.0
        
        // Higher weight for Pokemon with multiple types that match
        const matchingTypes = pokemonTypes.filter(pt => 
          types.some(rt => pt.toLowerCase() === rt.toLowerCase())
        )
        weight += matchingTypes.length * 0.3
        
        // Get Pokemon rarity and apply rarity weight
        const rarity = await this.getPokemonRarity(pokemon.name)
        const rarityWeight = this.getRarityWeight(rarity)
        weight *= (rarityWeight / 100) // Normalize rarity weight
        
        // Add some randomness to prevent always picking the "best" ones
        weight *= (0.7 + Math.random() * 0.6)
        
        return weight
      }))
      
      // Use weighted random selection
      const selected = this.weightedRandomSelection(pokemonData, weights, count)
      
      // Final shuffle for additional randomness
      return this.fisherYatesShuffle(selected)
      
    } catch (error) {
      console.error('Error getting random Pokemon by types:', error)
      return []
    }
  }

  /**
   * Get random Pokemon for team building with enhanced randomization including rarity
   */
  static async getRandomPokemonForTeam(weaknesses: string[], count: number = 6): Promise<Pokemon[]> {
    try {
      const cobblemonData = await fetchCobblemonData()
      const cachedTypes = await usePokemonCache().getCachedTypes()
      
      if (!cachedTypes) return []
      
      // Create a pool of all effective Pokemon
      const effectivePokemonPool: Array<{ 
        pokemon: Pokemon, 
        effectiveness: number, 
        diversity: number,
        rarity: string,
        rarityWeight: number
      }> = []
      
      for (const cobblemon of cobblemonData) {
        const pokemonTypes = cachedTypes[cobblemon.POKÉMON] || []
        
        if (pokemonTypes.length === 0) continue
        
        // Calculate effectiveness against weaknesses
        const strengths = calculateTypeStrengths(pokemonTypes)
        let totalEffectiveness = 0
        
        for (const weakness of weaknesses) {
          const multiplier = strengths[weakness] || 1
          if (multiplier > 1) {
            totalEffectiveness += multiplier
          }
        }
        
        // Only include Pokemon that are effective against at least one weakness
        if (totalEffectiveness > 0) {
          // Convert to Pokemon format
          const pokemonArray = await PokemonDataTransformer.createPokemonFromCobblemon([cobblemon], cachedTypes)
          if (pokemonArray.length > 0) {
            const pokemon = pokemonArray[0]
            
            // Calculate diversity score (prefer less common types)
            const diversity = this.calculateDiversityScore(pokemonTypes, weaknesses)
            
            // Get rarity information
            const rarity = cobblemon.RARITY || DEFAULT_RARITY
            const rarityWeight = this.getRarityWeight(rarity)
            
            effectivePokemonPool.push({
              pokemon,
              effectiveness: totalEffectiveness,
              diversity,
              rarity,
              rarityWeight
            })
          }
        }
      }
      
      if (effectivePokemonPool.length === 0) return []
      
      // Sort by effectiveness and diversity, then take top candidates
      effectivePokemonPool.sort((a, b) => (b.effectiveness + b.diversity) - (a.effectiveness + a.diversity))
      
      // Take top 50% to ensure quality, then randomize from that pool
      const topCandidates = effectivePokemonPool.slice(0, Math.ceil(effectivePokemonPool.length * 0.5))
      
      // Calculate final weights for selection (including rarity)
      const weights = topCandidates.map(candidate => {
        let weight = candidate.effectiveness
        
        // Add diversity bonus
        weight += candidate.diversity * 2
        
        // Apply rarity weight (rarer Pokemon have lower weight, making them less likely to be selected)
        weight *= (candidate.rarityWeight / 100)
        
        // Add significant randomization factor (0.5 to 2.0 multiplier)
        weight *= (0.5 + Math.random() * 1.5)
        
        return weight
      })
      
      // Select diverse team using weighted random selection
      const selectedCandidates = this.weightedRandomSelection(
        topCandidates, 
        weights, 
        Math.min(count * 2, topCandidates.length) // Get more candidates for final selection
      )
      
      // Ensure type diversity in final team
      const finalTeam = this.ensureTypeDiversity(selectedCandidates, count)
      
      // Final shuffle for maximum randomness
      return this.fisherYatesShuffle(finalTeam)
        
    } catch (error) {
      console.error('Error getting random Pokemon for team:', error)
      return []
    }
  }

  /**
   * Calculate diversity score for Pokemon types
   */
  private static calculateDiversityScore(pokemonTypes: string[], targetWeaknesses: string[]): number {
    let diversityScore = 0
    
    // Higher score for types that cover multiple weaknesses
    for (const type of pokemonTypes) {
      const strengths = calculateTypeStrengths([type])
      let coveredWeaknesses = 0
      
      for (const weakness of targetWeaknesses) {
        if (strengths[weakness] > 1) {
          coveredWeaknesses++
        }
      }
      
      diversityScore += coveredWeaknesses * 0.5
    }
    
    // Bonus for dual-type Pokemon
    if (pokemonTypes.length > 1) {
      diversityScore += 0.3
    }
    
    return diversityScore
  }

  /**
   * Enforce rarity distribution in team selection
   */
  private static enforceRarityDistribution(
    candidates: Array<{ 
      pokemon: Pokemon, 
      effectiveness: number, 
      diversity: number,
      rarity: string,
      rarityWeight: number
    }>, 
    count: number
  ): Pokemon[] {
    const selectedPokemon: Pokemon[] = []
    const usedTypes = new Set<string>()
    const rarityCount: Record<string, number> = {
      'Common': 0,
      'Uncommon': 0,
      'Rare': 0,
      'Ultra-Rare': 0,
      'Legendary': 0
    }

    // Sort candidates by priority (rarer first) and effectiveness
    const sortedCandidates = [...candidates].sort((a, b) => {
      const aPriority = RARITY_DISTRIBUTION_TARGETS[a.rarity as keyof typeof RARITY_DISTRIBUTION_TARGETS]?.priority || 99
      const bPriority = RARITY_DISTRIBUTION_TARGETS[b.rarity as keyof typeof RARITY_DISTRIBUTION_TARGETS]?.priority || 99
      if (aPriority !== bPriority) {
        return aPriority - bPriority // Lower priority number = higher priority
      }
      return (b.effectiveness + b.diversity) - (a.effectiveness + a.diversity)
    })

    // First pass: select based on rarity targets and type diversity
    for (const candidate of sortedCandidates) {
      if (selectedPokemon.length >= count) break
      
      const rarityTarget = RARITY_DISTRIBUTION_TARGETS[candidate.rarity as keyof typeof RARITY_DISTRIBUTION_TARGETS]
      if (!rarityTarget) continue

      // Check if we can add more of this rarity
      if (rarityCount[candidate.rarity] >= rarityTarget.max) continue

      // Check type diversity
      const pokemonTypes = candidate.pokemon.types.map((t: any) => t.type.name)
      const hasNewType = pokemonTypes.some((type: string) => !usedTypes.has(type))
      
      // For common/uncommon, allow duplicate types if needed to fill minimums
      const allowDuplicateType = !hasNewType && 
        (candidate.rarity === 'Common' || candidate.rarity === 'Uncommon') &&
        (selectedPokemon.length < count - 2) // Leave room for other types

      if (hasNewType || allowDuplicateType) {
        selectedPokemon.push(candidate.pokemon)
        rarityCount[candidate.rarity]++
        pokemonTypes.forEach((type: string) => usedTypes.add(type))
      }
    }

    // Second pass: fill remaining slots with common/uncommon to meet minimums
    const fillMinimums = () => {
      for (const [rarity, target] of Object.entries(RARITY_DISTRIBUTION_TARGETS)) {
        while (rarityCount[rarity] < target.min && selectedPokemon.length < count) {
          const availableCandidates = sortedCandidates.filter(c => 
            c.rarity === rarity && 
            !selectedPokemon.some((p: Pokemon) => p.id === c.pokemon.id)
          )
          
          if (availableCandidates.length === 0) break
          
          const candidate = availableCandidates[0]
          selectedPokemon.push(candidate.pokemon)
          rarityCount[rarity]++
          
          const pokemonTypes = candidate.pokemon.types.map((t: any) => t.type.name)
          pokemonTypes.forEach((type: string) => usedTypes.add(type))
        }
      }
    }

    fillMinimums()

    // Third pass: fill remaining slots with any available Pokemon (prefer common)
    if (selectedPokemon.length < count) {
      const remainingCandidates = sortedCandidates.filter(c => 
        !selectedPokemon.some((p: Pokemon) => p.id === c.pokemon.id)
      )
      
      // Sort remaining by rarity (common first)
      remainingCandidates.sort((a, b) => {
        const aWeight = RARITY_WEIGHTS[a.rarity] || 0
        const bWeight = RARITY_WEIGHTS[b.rarity] || 0
        return bWeight - aWeight
      })
      
      for (const candidate of remainingCandidates) {
        if (selectedPokemon.length >= count) break
        selectedPokemon.push(candidate.pokemon)
      }
    }
    
    return selectedPokemon.slice(0, count)
  }

  /**
   * Ensure type diversity in the final team selection (legacy method)
   */
  private static ensureTypeDiversity(
    candidates: Array<{ 
      pokemon: Pokemon, 
      effectiveness: number, 
      diversity: number,
      rarity: string,
      rarityWeight: number
    }>, 
    count: number
  ): Pokemon[] {
    // Use the new rarity-aware method instead
    return this.enforceRarityDistribution(candidates, count)
  }

  /**
   * Get random Pokemon based on rarity preferences
   */
  static async getRandomPokemonByRarity(
    preferredRarity: string = 'Common', 
    count: number = 1,
    allowRarer: boolean = true
  ): Promise<Pokemon[]> {
    try {
      const cobblemonData = await fetchCobblemonData()
      const cachedTypes = await usePokemonCache().getCachedTypes()
      
      if (!cachedTypes) return []
      
      // Filter Pokemon by rarity preference
      const filteredPokemon = cobblemonData.filter((cobblemon: CobblemonData) => {
        const rarity = cobblemon.RARITY || DEFAULT_RARITY
        
        if (allowRarer) {
          // Include preferred rarity and any rarer ones
          const preferredWeight = this.getRarityWeight(preferredRarity)
          const rarityWeight = this.getRarityWeight(rarity)
          return rarityWeight <= preferredWeight
        } else {
          // Only include exact rarity match
          return rarity === preferredRarity
        }
      })
      
      // Convert to Pokemon format
      const pokemonData = await PokemonDataTransformer.createPokemonFromCobblemon(filteredPokemon, cachedTypes)
      
      if (pokemonData.length === 0) return []
      
      // Calculate weights based on exact rarity match bonus
      const weights = await Promise.all(pokemonData.map(async (pokemon) => {
        const rarity = await this.getPokemonRarity(pokemon.name)
        let weight = this.getRarityWeight(rarity)
        
        // Bonus for exact rarity match
        if (rarity === preferredRarity) {
          weight *= 2.0
        }
        
        // Add some randomness
        weight *= (0.8 + Math.random() * 0.4)
        
        return weight
      }))
      
      // Use weighted random selection
      const selected = this.weightedRandomSelection(pokemonData, weights, count)
      
      // Final shuffle
      return this.fisherYatesShuffle(selected)
      
    } catch (error) {
      console.error('Error getting random Pokemon by rarity:', error)
      return []
    }
  }
}
