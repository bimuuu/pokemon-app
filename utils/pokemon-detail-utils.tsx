import React from 'react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { PokemonVariety, FormTransformationCondition } from '@/types/pokemon'
import { calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'

/**
 * Renders a stat bar with percentage
 */
export const renderStatBar = (stat: any, showComparison = false, baseStatValue?: number) => {
  const percentage = (stat.base_stat / 255) * 100
  const difference = showComparison && baseStatValue ? stat.base_stat - baseStatValue : 0
  
  return (
    <div key={stat.stat.name}>
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="font-medium">
          {(() => {
            const statKey = stat.stat.name.replace('-', '')
            const translationKey = `pokemon.${statKey === 'specialattack' ? 'spAttack' : statKey === 'specialdefense' ? 'spDefense' : statKey}`
            // Note: This would need t function passed in
            return stat.stat.name.toUpperCase()
          })()}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-medium">{stat.base_stat}</span>
          {showComparison && difference !== 0 && (
            <span className={`text-xs font-medium ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ({difference > 0 ? '+' : ''}{difference})
            </span>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${showComparison 
            ? (difference > 0 ? 'bg-green-500' : difference < 0 ? 'bg-red-500' : 'bg-blue-500')
            : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Renders abilities list
 */
export const renderAbilities = (abilities: any[], onAbilityClick: (name: string) => void, t: (key: string) => string) => {
  return (
    <div className="space-y-1">
      {abilities.map(ability => (
        <div key={ability.ability.name} className="flex items-center justify-between text-xs">
          <span 
            className="font-medium capitalize hover:text-blue-600 cursor-pointer"
            onClick={() => onAbilityClick(ability.ability.name)}
          >
            {ability.ability.name.replace('-', ' ')}
          </span>
          {ability.is_hidden && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
              {t('pokemon.hidden') || 'Hidden'}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Renders type matchups (strengths and weaknesses)
 */
export const renderTypeMatchups = (types: string[], t: (key: string) => string) => {
  const weaknesses = calculateTypeWeaknesses(types)
  const strengths = calculateTypeStrengths(types)
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <h5 className="font-medium text-green-600 mb-1 text-xs">{t('pokemon.strongAgainst') || 'Strong'}</h5>
        <div className="flex flex-wrap gap-1">
          {Object.entries(strengths)
            .filter(([_, multiplier]) => multiplier > 1)
            .sort(([_, a], [__, b]) => b - a)
            .slice(0, 3)
            .map(([type, multiplier]) => (
              <div key={type} className="flex items-center gap-1">
                <TypeBadge type={type} className="text-xs" />
                <span className="text-xs font-medium text-green-700">×{multiplier}</span>
              </div>
            ))}
        </div>
      </div>
      <div>
        <h5 className="font-medium text-red-600 mb-1 text-xs">{t('pokemon.weakAgainst') || 'Weak'}</h5>
        <div className="flex flex-wrap gap-1">
          {Object.entries(weaknesses)
            .filter(([_, multiplier]) => multiplier > 1)
            .sort(([_, a], [__, b]) => b - a)
            .slice(0, 3)
            .map(([type, multiplier]) => (
              <div key={type} className="flex items-center gap-1">
                <TypeBadge type={type} className="text-xs" />
                <span className="text-xs font-medium text-red-700">×{multiplier}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Renders transformation conditions with styling
 */
export const renderTransformationConditions = (
  formConditions: FormTransformationCondition[], 
  cobbleverseConditions: any[], 
  t: (key: string) => string
) => {
  const allConditions = [...formConditions, ...cobbleverseConditions]
  
  if (allConditions.length === 0) {
    return <p className="text-xs text-gray-500">No special transformation conditions</p>
  }
  
  return (
    <div className="space-y-2">
      {allConditions.map((condition, index) => (
        <div key={index} className="text-xs">
          <span className="font-medium capitalize">{condition.type}:</span> {t(condition.description)}
        </div>
      ))}
    </div>
  )
}

/**
 * Renders form type badge with appropriate styling
 */
export const renderFormTypeBadge = (variety: PokemonVariety) => {
  const getBadgeStyles = (formType: string, isDefault: boolean) => {
    if (isDefault) return 'bg-blue-100 text-blue-800'
    
    switch (formType) {
      case 'mega': return 'bg-red-100 text-red-800'
      case 'gigantamax': return 'bg-purple-100 text-purple-800'
      case 'plate': return 'bg-yellow-100 text-yellow-800'
      case 'alolan':
      case 'galarian':
      case 'hisuian':
      case 'paldean': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getFormTypeLabel = (formType: string, isDefault: boolean) => {
    if (isDefault) return 'Base Form'
    
    switch (formType) {
      case 'mega': return 'Mega Evolution'
      case 'gigantamax': return 'Gigantamax'
      case 'plate': return 'Plate Form'
      case 'alolan': return 'Alolan Form'
      case 'galarian': return 'Galarian Form'
      case 'hisuian': return 'Hisuian Form'
      case 'paldean': return 'Paldean Form'
      default: return `${formType.charAt(0).toUpperCase() + formType.slice(1)} Form`
    }
  }
  
  return (
    <div className={`
      text-xs px-2 py-1 rounded-full font-medium inline-block
      ${getBadgeStyles(variety.form_type, variety.is_default)}
    `}>
      {getFormTypeLabel(variety.form_type, variety.is_default)}
    </div>
  )
}

/**
 * Formats stat name with translation
 */
export const formatStatName = (statName: string, t: (key: string) => string) => {
  const statKey = statName.replace('-', '')
  const translationKey = `pokemon.${statKey === 'specialattack' ? 'spAttack' : statKey === 'specialdefense' ? 'spDefense' : statKey}`
  const translation = t(translationKey)
  return translation !== translationKey ? translation : statName.toUpperCase()
}
