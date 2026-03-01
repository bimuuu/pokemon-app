export interface PokemonCategory {
  name: string
  description: string
  pokemon?: string[]
  subcategories?: {
    name: string
    description?: string
    pokemon: string[]
  }[]
}

export const pokemonCategories: Record<string, PokemonCategory> = {
  mythical: {
    name: 'Mythical Pokémon',
    description: 'Rare and mysterious Pokémon that are often difficult to obtain through normal gameplay',
    pokemon: [
      'Mew',
      'Celebi',
      'Jirachi',
      'Deoxys',
      'Manaphy',
      'Phione',
      'Darkrai',
      'Shaymin',
      'Arceus',
      'Victini',
      'Keldeo',
      'Meloetta',
      'Genesect',
      'Diancie',
      'Hoopa',
      'Volcanion',
      'Magearna',
      'Marshadow',
      'Zeraora',
      'Meltan',
      'Melmetal',
      'Zarude',
      'Pecharunt'
    ]
  },
  
  legendary: {
    name: 'Legendary Pokémon',
    description: 'Powerful and rare Pokémon that play significant roles in the Pokémon world lore',
    subcategories: [
      {
        name: 'Generation I',
        pokemon: ['Articuno', 'Zapdos', 'Moltres', 'Mewtwo']
      },
      {
        name: 'Generation II',
        pokemon: ['Raikou', 'Entei', 'Suicune', 'Lugia', 'Ho-Oh']
      },
      {
        name: 'Generation III',
        pokemon: ['Regirock', 'Regice', 'Registeel', 'Latios', 'Latias', 'Kyogre', 'Groudon', 'Rayquaza', 'Uxie', 'Mesprit', 'Azelf']
      },
      {
        name: 'Generation IV',
        pokemon: ['Dialga', 'Palkia', 'Giratina', 'Heatran', 'Regigigas', 'Cresselia', 'Cobalion', 'Terrakion', 'Virizion']
      },
      {
        name: 'Generation V',
        pokemon: ['Tornadus', 'Thundurus', 'Landorus', 'Reshiram', 'Zekrom', 'Kyurem']
      },
      {
        name: 'Generation VI',
        pokemon: ['Xerneas', 'Yveltal', 'Zygarde']
      },
      {
        name: 'Generation VII',
        pokemon: ['Type: Null', 'Silvally', 'Tapu Koko', 'Tapu Lele', 'Tapu Bulu', 'Tapu Fini', 'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma', 'Zacian', 'Zamazenta']
      },
      {
        name: 'Generation VIII',
        pokemon: ['Eternatus', 'Kubfu', 'Urshifu', 'Regieleki', 'Regidrago', 'Calyrex', 'Glastrier', 'Spectrier', 'Enamorus']
      },
      {
        name: 'Generation IX',
        pokemon: ['Wo-Chien', 'Chien-Pao', 'Ting-Lu', 'Chi-Yu', 'Koraidon', 'Miraidon', 'Okidogi', 'Munkidori', 'Fezandipiti', 'Ogerpon', 'Terapagos']
      },
      {
        name: 'Regional Forms',
        pokemon: ['Articuno', 'Zapdos', 'Moltres']
      }
    ]
  },
  
  pseudoLegendary: {
    name: 'Pseudo-Legendary Pokémon',
    description: 'Pokémon with a base stat total of 600 that have three-stage evolution lines',
    subcategories: [
      {
        name: 'Generation I',
        pokemon: ['Dratini', 'Dragonair', 'Dragonite']
      },
      {
        name: 'Generation II',
        pokemon: ['Larvitar', 'Pupitar', 'Tyranitar']
      },
      {
        name: 'Generation III',
        pokemon: ['Bagon', 'Shelgon', 'Salamence', 'Beldum', 'Metang', 'Metagross']
      },
      {
        name: 'Generation IV',
        pokemon: ['Gible', 'Gabite', 'Garchomp']
      },
      {
        name: 'Generation V',
        pokemon: ['Deino', 'Zweilous', 'Hydreigon']
      },
      {
        name: 'Generation VI',
        pokemon: ['Goomy', 'Sliggoo', 'Goodra']
      },
      {
        name: 'Generation VII',
        pokemon: ['Jangmo-o', 'Hakamo-o', 'Kommo-o']
      },
      {
        name: 'Generation VIII',
        pokemon: ['Dreepy', 'Drakloak', 'Dragapult', 'Hisuian Goomy', 'Hisuian Sliggoo', 'Hisuian Goodra']
      },
      {
        name: 'Generation IX',
        pokemon: ['Frigibax', 'Arctibax', 'Baxcalibur']
      }
    ]
  },
  
  firstPartner: {
    name: 'First Partner Pokémon',
    description: 'The starter Pokémon that trainers receive at the beginning of their journey',
    subcategories: [
      {
        name: 'Kanto',
        pokemon: ['Bulbasaur', 'Charmander', 'Squirtle']
      },
      {
        name: 'Johto',
        pokemon: ['Chikorita', 'Cyndaquil', 'Totodile']
      },
      {
        name: 'Hoenn',
        pokemon: ['Treecko', 'Torchic', 'Mudkip']
      },
      {
        name: 'Sinnoh',
        pokemon: ['Turtwig', 'Chimchar', 'Piplup']
      },
      {
        name: 'Unova',
        pokemon: ['Snivy', 'Tepig', 'Oshawott']
      },
      {
        name: 'Kalos',
        pokemon: ['Chespin', 'Fennekin', 'Froakie']
      },
      {
        name: 'Alola',
        pokemon: ['Rowlet', 'Litten', 'Popplio']
      },
      {
        name: 'Galar',
        pokemon: ['Grookey', 'Scorbunny', 'Sobble']
      },
      {
        name: 'Paldea',
        pokemon: ['Sprigatito', 'Fuecoco', 'Quaxly']
      }
    ]
  },
  
  paradox: {
    name: 'Paradox Pokémon',
    description: 'Pokémon from different time periods brought to the present through mysterious phenomena',
    subcategories: [
      {
        name: 'Ancient Paradox Pokémon',
        description: 'Pokémon from the ancient past',
        pokemon: ['Great Tusk', 'Scream Tail', 'Brute Bonnet', 'Flutter Mane', 'Slither Wing', 'Sandy Shocks', 'Roaring Moon', 'Koraidon', 'Gouging Fire', 'Walking Wake', 'Raging Bolt']
      },
      {
        name: 'Future Paradox Pokémon',
        description: 'Pokémon from the distant future',
        pokemon: ['Iron Treads', 'Iron Bundle', 'Iron Hands', 'Iron Jugulis', 'Iron Moth', 'Iron Thorns', 'Iron Valiant', 'Miraidon', 'Iron Boulder', 'Iron Crown']
      }
    ]
  },
  
  fossil: {
    name: 'Fossil Pokémon',
    description: 'Ancient Pokémon revived from fossils found throughout the regions',
    subcategories: [
      {
        name: 'Generation I',
        pokemon: ['Omanyte', 'Omastar', 'Kabuto', 'Kabutops', 'Aerodactyl']
      },
      {
        name: 'Generation III',
        pokemon: ['Lileep', 'Cradily', 'Anorith', 'Armaldo']
      },
      {
        name: 'Generation IV',
        pokemon: ['Cranidos', 'Rampardos', 'Shieldon', 'Bastiodon']
      },
      {
        name: 'Generation V',
        pokemon: ['Tirtouga', 'Carracosta', 'Archen', 'Archeops']
      },
      {
        name: 'Generation VI',
        pokemon: ['Tyrunt', 'Tyrantrum', 'Amaura', 'Aurorus']
      },
      {
        name: 'Generation VIII',
        pokemon: ['Dracozolt', 'Arctozolt', 'Dracovish', 'Arctovish']
      }
    ]
  },
  
  ultraBeast: {
    name: 'Ultra Beast',
    description: 'Powerful creatures from Ultra Space that possess mysterious powers',
    subcategories: [
      {
        name: 'Generation VII',
        pokemon: ['Nihilego', 'Buzzwole', 'Pheromosa', 'Xurkitree', 'Celesteela', 'Kartana', 'Guzzlord', 'Blacephalon', 'Stakataka']
      },
      {
        name: 'Generation VIII',
        pokemon: ['Poipole', 'Naganadel']
      }
    ]
  }
}

export const getAllCategoryPokemon = (categoryKey: string): string[] => {
  const category = pokemonCategories[categoryKey]
  if (!category) return []
  
  if (category.subcategories) {
    return category.subcategories.flatMap(sub => sub.pokemon)
  }
  
  return category.pokemon || []
}

export const getCategoryByPokemon = (pokemonName: string): string[] => {
  const categories: string[] = []
  
  Object.entries(pokemonCategories).forEach(([key, category]) => {
    const allPokemon = category.subcategories 
      ? category.subcategories.flatMap(sub => sub.pokemon)
      : category.pokemon || []
    
    if (allPokemon.includes(pokemonName)) {
      categories.push(key)
    }
  })
  
  return categories
}
