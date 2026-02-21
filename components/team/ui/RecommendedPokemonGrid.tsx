import { Users, RefreshCw } from 'lucide-react'
import { RarityBadge } from '@/components/ui'
import { formatPokemonName } from '@/lib/utils'
import { Pokemon } from '@/types/pokemon'

interface RecommendedPokemon {
  pokemon: Pokemon
  reason: string
  effectiveness: number
  types: string[]
  coveredWeaknesses?: string[]
  rarity?: string
}

interface RecommendedPokemonGridProps {
  recommendedPokemon: RecommendedPokemon[]
  loading: boolean
  onRandomize: () => void
}

export function RecommendedPokemonGrid({ 
  recommendedPokemon, 
  loading, 
  onRandomize 
}: RecommendedPokemonGridProps) {
  if (recommendedPokemon.length === 0) {
    return null
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium flex items-center text-green-700">
          <Users className="w-4 h-4 mr-2" />
          Recommended Pokemon
        </h4>
        <button
          onClick={onRandomize}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-md transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Randomize
        </button>
      </div>
      
      {/* Pokemon Grid - Icons and Names Only */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {recommendedPokemon.map((rec, index) => (
          <div key={index} className="text-center">
            <div className="bg-white rounded-lg p-3 border border-blue-200 hover:shadow-md transition-shadow min-w-[80px]">
              <img 
                src={rec.pokemon.sprites.front_default}
                alt={rec.pokemon.name}
                className="w-12 h-12 mx-auto mb-2 object-contain"
              />
              <div className="text-xs font-medium text-gray-800 leading-tight min-h-[2.5em] flex items-center justify-center mb-2">
                {formatPokemonName(rec.pokemon.name)}
              </div>
              {/* Rarity Badge */}
              {rec.rarity && (
                <div className="flex justify-center">
                  <RarityBadge rarity={rec.rarity} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
