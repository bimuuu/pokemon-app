// Pokemon name to Pokedex ID mapping and API integration

// Cache for Pokemon data to avoid repeated API calls
const POKEMON_CACHE = new Map<string, { id: number, generation: number }>()

// Helper function to get Pokemon data from PokeAPI
export const getPokemonDataFromAPI = async (pokemonName: string): Promise<{ id: number, generation: number } | null> => {
  try {
    const normalizedName = pokemonName.toLowerCase().trim()
    
    // Check cache first
    if (POKEMON_CACHE.has(normalizedName)) {
      return POKEMON_CACHE.get(normalizedName)!
    }
    
    // Fetch from PokeAPI
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalizedName}`)
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    // Extract generation from ID
    const pokemonId = data.id
    let generation = 1 // Default to Kanto
    
    // Determine generation based on Pokemon ID
    if (pokemonId <= 151) generation = 1      // Kanto
    else if (pokemonId <= 251) generation = 2    // Johto
    else if (pokemonId <= 386) generation = 3    // Hoenn
    else if (pokemonId <= 493) generation = 4    // Sinnoh
    else if (pokemonId <= 649) generation = 5    // Unova
    else if (pokemonId <= 721) generation = 6    // Kalos
    else if (pokemonId <= 809) generation = 7    // Alola
    else if (pokemonId <= 905) generation = 8    // Galar
    else generation = 9 // Beyond Galar
    
    const pokemonData = { id: pokemonId, generation }
    
    // Cache the result
    POKEMON_CACHE.set(normalizedName, pokemonData)
    
    return pokemonData
  } catch (error) {
    console.error(`Error fetching Pokemon data for ${pokemonName}:`, error)
    return null
  }
}

// Helper function to get Pokemon ID by name (with API fallback)
export const getPokemonIdByName = async (pokemonName: string): Promise<number> => {
  const pokemonData = await getPokemonDataFromAPI(pokemonName)
  return pokemonData?.id || 1 // Default to Bulbasaur if not found
}

// Helper function to get Pokemon generation by name (with API fallback)
export const getPokemonGenerationByName = async (pokemonName: string): Promise<number> => {
  const pokemonData = await getPokemonDataFromAPI(pokemonName)
  return pokemonData?.generation || 1 // Default to Kanto if not found
}

// Helper function to get Pokemon sprite URL by ID
export const getPokemonSpriteUrl = (pokemonId: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
}

// Helper function to get Pokemon sprite URL by name (with API fallback)
export const getPokemonSpriteUrlByName = async (pokemonName: string): Promise<string> => {
  const pokemonData = await getPokemonDataFromAPI(pokemonName)
  const pokemonId = pokemonData?.id || 1
  return getPokemonSpriteUrl(pokemonId)
}

// Helper function to get Pokemon sprite URL by name (synchronous fallback for immediate use)
export const getPokemonSpriteUrlByNameSync = (pokemonName: string): string => {
  const normalizedName = pokemonName.toLowerCase().trim()
  
  // Check cache first
  if (POKEMON_CACHE.has(normalizedName)) {
    const cached = POKEMON_CACHE.get(normalizedName)!
    return getPokemonSpriteUrl(cached.id)
  }
  
  // Fallback to hardcoded mapping for common Pokemon if API not available
  const FALLBACK_MAPPING: Record<string, number> = {
    'bulbasaur': 1, 'ivysaur': 2, 'venusaur': 3,
    'charmander': 4, 'charmeleon': 5, 'charizard': 6,
    'squirtle': 7, 'wartortle': 8, 'blastoise': 9,
    'pikachu': 25, 'raichu': 26,
    'eevee': 133, 'vaporeon': 134, 'jolteon': 135, 'flareon': 136,
    'dragonite': 149, 'mewtwo': 150, 'mew': 151,
    'chikorita': 152, 'cyndaquil': 155, 'totodile': 158,
    'treecko': 252, 'torchic': 255, 'mudkip': 258,
    'rayquaza': 386,
    // Add more common Pokemon as needed
  }
  
  return getPokemonSpriteUrl(FALLBACK_MAPPING[normalizedName] || 1)
}

// Helper function to clear cache (useful for testing or when Pokemon data changes)
export const clearPokemonCache = (): void => {
  POKEMON_CACHE.clear()
}
