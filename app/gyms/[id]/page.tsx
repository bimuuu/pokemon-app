'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Trophy, Shield, Zap, Star, Activity, ChevronDown, ChevronUp, MapPin, ArrowLeft, Target, CheckCircle } from 'lucide-react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { Badge } from '@/components/ui/badge'
import { LazyTeamRecommendation } from '@/components/team/LazyTeamRecommendation'
import { AbilityTooltip } from '@/components/common/AbilityTooltip'
import { NatureTooltip } from '@/components/common/NatureTooltip'
import { MoveTooltip } from '@/components/common/MoveTooltip'
import { HeldItemTooltip } from '@/components/common/HeldItemTooltip'
import { GymTimeline } from '@/components/gym/GymTimeline'
import { GymTip } from '@/components/common/GymTip'
import { Trainer, Pokemon } from '@/types/pokemon'
import { fetchTrainerData, fetchTrainersByType, fetchPokemonByName } from '@/lib/api'
import { formatPokemonName, calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

// Utility function to format search terms
const formatSearchTerm = (term: string): string => {
  return term
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\./g, '.') // Keep dots as-is
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/ /g, '-')
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
const PokemonCard = ({ pokemon }: { pokemon: ExtendedPokemon }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAbilityClick = (ability: string) => {
    const formattedAbility = formatSearchTerm(ability)
    window.open(`/abilities?search=${encodeURIComponent(formattedAbility)}`, '_blank')
  }

  const handleMoveClick = (move: string) => {
    const formattedMove = formatSearchTerm(move)
    window.open(`/moves?search=${encodeURIComponent(formattedMove)}`, '_blank')
  }

  const handleNatureClick = (nature: string) => {
    const formattedNature = formatSearchTerm(nature)
    window.open(`/natures?search=${encodeURIComponent(formattedNature)}`, '_blank')
  }

  // Memoize expensive calculations
  const formattedMoves = pokemon.moveset?.map(move => 
    move.replace(/_/g, ' ').replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')
  ) || []

  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 space-y-3 pokemon-card transition-all duration-300 hover:shadow-lg hover:border-blue-200 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Pokemon Header */}
      <div className="flex items-start space-x-3">
        <img 
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-16 h-16 object-contain flex-shrink-0 pointer-events-none"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-lg truncate pointer-events-none">{formatPokemonName(pokemon.name)}</h4>
            <div className="text-right flex-shrink-0 pointer-events-none">
              <span className="text-sm font-medium text-gray-600">Lv. {pokemon.level}</span>
              {pokemon.gender && (
                <span className="ml-2 text-xs text-gray-500">
                  {pokemon.gender === 'MALE' ? '♂' : '♀'}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1 mb-2 flex-wrap pointer-events-none">
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
        onClick={(e) => {
          e.stopPropagation()
          setIsExpanded(!isExpanded)
        }}
        className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-all duration-200 transform hover:scale-105 group"
      >
        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          {isExpanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
        </div>
        <span className="transition-colors duration-200">{isExpanded ? 'Show Less' : 'Show Details'}</span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div 
          className="space-y-3 border-t pt-3 animate-in slide-in-from-top-2 duration-300 ease-out pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            {pokemon.ability && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ability:</span>
                <AbilityTooltip ability={{ name: pokemon.ability }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAbilityClick(pokemon.ability!)
                    }}
                    className="cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-md active:scale-95 pointer-events-auto"
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
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNatureClick(pokemon.nature!)
                    }}
                    className="cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-md active:scale-95 pointer-events-auto"
                  >
                    <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 px-2 py-1 text-xs">
                      {pokemon.nature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </button>
                </NatureTooltip>
              </div>
            )}
            {pokemon.heldItem && pokemon.heldItem.length > 0 && pokemon.heldItem[0] && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Held Item:</span>
                <HeldItemTooltip itemName={pokemon.heldItem[0]}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const searchTerm = pokemon.heldItem?.[0]?.replace(/_/g, ' ').replace(/ /g, '-').toLowerCase()
                      if (searchTerm) {
                        window.open(`/held-items?search=${encodeURIComponent(searchTerm)}`, '_blank')
                      }
                    }}
                    className="cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-md active:scale-95 pointer-events-auto"
                  >
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-2 py-1 text-xs">
                      {pokemon.heldItem[0]?.replace(/_/g, ' ').replace(/-/g, ' ')}
                    </Badge>
                  </button>
                </HeldItemTooltip>
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
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMoveClick(pokemon.moveset![moveIndex])
                      }}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded text-xs font-medium capitalize transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-sm active:scale-95 pointer-events-auto"
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
}

export default function TrainerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [trainerPokemon, setTrainerPokemon] = useState<ExtendedPokemon[]>([])
  const [loading, setLoading] = useState(true)

  const trainerId = decodeURIComponent(params.id as string).replace(/%20/g, ' ').replace(/%2E/g, '.')
  
  // Parse region-prefixed ID (format: region_trainerName) or legacy ID (format: trainerName)
  const [regionPrefix, trainerName] = trainerId.includes('_') 
    ? trainerId.split('_', 2) 
    : [null, trainerId]

  console.log('=== Page.tsx ===')
  console.log('Raw params.id:', params.id)
  console.log('Decoded trainerId:', trainerId)
  console.log('Region prefix:', regionPrefix, 'Trainer name:', trainerName)
  console.log('Passing to GymTimeline as currentTrainerId:', trainerId)

  useEffect(() => {
    loadTrainerDetails()
  }, [trainerId])

  const loadTrainerDetails = async () => {
    setLoading(true)
    try {
      // Find trainer across all types
      const [gymLeadersData, eliteFourData, championsData] = await Promise.all([
        fetchTrainersByType('gym_leaders'),
        fetchTrainersByType('elite_four'),
        fetchTrainersByType('champions')
      ])

      let foundTrainer: any = null
      let trainerType = ''

      // Search in gym leaders first
      for (const [key, data] of Object.entries(gymLeadersData)) {
        if (key === trainerName) {
          // If region prefix is specified, match it too
          if (!regionPrefix || (data as any).region === regionPrefix) {
            console.log('Found gym leader:', key, 'Region:', (data as any).region)
            foundTrainer = {
              ...(data as any),
              location: (data as any).location,
              type: 'Gym Leader'
            }
            trainerType = 'gym_leaders'
            break
          }
        }
      }

      // Search in elite four with region filtering
      if (!foundTrainer) {
        for (const [key, data] of Object.entries(eliteFourData)) {
          if (key === trainerName) {
            // If region prefix is specified, match it too
            if (!regionPrefix || (data as any).region === regionPrefix) {
              console.log('Found elite four:', key, 'Region:', (data as any).region)
              foundTrainer = {
                ...(data as any),
                location: {
                  gym_location: `${(data as any).region.charAt(0).toUpperCase() + (data as any).region.slice(1)} Elite Four Tower`,
                  type: "Elite Four",
                  badge: "Elite Four Medal"
                },
                type: 'Elite Four'
              }
              trainerType = 'elite_four'
              break
            }
          }
        }
      }

      // Search in champions last with region filtering
      if (!foundTrainer) {
        for (const [key, data] of Object.entries(championsData)) {
          if (key === trainerName) {
            // If region prefix is specified, match it too
            if (!regionPrefix || (data as any).region === regionPrefix) {
              console.log('Found champion:', key, 'Region:', (data as any).region)
              foundTrainer = {
                ...(data as any),
                location: {
                  gym_location: `${(data as any).region.charAt(0).toUpperCase() + (data as any).region.slice(1)} Championship Hall`,
                  type: "Champion",
                  badge: "Champion Trophy"
                },
                type: 'Champion'
              }
              trainerType = 'champions'
              break
            }
          }
        }
      }

      console.log('Final foundTrainer:', foundTrainer?.name || 'None found')

      if (!foundTrainer) {
        router.push('/gyms')
        return
      }

      setTrainer(foundTrainer)

      // Load Pokemon data
      const pokemonData = await Promise.all(
        foundTrainer.data.team.map(async (teamPokemon: any) => {
          const pokemon = await fetchPokemonByName(teamPokemon.species)
          if (pokemon) {
            return {
              ...pokemon,
              level: teamPokemon.level,
              moveset: teamPokemon.moveset,
              ivs: teamPokemon.ivs,
              evs: teamPokemon.evs,
              ability: teamPokemon.ability,
              nature: teamPokemon.nature,
              heldItem: teamPokemon.heldItem,
              gender: teamPokemon.gender
            }
          }
          return null
        })
      )
      
      setTrainerPokemon(pokemonData.filter((p): p is NonNullable<typeof p> => p !== null))
    } catch (error) {
      console.error('Error loading trainer details:', error)
      router.push('/gyms')
    } finally {
      setLoading(false)
    }
  }

  const analyzeMatchup = () => {
    if (!trainer || trainerPokemon.length === 0) return null

    const allTypes = trainerPokemon.flatMap((p) => p.types.map((t: any) => t.type.name))
    const typeCount: Record<string, number> = {}
    
    allTypes.forEach((type: string) => {
      typeCount[type] = (typeCount[type] || 0) + 1
    })

    const allWeaknesses: Record<string, number> = {}
    const allStrengths: Record<string, number> = {}
    
    trainerPokemon.forEach((pokemon) => {
      const weaknesses = calculateTypeWeaknesses(pokemon.types.map((t: any) => t.type.name))
      const strengths = calculateTypeStrengths(pokemon.types.map((t: any) => t.type.name))
      
      Object.entries(weaknesses).forEach(([type, multiplier]) => {
        if (multiplier > 1) {
          allWeaknesses[type] = (allWeaknesses[type] || 0) + multiplier
        }
      })
      
      Object.entries(strengths).forEach(([type, multiplier]) => {
        if (multiplier > 1) {
          allStrengths[type] = Math.max(allStrengths[type] || 0, multiplier)
        }
      })
    })

    return {
      weaknesses: Object.entries(allWeaknesses)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([type]) => type),
      strengths: Object.entries(allStrengths)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([type]) => type),
      averageLevel: Math.round((trainer as any).data.team.reduce((sum: number, p: any) => sum + p.level, 0) / (trainer as any).data.team.length)
    }
  }

  const matchup = analyzeMatchup()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('gyms.loadingTrainerDetails')}</p>
        </div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Trainer not found</p>
          <button
            onClick={() => router.push('/gyms')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Gyms
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6 animate-in fade-in slide-in-from-left-4 duration-500 ease-out">
          <button
            onClick={() => router.push('/gyms')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-all duration-200 transform hover:scale-105 hover:translate-x-1 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="transition-colors duration-200">Back to Gyms</span>
          </button>
        </div>

        {/* Trainer Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-600 ease-out hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center overflow-hidden mb-3">
            <h1 className="text-2xl font-bold flex items-center transition-transform duration-300 hover:scale-105">
              <Trophy className="w-6 h-6 mr-3 text-yellow-500 transition-transform duration-300 hover:rotate-12" />
              {typeof trainer.name === 'string' ? trainer.name : (trainer.name?.literal || trainer.name?.toString() || 'Unknown')}
            </h1>
            <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium text-sm transition-all duration-200 hover:scale-105 hover:bg-blue-200 hover:shadow-md cursor-default">
              {(trainer as any).type}
            </span>
            <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium text-sm transition-all duration-200 hover:scale-105 hover:bg-green-200 hover:shadow-md cursor-default">
              {(trainer as any).region?.charAt(0).toUpperCase() + (trainer as any).region?.slice(1) || 'Unknown Region'}
            </span>
          </div>
          {(trainer as any).location && (
            <div className="flex items-center text-gray-600 mb-2 group">
              <MapPin className="w-5 h-5 mr-2 transition-colors duration-200 group-hover:text-red-500" />
              <span className="font-medium transition-colors duration-200 group-hover:text-gray-800">{(trainer as any).location.gym_location || (trainer as any).location.type}</span>
            </div>
          )}
          {(trainer as any).location && (trainer as any).location.badge && (trainer as any).location.badge.trim() !== "" && (
            <div className="flex items-center text-gray-600 group">
              <Trophy className="w-5 h-5 mr-2 transition-colors duration-200 group-hover:text-yellow-500" />
              <span className="font-medium transition-colors duration-200 group-hover:text-gray-800">Reward:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md cursor-default ${
                (trainer as any).type === 'Gym Leader' ? 'bg-slate-700 text-white border border-slate-800 hover:bg-slate-600' :
                (trainer as any).type === 'Elite Four' ? 'bg-purple-700 text-white border border-purple-800 hover:bg-purple-600' :
                (trainer as any).type === 'Champion' ? 'bg-amber-700 text-white border border-amber-800 hover:bg-amber-600' :
                'bg-gray-700 text-white hover:bg-gray-600'
              }`}>
                {(trainer as any).location.badge}
              </span>
            </div>
          )}
        </div>

        {/* Timeline Progression */}
        <div className="relative">
          <GymTimeline 
            currentTrainerId={trainerId}
            region={(trainer as any).region || 'kanto'}
            className="mb-6"
            showNextRegion={(trainer as any).type === 'Champion'} // Only show next region dot for champions
          />
          
          {/* Timeline Tip */}
          <div className="absolute top-2 right-2">
            <GymTip title="Timeline Tips">
              <div className="space-y-2">
                <p>
                  <strong>🎯 Progress Tracking:</strong> The timeline shows your journey through gyms in this region.
                </p>
                <p>
                  <strong>✅ Completed:</strong> Green checkmarks indicate gyms you've already conquered.
                </p>
                <p>
                  <strong>🔵 Current:</strong> The blue pulsing dot shows your current position.
                </p>
                <p>
                  <strong>🔒 Locked:</strong> Gray dots represent future challenges ahead.
                </p>
                <p>
                  <strong>💡 Pro Tip:</strong> Click any gym in the timeline to quickly navigate there!
                </p>
              </div>
            </GymTip>
          </div>
        </div>

        {/* Team and Recommendations Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-6">
          {/* Team Section - Left */}
          <div className="bg-white rounded-lg shadow-sm border p-6 animate-in fade-in slide-in-from-left-4 duration-700 ease-out hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold mb-4 flex items-center transition-transform duration-300 hover:scale-105">
              <Shield className="w-5 h-5 mr-2 transition-transform duration-300 hover:rotate-12" />
              Team ({(trainer as any).data.team.length} Pokemon)
            </h2>
            
            <div className="space-y-3">
              {trainerPokemon.map((pokemon, index) => (
                <div 
                  key={`${pokemon.name}-${pokemon.level}-${pokemon.ability}-${pokemon.nature}`} 
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PokemonCard pokemon={pokemon} />
                </div>
              ))}
            </div>
          </div>

          {/* Team Recommendations Section - Right */}
          {matchup && (
            <div className="bg-white rounded-lg shadow-sm border p-6 animate-in fade-in slide-in-from-right-4 duration-700 ease-out hover:shadow-lg transition-all">
              <h2 className="text-xl font-semibold mb-4 flex items-center transition-transform duration-300 hover:scale-105">
                <Zap className="w-5 h-5 mr-2 transition-transform duration-300 hover:rotate-12" />
                Team Recommendations
              </h2>
              
              <div className="mt-4">
                <LazyTeamRecommendation
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
  )
}
