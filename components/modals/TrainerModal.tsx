import { X, Trophy, Shield, Zap, Star, Activity } from 'lucide-react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { TeamRecommendation } from '@/components/team/TeamRecommendation'
import { Trainer, Pokemon } from '@/types/pokemon'
import { formatPokemonName } from '@/lib/utils'

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
  if (!trainer) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b p-6 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
              {trainer.name.literal}
            </h2>
            <span className="ml-4 px-3 py-1 bg-blue-900 text-blue-200 rounded-full font-medium">
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

        <div className="p-6">
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
                        <div className="flex gap-1 mb-3">
                          {pokemon.types.map((type: any) => (
                            <TypeBadge key={type.type.name} type={type.type.name} className="text-xs" />
                          ))}
                        </div>
                        
                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {/* Basic Info */}
                          <div className="space-y-2">
                            {pokemon.ability && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Ability:</span>
                                <span className="font-medium capitalize">{pokemon.ability}</span>
                              </div>
                            )}
                            {pokemon.nature && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Nature:</span>
                                <span className="font-medium capitalize">{pokemon.nature}</span>
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
                              <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
                                <div>HP: {pokemon.ivs.hp}</div>
                                <div>ATK: {pokemon.ivs.atk}</div>
                                <div>DEF: {pokemon.ivs.def}</div>
                                <div>SPA: {pokemon.ivs.spa}</div>
                                <div>SPD: {pokemon.ivs.spd}</div>
                                <div>SPE: {pokemon.ivs.spe}</div>
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
                                <span 
                                  key={moveIndex}
                                  className="px-2 py-1 bg-gray-700 text-gray-200 rounded text-xs font-medium capitalize"
                                >
                                  {move.replace(/_/g, ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* EVs */}
                        {pokemon.evs && (
                          <div className="mt-3 text-xs">
                            <div className="font-medium text-gray-300 mb-1">EVs:</div>
                            <div className="flex gap-x-4">
                              {pokemon.evs.hp > 0 && <span>HP: {pokemon.evs.hp}</span>}
                              {pokemon.evs.atk > 0 && <span>ATK: {pokemon.evs.atk}</span>}
                              {pokemon.evs.def > 0 && <span>DEF: {pokemon.evs.def}</span>}
                              {pokemon.evs.spa > 0 && <span>SPA: {pokemon.evs.spa}</span>}
                              {pokemon.evs.spd > 0 && <span>SPD: {pokemon.evs.spd}</span>}
                              {pokemon.evs.spe > 0 && <span>SPE: {pokemon.evs.spe}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {matchup && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Battle Analysis</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-950 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center text-blue-200">
                        <Shield className="w-4 h-4 mr-2" />
                        Team Stats
                      </h4>
                      <div className="text-sm space-y-1">
                        <div>Team Size: {trainerPokemon.length} Pokemon</div>
                        <div>Average Level: {matchup.averageLevel}</div>
                        <div>Battle Format: {trainer.battleFormat}</div>
                      </div>
                    </div>

                    <div className="bg-green-950 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center text-green-200">
                        <Zap className="w-4 h-4 mr-2" />
                        Strong Against
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchup.strengths.map(type => (
                          <TypeBadge key={type} type={type} />
                        ))}
                      </div>
                    </div>

                    <div className="bg-red-950 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center text-red-200">
                        <Star className="w-4 h-4 mr-2" />
                        Weak Against
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchup.weaknesses.map(type => (
                          <TypeBadge key={type} type={type} />
                        ))}
                      </div>
                    </div>

                    <div className="bg-yellow-950 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-yellow-200">Battle Tips</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Bring Pokemon that are strong against {matchup.weaknesses.slice(0, 2).join(' and ')} types</li>
                        <li>• Be prepared for {matchup.strengths.slice(0, 2).join(' and ')} type moves</li>
                        <li>• Recommended level: {matchup.averageLevel + 5}+ for easier battles</li>
                        {trainer.bag.length > 0 && (
                          <li>• Trainer has healing items: {trainer.bag.map((item: any) => item.item).join(', ')}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Team Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Team Recommendations</h3>
                  <TeamRecommendation
                    trainerTeam={trainerPokemon}
                    trainerWeaknesses={matchup.weaknesses}
                    trainerStrengths={matchup.strengths}
                    averageLevel={matchup.averageLevel}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
