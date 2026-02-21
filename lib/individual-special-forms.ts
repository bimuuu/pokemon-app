import { Pokemon } from '@/types/pokemon'
import { fetchPokemonForms, fetchFormDataByUrl } from './pokemon-api'

/**
 * Create individual Pokemon entries for each special form
 */
export async function createIndividualSpecialForms(pokemon: Pokemon[]): Promise<Pokemon[]> {
  const result: Pokemon[] = []
  
  for (const basePokemon of pokemon) {
    try {
      // Fetch forms for this Pokemon
      const forms = await fetchPokemonForms(basePokemon.id)
      
      // Filter for special forms only
      const specialForms = forms.filter(form => {
        const formName = form.name.toLowerCase()
        return formName.includes('mega') || 
               formName.includes('gmax') || 
               formName.includes('primal') || 
               formName.includes('origin') ||
               formName.includes('attack') ||
               formName.includes('defense') ||
               formName.includes('speed') ||
               formName.includes('sky') ||
               formName.includes('heat') ||
               formName.includes('wash') ||
               formName.includes('frost') ||
               formName.includes('fan') ||
               formName.includes('mow') ||
               formName.includes('black') ||
               formName.includes('white') ||
               formName.includes('complete') ||
               formName.includes('therian') ||
               formName.includes('incarnate')
      })
      
      if (specialForms.length > 0) {
        // Load detailed form data for each special form
        for (const form of specialForms) {
          try {
            const formData = await fetchFormDataByUrl(form.url)
            if (formData) {
              // Create a new Pokemon entry for this special form
              const specialFormPokemon: Pokemon = {
                ...basePokemon,
                name: form.name,
                sprites: formData.sprites || basePokemon.sprites,
                types: formData.types || basePokemon.types,
                // Add form-specific data as custom properties
                form_name: form.name,
                form_data: formData
              } as Pokemon
              
              result.push(specialFormPokemon)
            }
          } catch (error) {
            console.warn(`Failed to fetch form data for ${form.name}:`, error)
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch forms for ${basePokemon.name}:`, error)
    }
  }
  
  return result
}

/**
 * Filter and create individual special forms from all Pokemon
 */
export async function getIndividualSpecialForms(pokemon: Pokemon[]): Promise<Pokemon[]> {
  // First, filter Pokemon that might have special forms
  const potentialSpecialFormPokemon = pokemon.filter(p => {
    const pokemonName = p.name.toLowerCase()
    const baseName = pokemonName.split('-')[0]
    
    // Known Pokemon with special forms (simplified list for performance)
    const knownSpecialFormPokemon = [
      'venusaur', 'charizard', 'blastoise', 'beedrill', 'pidgeot', 'alakazam',
      'slowbro', 'gengar', 'kangaskhan', 'pinsir', 'gyarados', 'aerodactyl',
      'mewtwo', 'ampharos', 'steelix', 'scizor', 'heracross', 'houndoom',
      'tyranitar', 'sceptile', 'blaziken', 'swampert', 'gardevoir', 'sableye',
      'mawile', 'aggron', 'medicham', 'latias', 'latios', 'rayquaza', 'glalie',
      'salamence', 'metagross', 'lopunny', 'garchomp', 'lucario', 'abomasnow',
      'gallade', 'audino', 'diancie', 'kyogre', 'groudon', 'deoxys', 'giratina',
      'shaymin', 'rotom', 'castform', 'kyurem', 'necrozma', 'tornadus', 'thundurus',
      'landorus', 'enamorus', 'calyrex', 'arceus'
    ]
    
    return knownSpecialFormPokemon.includes(pokemonName) || 
           knownSpecialFormPokemon.includes(baseName) ||
           pokemonName.includes('mega') ||
           pokemonName.includes('gmax') ||
           pokemonName.includes('primal')
  })
  
  // Create individual special forms
  return await createIndividualSpecialForms(potentialSpecialFormPokemon)
}

/**
 * Get form type display information
 */
export function getFormTypeDisplay(formName: string): { text: string; className: string } {
  const name = formName.toLowerCase()
  
  if (name.includes('mega-x')) return { text: 'Mega X', className: 'bg-orange-100 text-orange-700' }
  if (name.includes('mega-y')) return { text: 'Mega Y', className: 'bg-orange-100 text-orange-700' }
  if (name.includes('mega')) return { text: 'Mega', className: 'bg-orange-100 text-orange-700' }
  if (name.includes('gmax')) return { text: 'G-Max', className: 'bg-blue-100 text-blue-700' }
  if (name.includes('primal')) return { text: 'Primal', className: 'bg-red-100 text-red-700' }
  if (name.includes('origin')) return { text: 'Origin', className: 'bg-purple-100 text-purple-700' }
  if (name.includes('therian')) return { text: 'Therian', className: 'bg-indigo-100 text-indigo-700' }
  if (name.includes('incarnate')) return { text: 'Incarnate', className: 'bg-purple-100 text-purple-700' }
  if (name.includes('attack')) return { text: 'Attack', className: 'bg-red-100 text-red-700' }
  if (name.includes('defense')) return { text: 'Defense', className: 'bg-blue-100 text-blue-700' }
  if (name.includes('speed')) return { text: 'Speed', className: 'bg-yellow-100 text-yellow-700' }
  if (name.includes('sky')) return { text: 'Sky', className: 'bg-blue-100 text-blue-700' }
  if (name.includes('heat')) return { text: 'Heat', className: 'bg-red-100 text-red-700' }
  if (name.includes('wash')) return { text: 'Wash', className: 'bg-blue-100 text-blue-700' }
  if (name.includes('frost')) return { text: 'Frost', className: 'bg-cyan-100 text-cyan-700' }
  if (name.includes('fan')) return { text: 'Fan', className: 'bg-green-100 text-green-700' }
  if (name.includes('mow')) return { text: 'Mow', className: 'bg-green-100 text-green-700' }
  if (name.includes('black')) return { text: 'Black', className: 'bg-gray-100 text-gray-700' }
  if (name.includes('white')) return { text: 'White', className: 'bg-gray-100 text-gray-700' }
  if (name.includes('complete')) return { text: 'Complete', className: 'bg-yellow-100 text-yellow-700' }
  if (name.includes('dawn')) return { text: 'Dawn', className: 'bg-pink-100 text-pink-700' }
  if (name.includes('dusk')) return { text: 'Dusk', className: 'bg-purple-100 text-purple-700' }
  if (name.includes('midday')) return { text: 'Midday', className: 'bg-yellow-100 text-yellow-700' }
  if (name.includes('midnight')) return { text: 'Midnight', className: 'bg-purple-100 text-purple-700' }
  if (name.includes('school')) return { text: 'School', className: 'bg-blue-100 text-blue-700' }
  if (name.includes('solo')) return { text: 'Solo', className: 'bg-red-100 text-red-700' }
  if (name.includes('disguised')) return { text: 'Disguised', className: 'bg-purple-100 text-purple-700' }
  if (name.includes('busted')) return { text: 'Busted', className: 'bg-red-100 text-red-700' }
  if (name.includes('average')) return { text: 'Average', className: 'bg-gray-100 text-gray-700' }
  if (name.includes('small')) return { text: 'Small', className: 'bg-green-100 text-green-700' }
  if (name.includes('large')) return { text: 'Large', className: 'bg-red-100 text-red-700' }
  if (name.includes('super')) return { text: 'Super', className: 'bg-yellow-100 text-yellow-700' }
  
  return { text: 'Special', className: 'bg-purple-100 text-purple-700' }
}
