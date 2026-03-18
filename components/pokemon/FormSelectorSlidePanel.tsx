'use client'

import { Pokemon, PokemonForm } from '@/types/pokemon'
import { useLanguage } from '@/contexts/LanguageContext'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { formatPokemonName } from '@/lib/utils'
import { getFormDisplayName } from '@/lib/pokemon-api'
import { X, Zap, Shield, Crown, ChevronLeft } from 'lucide-react'

interface FormSelectorSlidePanelProps {
  isOpen: boolean
  onClose: () => void
  basePokemon: Pokemon
  forms: Pokemon[]
  onFormSelect: (selectedPokemon: Pokemon) => void
}

export function FormSelectorSlidePanel({ 
  isOpen, 
  onClose, 
  basePokemon, 
  forms, 
  onFormSelect 
}: FormSelectorSlidePanelProps) {
  const { t } = useLanguage()

  const getFormIcon = (formName: string) => {
    if (formName.includes('mega')) return <Crown className="w-4 h-4 text-orange-400" />
    if (formName.includes('gmax')) return <Zap className="w-4 h-4 text-blue-400" />
    if (formName.includes('primal')) return <Shield className="w-4 h-4 text-red-400" />
    return null
  }

  const getFormBadge = (formName: string) => {
    if (formName.includes('mega')) {
      return (
        <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-medium">
          Mega
        </span>
      )
    }
    if (formName.includes('gmax')) {
      return (
        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
          G-Max
        </span>
      )
    }
    if (formName.includes('primal')) {
      return (
        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
          Primal
        </span>
      )
    }
    if (formName.includes('origin')) {
      return (
        <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full font-medium">
          Origin
        </span>
      )
    }
    if (formName.includes('therian')) {
      return (
        <span className="px-2 py-1 bg-indigo-500 text-white text-xs rounded-full font-medium">
          Therian
        </span>
      )
    }
    return null
  }

  const handleFormSelect = (selectedPokemon: Pokemon) => {
    onFormSelect(selectedPokemon)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-100"
        onClick={onClose}
      />
      
      {/* Slide Panel - No Framer Motion */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-gray-800 border-l border-gray-600 shadow-2xl z-50 overflow-hidden transform transition-transform duration-150 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-700 bg-gray-900/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                <img 
                  src={basePokemon.sprites.front_default}
                  alt={basePokemon.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white truncate">
                  {formatPokemonName(basePokemon.name)}
                </h3>
                <p className="text-xs text-gray-400">
                  {t('pokemon.selectForm') || 'Select Form'} ({forms.length} {t('pokemon.formsAvailable') || 'forms available'})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Forms List */}
        <div className="h-full overflow-y-auto pb-20">
          {forms.length > 0 ? (
            <div className="p-4 space-y-3">
              {forms.map((formPokemon, index) => (
                <button
                  key={`${formPokemon.id}-${formPokemon.name}-${index}`}
                  onClick={() => handleFormSelect(formPokemon)}
                  className="w-full group bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded-xl p-4 transition-colors hover:border-gray-400"
                >
                  <div className="flex items-center gap-4">
                    {/* Pokemon Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                        <img 
                          src={formPokemon.sprites.front_default || '/placeholder-pokemon.png'}
                          alt={formPokemon.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-pokemon.png'
                          }}
                        />
                      </div>
                      {getFormIcon(formPokemon.name) && (
                        <div className="absolute -top-1 -right-1 bg-gray-800 rounded-full p-0.5">
                          {getFormIcon(formPokemon.name)}
                        </div>
                      )}
                    </div>

                    {/* Pokemon Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors truncate">
                        {getFormDisplayName(formPokemon.name)}
                      </div>
                      
                      {/* Types */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {formPokemon.types && formPokemon.types.length > 0 ? (
                          formPokemon.types.map((type, typeIndex) => (
                            <TypeBadge 
                              key={`${formPokemon.id}-${type.type.name}-${typeIndex}`} 
                              type={type.type.name} 
                              className="text-xs" 
                            />
                          ))
                        ) : (
                          <div className="flex gap-1">
                            <div className="w-6 h-3 bg-gray-600 rounded"></div>
                            <div className="w-6 h-3 bg-gray-600 rounded"></div>
                          </div>
                        )}
                      </div>

                      {/* Form Badge */}
                      {getFormBadge(formPokemon.name)}
                    </div>

                    {/* Selection indicator */}
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 border-2 border-gray-500 rounded-full group-hover:border-blue-400 transition-colors"></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 px-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 text-center">
                {t('pokemon.noFormsAvailable') || 'No forms available'}
              </p>
              <p className="text-gray-500 text-sm text-center mt-2">
                {t('pokemon.useDefaultForm') || 'Use default form'}
              </p>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t border-gray-700 bg-gray-900/90 backdrop-blur-sm">
          <button
            onClick={() => handleFormSelect(basePokemon)}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
          >
            {t('pokemon.useDefault') || 'Use Default'}
          </button>
        </div>
      </div>
    </>
  )
}
