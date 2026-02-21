export interface CobblemonPokemon {
  "N.": string;
  POKÉMON: string;
  SOURCE: string;
  SPAWN: string;
  RARITY: string;
  CONDITION: string;
  FORMS: string;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
}

export interface PokemonSprite {
  front_default: string;
  front_shiny: string;
  back_default: string;
  back_shiny: string;
}

export interface Pokemon {
  id: number;
  name: string;
  order: number;
  height: number;
  weight: number;
  base_experience: number;
  is_default: boolean;
  location_area_encounters: string;
  sprites: PokemonSprite;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  types: PokemonType[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  species: {
    name: string;
    url: string;
  };
  // Optional form-specific data for special forms
  form_name?: string;
  form_data?: PokemonFormData;
}

export interface EvolutionChain {
  id: number;
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: Array<{
      species: {
        name: string;
        url: string;
      };
      evolution_details: Array<{
        min_level: number | null;
        item: {
          name: string;
          url: string;
        } | null;
        trigger: {
          name: string;
          url: string;
        };
      }>;
      evolves_to: any[];
    }>;
  };
}

export interface TeamPokemon {
  id: number;
  name: string;
  level: number;
  moves: string[];
  ability: string;
  item?: string;
  nature: string;
  ivs: PokemonStats;
  evs: Partial<PokemonStats>;
  species: string;
}

export interface Trainer {
  name: {
    literal: string;
  };
  ai: {
    type: string;
    data: any;
  };
  battleRules: any;
  bag: Array<{
    item: string;
    quantity: number;
  }>;
  team: TeamPokemon[];
  battleFormat: string;
}

export interface TypeEffectiveness {
  attacking: Record<string, number>;
  defending: Record<string, number>;
}

export interface TeamRecommendation {
  text: string;
  types?: string[];
}

export interface TypeStrength {
  type: string;
  multiplier: number;
}

export interface TypeWeakness {
  type: string;
  multiplier: number;
  count: number;
}

export interface TeamAnalysis {
  strengths: TypeStrength[];
  weaknesses: TypeWeakness[];
  coverage: string[];
  recommendations: (string | TeamRecommendation)[];
}

export interface PokemonForm {
  name: string;
  url: string;
}

export interface PokemonFormData {
  id: number;
  name: string;
  form_name: string;
  form_names: Array<{
    language: {
      name: string;
      url: string;
    };
    name: string;
  }>;
  order: number;
  form_order: number;
  is_default: boolean;
  is_battle_only: boolean;
  is_mega: boolean;
  is_primal: boolean;
  pokemon: {
    name: string;
    url: string;
  };
  sprites: {
    front_default: string;
    front_female: string | null;
    front_shiny: string;
    front_shiny_female: string | null;
    back_default: string;
    back_female: string | null;
    back_shiny: string;
    back_shiny_female: string | null;
  };
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
}

export interface PokemonWithForms extends Pokemon {
  forms: PokemonForm[];
  selected_form?: PokemonForm;
  forms_data?: Record<string, PokemonFormData>;
}

export interface FormTransformationCondition {
  type: 'item' | 'ability' | 'weather' | 'time' | 'location' | 'move' | 'trade' | 'friendship' | 'none' | 'nature' | 'gender' | 'random' | 'size' | 'evolution' | 'mega' | 'battle' | 'gmax';
  trigger: string;
  description: string;
  item?: string;
  ability?: string;
  location?: string;
}
