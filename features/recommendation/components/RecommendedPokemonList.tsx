'use client'

import { Users } from 'lucide-react'
import { RecommendedPokemon } from '../services/recommendationService'
import { formatPokemonName } from '@/lib/utils'

interface RecommendedPokemonListProps {
  recommendations: RecommendedPokemon[]
}

export function RecommendedPokemonList({ recommendations }: RecommendedPokemonListProps) {
  if (recommendations.length === 0) return null

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2 flex items-center text-green-700">
        <Users className="w-4 h-4 mr-2" />
        Recommended Pokemon
      </h4>
      
      {/* Pokemon Grid - Icons and Names Only */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {recommendations.map((rec, index) => (
          <div key={index} className="text-center">
            <div className="bg-white rounded-lg p-2 border border-blue-200 hover:shadow-md transition-shadow">
              <img 
                src={rec.pokemon.sprites.front_default}
                alt={rec.pokemon.name}
                className="w-10 h-10 mx-auto mb-1 object-contain"
              />
              <div className="text-xs font-medium text-gray-800">
                {formatPokemonName(rec.pokemon.name)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
