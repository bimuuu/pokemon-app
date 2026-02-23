'use client'

import { useDraggable } from '@dnd-kit/core'
import { Pokemon, PokemonForm } from '@/types/pokemon'
import { useLanguage } from '@/contexts/LanguageContext'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { formatPokemonName } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { fetchPokemonForms, getFormDisplayName } from '@/lib/pokemon-api'

interface DraggablePokemonCardProps {
  pokemon: Pokemon
  isDisabled?: boolean
}

export function DraggablePokemonCard({ pokemon, isDisabled = false }: DraggablePokemonCardProps) {
  const { t } = useLanguage()
  const [forms, setForms] = useState<PokemonForm[]>([])
  const [loadingForms, setLoadingForms] = useState(false)
  const [showFormSelector, setShowFormSelector] = useState(false)
  
  // Load forms data for this Pokemon
  useEffect(() => {
    const loadForms = async () => {
      if (pokemon.id > 0) {
        setLoadingForms(true)
        try {
          const pokemonForms = await fetchPokemonForms(pokemon.id)
          setForms(pokemonForms)
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
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `pokemon-${pokemon.id}`,
    data: {
      type: 'pokemon',
      pokemon,
    },
    disabled: isDisabled,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  if (isDisabled) {
    return (
      <div className="relative p-3 border border-gray-600 rounded-lg bg-gray-800 opacity-50 cursor-not-allowed">
        <div className="flex items-center space-x-3">
          <img 
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-12 h-12 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{formatPokemonName(pokemon.name)}</p>
            <div className="flex flex-wrap gap-1 mt-1">
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
              <div className="mt-1">
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
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      key={`${pokemon.id}-${pokemon.types.length}`} // Force re-render when types change
      className={`
        relative p-3 border border-gray-600 rounded-lg cursor-move transition-all
        hover:shadow-lg hover:scale-105 hover:bg-gray-700 hover:border-gray-500
        ${isDragging ? 'opacity-50 rotate-3 scale-105 shadow-xl' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-600' : 'bg-gray-800 shadow-md'}
      `}
    >
      <div key="drag-handle" className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity">
        <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
          <svg className="w-2 h-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
          </svg>
        </div>
      </div>
      
      <div key="pokemon-content" className="flex items-center space-x-3">
        <img 
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-12 h-12 object-contain flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{formatPokemonName(pokemon.name)}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {pokemon.types.map((type, index) => (
              <TypeBadge key={`${type.type.name}-${index}`} type={type.type.name} className="text-xs leading-none" />
            ))}
          </div>
          {hasMultipleForms && !loadingForms && (
            <div className="mt-1">
              <span className="text-xs text-purple-600 font-medium">
                {forms.length} {t('pokemon.forms')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
