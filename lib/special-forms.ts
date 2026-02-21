import { Pokemon } from '@/types/pokemon'

/**
 * Check if Pokemon has special forms
 */
export function hasSpecialForms(pokemon: Pokemon): boolean {
  // This is a placeholder implementation
  // In a real app, this would check if the Pokemon has mega, gmax, or other special forms
  const specialFormPokemon = [
    'charizard', 'mewtwo', 'blastoise', 'venusaur', 'alakazam', 'gengar',
    'kangaskhan', 'pinsir', 'gyarados', 'aerodactyl', 'lucario', 'abomasnow',
    'groudon', 'kyogre', 'rayquaza', 'diancie', 'sceptile', 'blaziken',
    'swampert', 'sableye', 'sharpedo', 'camerupt', 'altaria', 'tyranitar',
    'aggron', 'medicham', 'gardevoir', 'gallade', 'audino', 'slowbro',
    'steelix', 'glalie', 'salamence', 'metagross', 'latias', 'latios'
  ]
  
  return specialFormPokemon.includes(pokemon.name.toLowerCase())
}

/**
 * Filter Pokemon that have special forms
 */
export function filterSpecialFormsPokemon(pokemon: Pokemon[]): Pokemon[] {
  return pokemon.filter(hasSpecialForms)
}
