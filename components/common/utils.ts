// Common utility functions for Pokemon data handling
import { Pokemon } from '@/types/pokemon'

export function formatPokemonId(id: number): string {
  return id.toString().padStart(3, '0')
}

export function getPokemonImageUrl(id: number, isAnimated = true): string {
  const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other'
  
  if (isAnimated) {
    return `${baseUrl}/animated/${id}.gif`
  }
  
  return `${baseUrl}/official-artwork/${id}.png`
}

export function getMiniPokemonImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

export function calculatePokemonLevel(pokemon: Pokemon): number {
  // This is a placeholder - in a real app, you might calculate this from experience
  return Math.floor(Math.random() * 100) + 1
}

export function getPokemonDescription(pokemon: Pokemon): string {
  // This would typically come from the Pokemon species data
  // For now, return a formatted description based on types
  const types = pokemon.types.map(t => t.type.name).join(' and ')
  return `A ${types} type Pokémon with various abilities.`
}

export function isPokemonLegendary(pokemon: Pokemon): boolean {
  const legendaryIds = [
    144, 145, 146, 150, // Mewtwo, Mew
    243, 244, 245, // Raikou, Entei, Suicune
    249, 250, 251, // Lugia, Ho-Oh
    377, 378, 379, // Regirock, Regice, Registeel
    380, 381, 382, 383, 384, 385, 386, // Latias, Latios, Kyogre, Groudon, Rayquaza, Jirachi
    480, 481, 482, 483, 484, 485, 486, 487, // Uxie, Mesprit, Azelf, Dialga, Palkia, Heatran
    488, 489, 490, 491, 492, 493, 494, // Regigigas, Giratina, Cresselia, Phione, Manaphy
    495, 496, 497, 498, // Darkrai, Shaymin, Arceus
    638, 639, 640, 641, 642, 643, 644, 645, // Cobalion, Terrakion, Virizion, Tornadus, Thundurus, Landorus
    646, 647, 648, 649, // Reshiram, Zekrom, Kyurem
    716, 717, 718, 719, 720, 721, // Xerneas, Yveltal, Zygarde
    785, 786, 787, 788, 789, 790, 791, 792, // Diancie, Hoopa, Volcanion
    800, 801, 802, // Magearna
    888, 889, 890, 891, // Zacian, Zamazenta, Eternatus
    895, 896, 897, 898, // Dusk Mane, Dawn Wings, Ultra Necrozma
    999, // Magearna
  1000, 1001, 1002, // Glastrier, Spectrier, Calyrex
  1008, 1009, 1010, // Miraidon, Koraidon
  1025, // Pecharunt
  1017, // Stakataka
    1018, // Blacephalon
    1019, // Iron Moth
    1020, // Iron Hands
    1021, // Iron Jugulis
    1022, // Iron Thorns
    1023, // Iron Boulder
    1024, // Iron Crown
  1014, // Great Tusk
    1015, // Iron Treads
    1016, // Iron Bundle
    1013, // Iron Valiant
    991, // Iron Leaves
    992, // Iron Hands
    993, // Iron Head
    994, // Iron Jugulis
    995, // Iron Moth
    996, // Iron Boulder
    997, // Iron Crown
    998, // Iron Valiant
    990, // Gouging Fire
    991, // Wo-Chien
    1004, // Ting-Lu
    1005, // Chien-Pao
    1006, // Yu-Pa
    1007, // Chi-Yu
    905, // Enamorus
    896, // Glastrier
    897, // Spectrier
    898, // Calyrex
  894, // Regieleki
    895, // Regidrago
    893, // Regirock
  892, // Registeel
  891, // Regice
  880, // Duraludon
    881, // Arboliva
    882, // Munkidori
    883, // Okidogi
    884, // Fezandipiti
    885, // Ogerpon
    886, // Archaludon
    887, // Raging Bolt
    888, // Iron Hands
    889, // Iron Jugulis
    979, // Ogerpon-Cornerstone
    980, // Ogerpon-Hearthflame
    981, // Ogerpon-Wellspring
    982, // Ogerpon-Cornerstone
    983, // Ogerpon-Hearthflame
    984, // Ogerpon-Wellspring
    985, // Ogerpon-Cornerstone
    986, // Ogerpon-Hearthflame
    987, // Ogerpon-Wellspring
    988, // Ogerpon-Cornerstone
    989, // Ogerpon-Hearthflame
    990, // Ogerpon-Wellspring
  991, // Ogerpon-Cornerstone
    992, // Ogerpon-Hearthflame
    993, // Ogerpon-Wellspring
    994, // Ogerpon-Cornerstone
    995, // Ogerpon-Hearthflame
    996, // Ogerpon-Wellspring
    997, // Ogerpon-Cornerstone
    998, // Ogerpon-Hearthflame
    999, // Ogerpon-Wellspring
  ]
  
  return legendaryIds.includes(pokemon.id)
}

export function getPokemonColor(pokemon: Pokemon): string {
  const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  }
  
  const primaryType = pokemon.types[0]?.type.name.toLowerCase()
  return typeColors[primaryType] || '#68A090'
}

export function sortPokemonBy<T>(pokemon: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...pokemon].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function filterPokemonBy<T>(pokemon: T[], filters: Partial<Record<string, any>>): T[] {
  return pokemon.filter(p => {
    return Object.entries(filters).every(([filterKey, filterValue]) => {
      if (!filterValue) return true
      
      const pokemonValue = (p as any)[filterKey]
      if (typeof pokemonValue === 'string') {
        return pokemonValue.toLowerCase().includes(filterValue.toLowerCase())
      }
      
      if (Array.isArray(pokemonValue)) {
        return pokemonValue.some(item => 
          typeof item === 'object' 
            ? item.type?.name?.toLowerCase().includes(filterValue.toLowerCase())
            : item.toString().toLowerCase().includes(filterValue.toLowerCase())
        )
      }
      
      return pokemonValue === filterValue
    })
  })
}
