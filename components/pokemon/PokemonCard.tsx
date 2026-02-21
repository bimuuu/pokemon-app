import Link from 'next/link'
import { CobblemonPokemon, PokemonForm } from '@/types/pokemon'
import { TypeBadge, RarityBadge } from '@/components/ui'
import { formatPokemonName } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { translateCondition } from '@/lib/i18n'
import { useState, useEffect } from 'react'
import { fetchPokemonForms } from '@/lib/pokemon-api'

interface PokemonCardProps {
  pokemon: CobblemonPokemon
  types?: string[]
}

export function PokemonCard({ pokemon, types }: PokemonCardProps) {
  const { t } = useLanguage()
  const id = parseInt(pokemon['N.'].replace('#', ''))
  const name = formatPokemonName(pokemon.POKÉMON.toLowerCase())
  const [forms, setForms] = useState<PokemonForm[]>([])
  const [loadingForms, setLoadingForms] = useState(false)
  
  // Load forms data for this Pokemon
  useEffect(() => {
    const loadForms = async () => {
      if (id > 0) {
        setLoadingForms(true)
        try {
          const pokemonForms = await fetchPokemonForms(id)
          setForms(pokemonForms)
        } catch (error) {
          console.warn(`Failed to fetch forms for ${pokemon.POKÉMON}:`, error)
        } finally {
          setLoadingForms(false)
        }
      }
    }
    
    loadForms()
  }, [id, pokemon.POKÉMON])
  
  const hasMultipleForms = forms.length > 1
  const formCount = forms.length
  
  return (
    <article className="pokemon-card p-4 hover:scale-105 transition-transform">
      <Link href={`/pokemon/${name}`}>
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm font-bold text-gray-500">{pokemon['N.']}</span>
          <div className="flex gap-1">
            <RarityBadge rarity={pokemon.RARITY} />
          </div>
        </div>
        
        <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
          <img 
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
            alt={pokemon.POKÉMON}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
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
        
        {hasMultipleForms && !loadingForms && (
          <div className="mt-2 text-xs text-purple-600 bg-purple-50 p-2 rounded">
            <strong>{t('pokemon.availableForms')}:</strong> {formCount} {t('pokemon.formsAvailable')}
          </div>
        )}
      </Link>
    </article>
  )
}
