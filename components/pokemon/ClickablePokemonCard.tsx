'use client'

import { Pokemon, PokemonForm } from '@/types/pokemon'
import { useLanguage } from '@/contexts/LanguageContext'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { formatPokemonName } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { fetchPokemonForms, getFormDisplayName, fetchPokemonByName } from '@/lib/pokemon-api'

interface ClickablePokemonCardProps {
  pokemon: Pokemon
  isDisabled?: boolean
  onClick?: (pokemon: Pokemon) => void
}

export function ClickablePokemonCard({ pokemon, isDisabled = false, onClick }: ClickablePokemonCardProps) {
  const { t } = useLanguage()
  const [forms, setForms] = useState<PokemonForm[]>([])
  const [loadingForms, setLoadingForms] = useState(false)
  const [showFormSelector, setShowFormSelector] = useState(false)
  const [formPokemonDetails, setFormPokemonDetails] = useState<Pokemon[]>([])

  // Load forms data for this Pokemon
  useEffect(() => {
    const loadForms = async () => {
      if (pokemon.id > 0) {
        setLoadingForms(true)
        try {
          const pokemonForms = await fetchPokemonForms(pokemon.id)
          setForms(pokemonForms)

          // Fetch full Pokemon details for each form to get sprites
          const detailsPromises = pokemonForms.map(form => fetchPokemonByName(form.name))
          const details = await Promise.all(detailsPromises)
          
          // Convert pokenode Pokemon to our Pokemon type
          const convertedDetails: Pokemon[] = details.map(formPokemon => ({
            id: formPokemon.id,
            name: formPokemon.name,
            base_experience: formPokemon.base_experience || 0,
            order: formPokemon.order,
            height: formPokemon.height,
            weight: formPokemon.weight,
            is_default: formPokemon.is_default,
            location_area_encounters: formPokemon.location_area_encounters,
            sprites: {
              front_default: formPokemon.sprites.front_default || '',
              front_shiny: formPokemon.sprites.front_shiny || '',
              back_default: formPokemon.sprites.back_default || '',
              back_shiny: formPokemon.sprites.back_shiny || '',
            },
            types: formPokemon.types,
            stats: formPokemon.stats,
            abilities: formPokemon.abilities,
            moves: formPokemon.moves,
            species: formPokemon.species,
            forms: formPokemon.forms,
            game_indices: formPokemon.game_indices,
            held_items: formPokemon.held_items,
            past_types: formPokemon.past_types,
          }))
          
          setFormPokemonDetails(convertedDetails)
        } catch (error) {
          console.warn(`Failed to fetch forms for ${pokemon.name}:`, error)
        } finally {
          setLoadingForms(false)
        }
      }
    }
    
    loadForms()
  }, [pokemon.id, pokemon.name])
  
  const hasMultipleForms = forms.length > 1

  const handleCardClick = () => {
    if (hasMultipleForms && !showFormSelector) {
      setShowFormSelector(true)
    } else if (showFormSelector) {
      setShowFormSelector(false)
    } else {
      // No multiple forms, just use original Pokemon
      if (onClick) {
        onClick(pokemon)
      }
    }
  }

  const handleFormSelect = async (selectedPokemon: Pokemon) => {
    if (onClick) {
      onClick(selectedPokemon)
    }
    setShowFormSelector(false)
  }

  if (isDisabled) {
    return (
      <div className="relative p-5 border border-gray-600 rounded-lg bg-gray-800 opacity-50 cursor-not-allowed h-32">
        <div className="flex items-center h-full space-x-3">
          <img 
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-16 h-16 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="font-medium text-sm truncate">{formatPokemonName(pokemon.name)}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {pokemon.types && pokemon.types.length > 0 ? (
                pokemon.types.map((type, index) => (
                  <TypeBadge key={`${type.type.name}-${index}`} type={type.type.name} className="text-xs leading-none" />
                ))
              ) : (
                <div className="flex gap-1">
                  <div className="type-badge-placeholder"></div>
                  <div className="type-badge-placeholder"></div>
                </div>
              )}
            </div>
            {hasMultipleForms && !loadingForms && (
              <div className="mt-2">
                <span className="text-xs text-purple-600 font-medium">
                  {forms.length} {t('pokemon.forms')}
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
    <div className="relative">
      <div
        onClick={handleCardClick}
        className={`
          relative p-5 border border-gray-600 rounded-lg cursor-pointer transition-all h-32
          hover:shadow-lg hover:scale-105 hover:bg-gray-700 hover:border-gray-500
          ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-600' : 'bg-gray-800 shadow-md'}
        `}
      >
        <div className="flex items-center h-full space-x-3">
          <img 
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-16 h-16 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="font-medium text-sm truncate">{formatPokemonName(pokemon.name)}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {pokemon.types.map((type, index) => (
                <TypeBadge key={`${type.type.name}-${index}`} type={type.type.name} className="text-xs leading-none" />
              ))}
            </div>
            {hasMultipleForms && !loadingForms && (
              <div className="mt-2">
                <span className="text-xs text-purple-600 font-medium">
                  {forms.length} {t('pokemon.forms')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Selector Dropdown */}
      {showFormSelector && hasMultipleForms && (
        <motion.div 
          className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 min-w-[280px]"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
              type: "spring", 
              stiffness: 400, 
              damping: 25 
            }
          }}
          exit={{ 
            opacity: 0, 
            y: -10, 
            scale: 0.95,
            transition: { 
              type: "spring", 
              stiffness: 400, 
              damping: 25 
            }
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-300 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                {t('pokemon.selectForm')}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowFormSelector(false)
                }}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {formPokemonDetails.map((formPokemon, index) => (
                <motion.button
                  key={formPokemon.name}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFormSelect(formPokemon)
                  }}
                  className="w-full group relative bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded-lg p-3 transition-all hover:border-gray-400 hover:shadow-lg"
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: "#374151",
                    borderColor: "#6b7280"
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      delay: index * 0.05,
                      type: "spring", 
                      stiffness: 300, 
                      damping: 24 
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={formPokemon.sprites.front_default}
                        alt={formPokemon.name}
                        className="w-12 h-12 object-contain flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                      />
                      {formPokemon.name !== pokemon.name && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          NEW
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-left">
                        <div className="font-medium text-sm text-white mb-1 group-hover:text-blue-300 transition-colors">
                          {getFormDisplayName(formPokemon.name)}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {formPokemon.types.map((type, index) => (
                            <TypeBadge 
                              key={`${type.type.name}-${index}`} 
                              type={type.type.name} 
                              className="text-xs leading-none transform scale-90 group-hover:scale-110 transition-transform duration-200" 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
