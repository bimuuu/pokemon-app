import { X, Trophy, Shield, Zap, Star, Activity } from 'lucide-react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { Badge } from '@/components/ui/badge'
import { TeamRecommendation } from '@/components/team/TeamRecommendation'
import { AbilityDetailModal } from '@/components/modals/AbilityDetailModal'
import { MoveDetailModal } from '@/components/modals/MoveDetailModal'
import { NatureDetailModal } from '@/components/modals/NatureDetailModal'
import { Trainer, Pokemon } from '@/types/pokemon'
import { formatPokemonName } from '@/lib/utils'
import { useState, useEffect } from 'react'
import type { Ability } from 'pokenode-ts'
import type { Move } from 'pokenode-ts'
import type { PokemonWithAbility } from '@/services/abilityService'
import type { PokemonWithMove } from '@/services/moveService'

interface TrainerModalProps {
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

export default function TrainerModal({ trainer, trainerPokemon, matchup, onClose }: TrainerModalProps) {
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null)
  const [selectedMove, setSelectedMove] = useState<Move | null>(null)
  const [selectedNature, setSelectedNature] = useState<string | null>(null)
  const [pokemonWithAbility, setPokemonWithAbility] = useState<PokemonWithAbility[]>([])
  const [pokemonWithMove, setPokemonWithMove] = useState<PokemonWithMove[]>([])
  const [isLoadingPokemon, setIsLoadingPokemon] = useState(false)
  const [pokemonSearchTerm, setPokemonSearchTerm] = useState('')

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [onClose])

  if (!trainer) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999999] p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-card rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden relative z-[1000000]">
        <style jsx global>{`
          .type-badge {
            transform: none !important;
          }
        `}</style>
        <div className="sticky top-0 bg-card border-b p-6 flex items-center justify-between z-20">
          <div className="flex items-center overflow-hidden">
            <h2 className="text-2xl font-bold flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
              {trainer.name.literal}
            </h2>
            <span className="ml-4 px-3 py-1 bg-blue-900 text-blue-200 rounded-full font-medium relative z-10">
              {(trainer as any).type}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Team</h3>
              <div className="space-y-4">
                {trainerPokemon.map((pokemon, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        className="w-20 h-20 object-contain"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg">{formatPokemonName(pokemon.name)}</h4>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-400">Lv. {pokemon.level}</span>
                            {pokemon.gender && (
                              <span className="ml-2 text-xs text-gray-500">
                                {pokemon.gender === 'MALE' ? '♂' : '♀'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 mb-3 relative z-10">
                          {pokemon.types.map((type: any) => (
                            <span key={type.type.name} className="inline-block">
                              <TypeBadge type={type.type.name} className="text-xs" />
                            </span>
                          ))}
                        </div>
                        
                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {/* Basic Info */}
                          <div className="space-y-2">
                            {pokemon.ability && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Ability:</span>
                                <button
                                  onClick={() => setSelectedAbility({ name: pokemon.ability } as Ability)}
                                  className="cursor-pointer transition-transform hover:scale-105"
                                >
                                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0 px-3 py-1">
                                    {pokemon.ability.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </Badge>
                                </button>
                              </div>
                            )}
                            {pokemon.nature && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Nature:</span>
                                <button
                                  onClick={() => setSelectedNature(pokemon.nature || null)}
                                  className="cursor-pointer transition-transform hover:scale-105"
                                >
                                  <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 px-3 py-1">
                                    {pokemon.nature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </Badge>
                                </button>
                              </div>
                            )}
                            {pokemon.heldItem && pokemon.heldItem.length > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Held Item:</span>
                                <span className="font-medium text-xs">{pokemon.heldItem[0]?.replace(/_/g, ' ')}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* IVs */}
                          {pokemon.ivs && (
                            <div>
                              <div className="font-medium text-gray-300 mb-1">IVs:</div>
                              <div className="border border-blue-500 rounded-md p-2 bg-blue-950/40">
                                <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-xs">
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
                        </div>
                        
                        {/* Moveset */}
                        {pokemon.moveset && pokemon.moveset.length > 0 && (
                          <div className="mt-3">
                            <div className="font-medium text-gray-300 mb-2 flex items-center">
                              <Activity className="w-3 h-3 mr-1" />
                              Moveset:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {pokemon.moveset.map((move, moveIndex) => (
                                <button
                                  key={moveIndex}
                                  onClick={() => setSelectedMove({ name: move } as Move)}
                                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white rounded text-xs font-medium capitalize transition-colors cursor-pointer"
                                >
                                  {move.replace(/_/g, ' ').replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* EVs */}
                        {pokemon.evs && (
                          <div className="mt-3">
                            <div className="font-medium text-gray-300 mb-1">EVs:</div>
                            <div className="border border-green-500 rounded-md p-2 bg-green-950/40">
                              <div className="flex gap-x-3">
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
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Recommendations */}
            {matchup && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Team Recommendations</h3>
                <TeamRecommendation
                  trainerTeam={trainerPokemon}
                  trainerWeaknesses={matchup.weaknesses}
                  trainerStrengths={matchup.strengths}
                  averageLevel={matchup.averageLevel}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {selectedAbility && (
        <AbilityDetailModal
          ability={selectedAbility}
          pokemonWithAbility={pokemonWithAbility}
          isLoadingPokemon={isLoadingPokemon}
          pokemonSearchTerm={pokemonSearchTerm}
          onPokemonSearchChange={setPokemonSearchTerm}
          hideGenerationAndPokemon={true}
          onClose={() => {
            setSelectedAbility(null)
            setPokemonWithAbility([])
            setPokemonSearchTerm('')
          }}
        />
      )}
      
      {selectedMove && (
        <MoveDetailModal
          move={selectedMove}
          pokemonWithMove={pokemonWithMove}
          isLoadingPokemon={isLoadingPokemon}
          pokemonSearchTerm={pokemonSearchTerm}
          onPokemonSearchChange={setPokemonSearchTerm}
          hidePokemonSection={true}
          onClose={() => {
            setSelectedMove(null)
            setPokemonWithMove([])
            setPokemonSearchTerm('')
          }}
        />
      )}
      
      {selectedNature && (
        <NatureDetailModal
          nature={selectedNature}
          onClose={() => setSelectedNature(null)}
        />
      )}
    </div>
  )
}
