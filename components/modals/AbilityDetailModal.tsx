'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, X, Zap, Shield, Star, Users } from 'lucide-react'
import { getTypeColor } from '@/lib/utils'
import { formatPokemonName } from '@/lib/utils'
import type { Ability } from 'pokenode-ts'
import type { PokemonWithAbility } from '@/services/abilityService'

interface AbilityDetailModalProps {
  ability: Ability | null
  pokemonWithAbility: PokemonWithAbility[]
  isLoadingPokemon: boolean
  pokemonSearchTerm: string
  onPokemonSearchChange: (value: string) => void
  onClose: () => void
}

export function AbilityDetailModal({ 
  ability, 
  pokemonWithAbility, 
  isLoadingPokemon, 
  pokemonSearchTerm,
  onPokemonSearchChange,
  onClose 
}: AbilityDetailModalProps) {
  if (!ability) return null

  // Filter Pokemon based on search term
  const filteredPokemon = pokemonWithAbility.filter(pokemon =>
    pokemon.name.toLowerCase().includes(pokemonSearchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-background/95 backdrop-blur-sm absolute inset-0" onClick={onClose} />
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10">
        {/* Modal Header */}
        <div className="sticky top-0 bg-card border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold capitalize">{ability.name.replace('-', ' ')}</h2>
            <Badge className="bg-purple-500 text-white">
              ABILITY
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
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {ability.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text || 
                 ability.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect || 
                 'No description available.'}
              </p>
            </CardContent>
          </Card>

          {/* Effect Details */}
          {ability.effect_entries?.find((e: any) => e.language.name === 'en')?.effect && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Effect Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {ability.effect_entries?.find((e: any) => e.language.name === 'en')?.effect}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground capitalize">
                {ability.generation?.name.replace('-', ' ') || 'Unknown'}
              </p>
            </CardContent>
          </Card>

          {/* Pokemon That Have This Ability */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <CardTitle className="text-lg">Pokemon That Have This Ability</CardTitle>
                {pokemonWithAbility.length > 0 && (
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
                  {filteredPokemon.slice(0, 200).map((pokemon) => {
                    // Check if this ability is hidden for this Pokemon
                    const abilityInfo = pokemon.abilities.find(a => a.ability.name === ability.name)
                    const isHidden = abilityInfo?.is_hidden || false
                    
                    return (
                      <Link 
                        key={pokemon.id} 
                        href={`/pokemon/${formatPokemonName(pokemon.name)}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onClose()
                        }}
                      >
                        <div className="flex flex-col items-center p-2 border rounded-lg hover:bg-muted hover:shadow-md transition-all cursor-pointer h-full relative">
                          {isHidden && (
                            <div className="absolute top-1 right-1">
                              <Badge className="bg-yellow-500 text-white text-xs px-1 py-0">
                                H
                              </Badge>
                            </div>
                          )}
                          <img 
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            className="w-12 h-12 object-contain mb-1"
                          />
                          <span className="text-xs font-medium capitalize text-center">
                            {pokemon.name.replace('-', ' ')}
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
                    )
                  })}
                  {filteredPokemon.length > 200 && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground col-span-full">
                      +{filteredPokemon.length - 200} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    {pokemonSearchTerm ? 'No Pokemon found matching your search.' : 'No Pokemon found that have this ability'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
