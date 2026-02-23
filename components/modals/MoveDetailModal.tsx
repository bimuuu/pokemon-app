'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, X, Sword, Target, Star, Activity, Zap } from 'lucide-react'
import { getTypeColor } from '@/lib/utils'
import { ColorUtils } from '@/utils/colorUtils'
import { formatPokemonName } from '@/lib/utils'
import type { Move } from 'pokenode-ts'
import type { PokemonWithMove } from '@/services/moveService'
import { MoveService } from '@/services/moveService'
import { useState, useEffect } from 'react'

interface MoveDetailModalProps {
  move: Move | null
  pokemonWithMove: PokemonWithMove[]
  isLoadingPokemon: boolean
  pokemonSearchTerm: string
  onPokemonSearchChange: (value: string) => void
  onClose: () => void
  hidePokemonSection?: boolean
}

export function MoveDetailModal({ 
  move, 
  pokemonWithMove, 
  isLoadingPokemon, 
  pokemonSearchTerm,
  onPokemonSearchChange,
  onClose,
  hidePokemonSection = false
}: MoveDetailModalProps) {
  const [fullMoveData, setFullMoveData] = useState<Move | null>(null)
  const [isLoadingMove, setIsLoadingMove] = useState(false)

  useEffect(() => {
    async function fetchMoveData() {
      if (move?.name) {
        setIsLoadingMove(true)
        try {
          const data = await MoveService.fetchMoveDetails(move.name)
          setFullMoveData(data)
          
          // Also fetch Pokemon with this move
          if (data) {
            const pokemon = await MoveService.fetchPokemonWithMove(move.name)
            // We can't update pokemonWithMove from here since it's passed as prop
          }
        } catch (error) {
          console.error('Failed to fetch move data:', error)
        } finally {
          setIsLoadingMove(false)
        }
      }
    }

    fetchMoveData()
  }, [move?.name])

  // Use fullMoveData if available, otherwise fall back to the basic move
  const displayMove = fullMoveData || move
  
  if (!displayMove) return null

  // Filter Pokemon based on search term
  const filteredPokemon = pokemonWithMove.filter(pokemon =>
    pokemon.name.toLowerCase().includes(pokemonSearchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000001] p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onClose(); }} />
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-[1000002]" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold capitalize">
              {isLoadingMove ? 'Loading...' : displayMove.name.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')}
            </h2>
            {displayMove.type && (
              <Badge 
                className="text-white border-0"
                style={{ backgroundColor: getTypeColor(displayMove.type.name) }}
              >
                {displayMove.type.name.toUpperCase()}
              </Badge>
            )}
            <Badge className={`${ColorUtils.getDamageClassColor(displayMove.damage_class?.name || 'status')} text-white`}>
              {displayMove.damage_class?.name.toUpperCase() || 'STATUS'}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Power</CardTitle>
                <Sword className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${ColorUtils.getPowerColor(displayMove.power)}`}>
                  {isLoadingMove ? '—' : (displayMove.power || '—')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${ColorUtils.getAccuracyColor(displayMove.accuracy || 0)}`}>
                  {isLoadingMove ? '—' : (displayMove.accuracy ? `${displayMove.accuracy}%` : '—')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PP</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {isLoadingMove ? '—' : (displayMove.pp || '—')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isLoadingMove ? 'Loading description...' : (
                  displayMove.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text || 
                  displayMove.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect || 
                  'No description available.'
                )}
              </p>
            </CardContent>
          </Card>

          {/* Effect Details */}
          {displayMove.effect_entries?.find((e: any) => e.language.name === 'en')?.effect && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Effect Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {isLoadingMove ? 'Loading effect details...' : (
                    displayMove.effect_entries?.find((e: any) => e.language.name === 'en')?.effect
                  )}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pokemon That Can Learn This Move */}
          {!hidePokemonSection && (
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <CardTitle className="text-lg">Pokemon That Can Learn This Move</CardTitle>
                  {pokemonWithMove.length > 0 && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search Pokemon by name..."
                        value={pokemonSearchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPokemonSearchChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingPokemon ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Loading Pokemon...</p>
                  </div>
                ) : filteredPokemon.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {filteredPokemon.slice(0, 200).map((pokemon) => (
                      <Link 
                        key={pokemon.id} 
                        href={`/pokemon/${formatPokemonName(pokemon.name)}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onClose()
                        }}
                      >
                        <div className="flex flex-col items-center p-2 border rounded-lg hover:bg-muted hover:shadow-md transition-all cursor-pointer h-full">
                          <img 
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            className="w-12 h-12 object-contain mb-1"
                          />
                          <span className="text-xs font-medium capitalize text-center">
                            {pokemon.name.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')}
                          </span>
                          <div className="flex gap-1 mt-1">
                            {pokemon.types.map((type: any) => (
                              <Badge 
                                key={type.type.name} 
                                className="text-white border-0 text-xs"
                                style={{ backgroundColor: getTypeColor(type.type.name) }}
                              >
                                {type.type.name.slice(0, 3).toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                    {filteredPokemon.length > 200 && (
                      <div className="flex items-center justify-center text-sm text-muted-foreground col-span-full">
                        +{filteredPokemon.length - 200} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      {pokemonSearchTerm ? 'No Pokemon found matching your search.' : 'No Pokemon found that can learn this move'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
