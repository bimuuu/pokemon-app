export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const;

export const TYPE_COLORS = {
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
} as const;

export const TYPE_EFFECTIVENESS = {
  normal: { 
    attacking: { rock: 0.5, ghost: 0, steel: 1, fighting: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, dragon: 1, dark: 1, fairy: 1 },
    defending: { fighting: 2, ghost: 0 }
  },
  fire: { 
    attacking: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2, normal: 1, electric: 1, poison: 1, ground: 1, flying: 1, psychic: 1, fighting: 1, dark: 1, fairy: 1 },
    defending: { fire: 0.5, water: 2, grass: 0.5, ice: 0.5, bug: 0.5, rock: 2, dragon: 1, steel: 0.5, normal: 1, electric: 1, poison: 1, ground: 1, flying: 1, psychic: 1, fighting: 1, dark: 1, fairy: 0.5 }
  },
  water: { 
    attacking: { fire: 2, water: 0.5, grass: 0.5, electric: 0.5, ice: 0.5, ground: 2, rock: 2, dragon: 0.5, normal: 1, poison: 1, flying: 1, psychic: 1, bug: 1, fighting: 1, steel: 1, dark: 1, fairy: 1 },
    defending: { fire: 0.5, water: 0.5, grass: 2, electric: 2, ice: 0.5, ground: 1, rock: 1, dragon: 1, normal: 1, poison: 1, flying: 1, psychic: 1, bug: 1, fighting: 1, steel: 1, dark: 1, fairy: 1 }
  },
  electric: { 
    attacking: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5, normal: 1, fire: 1, ice: 1, poison: 1, rock: 1, psychic: 1, bug: 1, fighting: 1, steel: 1, dark: 1, fairy: 1 },
    defending: { water: 1, electric: 0.5, grass: 1, ground: 2, flying: 0.5, dragon: 1, normal: 1, fire: 1, ice: 1, poison: 1, rock: 1, psychic: 1, bug: 1, fighting: 1, steel: 1, dark: 1, fairy: 1 }
  },
  grass: { 
    attacking: { fire: 0.5, water: 2, grass: 0.5, electric: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5, normal: 1, ice: 1, psychic: 1, fighting: 1, dark: 1, fairy: 1 },
    defending: { fire: 2, water: 0.5, grass: 0.5, electric: 0.5, poison: 2, ground: 0.5, flying: 2, bug: 2, rock: 1, dragon: 1, steel: 0.5, normal: 1, ice: 1, psychic: 1, fighting: 1, dark: 1, fairy: 1 }
  },
  ice: { 
    attacking: { fire: 0.5, water: 0.5, grass: 2, electric: 0.5, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5, normal: 1, poison: 1, rock: 1, psychic: 1, bug: 1, fighting: 1, dark: 1, fairy: 1 },
    defending: { fire: 2, water: 0.5, grass: 2, electric: 1, ice: 0.5, ground: 1, flying: 1, dragon: 1, steel: 2, normal: 1, poison: 1, rock: 1, psychic: 1, bug: 1, fighting: 1, dark: 1, fairy: 1 }
  },
  fighting: { 
    attacking: { normal: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5 },
    defending: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, poison: 0.5, ground: 1, flying: 2, psychic: 2, bug: 0.5, rock: 0.5, ghost: 1, dragon: 1, dark: 0.5, steel: 1, fairy: 2 }
  },
  poison: { 
    attacking: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 1, steel: 0, fairy: 2, normal: 1, fire: 1, water: 1, electric: 1, ice: 1, fighting: 1, flying: 1, psychic: 1, bug: 1, dragon: 1, dark: 1 },
    defending: { grass: 0.5, poison: 0.5, ground: 2, rock: 0.5, ghost: 1, steel: 1, fairy: 0.5, normal: 1, fire: 1, water: 1, electric: 1, ice: 1, fighting: 0.5, flying: 1, psychic: 1, bug: 0.5, dragon: 1, dark: 1 }
  },
  ground: { 
    attacking: { fire: 2, water: 1, grass: 0.5, electric: 2, poison: 2, ground: 1, flying: 0, rock: 2, bug: 1, steel: 2, normal: 1, ice: 1, fighting: 1, psychic: 1, dragon: 1, dark: 1, fairy: 1 },
    defending: { fire: 1, water: 2, grass: 2, electric: 0, poison: 0.5, ground: 1, flying: 1, rock: 0.5, bug: 1, steel: 1, normal: 1, ice: 1, fighting: 1, psychic: 1, dragon: 1, dark: 1, fairy: 1 }
  },
  flying: { 
    attacking: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5, normal: 1, fire: 1, water: 1, poison: 1, ground: 1, psychic: 1, dragon: 1, dark: 1, fairy: 1, ice: 1, ghost: 1 },
    defending: { electric: 2, grass: 1, fighting: 0.5, bug: 0.5, rock: 2, steel: 1, normal: 1, fire: 1, water: 1, poison: 1, ground: 1, psychic: 1, dragon: 1, dark: 1, fairy: 1, ice: 2, ghost: 1 }
  },
  psychic: { 
    attacking: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5, normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, ground: 1, flying: 1, bug: 1, rock: 1, dragon: 1, fairy: 1 },
    defending: { fighting: 0.5, poison: 1, psychic: 0.5, dark: 2, steel: 0.5, normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, ground: 1, flying: 1, bug: 2, rock: 1, dragon: 1, fairy: 1 }
  },
  bug: { 
    attacking: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, psychic: 2, dark: 2, steel: 0.5, fairy: 0.5, normal: 1, water: 1, electric: 1, ice: 1, ground: 1, flying: 0.5, rock: 1, ghost: 0.5, dragon: 1 },
    defending: { fire: 2, grass: 1, fighting: 0.5, poison: 0.5, psychic: 1, dark: 1, steel: 0.5, fairy: 1, normal: 1, water: 1, electric: 1, ice: 1, ground: 1, flying: 2, rock: 1, ghost: 1, dragon: 1 }
  },
  rock: { 
    attacking: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5, normal: 1, water: 1, electric: 1, grass: 1, poison: 1, psychic: 1, ghost: 1, dragon: 1, dark: 1, fairy: 1 },
    defending: { fire: 0.5, ice: 2, fighting: 2, ground: 0.5, flying: 0.5, bug: 2, steel: 2, normal: 1, water: 2, electric: 1, grass: 2, poison: 1, psychic: 1, ghost: 1, dragon: 1, dark: 1, fairy: 1 }
  },
  ghost: { 
    attacking: { normal: 0, psychic: 2, ghost: 2, dark: 0.5, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, poison: 1, ground: 1, flying: 1, bug: 1, rock: 1, dragon: 1, steel: 1, fairy: 1 },
    defending: { normal: 0, psychic: 1, ghost: 2, dark: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, poison: 1, ground: 1, flying: 1, bug: 1, rock: 1, dragon: 1, steel: 1, fairy: 1 }
  },
  dragon: { 
    attacking: { dragon: 2, steel: 0.5, fairy: 0, normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dark: 1 },
    defending: { dragon: 2, steel: 1, fairy: 2, normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dark: 1 }
  },
  dark: { 
    attacking: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5, normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, poison: 1, ground: 1, flying: 1, rock: 1, dragon: 1, steel: 1 },
    defending: { fighting: 2, psychic: 0, ghost: 0.5, dark: 0.5, fairy: 2, normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, poison: 1, ground: 1, flying: 1, rock: 1, dragon: 1, steel: 1 }
  },
  steel: { 
    attacking: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, fairy: 2, normal: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, fighting: 1, dragon: 1, dark: 1, ghost: 1, grass: 1 },
    defending: { fire: 2, water: 0.5, electric: 1, ice: 0.5, rock: 0.5, fairy: 0.5, normal: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, fighting: 1, dragon: 1, dark: 1, ghost: 1, grass: 1 }
  },
  fairy: { 
    attacking: { poison: 0.5, steel: 0.5, fire: 0.5, fighting: 2, dragon: 2, dark: 1, normal: 1, water: 1, electric: 1, grass: 1, ice: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1 },
    defending: { poison: 2, steel: 2, fire: 0.5, fighting: 0.5, dragon: 0, dark: 0.5, normal: 1, water: 1, electric: 1, grass: 1, ice: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1 }
  }
} as const;

export const RARITY_COLORS = {
  'Common': '#22c55e',
  'Uncommon': '#84cc16', 
  'Rare': '#eab308',
  'Ultra-Rare': '#f97316',
  'Legendary': '#ef4444'
} as const;

export const POKEMON_PER_PAGE = 24;

export const REGIONS = {
  kanto: 'Kanto',
  johto: 'Johto', 
  hoenn: 'Hoenn',
  sinnoh: 'Sinnoh'
} as const;
