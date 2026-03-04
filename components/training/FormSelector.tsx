'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pokemon, PokemonForm, PokemonFormData, FormTransformationCondition } from '@/types/pokemon'
import { FormTransformationService } from '@/services/form-transformation-service'
import { formatPokemonName } from '@/lib/utils'
import { 
  Settings,
  Sparkles,
  Zap,
  Shield,
  Sword,
  Heart,
  Star,
  ChevronRight
} from 'lucide-react'

interface FormSelectorProps {
  pokemon: Pokemon
  selectedForm?: string
  onFormSelect: (formName: string, formData?: PokemonFormData) => void
  onFormChange?: () => void // Add callback for form change
  className?: string
}

export function FormSelector({ 
  pokemon, 
  selectedForm, 
  onFormSelect,
  onFormChange,
  className = ''
}: FormSelectorProps) {
  const [availableForms, setAvailableForms] = useState<PokemonForm[]>([])
  const [formsData, setFormsData] = useState<Record<string, PokemonFormData>>({})
  const [transformationConditions, setTransformationConditions] = useState<Record<string, FormTransformationCondition[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFormsData()
  }, [pokemon])

  const loadFormsData = async () => {
    setIsLoading(true)
    try {
      // Get base Pokemon name
      const baseName = pokemon.name.split('-')[0]
      
      // Define special forms for popular Pokemon
      const specialForms: Record<string, PokemonForm[]> = {
        // Kanto Starters - Mega Evolutions
        'charizard': [
          { name: 'charizard', url: `https://pokeapi.co/api/v2/pokemon/charizard` },
          { name: 'charizard-mega-x', url: `https://pokeapi.co/api/v2/pokemon/charizard-mega-x` },
          { name: 'charizard-mega-y', url: `https://pokeapi.co/api/v2/pokemon/charizard-mega-y` },
          { name: 'charizard-gmax', url: `https://pokeapi.co/api/v2/pokemon/charizard-gmax` }
        ],
        'venusaur': [
          { name: 'venusaur', url: `https://pokeapi.co/api/v2/pokemon/venusaur` },
          { name: 'venusaur-mega', url: `https://pokeapi.co/api/v2/pokemon/venusaur-mega` },
          { name: 'venusaur-gmax', url: `https://pokeapi.co/api/v2/pokemon/venusaur-gmax` }
        ],
        'blastoise': [
          { name: 'blastoise', url: `https://pokeapi.co/api/v2/pokemon/blastoise` },
          { name: 'blastoise-mega', url: `https://pokeapi.co/api/v2/pokemon/blastoise-mega` },
          { name: 'blastoise-gmax', url: `https://pokeapi.co/api/v2/pokemon/blastoise-gmax` }
        ],
        
        // Johto Starters - Mega Evolutions
        'typhlosion': [
          { name: 'typhlosion', url: `https://pokeapi.co/api/v2/pokemon/typhlosion` },
          { name: 'typhlosion-hisui', url: `https://pokeapi.co/api/v2/pokemon/typhlosion-hisui` },
          { name: 'typhlosion-gmax', url: `https://pokeapi.co/api/v2/pokemon/typhlosion-gmax` }
        ],
        
        // Hoenn Starters - Mega Evolutions
        'blaziken': [
          { name: 'blaziken', url: `https://pokeapi.co/api/v2/pokemon/blaziken` },
          { name: 'blaziken-mega', url: `https://pokeapi.co/api/v2/pokemon/blaziken-mega` },
          { name: 'blaziken-gmax', url: `https://pokeapi.co/api/v2/pokemon/blaziken-gmax` }
        ],
        'sceptile': [
          { name: 'sceptile', url: `https://pokeapi.co/api/v2/pokemon/sceptile` },
          { name: 'sceptile-mega', url: `https://pokeapi.co/api/v2/pokemon/sceptile-mega` },
          { name: 'sceptile-gmax', url: `https://pokeapi.co/api/v2/pokemon/sceptile-gmax` }
        ],
        'swampert': [
          { name: 'swampert', url: `https://pokeapi.co/api/v2/pokemon/swampert` },
          { name: 'swampert-mega', url: `https://pokeapi.co/api/v2/pokemon/swampert-mega` },
          { name: 'swampert-gmax', url: `https://pokeapi.co/api/v2/pokemon/swampert-gmax` }
        ],
        
        // Legendary Pokemon with Multiple Forms
        'mewtwo': [
          { name: 'mewtwo', url: `https://pokeapi.co/api/v2/pokemon/mewtwo` },
          { name: 'mewtwo-mega-x', url: `https://pokeapi.co/api/v2/pokemon/mewtwo-mega-x` },
          { name: 'mewtwo-mega-y', url: `https://pokeapi.co/api/v2/pokemon/mewtwo-mega-y` },
          { name: 'mewtwo-gmax', url: `https://pokeapi.co/api/v2/pokemon/mewtwo-gmax` }
        ],
        'rayquaza': [
          { name: 'rayquaza', url: `https://pokeapi.co/api/v2/pokemon/rayquaza` },
          { name: 'rayquaza-mega', url: `https://pokeapi.co/api/v2/pokemon/rayquaza-mega` }
        ],
        'kyogre': [
          { name: 'kyogre', url: `https://pokeapi.co/api/v2/pokemon/kyogre` },
          { name: 'kyogre-primal', url: `https://pokeapi.co/api/v2/pokemon/kyogre-primal` }
        ],
        'groudon': [
          { name: 'groudon', url: `https://pokeapi.co/api/v2/pokemon/groudon` },
          { name: 'groudon-primal', url: `https://pokeapi.co/api/v2/pokemon/groudon-primal` }
        ],
        'dialga': [
          { name: 'dialga', url: `https://pokeapi.co/api/v2/pokemon/dialga` },
          { name: 'dialga-origin', url: `https://pokeapi.co/api/v2/pokemon/dialga-origin` }
        ],
        'palkia': [
          { name: 'palkia', url: `https://pokeapi.co/api/v2/pokemon/palkia` },
          { name: 'palkia-origin', url: `https://pokeapi.co/api/v2/pokemon/palkia-origin` }
        ],
        'giratina': [
          { name: 'giratina', url: `https://pokeapi.co/api/v2/pokemon/giratina` },
          { name: 'giratina-origin', url: `https://pokeapi.co/api/v2/pokemon/giratina-origin` }
        ],
        'zygarde': [
          { name: 'zygarde', url: `https://pokeapi.co/api/v2/pokemon/zygarde` },
          { name: 'zygarde-10', url: `https://pokeapi.co/api/v2/pokemon/zygarde-10` },
          { name: 'zygarde-complete', url: `https://pokeapi.co/api/v2/pokemon/zygarde-complete` }
        ],
        'necrozma': [
          { name: 'necrozma', url: `https://pokeapi.co/api/v2/pokemon/necrozma` },
          { name: 'necrozma-dusk', url: `https://pokeapi.co/api/v2/pokemon/necrozma-dusk` },
          { name: 'necrozma-dawn', url: `https://pokeapi.co/api/v2/pokemon/necrozma-dawn` },
          { name: 'necrozma-ultra', url: `https://pokeapi.co/api/v2/pokemon/necrozma-ultra` }
        ],
        
        // Popular Pokemon with Mega Evolutions
        'alakazam': [
          { name: 'alakazam', url: `https://pokeapi.co/api/v2/pokemon/alakazam` },
          { name: 'alakazam-mega', url: `https://pokeapi.co/api/v2/pokemon/alakazam-mega` },
          { name: 'alakazam-gmax', url: `https://pokeapi.co/api/v2/pokemon/alakazam-gmax` }
        ],
        'gengar': [
          { name: 'gengar', url: `https://pokeapi.co/api/v2/pokemon/gengar` },
          { name: 'gengar-mega', url: `https://pokeapi.co/api/v2/pokemon/gengar-mega` },
          { name: 'gengar-gmax', url: `https://pokeapi.co/api/v2/pokemon/gengar-gmax` }
        ],
        'kangaskhan': [
          { name: 'kangaskhan', url: `https://pokeapi.co/api/v2/pokemon/kangaskhan` },
          { name: 'kangaskhan-mega', url: `https://pokeapi.co/api/v2/pokemon/kangaskhan-mega` },
          { name: 'kangaskhan-gmax', url: `https://pokeapi.co/api/v2/pokemon/kangaskhan-gmax` }
        ],
        'pinsir': [
          { name: 'pinsir', url: `https://pokeapi.co/api/v2/pokemon/pinsir` },
          { name: 'pinsir-mega', url: `https://pokeapi.co/api/v2/pokemon/pinsir-mega` },
          { name: 'pinsir-gmax', url: `https://pokeapi.co/api/v2/pokemon/pinsir-gmax` }
        ],
        'gyarados': [
          { name: 'gyarados', url: `https://pokeapi.co/api/v2/pokemon/gyarados` },
          { name: 'gyarados-mega', url: `https://pokeapi.co/api/v2/pokemon/gyarados-mega` },
          { name: 'gyarados-gmax', url: `https://pokeapi.co/api/v2/pokemon/gyarados-gmax` }
        ],
        'aerodactyl': [
          { name: 'aerodactyl', url: `https://pokeapi.co/api/v2/pokemon/aerodactyl` },
          { name: 'aerodactyl-mega', url: `https://pokeapi.co/api/v2/pokemon/aerodactyl-mega` },
          { name: 'aerodactyl-gmax', url: `https://pokeapi.co/api/v2/pokemon/aerodactyl-gmax` }
        ],
        'scizor': [
          { name: 'scizor', url: `https://pokeapi.co/api/v2/pokemon/scizor` },
          { name: 'scizor-mega', url: `https://pokeapi.co/api/v2/pokemon/scizor-mega` },
          { name: 'scizor-gmax', url: `https://pokeapi.co/api/v2/pokemon/scizor-gmax` }
        ],
        'heracross': [
          { name: 'heracross', url: `https://pokeapi.co/api/v2/pokemon/heracross` },
          { name: 'heracross-mega', url: `https://pokeapi.co/api/v2/pokemon/heracross-mega` },
          { name: 'heracross-gmax', url: `https://pokeapi.co/api/v2/pokemon/heracross-gmax` }
        ],
        'houndoom': [
          { name: 'houndoom', url: `https://pokeapi.co/api/v2/pokemon/houndoom` },
          { name: 'houndoom-mega', url: `https://pokeapi.co/api/v2/pokemon/houndoom-mega` },
          { name: 'houndoom-gmax', url: `https://pokeapi.co/api/v2/pokemon/houndoom-gmax` }
        ],
        'tyranitar': [
          { name: 'tyranitar', url: `https://pokeapi.co/api/v2/pokemon/tyranitar` },
          { name: 'tyranitar-mega', url: `https://pokeapi.co/api/v2/pokemon/tyranitar-mega` },
          { name: 'tyranitar-gmax', url: `https://pokeapi.co/api/v2/pokemon/tyranitar-gmax` }
        ],
        'salamence': [
          { name: 'salamence', url: `https://pokeapi.co/api/v2/pokemon/salamence` },
          { name: 'salamence-mega', url: `https://pokeapi.co/api/v2/pokemon/salamence-mega` },
          { name: 'salamence-gmax', url: `https://pokeapi.co/api/v2/pokemon/salamence-gmax` }
        ],
        'metagross': [
          { name: 'metagross', url: `https://pokeapi.co/api/v2/pokemon/metagross` },
          { name: 'metagross-mega', url: `https://pokeapi.co/api/v2/pokemon/metagross-mega` },
          { name: 'metagross-gmax', url: `https://pokeapi.co/api/v2/pokemon/metagross-gmax` }
        ],
        'latias': [
          { name: 'latias', url: `https://pokeapi.co/api/v2/pokemon/latias` },
          { name: 'latias-mega', url: `https://pokeapi.co/api/v2/pokemon/latias-mega` },
          { name: 'latias-gmax', url: `https://pokeapi.co/api/v2/pokemon/latias-gmax` }
        ],
        'latios': [
          { name: 'latios', url: `https://pokeapi.co/api/v2/pokemon/latios` },
          { name: 'latios-mega', url: `https://pokeapi.co/api/v2/pokemon/latios-mega` },
          { name: 'latios-gmax', url: `https://pokeapi.co/api/v2/pokemon/latios-gmax` }
        ],
        'lucario': [
          { name: 'lucario', url: `https://pokeapi.co/api/v2/pokemon/lucario` },
          { name: 'lucario-mega', url: `https://pokeapi.co/api/v2/pokemon/lucario-mega` },
          { name: 'lucario-gmax', url: `https://pokeapi.co/api/v2/pokemon/lucario-gmax` }
        ],
        'abomasnow': [
          { name: 'abomasnow', url: `https://pokeapi.co/api/v2/pokemon/abomasnow` },
          { name: 'abomasnow-mega', url: `https://pokeapi.co/api/v2/pokemon/abomasnow-mega` },
          { name: 'abomasnow-gmax', url: `https://pokeapi.co/api/v2/pokemon/abomasnow-gmax` }
        ],
        'gallade': [
          { name: 'gallade', url: `https://pokeapi.co/api/v2/pokemon/gallade` },
          { name: 'gallade-mega', url: `https://pokeapi.co/api/v2/pokemon/gallade-mega` },
          { name: 'gallade-gmax', url: `https://pokeapi.co/api/v2/pokemon/gallade-gmax` }
        ],
        'audino': [
          { name: 'audino', url: `https://pokeapi.co/api/v2/pokemon/audino` },
          { name: 'audino-mega', url: `https://pokeapi.co/api/v2/pokemon/audino-mega` },
          { name: 'audino-gmax', url: `https://pokeapi.co/api/v2/pokemon/audino-gmax` }
        ],
        'diancie': [
          { name: 'diancie', url: `https://pokeapi.co/api/v2/pokemon/diancie` },
          { name: 'diancie-mega', url: `https://pokeapi.co/api/v2/pokemon/diancie-mega` },
          { name: 'diancie-gmax', url: `https://pokeapi.co/api/v2/pokemon/diancie-gmax` }
        ],
        
        // Pokemon with Regional Variants
        'rattata': [
          { name: 'rattata', url: `https://pokeapi.co/api/v2/pokemon/rattata` },
          { name: 'rattata-alola', url: `https://pokeapi.co/api/v2/pokemon/rattata-alola` }
        ],
        'pikachu': [
          { name: 'pikachu', url: `https://pokeapi.co/api/v2/pokemon/pikachu` },
          { name: 'pikachu-alola', url: `https://pokeapi.co/api/v2/pokemon/pikachu-alola` },
          { name: 'pikachu-gmax', url: `https://pokeapi.co/api/v2/pokemon/pikachu-gmax` },
          { name: 'pikachu-original', url: `https://pokeapi.co/api/v2/pokemon/pikachu-original` },
          { name: 'pikachu-hoenn', url: `https://pokeapi.co/api/v2/pokemon/pikachu-hoenn` },
          { name: 'pikachu-sinnoh', url: `https://pokeapi.co/api/v2/pokemon/pikachu-sinnoh` },
          { name: 'pikachu-unova', url: `https://pokeapi.co/api/v2/pokemon/pikachu-unova` },
          { name: 'pikachu-kalos', url: `https://pokeapi.co/api/v2/pokemon/pikachu-kalos` }
        ],
        'eevee': [
          { name: 'eevee', url: `https://pokeapi.co/api/v2/pokemon/eevee` },
          { name: 'eevee-gmax', url: `https://pokeapi.co/api/v2/pokemon/eevee-gmax` }
        ],
        
        // Pokemon with Alternate Forms
        'deoxys': [
          { name: 'deoxys', url: `https://pokeapi.co/api/v2/pokemon/deoxys` },
          { name: 'deoxys-attack', url: `https://pokeapi.co/api/v2/pokemon/deoxys-attack` },
          { name: 'deoxys-defense', url: `https://pokeapi.co/api/v2/pokemon/deoxys-defense` },
          { name: 'deoxys-speed', url: `https://pokeapi.co/api/v2/pokemon/deoxys-speed` }
        ],
        'rotom': [
          { name: 'rotom', url: `https://pokeapi.co/api/v2/pokemon/rotom` },
          { name: 'rotom-heat', url: `https://pokeapi.co/api/v2/pokemon/rotom-heat` },
          { name: 'rotom-wash', url: `https://pokeapi.co/api/v2/pokemon/rotom-wash` },
          { name: 'rotom-frost', url: `https://pokeapi.co/api/v2/pokemon/rotom-frost` },
          { name: 'rotom-fan', url: `https://pokeapi.co/api/v2/pokemon/rotom-fan` },
          { name: 'rotom-mow', url: `https://pokeapi.co/api/v2/pokemon/rotom-mow` },
          { name: 'rotom-droid', url: `https://pokeapi.co/api/v2/pokemon/rotom-droid` }
        ],
        'castform': [
          { name: 'castform', url: `https://pokeapi.co/api/v2/pokemon/castform` },
          { name: 'castform-sunny', url: `https://pokeapi.co/api/v2/pokemon/castform-sunny` },
          { name: 'castform-rainy', url: `https://pokeapi.co/api/v2/pokemon/castform-rainy` },
          { name: 'castform-snowy', url: `https://pokeapi.co/api/v2/pokemon/castform-snowy` }
        ],
        'arceus': [
          { name: 'arceus', url: `https://pokeapi.co/api/v2/pokemon/arceus` }
        ],
      }
      
      // Use special forms if available, otherwise create base form
      let forms: PokemonForm[] = specialForms[baseName] || []
      
      if (forms.length === 0) {
        // Always include the base form
        forms = [
          { name: baseName, url: `https://pokeapi.co/api/v2/pokemon/${baseName}` }
        ]
      }
      
      setAvailableForms(forms)
      
      // Fetch detailed data for each form
      const formsDetails: Record<string, PokemonFormData> = {}
      for (const form of forms) {
        try {
          const formResponse = await fetch(form.url)
          if (formResponse.ok) {
            const formData = await formResponse.json()
            formsDetails[formData.name] = formData
          } else {
            // Skip forms that don't exist in API (like some Arceus forms)
            console.warn(`Form ${form.name} not found in API, skipping...`)
            
            // For Arceus forms that don't exist in API, create mock data
            if (form.name.startsWith('arceus-')) {
              const type = form.name.replace('arceus-', '')
              formsDetails[form.name] = {
                id: 493, // Arceus ID
                name: form.name,
                form_name: type,
                form_names: [{
                  language: { name: 'en', url: '' },
                  name: type.charAt(0).toUpperCase() + type.slice(1)
                }],
                order: 493,
                form_order: 1,
                is_default: false,
                is_battle_only: false,
                is_mega: false,
                is_primal: false,
                pokemon: {
                  name: 'arceus',
                  url: 'https://pokeapi.co/api/v2/pokemon/arceus'
                },
                sprites: {
                  front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/493.png`,
                  front_female: null,
                  front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/other/493.png`,
                  front_shiny_female: null,
                  back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/493.png`,
                  back_female: null,
                  back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/493.png`,
                  back_shiny_female: null
                },
                stats: [
                  { stat: { name: 'hp', url: '' }, base_stat: 120, effort: 0 },
                  { stat: { name: 'attack', url: '' }, base_stat: 120, effort: 0 },
                  { stat: { name: 'defense', url: '' }, base_stat: 120, effort: 0 },
                  { stat: { name: 'special-attack', url: '' }, base_stat: 120, effort: 0 },
                  { stat: { name: 'special-defense', url: '' }, base_stat: 120, effort: 0 },
                  { stat: { name: 'speed', url: '' }, base_stat: 120, effort: 0 }
                ],
                types: [
                  { slot: 1, type: { name: type, url: `https://pokeapi.co/api/v2/type/${type}` } }
                ],
                abilities: []
              }
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch form data for ${form.name}:`, error)
        }
      }
      setFormsData(formsDetails)
      
      // Load transformation conditions
      const conditions: Record<string, FormTransformationCondition[]> = {}
      availableForms.forEach(form => {
        conditions[form.name] = FormTransformationService.getFormTransformationConditions(form.name)
      })
      setTransformationConditions(conditions)
      
    } catch (error) {
      console.error('Failed to load forms data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFormIcon = (formName: string) => {
    const conditions = transformationConditions[formName] || []
    if (conditions.length === 0) return Settings
    
    const condition = conditions[0]
    switch (condition.type) {
      case 'mega':
        return Star
      case 'gmax':
        return Sparkles
      case 'item':
        return Zap
      case 'ability':
        return Heart
      case 'weather':
        return Shield
      case 'battle':
        return Sword
      default:
        return Settings
    }
  }

  const getFormDisplayName = (formName: string) => {
    const parts = formName.split('-')
    if (parts.length === 1) return formatPokemonName(formName)
    
    const baseName = parts[0]
    const formSuffix = parts.slice(1).join(' ')
    
    // Special cases for common form names
    const suffixMap: Record<string, string> = {
      'mega': 'Mega',
      'gmax': 'Gigantamax',
      'alola': 'Alola',
      'galar': 'Galar',
      'hisui': 'Hisui',
      'paldea': 'Paldea',
      'origin': 'Origin',
      'primal': 'Primal',
      'unbound': 'Unbound',
      'ash': 'Ash',
      'school': 'School',
      'blade': 'Blade',
      'shield': 'Shield',
      'power': 'Power',
      'technique': 'Technique',
      'soul': 'Soul',
      'pirouette': 'Pirouette',
      'therian': 'Therian',
      'incarnate': 'Incarnate',
      'resolute': 'Resolute',
      'sky': 'Sky',
      'land': 'Land',
      'blue': 'Blue',
      'red': 'Red',
      'white': 'White',
      'black': 'Black',
      'complete': 'Complete',
      'active': 'Active',
      'defense': 'Defense',
      'attack': 'Attack',
      'speed': 'Speed',
      'heat': 'Heat',
      'wash': 'Wash',
      'frost': 'Frost',
      'fan': 'Fan',
      'mow': 'Mow',
      'dawn': 'Dawn',
      'dusk': 'Dusk',
      'midnight': 'Midnight',
      'noon': 'Noon',
      'overcast': 'Overcast',
      'sunshine': 'Sunshine',
      'snowy': 'Snowy',
      'rainy': 'Rainy',
      'plant': 'Plant',
      'sandy': 'Sandy',
      'trash': 'Trash',
      'hangry': 'Hangry',
      'busted': 'Busted',
      'full': 'Full',
      'zero': 'Zero',
      'ice': 'Ice',
      'zen': 'Zen',
      'standard': 'Standard',
      'super': 'Super',
      'female': 'Female',
      'male': 'Male',
      'east': 'East',
      'west': 'West',
      'north': 'North',
      'south': 'South',
      'spring': 'Spring',
      'summer': 'Summer',
      'autumn': 'Autumn',
      'winter': 'Winter'
    }
    
    const formattedSuffix = suffixMap[formSuffix] || formSuffix.charAt(0).toUpperCase() + formSuffix.slice(1)
    return `${formatPokemonName(baseName)} (${formattedSuffix})`
  }

  const getFormBadgeVariant = (formName: string) => {
    const conditions = transformationConditions[formName] || []
    if (conditions.length === 0) return 'secondary'
    
    const condition = conditions[0]
    switch (condition.type) {
      case 'mega':
        return 'destructive'
      case 'gmax':
        return 'default'
      case 'item':
        return 'outline'
      case 'ability':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getFormDescription = (formName: string) => {
    const conditions = transformationConditions[formName] || []
    if (conditions.length > 0) {
      return conditions[0].description
    }
    
    const formData = formsData[formName]
    if (formData?.is_battle_only) {
      return 'Battle-only form'
    }
    if (formData?.is_mega) {
      return 'Mega Evolution form'
    }
    if (formData?.is_primal) {
      return 'Primal Reversion form'
    }
    
    return 'Alternate form'
  }

  const handleFormSelect = (formName: string) => {
    const formData = formsData[formName]
    onFormSelect(formName, formData)
    onFormChange?.() // Trigger form change callback
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Loading Forms...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Always show form selector to display base form
  const shouldShowFormSelector = () => {
    return true
  }

  if (!shouldShowFormSelector()) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Pokemon Forms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {availableForms.map((form, index) => {
            const Icon = getFormIcon(form.name)
            const isSelected = selectedForm === form.name || (selectedForm === 'base' && form.name === pokemon.name)
            const formData = formsData[form.name]
            
            return (
              <motion.div
                key={form.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full justify-between h-auto p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleFormSelect(form.name)}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <div className="text-left">
                      <div className="font-medium">
                        {getFormDisplayName(form.name)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getFormDescription(form.name)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {formData && (
                      <Badge variant={getFormBadgeVariant(form.name)} className="text-xs">
                        {formData.is_mega && 'Mega'}
                        {formData.is_gmax && 'Gmax'}
                        {formData.is_primal && 'Primal'}
                        {formData.is_battle_only && 'Battle'}
                        {!formData.is_mega && !formData.is_gmax && !formData.is_primal && !formData.is_battle_only && 'Form'}
                      </Badge>
                    )}
                    {isSelected && <ChevronRight className="h-4 w-4" />}
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </div>
        
        {selectedForm && transformationConditions[selectedForm]?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Transformation Requirements:</span>
            </div>
            <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              {transformationConditions[selectedForm].map((condition, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span>• {condition.description}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
