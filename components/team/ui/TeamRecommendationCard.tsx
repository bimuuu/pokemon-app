import { Lightbulb, BrainCircuit, Target, AlertTriangle, Shield, Users, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { TypeBadge, RarityBadge } from '@/components/ui'
import { formatPokemonName } from '@/lib/utils'

interface RecommendedPokemon {
  pokemon: any
  reason: string
  effectiveness: number
  types: string[]
  coveredWeaknesses?: string[]
  rarity?: string
}

interface TeamRecommendationCardProps {
  loading: boolean
  battleStrategy: string[]
  trainerWeaknesses: string[]
  trainerStrengths: string[]
  recommendedPokemon?: RecommendedPokemon[]
  onRandomize?: () => void
}

export function TeamRecommendationCard({ 
  loading, 
  battleStrategy, 
  trainerWeaknesses, 
  trainerStrengths,
  recommendedPokemon = [],
  onRandomize
}: TeamRecommendationCardProps) {
  if (loading) {
    return (
      <div className="relative p-4 rounded-lg shadow-lg bg-gray-800 text-gray-100">
        <div className="absolute top-4 right-4 text-blue-400">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div className="text-center py-4">
          <div className="text-gray-400">Loading recommendations...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative p-4 rounded-lg shadow-lg bg-gray-800 text-gray-100 overflow-hidden">
      <div className="absolute top-4 right-4 text-blue-400 z-10">
        <Lightbulb className="w-6 h-6" />
      </div>
      
      {/* Battle Strategy */}
      <div className="bg-gray-700 rounded-lg p-3 mb-3">
        <h4 className="font-medium mb-2 flex items-center text-gray-300">
          <BrainCircuit className="w-4 h-4 mr-2" />
          Battle Strategy
        </h4>
        <ul className="text-sm space-y-1 text-gray-400">
          <li>• Target ice/fighting/bug types</li>
          <li>• Avoid fire/ice/flying types</li>
          <li>• Level 21+ recommended</li>
        </ul>
      </div>

      {/* Recommended Pokemon */}
      {recommendedPokemon.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              Recommended Pokemon
            </h4>
            {onRandomize && (
              <button
                onClick={onRandomize}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Randomize
              </button>
            )}
          </div>
          
          {/* Pokemon Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {recommendedPokemon.map((rec, index) => (
              <Link 
                key={index} 
                href={`/pokemon/${rec.pokemon.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center block hover:scale-105 transition-transform"
              >
                <div className="bg-gray-700 rounded-lg p-3 border border-gray-600 hover:shadow-md transition-shadow min-w-[80px] cursor-pointer">
                  <img 
                    src={rec.pokemon.sprites.front_default}
                    alt={rec.pokemon.name}
                    className="w-12 h-12 mx-auto mb-2 object-contain"
                  />
                  <div className="text-xs font-medium text-gray-200 leading-tight min-h-[2.5em] flex items-center justify-center mb-2">
                    {formatPokemonName(rec.pokemon.name)}
                  </div>
                  {/* Rarity Badge */}
                  {rec.rarity && (
                    <div className="flex justify-center">
                      <RarityBadge rarity={rec.rarity} />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Target These Types */}
      <div className="bg-gray-700 rounded-lg p-3 mb-3">
        <h4 className="font-medium mb-2 flex items-center text-gray-300">
          <Target className="w-4 h-4 mr-2" />
          Target These Types
        </h4>
        <div className="flex flex-wrap gap-2 relative z-10">
          {trainerWeaknesses.slice(0, 4).map((type: string) => (
            <div key={type} className="flex items-center gap-1">
              <span className="inline-block">
                <TypeBadge type={type} />
              </span>
              <span className="text-xs font-bold text-gray-400">2x</span>
            </div>
          ))}
        </div>
      </div>

      {/* Avoid These Types */}
      <div className="bg-gray-700 rounded-lg p-3 mb-3">
        <h4 className="font-medium mb-2 flex items-center text-gray-300">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Avoid These Types
        </h4>
        <div className="flex flex-wrap gap-2 relative z-10">
          {trainerStrengths.slice(0, 4).map((type: string) => (
            <div key={type} className="flex items-center gap-1">
              <span className="inline-block">
                <TypeBadge type={type} />
              </span>
              <span className="text-xs font-bold text-gray-400">2x</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Tips */}
      <div className="bg-gray-700 rounded-lg p-3">
        <h4 className="font-medium mb-2 text-gray-300 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Pro Tips
        </h4>
        <ul className="text-sm space-y-1 text-gray-400">
          <li>• Status conditions help against tough opponents</li>
          <li>• Varied move types for better coverage</li>
        </ul>
      </div>
    </div>
  )
}
