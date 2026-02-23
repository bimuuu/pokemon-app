// Pokemon name to Pokedex ID mapping and API integration

// Cache for Pokemon data to avoid repeated API calls
const POKEMON_CACHE = new Map<string, { id: number, generation: number }>()

// Import the normalize function from pokemon-api
const { normalizePokemonName } = await import('@/lib/pokemon-api')

// Helper function to get Pokemon data from PokeAPI
export const getPokemonDataFromAPI = async (pokemonName: string): Promise<{ id: number, generation: number } | null> => {
  try {
    // Use proper normalization from pokemon-api
    const normalizedName = normalizePokemonName(pokemonName)
    
    // Check cache first
    if (POKEMON_CACHE.has(normalizedName)) {
      return POKEMON_CACHE.get(normalizedName)!
    }
    
    // Fetch from PokeAPI
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalizedName}`)
    if (!response.ok) {
      console.warn(`Pokemon not found: ${pokemonName} (normalized: ${normalizedName}) - Status: ${response.status}`)
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
  // Use proper normalization from pokemon-api (synchronously approximate)
  let normalizedName = pokemonName
    .replace(/%c3%a9/g, 'e') // é
    .replace(/%c3%a8/g, 'e') // è
    .replace(/%c3%aa/g, 'e') // ê
    .replace(/%c3%a7/g, 'c') // ç
    .replace(/%c3%b1/g, 'n') // ñ
    .replace(/%e2%99%82/g, 'm') // male symbol
    .replace(/%e2%99%80/g, 'f') // female symbol
    .replace(/%20/g, '-') // space
    .replace(/\./g, '-') // dot
    .replace(/['']/g, '') // apostrophes
    .replace(/\s+/g, '-') // spaces
    .replace(/[^a-z0-9-]/gi, '') // remove special characters except hyphens
    .toLowerCase()
    .trim()
  
  // Apply special case mappings (simplified version)
  const specialCases: { [key: string]: string } = {
    'nidoran': 'nidoran-m',
    'nidoran♂': 'nidoran-m',
    'nidoran♀': 'nidoran-f',
    'mr. rime': 'mr-rime',
    'mime jr.': 'mime-jr',
    'mrmime': 'mr-mime',
    'fluttermane': 'flutter-mane',
    'porygonz': 'porygon-z',
    'flabébé': 'flabebe',
    'deoxys': 'deoxys-normal',
    'wormadam': 'wormadam-plant',
    'shaymin': 'shaymin-land',
    'giratina': 'giratina-altered',
    'basculin': 'basculin-red-striped',
    'darmanitan': 'darmanitan-standard',
    'tornadus': 'tornadus-incarnate',
    'thundurus': 'thundurus-incarnate',
    'landorus': 'landorus-incarnate',
    'keldeo': 'keldeo-ordinary',
    'meloetta': 'meloetta-aria',
    'lycanroc': 'lycanroc-midday',
    'wishiwashi': 'wishiwashi-school',
    'oricorio': 'oricorio-baile',
    'mimikyu': 'mimikyu-disguised',
    'gourgeist': 'gourgeist-average',
    'meowstic': 'meowstic-male',
    'aegislash': 'aegislash-shield',
    'pumpkaboo': 'pumpkaboo-average',
    'zygarde': 'zygarde-10',
    'toxtricity': 'toxtricity-amped',
    'eiscue': 'eiscue-ice',
    'indeedee': 'indeedee-male',
    'morpeko': 'morpeko-full-belly',
    'urshifu': 'urshifu-single-strike',
    'enamorus': 'enamorus-incarnate',
    'basculegion': 'basculegion-male',
    'maushold': 'maushold-family-of-four',
    'oinkologne': 'oinkologne-male',
    'tatsugiri': 'tatsugiri-curly',
    'dudunsparce': 'dudunsparce-two-segment',
    'palafin': 'palafin-zero',
    'vivillion': 'vivillon',
    'kricket': 'kricketot',
    'crabomibale': 'crabominable',
    'squawkabilly': 'squawkabilly-green-plumage',
    'minior': 'minior-red-meteor',
    'iron hands': 'iron-hands',
    'iron jugulis': 'iron-jugulis',
    'iron moth': 'iron-moth',
    'iron thorns': 'iron-thorns',
    'iron bundle': 'iron-bundle',
    'iron treads': 'iron-treads',
    'iron valiant': 'iron-valiant',
    'iron leaves': 'iron-leaves',
    'iron crown': 'iron-crown'
  }
  
  // Check if name matches any special case (case-insensitive)
  if (specialCases[normalizedName]) {
    normalizedName = specialCases[normalizedName]
  }
  
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
