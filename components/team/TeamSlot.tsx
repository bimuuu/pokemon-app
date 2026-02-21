import { X, Plus } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import { Pokemon } from '@/types/pokemon'
import { useLanguage } from '@/contexts/LanguageContext'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { formatPokemonName } from '@/lib/utils'
import { getFormDisplayName } from '@/lib/pokemon-api'
import { useState, useRef, useEffect } from 'react'

interface TeamSlotProps {
  pokemon: Pokemon | null
  slotNumber: number
  slotIndex: number
  onRemove: () => void
  onAdd: () => void
}

export function TeamSlot({ pokemon, slotNumber, slotIndex, onRemove, onAdd }: TeamSlotProps) {
  const { t } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const { isOver, setNodeRef } = useDroppable({
    id: `team-slot-${slotIndex}`,
    data: {
      type: 'team-slot',
      slotIndex,
    },
  })

  // Handle hover with delay for smoother interaction
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true)
    }, 150)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false)
    }, 200)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Get display name for forms
  const displayName = pokemon ? getFormDisplayName(pokemon.name) : ''

  return (
    <div
      ref={setNodeRef}
      key={pokemon ? `${pokemon.id}-${pokemon.types.length}` : `empty-${slotIndex}`} // Force re-render when types change
      className={`
        bg-white border-2 border-dashed rounded-lg p-4 transition-all relative
        ${pokemon 
          ? 'border-gray-300' 
          : isOver 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-blue-400'
        }
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {pokemon ? (
        <div className="relative">
          {/* Hover overlay with form info */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center z-10">
              <div className="text-white text-center p-2">
                <div className="font-bold text-sm mb-1">{displayName}</div>
                <div className="flex justify-center gap-1">
                  {pokemon.types && pokemon.types.length > 0 && (
                    pokemon.types.map(type => (
                      <TypeBadge key={type.type.name} type={type.type.name} className="text-xs" />
                    ))
                  )}
                </div>
                {/* Form indicators */}
                <div className="flex justify-center gap-1 mt-1">
                  {pokemon.name.includes('mega') && (
                    <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
                      Mega
                    </span>
                  )}
                  {pokemon.name.includes('gmax') && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">
                      G-Max
                    </span>
                  )}
                  {pokemon.name.includes('primal') && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                      Primal
                    </span>
                  )}
                  {pokemon.name.includes('origin') && (
                    <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full font-medium">
                      Origin
                    </span>
                  )}
                  {pokemon.name.includes('therian') && (
                    <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full font-medium">
                      Therian
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-20"
          >
            <X className="w-3 h-3" />
          </button>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
              <img 
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-16 h-16 object-contain"
              />
            </div>
            <h4 className="font-semibold text-sm">{displayName}</h4>
            <div className="flex justify-center gap-1 mt-1">
              {pokemon.types && pokemon.types.length > 0 ? (
                pokemon.types.map(type => (
                  <TypeBadge key={type.type.name} type={type.type.name} className="text-xs" />
                ))
              ) : (
                <div className="flex gap-1">
                  <div className="type-badge-placeholder"></div>
                  <div className="type-badge-placeholder"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={onAdd}
          className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-sm">{t('team.slot')} {slotNumber}</span>
          {isOver && (
            <span className="text-xs text-blue-600 mt-1">{t('team.dropPokemonHere')}</span>
          )}
        </button>
      )}
    </div>
  )
}
