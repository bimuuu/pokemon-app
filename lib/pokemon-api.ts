import { PokemonClient, EvolutionClient } from 'pokenode-ts'
import { getServerTranslation } from './i18n'
import { PokemonForm, PokemonFormData, FormTransformationCondition } from '@/types/pokemon'

// Initialize clients
export const pokemonClient = new PokemonClient()
export const evolutionClient = new EvolutionClient()

// Special case mappings for Pokemon with complex names
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
  'minior': 'minior-red-meteor'
}

/**
 * Normalizes Pokemon names by handling special characters, spaces, and known cases
 */
export function normalizePokemonName(name: string): string {
  // Check if name matches any special case (case-insensitive)
  const lowerName = name.toLowerCase()
  if (specialCases[lowerName]) {
    return specialCases[lowerName]
  }

  // Handle URL-encoded characters
  let normalized = name
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

  // Remove any remaining special characters except hyphens
  normalized = normalized.replace(/[^a-z0-9-]/gi, '')

  return normalized.toLowerCase().trim()
}

/**
 * Fetches Pokemon species data by name with fallback logic
 */
export async function fetchPokemonSpeciesByName(name: string) {
  const fallbackNames: string[] = []
  const normalizedName = normalizePokemonName(name)
  
  // Start with normalized name
  fallbackNames.push(normalizedName)

  // Add fallbacks for Pokemon with multiple forms
  if (name.toLowerCase().includes('deoxys')) {
    fallbackNames.push('deoxys-attack', 'deoxys-defense', 'deoxys-speed')
  }
  if (name.toLowerCase().includes('wormadam')) {
    fallbackNames.push('wormadam-sandy', 'wormadam-trash')
  }
  if (name.toLowerCase().includes('shaymin')) {
    fallbackNames.push('shaymin-sky')
  }
  if (name.toLowerCase().includes('giratina')) {
    fallbackNames.push('giratina-origin')
  }
  if (name.toLowerCase().includes('basculin')) {
    fallbackNames.push('basculin-blue-striped', 'basculin-white-striped')
  }
  if (name.toLowerCase().includes('darmanitan')) {
    fallbackNames.push('darmanitan-zen')
  }
  if (name.toLowerCase().includes('tornadus')) {
    fallbackNames.push('tornadus-therian')
  }
  if (name.toLowerCase().includes('thundurus')) {
    fallbackNames.push('thundurus-therian')
  }
  if (name.toLowerCase().includes('landorus')) {
    fallbackNames.push('landorus-therian')
  }
  if (name.toLowerCase().includes('keldeo')) {
    fallbackNames.push('keldeo-resolute')
  }
  if (name.toLowerCase().includes('meloetta')) {
    fallbackNames.push('meloetta-pirouette')
  }
  if (name.toLowerCase().includes('lycanroc')) {
    fallbackNames.push('lycanroc-midnight', 'lycanroc-dusk')
  }
  if (name.toLowerCase().includes('wishiwashi')) {
    fallbackNames.push('wishiwashi-solo')
  }
  if (name.toLowerCase().includes('oricorio')) {
    fallbackNames.push('oricorio-pom-pom', 'oricorio-pau', 'oricorio-sensu')
  }
  if (name.toLowerCase().includes('mimikyu')) {
    fallbackNames.push('mimikyu-busted', 'mimikyu-totem-disguised', 'mimikyu-totem-busted')
  }
  if (name.toLowerCase().includes('gourgeist')) {
    fallbackNames.push('gourgeist-small', 'gourgeist-large', 'gourgeist-super')
  }
  if (name.toLowerCase().includes('meowstic')) {
    fallbackNames.push('meowstic-female')
  }
  if (name.toLowerCase().includes('aegislash')) {
    fallbackNames.push('aegislash-blade')
  }
  if (name.toLowerCase().includes('pumpkaboo')) {
    fallbackNames.push('pumpkaboo-small', 'pumpkaboo-large', 'pumpkaboo-super')
  }
  if (name.toLowerCase().includes('zygarde')) {
    fallbackNames.push('zygarde-50', 'zygarde-complete')
  }
  if (name.toLowerCase().includes('toxtricity')) {
    fallbackNames.push('toxtricity-low-key')
  }
  if (name.toLowerCase().includes('eiscue')) {
    fallbackNames.push('eiscue-noice')
  }
  if (name.toLowerCase().includes('indeedee')) {
    fallbackNames.push('indeedee-female')
  }
  if (name.toLowerCase().includes('morpeko')) {
    fallbackNames.push('morpeko-hangry')
  }
  if (name.toLowerCase().includes('urshifu')) {
    fallbackNames.push('urshifu-rapid-strike')
  }
  if (name.toLowerCase().includes('enamorus')) {
    fallbackNames.push('enamorus-therian')
  }
  if (name.toLowerCase().includes('basculegion')) {
    fallbackNames.push('basculegion-female')
  }
  if (name.toLowerCase().includes('maushold')) {
    fallbackNames.push('maushold-family-of-three')
  }
  if (name.toLowerCase().includes('oinkologne')) {
    fallbackNames.push('oinkologne-female')
  }
  if (name.toLowerCase().includes('tatsugiri')) {
    fallbackNames.push('tatsugiri-droopy', 'tatsugiri-stretchy')
  }
  if (name.toLowerCase().includes('dudunsparce')) {
    fallbackNames.push('dudunsparce-one-segment')
  }
  if (name.toLowerCase().includes('palafin')) {
    fallbackNames.push('palafin-hero')
  }
  if (name.toLowerCase().includes('vivillon')) {
    fallbackNames.push('vivillon-meadow', 'vivillon-sun', 'vivillon-rain', 'vivillon-snow', 'vivillon-polar', 'vivillon-tundra', 'vivillon-continental', 'vivillon-garden', 'vivillon-elegant', 'vivillon-savanna', 'vivillon-marine', 'vivillon-archipelago', 'vivillon-high-plains', 'vivillon-sandstorm', 'vivillon-river', 'vivillon-monsoon', 'vivillon-fancy', 'vivillon-pokeball')
  }
  
  // Add Gigantamax form fallbacks
  const gmaxPokemon = [
    'venusaur', 'charizard', 'blastoise', 'butterfree', 'pikachu', 'meowth',
    'machamp', 'gengar', 'kingler', 'lapras', 'eevee', 'snorlax', 'garbodor',
    'melmetal', 'corviknight', 'orbeetle', 'drednaw', 'coalossal', 'flapple',
    'appletun', 'sandaconda', 'toxtricity', 'centiskorch', 'hatterene', 'grimmsnarl',
    'alcremie', 'copperajah', 'duraludon', 'urshifu', 'rillaboom', 'cinderace',
    'inteleon', 'seismitoad', 'dracovish', 'arctozolt', 'dracozolt', 'arctovish'
  ]
  
  for (const gmaxName of gmaxPokemon) {
    if (name.toLowerCase().includes(gmaxName)) {
      fallbackNames.push(`${gmaxName}-gmax`)
      break
    }
  }
  
  // Also add the original name as fallback
  fallbackNames.push(name)
  
  for (const tryName of fallbackNames) {
    try {
      const result = await pokemonClient.getPokemonSpeciesByName(tryName)
      if (result) {
        return result
      }
    } catch (error) {
      console.warn(getServerTranslation('errors.failedToFetchSpecies', { name: tryName }))
      // Continue to next fallback
    }
  }
  
  throw new Error(getServerTranslation('errors.failedToFetchSpeciesAllVariations', { name }))
}

/**
 * Fetches Pokemon species data by ID
 */
export async function fetchPokemonSpeciesById(id: number) {
  try {
    return await pokemonClient.getPokemonSpeciesById(id)
  } catch (error) {
    console.error(getServerTranslation('errors.errorFetchingSpeciesId', { id }), error)
    throw error
  }
}

/**
 * Fetches Pokemon data by name with fallback logic
 */
export async function fetchPokemonByName(name: string) {
  const fallbackNames: string[] = []
  const normalizedName = normalizePokemonName(name)
  
  // Start with normalized name
  fallbackNames.push(normalizedName)

  // Add fallbacks for Pokemon with multiple forms
  if (name.toLowerCase().includes('deoxys')) {
    fallbackNames.push('deoxys-attack', 'deoxys-defense', 'deoxys-speed')
  }
  if (name.toLowerCase().includes('wormadam')) {
    fallbackNames.push('wormadam-sandy', 'wormadam-trash')
  }
  if (name.toLowerCase().includes('shaymin')) {
    fallbackNames.push('shaymin-sky')
  }
  if (name.toLowerCase().includes('giratina')) {
    fallbackNames.push('giratina-origin')
  }
  if (name.toLowerCase().includes('basculin')) {
    fallbackNames.push('basculin-blue-striped', 'basculin-white-striped')
  }
  if (name.toLowerCase().includes('darmanitan')) {
    fallbackNames.push('darmanitan-zen')
  }
  if (name.toLowerCase().includes('tornadus')) {
    fallbackNames.push('tornadus-therian')
  }
  if (name.toLowerCase().includes('thundurus')) {
    fallbackNames.push('thundurus-therian')
  }
  if (name.toLowerCase().includes('landorus')) {
    fallbackNames.push('landorus-therian')
  }
  if (name.toLowerCase().includes('keldeo')) {
    fallbackNames.push('keldeo-resolute')
  }
  if (name.toLowerCase().includes('meloetta')) {
    fallbackNames.push('meloetta-pirouette')
  }
  if (name.toLowerCase().includes('lycanroc')) {
    fallbackNames.push('lycanroc-midnight', 'lycanroc-dusk')
  }
  if (name.toLowerCase().includes('wishiwashi')) {
    fallbackNames.push('wishiwashi-solo')
  }
  if (name.toLowerCase().includes('oricorio')) {
    fallbackNames.push('oricorio-pom-pom', 'oricorio-pau', 'oricorio-sensu')
  }
  if (name.toLowerCase().includes('mimikyu')) {
    fallbackNames.push('mimikyu-busted', 'mimikyu-totem-disguised', 'mimikyu-totem-busted')
  }
  if (name.toLowerCase().includes('gourgeist')) {
    fallbackNames.push('gourgeist-small', 'gourgeist-large', 'gourgeist-super')
  }
  if (name.toLowerCase().includes('meowstic')) {
    fallbackNames.push('meowstic-female')
  }
  if (name.toLowerCase().includes('aegislash')) {
    fallbackNames.push('aegislash-blade')
  }
  if (name.toLowerCase().includes('pumpkaboo')) {
    fallbackNames.push('pumpkaboo-small', 'pumpkaboo-large', 'pumpkaboo-super')
  }
  if (name.toLowerCase().includes('zygarde')) {
    fallbackNames.push('zygarde-50', 'zygarde-complete')
  }
  if (name.toLowerCase().includes('toxtricity')) {
    fallbackNames.push('toxtricity-low-key')
  }
  if (name.toLowerCase().includes('eiscue')) {
    fallbackNames.push('eiscue-noice')
  }
  if (name.toLowerCase().includes('indeedee')) {
    fallbackNames.push('indeedee-female')
  }
  if (name.toLowerCase().includes('morpeko')) {
    fallbackNames.push('morpeko-hangry')
  }
  if (name.toLowerCase().includes('urshifu')) {
    fallbackNames.push('urshifu-rapid-strike')
  }
  if (name.toLowerCase().includes('enamorus')) {
    fallbackNames.push('enamorus-therian')
  }
  if (name.toLowerCase().includes('basculegion')) {
    fallbackNames.push('basculegion-female')
  }
  if (name.toLowerCase().includes('maushold')) {
    fallbackNames.push('maushold-family-of-three')
  }
  if (name.toLowerCase().includes('oinkologne')) {
    fallbackNames.push('oinkologne-female')
  }
  if (name.toLowerCase().includes('tatsugiri')) {
    fallbackNames.push('tatsugiri-droopy', 'tatsugiri-stretchy')
  }
  if (name.toLowerCase().includes('dudunsparce')) {
    fallbackNames.push('dudunsparce-one-segment')
  }
  if (name.toLowerCase().includes('palafin')) {
    fallbackNames.push('palafin-hero')
  }
  if (name.toLowerCase().includes('vivillon')) {
    fallbackNames.push('vivillon-meadow', 'vivillon-sun', 'vivillon-rain', 'vivillon-snow', 'vivillon-polar', 'vivillon-tundra', 'vivillon-continental', 'vivillon-garden', 'vivillon-elegant', 'vivillon-savanna', 'vivillon-marine', 'vivillon-archipelago', 'vivillon-high-plains', 'vivillon-sandstorm', 'vivillon-river', 'vivillon-monsoon', 'vivillon-fancy', 'vivillon-pokeball')
  }
  
  // Add Gigantamax form fallbacks
  const gmaxPokemon = [
    'venusaur', 'charizard', 'blastoise', 'butterfree', 'pikachu', 'meowth',
    'machamp', 'gengar', 'kingler', 'lapras', 'eevee', 'snorlax', 'garbodor',
    'melmetal', 'corviknight', 'orbeetle', 'drednaw', 'coalossal', 'flapple',
    'appletun', 'sandaconda', 'toxtricity', 'centiskorch', 'hatterene', 'grimmsnarl',
    'alcremie', 'copperajah', 'duraludon', 'urshifu', 'rillaboom', 'cinderace',
    'inteleon', 'seismitoad', 'dracovish', 'arctozolt', 'dracozolt', 'arctovish'
  ]
  
  for (const gmaxName of gmaxPokemon) {
    if (name.toLowerCase().includes(gmaxName)) {
      fallbackNames.push(`${gmaxName}-gmax`)
      break
    }
  }
    
  // Also add the original name as fallback
  fallbackNames.push(name)
    
  for (const tryName of fallbackNames) {
    try {
      const pokemon = await pokemonClient.getPokemonByName(tryName)
      if (pokemon) {
        return pokemon
      }
    } catch (error) {
      console.warn(getServerTranslation('errors.failedToFetchPokemon', { name: tryName }))
      // Continue to next fallback
    }
  }
    
  throw new Error(getServerTranslation('errors.failedToFetchPokemonAllVariations', { name }))
}

/**
 * Fetches Pokemon data by ID
 */
export async function fetchPokemonById(id: number) {
  try {
    return await pokemonClient.getPokemonById(id)
  } catch (error) {
    console.error(getServerTranslation('errors.errorFetchingPokemonId', { id }), error)
    throw error
  }
}

/**
 * Fetches evolution chain by ID
 */
export async function fetchEvolutionChain(id: number) {
  try {
    return await evolutionClient.getEvolutionChainById(id)
  } catch (error) {
    console.error(getServerTranslation('errors.errorFetchingEvolutionChainId', { id }), error)
    throw error
  }
}

/**
 * Fetches evolution chain by Pokemon species name
 */
export async function fetchEvolutionChainBySpeciesName(speciesName: string) {
  try {
    // First get the species data
    const species = await fetchPokemonSpeciesByName(speciesName)
    
    // Extract evolution chain ID from URL
    const evolutionChainUrl = species.evolution_chain?.url
    if (!evolutionChainUrl) {
      throw new Error(getServerTranslation('errors.evolutionChainUrlNotFound'))
    }
    
    // Extract ID from URL (format: https://pokeapi.co/api/v2/evolution-chain/{id}/)
    const evolutionChainId = evolutionChainUrl.split('/').filter(Boolean).pop()
    if (!evolutionChainId) {
      throw new Error(getServerTranslation('errors.couldNotExtractEvolutionId'))
    }
    
    // Fetch the evolution chain
    return await fetchEvolutionChain(parseInt(evolutionChainId))
  } catch (error) {
    console.error(getServerTranslation('errors.errorFetchingEvolutionChain', { speciesName }), error)
    throw error
  }
}

/**
 * Fetches Pokemon forms data by Pokemon ID
 */
export async function fetchPokemonForms(pokemonId: number): Promise<PokemonForm[]> {
  try {
    const pokemon = await pokemonClient.getPokemonById(pokemonId)
    
    // For Pokemon with multiple forms in the same Pokemon entry
    if (pokemon.forms.length > 1) {
      return pokemon.forms.map(form => ({
        name: form.name,
        url: form.url
      })).filter(form => form.name !== 'arceus-unknown')
    }
    
    // For Pokemon with forms as separate entries (like Deoxys, Giratina, etc.)
    // We need to check if this Pokemon has alternative forms by checking related species
    const species = await pokemonClient.getPokemonSpeciesByName(pokemon.species.name)
    
    // Check for known multi-form Pokemon that have separate entries
    const multiFormPokemon = [
      'deoxys', 'giratina', 'shaymin', 'rotom', 'castform', 'kyurem', 'necrozma',
      'tornadus', 'thundurus', 'landorus', 'enamorus', 'calyrex', 'kyogre', 'groudon'
    ]
    
    // Check for Pokemon with Mega Evolution forms
    const megaPokemon = [
      'charizard', 'mewtwo', 'blastoise', 'venusaur', 'alakazam', 'gengar', 
      'kangaskhan', 'pinsir', 'gyarados', 'aerodactyl', 'lucario', 'absol',
      'ampharos', 'scizor', 'heracross', 'houndoom', 'tyranitar', 'sceptile',
      'blaziken', 'swampert', 'gardevoir', 'sableye', 'mawile', 'aggron',
      'medicham', 'latias', 'latios', 'rayquaza', 'glalie', 'salamence',
      'metagross', 'lopunny', 'garchomp', 'lucario', 'abomasnow', 'gallade',
      'audino', 'diancie'
    ]
    
    // Check for Pokemon with Gigantamax forms
    const gmaxPokemon = [
      'venusaur', 'charizard', 'blastoise', 'butterfree', 'pikachu', 'meowth',
      'machamp', 'gengar', 'kingler', 'lapras', 'eevee', 'snorlax', 'garbodor',
      'melmetal', 'corviknight', 'orbeetle', 'duraludon', 'coalossal', 'flapple',
      'appletun', 'sandaconda', 'toxtricity', 'centiskorch', 'hatterene', 'grimmsnarl',
      'alcremie', 'copperajah', 'drednaw', 'urshifu', 'rillaboom', 'cinderace',
      'inteleon', 'seismitoad', 'dracovish', 'arctozolt', 'dracozolt', 'arctovish'
    ]
    
    // Check both the full name and base name for multi-form detection
    const baseName = pokemon.name.split('-')[0]
    if (multiFormPokemon.includes(pokemon.name) || multiFormPokemon.includes(baseName) || 
        megaPokemon.includes(baseName) || gmaxPokemon.includes(baseName)) {
      const forms: PokemonForm[] = []
      
      // Add current form
      forms.push({
        name: pokemon.forms[0].name,
        url: pokemon.forms[0].url
      })
      
      // Try to find alternative forms by checking nearby IDs or known patterns
      // This is a simplified approach - in reality you'd need a comprehensive mapping
      if (pokemon.name === 'deoxys' || baseName === 'deoxys') {
        // Deoxys forms are at IDs 386, 10001, 10002, 10003
        const deoxysForms = ['deoxys-normal', 'deoxys-attack', 'deoxys-defense', 'deoxys-speed']
        for (const formName of deoxysForms) {
          if (formName !== pokemon.forms[0].name) {
            forms.push({
              name: formName,
              url: `https://pokeapi.co/api/v2/pokemon-form/${formName}/`
            })
          }
        }
      } else if (pokemon.name === 'giratina' || baseName === 'giratina') {
        // Giratina forms
        const giratinaForms = ['giratina-altered', 'giratina-origin']
        for (const formName of giratinaForms) {
          if (formName !== pokemon.forms[0].name) {
            forms.push({
              name: formName,
              url: `https://pokeapi.co/api/v2/pokemon-form/${formName}/`
            })
          }
        }
      } else if (pokemon.name === 'shaymin' || baseName === 'shaymin') {
        // Shaymin forms
        const shayminForms = ['shaymin-land', 'shaymin-sky']
        for (const formName of shayminForms) {
          if (formName !== pokemon.forms[0].name) {
            forms.push({
              name: formName,
              url: `https://pokeapi.co/api/v2/pokemon-form/${formName}/`
            })
          }
        }
      } else if (pokemon.name === 'rotom' || baseName === 'rotom') {
        // Rotom forms
        const rotomForms = ['rotom', 'rotom-heat', 'rotom-wash', 'rotom-frost', 'rotom-fan', 'rotom-mow']
        for (const formName of rotomForms) {
          if (formName !== pokemon.forms[0].name) {
            forms.push({
              name: formName,
              url: `https://pokeapi.co/api/v2/pokemon-form/${formName}/`
            })
          }
        }
      } else if (pokemon.name === 'castform' || baseName === 'castform') {
        // Castform forms
        const castformForms = ['castform', 'castform-sunny', 'castform-rainy', 'castform-snowy']
        for (const formName of castformForms) {
          if (formName !== pokemon.forms[0].name) {
            forms.push({
              name: formName,
              url: `https://pokeapi.co/api/v2/pokemon-form/${formName}/`
            })
          }
        }
      } else if (pokemon.name === 'kyurem' || baseName === 'kyurem') {
        // Kyurem forms
        const kyuremForms = ['kyurem', 'kyurem-black', 'kyurem-white']
        for (const formName of kyuremForms) {
          if (formName !== pokemon.forms[0].name) {
            forms.push({
              name: formName,
              url: `https://pokeapi.co/api/v2/pokemon-form/${formName}/`
            })
          }
        }
      } else if (pokemon.name === 'kyogre' || baseName === 'kyogre') {
        // Kyogre forms
        const kyogreForms = ['kyogre', 'kyogre-primal']
        for (const formName of kyogreForms) {
          if (formName !== pokemon.forms[0].name) {
            forms.push({
              name: formName,
              url: `https://pokeapi.co/api/v2/pokemon-form/${formName}/`
            })
          }
        }
      } else if (pokemon.name === 'groudon' || baseName === 'groudon') {
        // Groudon forms
        const groudonForms = ['groudon', 'groudon-primal']
        for (const formName of groudonForms) {
          if (formName !== pokemon.forms[0].name) {
            forms.push({
              name: formName,
              url: `https://pokeapi.co/api/v2/pokemon-form/${formName}/`
            })
          }
        }
      } else if (megaPokemon.includes(baseName)) {
        // Mega Evolution forms
        
        // Check for specific Mega forms
        if (baseName === 'charizard' || baseName === 'mewtwo') {
          // Charizard and Mewtwo have two Mega forms (X and Y)
          const megaForms = [`${baseName}-mega-x`, `${baseName}-mega-y`]
          for (const formName of megaForms) {
            forms.push({
              name: formName,
              url: `https://pokeapi.co/api/v2/pokemon-form/${formName}/`
            })
          }
        } else if (baseName === 'rayquaza') {
          // Rayquaza has Mega form
          forms.push({
            name: `${baseName}-mega`,
            url: `https://pokeapi.co/api/v2/pokemon-form/${baseName}-mega/`
          })
        } else {
          // Most Pokemon have single Mega form
          forms.push({
            name: `${baseName}-mega`,
            url: `https://pokeapi.co/api/v2/pokemon-form/${baseName}-mega/`
          })
        }
        
        // Check if this Pokemon also has Gmax form
        if (gmaxPokemon.includes(baseName)) {
          forms.push({
            name: `${baseName}-gmax`,
            url: `https://pokeapi.co/api/v2/pokemon-form/${baseName}-gmax/`
          })
        }
      } else if (gmaxPokemon.includes(baseName)) {
        // Gigantamax forms only (no Mega)
        
        // Add Gigantamax form to base Pokemon
        forms.push({
          name: `${baseName}-gmax`,
          url: `https://pokeapi.co/api/v2/pokemon-form/${baseName}-gmax/`
        })
      }
      
      return forms
    }
    
    // Default case - return the single form
    return pokemon.forms.map(form => ({
      name: form.name,
      url: form.url
    })).filter(form => form.name !== 'arceus-unknown')
  } catch (error) {
    console.error('API Error in fetchPokemonForms:', error)
    console.error('API Error - Pokemon ID:', pokemonId)
    console.error(getServerTranslation('errors.errorFetchingForms', { id: pokemonId }), error)
    return []
  }
}

/**
 * Fetches detailed form data by form URL
 */
export async function fetchFormDataByUrl(formUrl: string): Promise<PokemonFormData | null> {
  try {
    const response = await fetch(formUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch form data: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching form data:', error)
    return null
  }
}

/**
 * Fetches all forms data for a Pokemon
 */
export async function fetchAllFormsData(pokemonId: number): Promise<Record<string, PokemonFormData>> {
  try {
    const forms = await fetchPokemonForms(pokemonId)
    const formsData: Record<string, PokemonFormData> = {}
    
    // Fetch each form's detailed data from /pokemon/{name} endpoint (not pokemon-form)
    const formPromises = forms.map(async (form) => {
      // Extract pokemon name from form name (e.g., "charizard-mega-y" -> "charizard-mega-y")
      const formName = form.name
      const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${formName}/`
      
      try {
        const response = await fetch(pokemonUrl)
        if (!response.ok) {
          console.warn(`Failed to fetch pokemon data for ${formName}: ${response.statusText}`)
          return null
        }
        const pokemonData = await response.json()
        
        // Also fetch form data for sprites and form-specific info
        const formData = await fetchFormDataByUrl(form.url)
        
        // Combine pokemon data (stats, abilities) with form data (sprites, form info)
        const combinedData: PokemonFormData = {
          id: pokemonData.id,
          name: pokemonData.name,
          form_name: formData?.form_name || formName,
          form_names: formData?.form_names || [],
          order: pokemonData.order,
          form_order: formData?.form_order || 0,
          is_default: formData?.is_default || false,
          is_battle_only: formData?.is_battle_only || false,
          is_mega: formData?.is_mega || false,
          is_primal: formData?.is_primal || false,
          pokemon: {
            name: pokemonData.name,
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonData.id}/`
          },
          sprites: formData?.sprites || pokemonData.sprites,
          stats: pokemonData.stats,
          abilities: pokemonData.abilities,
          types: pokemonData.types,
        }
        
        return { [form.name]: combinedData }
      } catch (error) {
        console.error(`Error fetching pokemon data for ${form.name}:`, error)
        return null
      }
    })
    
    const results = await Promise.allSettled(formPromises)
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        Object.assign(formsData, result.value)
      }
    })
    
    return formsData
  } catch (error) {
    console.error('Error fetching all forms data:', error)
    return {}
  }
}

/**
 * Gets transformation conditions for a specific form
 */
export function getFormTransformationConditions(formName: string): FormTransformationCondition[] {
  const conditions: FormTransformationCondition[] = []
  
  // Arceus forms - based on held plates
  if (formName.startsWith('arceus-')) {
    const type = formName.replace('arceus-', '')
    conditions.push({
      type: 'item',
      trigger: `${type}-plate`,
      description: `Hold ${type} Plate to change form`
    })
  }
  
  // Giratina forms
  if (formName === 'giratina-origin') {
    conditions.push({
      type: 'item',
      trigger: 'griseous-orb',
      description: 'Hold Griseous Orb to change to Origin Forme'
    })
  }
  
  // Shaymin forms
  if (formName === 'shaymin-sky') {
    conditions.push({
      type: 'item',
      trigger: 'gracidea-flower',
      description: 'Use Gracidea Flower during daytime to change to Sky Forme'
    })
  }
  
  // Deoxys forms
  if (formName.includes('deoxys')) {
    conditions.push({
      type: 'location',
      trigger: 'meteorite',
      description: 'Interact with meteorites in specific locations to change form'
    })
  }
  
  // Rotom forms
  if (formName.startsWith('rotom-')) {
    const appliance = formName.replace('rotom-', '')
    conditions.push({
      type: 'item',
      trigger: `${appliance}-key`,
      description: `Use ${appliance} Key to change to ${appliance} Form`
    })
  }
  
  // Castform forms
  if (formName.startsWith('castform-')) {
    const weather = formName.replace('castform-', '')
    conditions.push({
      type: 'weather',
      trigger: weather,
      description: `Changes to ${weather} form during ${weather} weather`
    })
  }
  
  // Wishiwashi forms
  if (formName === 'wishiwashi-school') {
    conditions.push({
      type: 'ability',
      trigger: 'schooling',
      description: 'Changes to School Form at level 20+ with Schooling ability'
    })
  }
  
  // Lycanroc forms
  if (formName.includes('lycanroc')) {
    if (formName === 'lycanroc-midnight') {
      conditions.push({
        type: 'time',
        trigger: 'night',
        description: 'Evolves from Rockruff at night'
      })
    } else if (formName === 'lycanroc-dusk') {
      conditions.push({
        type: 'time',
        trigger: 'dusk',
        description: 'Evolves from Rockruff during dusk'
      })
    }
  }
  
  // Zygarde forms
  if (formName.includes('zygarde')) {
    if (formName === 'zygarde-10') {
      conditions.push({
        type: 'ability',
        trigger: 'aura-break',
        description: 'Changes to 10% Forme with Aura Break ability'
      })
    } else if (formName === 'zygarde-complete') {
      conditions.push({
        type: 'item',
        trigger: 'zygarde-cube',
        description: 'Changes to Complete Forme with enough Zygarde Cells'
      })
    }
  }
  
  return conditions
}

/**
 * Gets form display name (formatted for UI)
 */
export function getFormDisplayName(formName: string): string {
  const displayName = formName.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
  
  // Special cases for better display names
  if (formName.includes('mega')) {
    return displayName.replace('Mega', 'Mega')
  } else if (formName.includes('gmax')) {
    return displayName.replace('Gmax', 'Gigantamax')
  } else if (formName.includes('primal')) {
    return displayName.replace('Primal', 'Primal')
  }
  
  return displayName
}

export function getGmaxMoveName(formName: string): string {
  const baseName = formName.replace('-gmax', '').toLowerCase()
  
  // G-Max move mappings
  const gmaxMoves: Record<string, string> = {
    'venusaur': 'G-Max Vine Lash',
    'charizard': 'G-Max Wildfire',
    'blastoise': 'G-Max Cannonade',
    'butterfree': 'G-Max Befuddle',
    'pikachu': 'G-Max Volt Crash',
    'meowth': 'G-Max Gold Rush',
    'machamp': 'G-Max Chi Strike',
    'gengar': 'G-Max Terror',
    'kingler': 'G-Max Foam Burst',
    'lapras': 'G-Max Resonance',
    'eevee': 'G-Max Cuddle',
    'snorlax': 'G-Max Replenish',
    'garbodor': 'G-Max Malodor',
    'melmetal': 'G-Max Meltdown',
    'corviknight': 'G-Max Wind Rage',
    'orbeetle': 'G-Max Resonance',
    'duraludon': 'G-Max Depletion',
    'coalossal': 'G-Max Steelsurge',
    'flapple': 'G-Max Tartness',
    'appletun': 'G-Max Sweetness',
    'sandaconda': 'G-Max Sandblast',
    'toxtricity': 'G-Max Stun Shock',
    'centiskorch': 'G-Max Centiferno',
    'hatterene': 'G-Max Smite',
    'grimmsnarl': 'G-Max Snooze',
    'alcremie': 'G-Max Finale',
    'copperajah': 'G-Max Steelsurge',
    'drednaw': 'G-Max Jaw Lock',
    'urshifu': 'G-Max One Blow',
    'rillaboom': 'G-Max Drum Solo',
    'cinderace': 'G-Max Fireball',
    'inteleon': 'G-Max Hydrosnipe',
    'seismitoad': 'G-Max Gravitas',
    'dracovish': 'G-Max Hailstorm',
    'arctozolt': 'G-Max Hailstorm',
    'dracozolt': 'G-Max Hailstorm',
    'arctovish': 'G-Max Hailstorm'
  }
  
  return gmaxMoves[baseName] || 'G-Max Move'
}

/**
 * Gets form sprite URL
 */
export function getFormSpriteUrl(formName: string, pokemonId: number): string {
  // Try to get form-specific sprite first
  const formId = getFormId(formName, pokemonId)
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${formId}.png`
}

/**
 * Gets form-specific Pokemon ID
 */
function getFormId(formName: string, baseId: number): number {
  // Mega Evolution IDs
  const megaIds: Record<string, number> = {
    'venusaur-mega': 10004,
    'charizard-mega-x': 10044,
    'charizard-mega-y': 10045,
    'blastoise-mega': 10034,
    'beedrill-mega': 10015,
    'pidgeot-mega': 10025,
    'alakazam-mega': 10019,
    'slowbro-mega': 10031,
    'gengar-mega': 10038,
    'kangaskhan-mega': 10020,
    'pinsir-mega': 10035,
    'gyarados-mega': 10041,
    'aerodactyl-mega': 10014,
    'mewtwo-mega-x': 10043,
    'mewtwo-mega-y': 10042,
    'ampharos-mega': 10010,
    'scizor-mega': 10039,
    'heracross-mega': 10021,
    'houndoom-mega': 10022,
    'tyranitar-mega': 10049,
    'sceptile-mega': 10047,
    'blaziken-mega': 10046,
    'swampert-mega': 10048,
    'gardevoir-mega': 10032,
    'sableye-mega': 10033,
    'mawile-mega': 10030,
    'aggron-mega': 10027,
    'medicham-mega': 10028,
    'latias-mega': 10036,
    'latios-mega': 10037,
    'rayquaza-mega': 10040,
    'glalie-mega': 10023,
    'salamence-mega': 10050,
    'metagross-mega': 10051,
    'lopunny-mega': 10029,
    'garchomp-mega': 10052,
    'lucario-mega': 10026,
    'abomasnow-mega': 10013,
    'gallade-mega': 10024,
    'audino-mega': 10017,
    'diancie-mega': 10018
  }
  
  // Gigantamax IDs (simplified - using base ID + 1000)
  const gmaxIds: Record<string, number> = {
    'venusaur-gmax': baseId + 1000,
    'charizard-gmax': baseId + 1001,
    'blastoise-gmax': baseId + 1002,
    'butterfree-gmax': baseId + 1003,
    'pikachu-gmax': baseId + 1004,
    'meowth-gmax': baseId + 1005,
    'machamp-gmax': baseId + 1006,
    'gengar-gmax': baseId + 1007,
    'kingler-gmax': baseId + 1008,
    'lapras-gmax': baseId + 1009,
    'eevee-gmax': baseId + 1010,
    'snorlax-gmax': baseId + 1011,
    'garbodor-gmax': baseId + 1012,
    'melmetal-gmax': baseId + 1013,
    'corviknight-gmax': baseId + 1014,
    'orbeetle-gmax': baseId + 1015,
    'duraludon-gmax': baseId + 1016,
    'coalossal-gmax': baseId + 1017,
    'flapple-gmax': baseId + 1018,
    'appletun-gmax': baseId + 1019,
    'sandaconda-gmax': baseId + 1020,
    'toxtricity-gmax': baseId + 1021,
    'centiskorch-gmax': baseId + 1022,
    'hatterene-gmax': baseId + 1023,
    'grimmsnarl-gmax': baseId + 1024,
    'alcremie-gmax': baseId + 1025,
    'copperajah-gmax': baseId + 1026,
    'drednaw-gmax': baseId + 1027,
    'urshifu-gmax': baseId + 1028,
    'rillaboom-gmax': baseId + 1029,
    'cinderace-gmax': baseId + 1030,
    'inteleon-gmax': baseId + 1031,
    'seismitoad-gmax': baseId + 1032,
    'dracovish-gmax': baseId + 1033,
    'arctozolt-gmax': baseId + 1034,
    'dracozolt-gmax': baseId + 1035,
    'arctovish-gmax': baseId + 1036
  }
  
  // Other form IDs
  const otherFormIds: Record<string, number> = {
    'deoxys-attack': 10001,
    'deoxys-defense': 10002,
    'deoxys-speed': 10003,
    'giratina-origin': 10006,
    'shaymin-sky': 10007,
    'rotom-heat': 10008,
    'rotom-wash': 10009,
    'rotom-frost': 10010,
    'rotom-fan': 10011,
    'rotom-mow': 10012,
    'castform-sunny': 10013,
    'castform-rainy': 10014,
    'castform-snowy': 10015,
    'kyurem-black': 10016,
    'kyurem-white': 10017,
    'kyogre-primal': 10018,
    'groudon-primal': 10019
  }
  
  // Check all mappings
  return megaIds[formName] || gmaxIds[formName] || otherFormIds[formName] || baseId
}
