'use client'

import { Pokemon, PokemonForm } from '@/types/pokemon'
import { useLanguage } from '@/contexts/LanguageContext'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { formatPokemonName } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { fetchPokemonForms, getFormDisplayName, fetchPokemonByName } from '@/lib/pokemon-api'
import { motion } from 'framer-motion'
import { FormSelectorSlidePanel } from './FormSelectorSlidePanel'

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

  // Load forms data for this Pokemon - optimized with debouncing
  useEffect(() => {
    const loadForms = async () => {
      if (pokemon.id > 0 && !loadingForms) {
        setLoadingForms(true)
        try {
          const pokemonForms = await fetchPokemonForms(pokemon.id)
          setForms(pokemonForms)

          // Only fetch details if we have multiple forms
          if (pokemonForms.length > 1) {
            // Fetch full Pokemon details for each form to get sprites
            const detailsPromises = pokemonForms.map(form => fetchPokemonByName(form.name))
            const details = await Promise.allSettled(detailsPromises)
            
            // Convert pokenode Pokemon to our Pokemon type, only include successful fetches
            const convertedDetails: Pokemon[] = details
              .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
              .map(result => result.value)
              .map(formPokemon => ({
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
            
            // Always include the base pokemon as fallback
            const allForms = [pokemon, ...convertedDetails.filter(p => p.name !== pokemon.name)]
            setFormPokemonDetails(allForms)
          } else {
            // Single form, just use base pokemon
            setFormPokemonDetails([pokemon])
          }
        } catch (error) {
          console.warn(`Failed to fetch forms for ${pokemon.name}:`, error)
          // Fallback to just the base pokemon
          setFormPokemonDetails([pokemon])
        } finally {
          setLoadingForms(false)
        }
      }
    }
    
    // Use setTimeout to debounce rapid calls - reduced delay
    const timeoutId = setTimeout(loadForms, 50)
    return () => clearTimeout(timeoutId)
  }, [pokemon.id, pokemon.name])
  
  const hasMultipleForms = forms.length > 1

  const handleCardClick = () => {
    // Immediate response for better UX
    if (hasMultipleForms && !showFormSelector) {
      setShowFormSelector(true)
    } else if (!hasMultipleForms) {
      // No multiple forms, just use original Pokemon
      if (onClick) {
        onClick(pokemon)
      }
    }
  }

  const handleFormSelect = (selectedPokemon: Pokemon) => {
    // Immediate response
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
                  <TypeBadge key={`${pokemon.id}-${type.type.name}-${index}`} type={type.type.name} className="text-xs leading-none" />
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
                <TypeBadge key={`${pokemon.id}-${type.type.name}-${index}`} type={type.type.name} className="text-xs leading-none" />
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

      {/* Form Selector Slide Panel */}
      <FormSelectorSlidePanel
        isOpen={showFormSelector}
        onClose={() => setShowFormSelector(false)}
        basePokemon={pokemon}
        forms={formPokemonDetails}
        onFormSelect={handleFormSelect}
      />
    </div>
  )
}
