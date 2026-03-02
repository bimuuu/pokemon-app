'use client'

import { memo, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CobblemonPokemon, PokemonVariety } from '@/types/pokemon'
import { TypeBadge, RarityBadge } from '@/components/ui'
import { formatPokemonName } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { translateCondition } from '@/lib/i18n'
import { getPokemonSpriteUrl, getFallbackSpriteUrl } from '@/lib/optimized-api'

interface PokemonCardProps {
  pokemon: CobblemonPokemon
  types?: string[]
  varieties?: PokemonVariety[]
}

export const PokemonCardClient = memo(({ pokemon, types, varieties }: PokemonCardProps) => {
  const { t } = useLanguage()
  const id = parseInt(pokemon['N.'].replace('#', ''))
  const name = formatPokemonName(pokemon.POKÉMON.toLowerCase())
  
  // State to track image loading errors
  const [mainImageError, setMainImageError] = useState(false)
  const [varietyImageErrors, setVarietyImageErrors] = useState<Set<string>>(new Set())
  const [mainImageLoaded, setMainImageLoaded] = useState(false)
  
  // Memoize sprite URL for performance
  const spriteUrl = useMemo(() => getPokemonSpriteUrl(id), [id])
  const fallbackUrl = useMemo(() => getFallbackSpriteUrl(id), [id])
  
  // Determine which image source to use for main sprite
  const mainImageSrc = mainImageError ? fallbackUrl : spriteUrl
  
  return (
    <article className="pokemon-card p-4 hover:scale-105 hover:shadow-lg transition-all duration-200 relative z-10">
      <Link href={`/pokemon/${name}`}>
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm font-bold text-gray-500">{pokemon['N.']}</span>
          <div className="flex gap-1">
            <RarityBadge rarity={pokemon.RARITY} />
          </div>
        </div>
        
        <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center relative">
          {mainImageError ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <>
              {!mainImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              <Image 
                src={mainImageSrc}
                alt={pokemon.POKÉMON}
                width={64}
                height={64}
                className={`object-contain transition-opacity duration-200 ${mainImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onError={() => {
                  if (!mainImageError) {
                    setMainImageError(true)
                  }
                }}
                onLoad={() => setMainImageLoaded(true)}
                placeholder="empty"
              />
            </>
          )}
        </div>
        
        <h3 className="font-semibold text-center mb-2">{pokemon.POKÉMON}</h3>
        
        {/* Pokemon Types */}
        {types && types.length > 0 ? (
          <div className="flex justify-center gap-1 mb-2">
            {types.map((type, index) => (
              <TypeBadge key={`${type}-${index}`} type={type} className="text-xs" />
            ))}
          </div>
        ) : (
          <div className="flex justify-center gap-1 mb-2">
            <div className="type-badge-placeholder"></div>
            <div className="type-badge-placeholder"></div>
          </div>
        )}
        
        <dl className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <dt>{t('pokemon.source')}:</dt>
            <dd className="font-medium">{pokemon.SOURCE}</dd>
          </div>
          <div className="flex justify-between">
            <dt>{t('pokemon.spawn')}:</dt>
            <dd className="font-medium truncate ml-2" title={pokemon.SPAWN}>
              {pokemon.SPAWN.length > 20 ? pokemon.SPAWN.substring(0, 20) + '...' : pokemon.SPAWN}
            </dd>
          </div>
        </dl>
        
        {pokemon.CONDITION && (
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
            <strong>{t('pokemon.condition')}:</strong> {translateCondition(pokemon.CONDITION)}
          </div>
        )}
        
        {/* Pokemon Varieties Section */}
        {varieties && varieties.length > 1 && (
          <div className="mt-3 border-t pt-2">
            <div className="text-xs font-semibold text-gray-700 mb-2">Forms:</div>
            <div className="flex flex-wrap gap-1">
              {varieties.slice(0, 4).map((variety) => (
                <div 
                  key={variety.name}
                  className={`
                    text-xs px-2 py-1 rounded-full border
                    ${variety.is_default 
                      ? 'bg-blue-100 text-blue-800 border-blue-200' 
                      : variety.form_type === 'mega'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : variety.form_type === 'gigantamax'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : variety.form_type === 'alolan' || variety.form_type === 'galarian' || variety.form_type === 'hisuian' || variety.form_type === 'paldean'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                    }
                  `}
                  title={variety.display_name}
                >
                  {variety.form_type === 'default' ? 'Base' : 
                   variety.form_type === 'mega' ? 'Mega' :
                   variety.form_type === 'gigantamax' ? 'G-Max' :
                   variety.form_type === 'alolan' ? 'Alola' :
                   variety.form_type === 'galarian' ? 'Galar' :
                   variety.form_type === 'hisuian' ? 'Hisui' :
                   variety.form_type === 'paldean' ? 'Paldea' :
                   variety.display_name.split(' ').slice(-1)[0]}
                </div>
              ))}
              {varieties.length > 4 && (
                <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 border-gray-200">
                  +{varieties.length - 4}
                </div>
              )}
            </div>
            
            {/* Mini sprites preview for varieties */}
            <div className="flex gap-1 mt-2">
              {varieties.slice(0, 6).map((variety) => {
                const varietyKey = variety.name
                const hasError = varietyImageErrors.has(varietyKey)
                
                if (hasError) {
                  return (
                    <div key={variety.name} className="w-6 h-6 rounded border border-gray-200 bg-gray-100 flex items-center justify-center relative group">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {variety.display_name}
                      </div>
                    </div>
                  )
                }
                
                return (
                  <div key={variety.name} className="relative group">
                    <Image 
                      src={variety.sprites.front_default || '/placeholder.png'}
                      alt={variety.display_name}
                      width={24}
                      height={24}
                      className="object-contain rounded border border-gray-200"
                      onError={() => {
                        if (!hasError) {
                          setVarietyImageErrors(prev => new Set(prev).add(varietyKey))
                        }
                      }}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {variety.display_name}
                    </div>
                  </div>
                )
              })}
              {varieties.length > 6 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                  +{varieties.length - 6}
                </div>
              )}
            </div>
          </div>
        )}
      </Link>
    </article>
  )
})

PokemonCardClient.displayName = 'PokemonCardClient'
