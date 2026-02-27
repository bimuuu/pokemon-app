'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { Pokemon, MovesetAnalysis } from '@/types/pokemon'
import { formatPokemonName } from '@/lib/utils'
import { PokemonStats } from '@/components/pokemon/PokemonStats'

interface PokemonOverviewProps {
  pokemon: Pokemon
  movesetAnalysis: MovesetAnalysis | null
  selectedMoves: any[]
  selectedItem: any
  selectedEVSpread: any
  selectedNature: string | null
  totalStats: number
  isBuildPage?: boolean
  t: (key: string) => string
}

export function PokemonOverview({
  pokemon,
  movesetAnalysis,
  selectedMoves,
  selectedItem,
  selectedEVSpread,
  selectedNature,
  totalStats,
  isBuildPage = false,
  t
}: PokemonOverviewProps) {
  const isComplete = selectedMoves.length === 4 && selectedItem

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <img 
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-14 h-14 object-contain"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{formatPokemonName(pokemon.name)}</h3>
          <div className="flex items-center gap-2 mb-2">
            {pokemon.types.map(type => (
              <TypeBadge key={type.type.name} type={type.type.name} />
            ))}
          </div>
          
          {/* Weak to section */}
          {movesetAnalysis?.weaknesses && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Weak to:</h4>
              <div className="flex gap-1 flex-wrap">
                {Object.entries(movesetAnalysis.weaknesses)
                  .map(([type, multiplier]) => [type, Number(multiplier)] as [string, number])
                  .filter(([_, multiplier]) => multiplier > 1)
                  .sort(([_, a], [__, b]) => b - a)
                  .map(([type, multiplier]) => (
                    <div key={type} className="flex items-center gap-1">
                      <TypeBadge type={type} className="text-xs" />
                      <span className="text-xs text-red-600 font-medium">
                        {multiplier}x
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className="text-right">
          <Badge variant={isComplete ? "default" : "secondary"} className="mb-2">
            {isComplete ? 'Complete' : 'In Progress'}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {selectedMoves.length}/4 Moves
          </div>
        </div>
      </div>

      {/* Enhanced Stats with EV and Nature */}
      <PokemonStats 
        pokemon={pokemon} 
        totalStats={totalStats} 
        t={t}
        evSpread={selectedEVSpread}
        selectedNature={selectedNature}
        showNatureStatus={isBuildPage}
      />
    </div>
  )
}
