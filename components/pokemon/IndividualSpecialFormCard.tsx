'use client'

import { useDraggable } from '@dnd-kit/core'
import { Pokemon, PokemonForm, PokemonFormData } from '@/types/pokemon'
import { useLanguage } from '@/contexts/LanguageContext'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { formatPokemonName } from '@/lib/utils'
import { fetchPokemonForms, fetchFormDataByUrl, getFormDisplayName } from '@/lib/pokemon-api'

interface IndividualSpecialFormCardProps {
  basePokemon: Pokemon
  formName: string
  formData: PokemonFormData
  isDisabled?: boolean
}

export function IndividualSpecialFormCard({ 
  basePokemon, 
  formName, 
  formData, 
  isDisabled = false 
}: IndividualSpecialFormCardProps) {
  const { t } = useLanguage()
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `pokemon-${basePokemon.id}-${formName}`,
    data: {
      type: 'pokemon',
      pokemon: {
        ...basePokemon,
        name: formName,
        sprites: formData.sprites,
        types: formData.types
      },
      form: formData
    },
    disabled: isDisabled,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const getFormTypeDisplay = (formName: string) => {
    const name = formName.toLowerCase()
    
    if (name.includes('mega-x')) return { text: 'Mega X', className: 'bg-orange-100 text-orange-700' }
    if (name.includes('mega-y')) return { text: 'Mega Y', className: 'bg-orange-100 text-orange-700' }
    if (name.includes('mega')) return { text: 'Mega', className: 'bg-orange-100 text-orange-700' }
    if (name.includes('gmax')) return { text: 'G-Max', className: 'bg-blue-100 text-blue-700' }
    if (name.includes('primal')) return { text: 'Primal', className: 'bg-red-100 text-red-700' }
    if (name.includes('origin')) return { text: 'Origin', className: 'bg-purple-100 text-purple-700' }
    if (name.includes('therian')) return { text: 'Therian', className: 'bg-indigo-100 text-indigo-700' }
    if (name.includes('incarnate')) return { text: 'Incarnate', className: 'bg-purple-100 text-purple-700' }
    if (name.includes('attack')) return { text: 'Attack', className: 'bg-red-100 text-red-700' }
    if (name.includes('defense')) return { text: 'Defense', className: 'bg-blue-100 text-blue-700' }
    if (name.includes('speed')) return { text: 'Speed', className: 'bg-yellow-100 text-yellow-700' }
    if (name.includes('sky')) return { text: 'Sky', className: 'bg-blue-100 text-blue-700' }
    if (name.includes('heat')) return { text: 'Heat', className: 'bg-red-100 text-red-700' }
    if (name.includes('wash')) return { text: 'Wash', className: 'bg-blue-100 text-blue-700' }
    if (name.includes('frost')) return { text: 'Frost', className: 'bg-cyan-100 text-cyan-700' }
    if (name.includes('fan')) return { text: 'Fan', className: 'bg-green-100 text-green-700' }
    if (name.includes('mow')) return { text: 'Mow', className: 'bg-green-100 text-green-700' }
    if (name.includes('black')) return { text: 'Black', className: 'bg-gray-100 text-gray-700' }
    if (name.includes('white')) return { text: 'White', className: 'bg-gray-100 text-gray-700' }
    if (name.includes('complete')) return { text: 'Complete', className: 'bg-yellow-100 text-yellow-700' }
    if (name.includes('dawn')) return { text: 'Dawn', className: 'bg-pink-100 text-pink-700' }
    if (name.includes('dusk')) return { text: 'Dusk', className: 'bg-purple-100 text-purple-700' }
    if (name.includes('midday')) return { text: 'Midday', className: 'bg-yellow-100 text-yellow-700' }
    if (name.includes('midnight')) return { text: 'Midnight', className: 'bg-purple-100 text-purple-700' }
    if (name.includes('school')) return { text: 'School', className: 'bg-blue-100 text-blue-700' }
    if (name.includes('solo')) return { text: 'Solo', className: 'bg-red-100 text-red-700' }
    if (name.includes('disguised')) return { text: 'Disguised', className: 'bg-purple-100 text-purple-700' }
    if (name.includes('busted')) return { text: 'Busted', className: 'bg-red-100 text-red-700' }
    if (name.includes('average')) return { text: 'Average', className: 'bg-gray-100 text-gray-700' }
    if (name.includes('small')) return { text: 'Small', className: 'bg-green-100 text-green-700' }
    if (name.includes('large')) return { text: 'Large', className: 'bg-red-100 text-red-700' }
    if (name.includes('super')) return { text: 'Super', className: 'bg-yellow-100 text-yellow-700' }
    
    return { text: 'Special', className: 'bg-purple-100 text-purple-700' }
  }

  const formType = getFormTypeDisplay(formName)

  if (isDisabled) {
    return (
      <div className="relative p-3 border rounded-lg bg-gray-50 opacity-50 cursor-not-allowed">
        <div className="flex items-center space-x-3">
          <img 
            src={formData.sprites?.front_default || basePokemon.sprites.front_default}
            alt={formName}
            className="w-12 h-12 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{getFormDisplayName(formName)}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {formData.types && formData.types.length > 0 ? (
                formData.types.map(type => (
                  <TypeBadge key={type.type.name} type={type.type.name} className="text-xs leading-none" />
                ))
              ) : (
                <div className="flex gap-1">
                  <div className="type-badge-placeholder"></div>
                  <div className="type-badge-placeholder"></div>
                </div>
              )}
            </div>
            <div className="mt-1">
              <span className={`text-xs ${formType.className} px-2 py-0.5 rounded-full font-medium`}>
                {formType.text}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-lg">
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
      className={`
        relative p-3 border rounded-lg cursor-move transition-all
        hover:shadow-md hover:scale-105 hover:bg-gray-50
        ${isDragging ? 'opacity-50 rotate-3 scale-105 shadow-lg' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}
        border-purple-300 bg-purple-50
      `}
    >
      <div className="absolute top-1 right-1">
        <div className="w-4 h-4 bg-purple-300 rounded-full flex items-center justify-center">
          <svg className="w-2 h-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
          </svg>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <img 
          src={formData.sprites?.front_default || basePokemon.sprites.front_default}
          alt={formName}
          className="w-12 h-12 object-contain flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{getFormDisplayName(formName)}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {formData.types && formData.types.length > 0 ? (
              formData.types.map(type => (
                <TypeBadge key={type.type.name} type={type.type.name} className="text-xs leading-none" />
              ))
            ) : (
              <div className="flex gap-1">
                <div className="type-badge-placeholder"></div>
                <div className="type-badge-placeholder"></div>
              </div>
            )}
          </div>
          
          <div className="mt-1">
            <span className={`text-xs ${formType.className} px-2 py-0.5 rounded-full font-medium`}>
              {formType.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
