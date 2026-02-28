'use client'

import { Pokemon, PokemonForm, PokemonFormData, PokemonVariety } from '@/types/pokemon'
import { useLanguage } from '@/contexts/LanguageContext'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { formatPokemonName } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { fetchPokemonForms, fetchAllFormsData, getFormDisplayName, fetchPokemonVarietiesWithDetails } from '@/lib/pokemon-api'
import { Plus, Check } from 'lucide-react'

interface TeamPokemonCardProps {
  pokemon: Pokemon
  isDisabled?: boolean
  onAddToTeam: (pokemon: Pokemon) => void
}

export function TeamPokemonCard({ pokemon, isDisabled = false, onAddToTeam }: TeamPokemonCardProps) {
  const { t } = useLanguage()
  const [varieties, setVarieties] = useState<PokemonVariety[]>([])
  const [loadingVarieties, setLoadingVarieties] = useState(false)
  const [showFormSelector, setShowFormSelector] = useState(false)
  const [selectedForm, setSelectedForm] = useState<Pokemon | null>(null)
  
  // Load varieties data for this Pokemon
  useEffect(() => {
    const loadVarieties = async () => {
      const pokemonName = formatPokemonName(pokemon.name.toLowerCase())
      setLoadingVarieties(true)
      try {
        const varietiesData = await fetchPokemonVarietiesWithDetails(pokemonName)
        setVarieties(varietiesData)
      } catch (error) {
        console.warn(`Failed to load varieties for ${pokemon.name}:`, error)
      } finally {
        setLoadingVarieties(false)
      }
    }
    
    loadVarieties()
  }, [pokemon.name])
  
  const hasMultipleForms = varieties.length > 1
  
  const handleAddToTeam = (pokemonToAdd: Pokemon) => {
    if (!isDisabled) {
      onAddToTeam(pokemonToAdd)
    }
  }

  const handleCardClick = () => {
    if (hasMultipleForms && !isDisabled) {
      setShowFormSelector(!showFormSelector)
    } else if (!isDisabled) {
      handleAddToTeam(pokemon)
    }
  }

  const displayPokemon = selectedForm || pokemon

  if (isDisabled) {
    return (
      <div className="relative p-4 border border-gray-600 rounded-lg bg-gray-800 opacity-50 cursor-not-allowed h-36 flex flex-col justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={displayPokemon.sprites.front_default}
            alt={displayPokemon.name}
            className="w-12 h-12 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{formatPokemonName(displayPokemon.name)}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {displayPokemon.types && displayPokemon.types.length > 0 ? (
                displayPokemon.types.map((type, index) => (
                  <TypeBadge key={`${type.type.name}-${index}`} type={type.type.name} className="text-xs leading-none" />
                ))
              ) : (
                <div className="flex gap-1">
                  <div className="type-badge-placeholder"></div>
                  <div className="type-badge-placeholder"></div>
                </div>
              )}
            </div>
            {hasMultipleForms && !loadingVarieties && (
              <div className="mt-1">
                <span className="text-xs text-purple-600 font-medium">
                  {varieties.length} {t('pokemon.forms')}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 rounded-lg">
          <span className="text-xs font-medium text-gray-600">{t('team.inTeam')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div
        onClick={handleCardClick}
        className={`
          relative p-4 border border-gray-600 rounded-lg cursor-pointer transition-all
          hover:shadow-lg hover:shadow-blue-500/20 hover:bg-gray-700 hover:border-blue-400
          ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-600' : 'bg-gray-800 shadow-md'}
          h-36 flex flex-col justify-between
        `}
      >
        <div className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <img 
            src={displayPokemon.sprites.front_default}
            alt={displayPokemon.name}
            className="w-12 h-12 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{formatPokemonName(displayPokemon.name)}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {displayPokemon.types.map((type, index) => (
                <TypeBadge key={`${type.type.name}-${index}`} type={type.type.name} className="text-xs leading-none" />
              ))}
            </div>
            {hasMultipleForms && !loadingVarieties && (
              <div className="mt-1">
                <span className="text-xs text-purple-600 font-medium">
                  {varieties.length} {t('pokemon.forms')}
                </span>
              </div>
            )}
            
            {/* Form Type Indicators */}
            {displayPokemon.name && (
              <div className="mt-1 flex gap-1">
                {displayPokemon.name.includes('mega') && (
                  <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
                    Mega
                  </span>
                )}
                {displayPokemon.name.includes('gmax') && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">
                    G-Max
                  </span>
                )}
                {displayPokemon.name.includes('primal') && (
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                    Primal
                  </span>
                )}
                {displayPokemon.name.includes('alola') && (
                  <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-medium">
                    Alola
                  </span>
                )}
                {displayPokemon.name.includes('galar') && (
                  <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full font-medium">
                    Galar
                  </span>
                )}
                {displayPokemon.name.includes('hisui') && (
                  <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full font-medium">
                    Hisui
                  </span>
                )}
                {displayPokemon.name.includes('paldea') && (
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">
                    Paldea
                  </span>
                )}
                {displayPokemon.name.includes('origin') && (
                  <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full font-medium">
                    Origin
                  </span>
                )}
                {displayPokemon.name.includes('therian') && (
                  <span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full font-medium">
                    Therian
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Selector */}
      {showFormSelector && hasMultipleForms && !isDisabled && (
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-2 space-y-1">
          <div className="text-xs text-gray-400 mb-2">{t('pokemon.selectForm')}:</div>
          {varieties.map((variety) => {
            const formPokemon = variety.pokemon
            
            const isFormInTeam = false // You might want to check if this specific form is in team
            
            return (
              <div
                key={variety.name}
                onClick={() => {
                  setSelectedForm(formPokemon)
                  setShowFormSelector(false)
                  handleAddToTeam(formPokemon)
                }}
                className={`
                  flex items-center space-x-2 p-2 rounded cursor-pointer transition-all
                  hover:bg-gray-600 ${isFormInTeam ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <img 
                  src={variety.sprites.front_default || '/placeholder.png'}
                  alt={variety.name}
                  className="w-8 h-8 object-contain"
                />
                <div className="flex-1">
                  <p className="text-xs font-medium">{variety.display_name}</p>
                  <div className="flex gap-1">
                    {variety.types.map((type: any, index: number) => (
                      <TypeBadge key={`${type.type.name}-${index}`} type={type.type.name} className="text-xs" />
                    ))}
                  </div>
                </div>
                {isFormInTeam && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
