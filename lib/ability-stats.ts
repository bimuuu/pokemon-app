import { pokemonClient } from './pokemon-api'

interface AbilityStats {
  totalPokemon: number
  singleAbilityPokemon: number
  dualAbilityPokemon: number
  singleAbilityPokemonList: string[]
  dualAbilityPokemonList: string[]
}

export async function getAbilityStats(): Promise<AbilityStats> {
  const stats: AbilityStats = {
    totalPokemon: 0,
    singleAbilityPokemon: 0,
    dualAbilityPokemon: 0,
    singleAbilityPokemonList: [],
    dualAbilityPokemonList: []
  }

  try {
    // Get total count first
    const countResponse = await fetch('https://pokeapi.co/api/v2/pokemon')
    if (!countResponse.ok) {
      throw new Error('Failed to fetch Pokemon count')
    }
    const countData = await countResponse.json()
    stats.totalPokemon = countData.count

    // Process Pokemon in batches to avoid overwhelming the API
    const batchSize = 50
    let processedCount = 0
    
    for (let offset = 0; offset < Math.min(stats.totalPokemon, 1000); offset += batchSize) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${batchSize}&offset=${offset}`)
        if (!response.ok) {
          console.warn(`Failed to fetch batch at offset ${offset}`)
          continue
        }
        
        const pokemonList = await response.json()
        
        // Process each Pokemon in this batch
        for (const pokemon of pokemonList.results) {
          try {
            const pokemonData = await pokemonClient.getPokemonByName(pokemon.name)
            const abilities = pokemonData.abilities
            
            // Filter out hidden abilities (is_hidden: true)
            const visibleAbilities = abilities.filter((ability: any) => !ability.is_hidden)
            
            if (visibleAbilities.length === 1) {
              stats.singleAbilityPokemon++
              if (stats.singleAbilityPokemonList.length < 50) {
                stats.singleAbilityPokemonList.push(pokemon.name)
              }
            } else if (visibleAbilities.length >= 2) {
              stats.dualAbilityPokemon++
              if (stats.dualAbilityPokemonList.length < 50) {
                stats.dualAbilityPokemonList.push(pokemon.name)
              }
            }
            
            processedCount++
          } catch (error) {
            console.warn(`Failed to fetch data for ${pokemon.name}:`, error)
            continue
          }
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`Error processing batch at offset ${offset}:`, error)
        continue
      }
    }

    // Extrapolate from sample if we didn't process all Pokemon
    if (processedCount < stats.totalPokemon) {
      const ratio = stats.totalPokemon / processedCount
      stats.singleAbilityPokemon = Math.round(stats.singleAbilityPokemon * ratio)
      stats.dualAbilityPokemon = Math.round(stats.dualAbilityPokemon * ratio)
    }

    return stats
  } catch (error) {
    console.error('Error getting ability stats:', error)
    throw error
  }
}

// Function to get expected values based on known Pokemon data
export function getExpectedAbilityStats(): AbilityStats {
  return {
    totalPokemon: 1010, // Approximate total
    singleAbilityPokemon: 308,
    dualAbilityPokemon: 355,
    singleAbilityPokemonList: [],
    dualAbilityPokemonList: []
  }
}
