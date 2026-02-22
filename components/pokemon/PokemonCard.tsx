import { memo, useMemo } from 'react'
import Link from 'next/link'
import { CobblemonPokemon } from '@/types/pokemon'
import { TypeBadge, RarityBadge } from '@/components/ui'
import { formatPokemonName } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { translateCondition } from '@/lib/i18n'
import { getPokemonSpriteUrl, getFallbackSpriteUrl } from '@/lib/optimized-api'

interface PokemonCardProps {
  pokemon: CobblemonPokemon
  types?: string[]
}

export const PokemonCard = memo(({ pokemon, types }: PokemonCardProps) => {
  const { t } = useLanguage()
  const id = parseInt(pokemon['N.'].replace('#', ''))
  const name = formatPokemonName(pokemon.POKÉMON.toLowerCase())
  
  // Memoize sprite URL for performance
  const spriteUrl = useMemo(() => getPokemonSpriteUrl(id), [id])
  const fallbackUrl = useMemo(() => getFallbackSpriteUrl(id), [id])
  
  return (
    <article className="pokemon-card p-4 hover:scale-105 hover:shadow-lg transition-all duration-200">
      <Link href={`/pokemon/${name}`}>
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm font-bold text-gray-500">{pokemon['N.']}</span>
          <div className="flex gap-1">
            <RarityBadge rarity={pokemon.RARITY} />
          </div>
        </div>
        
        <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
          <img 
            src={spriteUrl}
            alt={pokemon.POKÉMON}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = fallbackUrl
            }}
          />
        </div>
        
        <h3 className="font-semibold text-center mb-2">{pokemon.POKÉMON}</h3>
        
        {/* Pokemon Types */}
        {types && types.length > 0 ? (
          <div className="flex justify-center gap-1 mb-2">
            {types.map(type => (
              <TypeBadge key={type} type={type} className="text-xs" />
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
      </Link>
    </article>
  )
})

PokemonCard.displayName = 'PokemonCard'
