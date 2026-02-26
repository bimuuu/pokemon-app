'use client'

import { useState, memo, useMemo, useCallback } from 'react'
import { Trophy, Shield, Zap, Star, Activity, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { Badge } from '@/components/ui/badge'
import { LazyTeamRecommendation } from '@/components/team/LazyTeamRecommendation'
import { AbilityTooltip } from '@/components/common/AbilityTooltip'
import { NatureTooltip } from '@/components/common/NatureTooltip'
import { MoveTooltip } from '@/components/common/MoveTooltip'
import { Trainer, Pokemon } from '@/types/pokemon'
import { formatPokemonName } from '@/lib/utils'

// Utility function to format search terms
const formatSearchTerm = (term: string): string => {
  return term
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/ /g, '-')
}

interface TrainerSlidePanelProps {
  trainer: Trainer | null
  trainerPokemon: ExtendedPokemon[]
  matchup: {
    weaknesses: string[]
    strengths: string[]
    averageLevel: number
  } | null
  onClose: () => void
}

interface ExtendedPokemon extends Pokemon {
  level: number
  moveset?: string[]
  ivs?: {
    hp: number
    atk: number
    def: number
    spa: number
    spd: number
    spe: number
  }
  evs?: {
    hp: number
    atk: number
    def: number
    spa: number
    spd: number
    spe: number
  }
  ability?: string
  nature?: string
  heldItem?: string[]
  gender?: string
}

// Memoized Pokemon Card Component with better comparison
const PokemonCard = memo(({ pokemon }: { pokemon: ExtendedPokemon }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAbilityClick = useCallback((ability: string) => {
    const formattedAbility = formatSearchTerm(ability)
    window.open(`/abilities?search=${encodeURIComponent(formattedAbility)}`, '_blank')
  }, [])

  const handleMoveClick = useCallback((move: string) => {
    const formattedMove = formatSearchTerm(move)
    window.open(`/moves?search=${encodeURIComponent(formattedMove)}`, '_blank')
  }, [])

  const handleNatureClick = useCallback((nature: string) => {
    const formattedNature = formatSearchTerm(nature)
    window.open(`/natures?search=${encodeURIComponent(formattedNature)}`, '_blank')
  }, [])

  // Memoize expensive calculations
  const formattedMoves = useMemo(() => 
    pokemon.moveset?.map(move => 
      move.replace(/_/g, ' ').replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')
    ) || [],
    [pokemon.moveset]
  )

  // Create stable key for memoization
  const pokemonKey = useMemo(() => 
    `${pokemon.name}-${pokemon.level}-${pokemon.ability}-${pokemon.nature}`,
    [pokemon.name, pokemon.level, pokemon.ability, pokemon.nature]
  )

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3 pokemon-card">
      {/* Pokemon Header */}
      <div className="flex items-start space-x-3">
        <img 
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-16 h-16 object-contain flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-lg truncate">{formatPokemonName(pokemon.name)}</h4>
            <div className="text-right flex-shrink-0">
              <span className="text-sm font-medium text-gray-600">Lv. {pokemon.level}</span>
              {pokemon.gender && (
                <span className="ml-2 text-xs text-gray-500">
                  {pokemon.gender === 'MALE' ? '♂' : '♀'}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1 mb-2 flex-wrap">
            {pokemon.types.map((type: any) => (
              <span key={type.type.name} className="inline-block">
                <TypeBadge type={type.type.name} className="text-xs" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        {isExpanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
        {isExpanded ? 'Show Less' : 'Show Details'}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 border-t pt-3">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            {pokemon.ability && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ability:</span>
                <AbilityTooltip ability={{ name: pokemon.ability }}>
                  <button
                    onClick={() => handleAbilityClick(pokemon.ability!)}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0 px-2 py-1 text-xs">
                      {pokemon.ability.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </button>
                </AbilityTooltip>
              </div>
            )}
            {pokemon.nature && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nature:</span>
                <NatureTooltip nature={pokemon.nature}>
                  <button
                    onClick={() => handleNatureClick(pokemon.nature!)}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 px-2 py-1 text-xs">
                      {pokemon.nature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </button>
                </NatureTooltip>
              </div>
            )}
            {pokemon.heldItem && pokemon.heldItem.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Held Item:</span>
                <span className="font-medium text-xs truncate ml-2">{pokemon.heldItem[0]?.replace(/_/g, ' ')}</span>
              </div>
            )}
          </div>
          
          {/* IVs */}
          {pokemon.ivs && (
            <div>
              <div className="font-medium text-gray-700 mb-2 text-sm">IVs:</div>
              <div className="border border-blue-300 rounded-md p-2 bg-blue-50">
                <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-xs">
                  <div className="font-semibold">HP: {pokemon.ivs.hp}</div>
                  <div className="font-semibold">ATK: {pokemon.ivs.atk}</div>
                  <div className="font-semibold">DEF: {pokemon.ivs.def}</div>
                  <div className="font-semibold">SPA: {pokemon.ivs.spa}</div>
                  <div className="font-semibold">SPD: {pokemon.ivs.spd}</div>
                  <div className="font-semibold">SPE: {pokemon.ivs.spe}</div>
                </div>
              </div>
            </div>
          )}

          {/* Moveset */}
          {pokemon.moveset && pokemon.moveset.length > 0 && (
            <div>
              <div className="font-medium text-gray-700 mb-2 text-sm flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Moveset:
              </div>
              <div className="flex flex-wrap gap-1">
                {formattedMoves.map((move, moveIndex) => (
                  <MoveTooltip key={moveIndex} move={{ name: pokemon.moveset![moveIndex] }}>
                    <button
                      onClick={() => handleMoveClick(pokemon.moveset![moveIndex])}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded text-xs font-medium capitalize transition-colors cursor-pointer"
                    >
                      {move}
                    </button>
                  </MoveTooltip>
                ))}
              </div>
            </div>
          )}

          {/* EVs */}
          {pokemon.evs && (
            <div>
              <div className="font-medium text-gray-700 mb-2 text-sm">EVs:</div>
              <div className="border border-green-300 rounded-md p-2 bg-green-50">
                <div className="flex gap-x-2 flex-wrap">
                  {pokemon.evs.hp > 0 && <span className="font-semibold text-xs">HP: {pokemon.evs.hp}</span>}
                  {pokemon.evs.atk > 0 && <span className="font-semibold text-xs">ATK: {pokemon.evs.atk}</span>}
                  {pokemon.evs.def > 0 && <span className="font-semibold text-xs">DEF: {pokemon.evs.def}</span>}
                  {pokemon.evs.spa > 0 && <span className="font-semibold text-xs">SPA: {pokemon.evs.spa}</span>}
                  {pokemon.evs.spd > 0 && <span className="font-semibold text-xs">SPD: {pokemon.evs.spd}</span>}
                  {pokemon.evs.spe > 0 && <span className="font-semibold text-xs">SPE: {pokemon.evs.spe}</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

PokemonCard.displayName = 'PokemonCard'

export default function TrainerSlidePanel({ trainer, trainerPokemon, matchup, onClose }: TrainerSlidePanelProps) {
  const [visibleCount, setVisibleCount] = useState(2)
  const [showRecommendations, setShowRecommendations] = useState(false)

  // Progressive loading
  const visiblePokemon = trainerPokemon.slice(0, visibleCount)
  const hasMore = trainerPokemon.length > visibleCount

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 2, trainerPokemon.length))
  }, [trainerPokemon.length])

  const handleAbilityClick = useCallback((ability: string) => {
    const formattedAbility = formatSearchTerm(ability)
    window.open(`/abilities?search=${encodeURIComponent(formattedAbility)}`, '_blank')
  }, [])

  if (!trainer) return null

  return (
    <div className="space-y-6">
      {/* Trainer Header */}
      <div className="border-b pb-4">
        <div className="flex items-center overflow-hidden mb-3">
          <h2 className="text-xl font-bold flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            {trainer.name.literal}
          </h2>
          <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium text-xs">
            {(trainer as any).type}
          </span>
        </div>
        {(trainer as any).location && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="font-medium">{(trainer as any).location.gym_location || (trainer as any).location.type}</span>
          </div>
        )}
        {(trainer as any).location && (trainer as any).location.badge && (trainer as any).location.badge.trim() !== "" && (
          <div className="flex items-center text-sm text-gray-600">
            <Trophy className="w-4 h-4 mr-1" />
            <span className="font-medium">Reward:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
              (trainer as any).type === 'Gym Leader' ? 'bg-slate-700 text-white border border-slate-800' :
              (trainer as any).type === 'Elite Four' ? 'bg-purple-700 text-white border border-purple-800' :
              (trainer as any).type === 'Champion' ? 'bg-amber-700 text-white border border-amber-800' :
              'bg-gray-700 text-white'
            }`}>
              {(trainer as any).location.badge}
            </span>
          </div>
        )}
      </div>

      {/* Team Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Team ({trainerPokemon.length} Pokemon)
        </h3>
        
        <div className="space-y-3">
          {visiblePokemon.map((pokemon, index) => (
            <PokemonCard key={`${pokemon.name}-${pokemon.level}-${pokemon.ability}-${pokemon.nature}`} pokemon={pokemon} />
          ))}
          
          {/* Load More Button */}
          {hasMore && (
            <button
              onClick={loadMore}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
            >
              Load {Math.min(2, trainerPokemon.length - visibleCount)} More Pokemon
            </button>
          )}
        </div>
      </div>

      {/* Team Recommendations Section */}
      {matchup && (
        <div>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <h3 className="text-lg font-semibold flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Team Recommendations
            </h3>
            <Star className={`w-4 h-4 transition-transform ${showRecommendations ? 'rotate-180' : ''}`} />
          </button>
          
          {showRecommendations && (
            <div className="mt-3">
              <LazyTeamRecommendation
                trainerTeam={trainerPokemon}
                trainerWeaknesses={matchup.weaknesses}
                trainerStrengths={matchup.strengths}
                averageLevel={matchup.averageLevel}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
