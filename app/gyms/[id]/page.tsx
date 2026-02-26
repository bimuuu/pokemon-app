'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Trophy, Shield, Zap, Star, Activity, ChevronDown, ChevronUp, MapPin, ArrowLeft, ArrowRight } from 'lucide-react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { Badge } from '@/components/ui/badge'
import { LazyTeamRecommendation } from '@/components/team/LazyTeamRecommendation'
import { AbilityTooltip } from '@/components/common/AbilityTooltip'
import { NatureTooltip } from '@/components/common/NatureTooltip'
import { MoveTooltip } from '@/components/common/MoveTooltip'
import { Trainer, Pokemon } from '@/types/pokemon'
import { fetchTrainerData, fetchTrainersByType, fetchPokemonByName } from '@/lib/api'
import { formatPokemonName, calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'

// Utility function to format search terms
const formatSearchTerm = (term: string): string => {
  return term
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
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
}

export default function TrainerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [trainerPokemon, setTrainerPokemon] = useState<ExtendedPokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [allTrainers, setAllTrainers] = useState<any[]>([])
  const [currentTrainerIndex, setCurrentTrainerIndex] = useState(-1)

  const trainerId = params.id as string

  useEffect(() => {
    loadAllTrainers()
    loadTrainerDetails()
  }, [trainerId])

  const loadAllTrainers = async () => {
    try {
      // Load all trainer types from consolidated files
      const [gymLeadersData, eliteFourData, championsData] = await Promise.all([
        fetchTrainersByType('gym_leaders'),
        fetchTrainersByType('elite_four'),
        fetchTrainersByType('champions')
      ])

      // Get all trainers and sort by name
      const allTrainersList: any[] = []
      
      // Process gym leaders
      Object.entries(gymLeadersData).forEach(([key, trainer]: [string, any]) => {
        allTrainersList.push({
          id: key,
          name: trainer.data.name.literal,
          type: 'Gym Leader',
          region: trainer.region
        })
      })

      // Process elite four
      Object.entries(eliteFourData).forEach(([key, trainer]: [string, any]) => {
        allTrainersList.push({
          id: key,
          name: trainer.data.name.literal,
          type: 'Elite Four',
          region: trainer.region
        })
      })

      // Process champions
      Object.entries(championsData).forEach(([key, trainer]: [string, any]) => {
        allTrainersList.push({
          id: key,
          name: trainer.data.name.literal,
          type: 'Champion',
          region: trainer.region
        })
      })

      // Sort by name alphabetically
      allTrainersList.sort((a, b) => a.name.localeCompare(b.name))
      
      setAllTrainers(allTrainersList)
      
      // Find current trainer index
      const currentIndex = allTrainersList.findIndex(t => t.id === trainerId)
      setCurrentTrainerIndex(currentIndex)
      
    } catch (error) {
      console.error('Error loading all trainers:', error)
    }
  }

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

      // Search in gym leaders
      for (const [key, data] of Object.entries(gymLeadersData)) {
        if (key === trainerId) {
          foundTrainer = {
            ...(data as any),
            location: (data as any).location,
            type: 'Gym Leader'
          }
          trainerType = 'gym_leaders'
          break
        }
      }

      // Search in elite four
      if (!foundTrainer) {
        for (const [key, data] of Object.entries(eliteFourData)) {
          if (key === trainerId) {
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

      // Search in champions
      if (!foundTrainer) {
        for (const [key, data] of Object.entries(championsData)) {
          if (key === trainerId) {
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

  const getNextTrainerName = () => {
    if (currentTrainerIndex >= 0 && currentTrainerIndex < allTrainers.length - 1) {
      return allTrainers[currentTrainerIndex + 1]?.name
    }
    return null
  }

  const getPreviousTrainerName = () => {
    if (currentTrainerIndex > 0) {
      return allTrainers[currentTrainerIndex - 1]?.name
    }
    return null
  }

  const goToNextGym = () => {
    if (currentTrainerIndex >= 0 && currentTrainerIndex < allTrainers.length - 1) {
      const nextTrainer = allTrainers[currentTrainerIndex + 1]
      router.push(`/gyms/${nextTrainer.id}`)
    }
  }

  const goToPreviousGym = () => {
    if (currentTrainerIndex > 0) {
      const previousTrainer = allTrainers[currentTrainerIndex - 1]
      router.push(`/gyms/${previousTrainer.id}`)
    }
  }

  const nextTrainerName = getNextTrainerName()
  const previousTrainerName = getPreviousTrainerName()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer details...</p>
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
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/gyms')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gyms
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousGym}
              disabled={currentTrainerIndex <= 0}
              className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {previousTrainerName || 'Previous'}
            </button>
            
            <span className="text-sm text-gray-500">
              {currentTrainerIndex >= 0 ? `${currentTrainerIndex + 1} / ${allTrainers.length}` : '- / -'}
            </span>
            
            <button
              onClick={goToNextGym}
              disabled={currentTrainerIndex >= allTrainers.length - 1 || currentTrainerIndex < 0}
              className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg transition-colors"
            >
              {nextTrainerName || 'Next'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Trainer Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center overflow-hidden mb-3">
            <h1 className="text-2xl font-bold flex items-center">
              <Trophy className="w-6 h-6 mr-3 text-yellow-500" />
              {trainer.name.literal}
            </h1>
            <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium text-sm">
              {(trainer as any).type}
            </span>
          </div>
          {(trainer as any).location && (
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="font-medium">{(trainer as any).location.gym_location || (trainer as any).location.type}</span>
            </div>
          )}
          {(trainer as any).location && (trainer as any).location.badge && (trainer as any).location.badge.trim() !== "" && (
            <div className="flex items-center text-gray-600">
              <Trophy className="w-5 h-5 mr-2" />
              <span className="font-medium">Reward:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
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

        {/* Team and Recommendations Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-6">
          {/* Team Section - Left */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Team ({(trainer as any).data.team.length} Pokemon)
            </h2>
            
            <div className="space-y-3">
              {trainerPokemon.map((pokemon, index) => (
                <PokemonCard key={`${pokemon.name}-${pokemon.level}-${pokemon.ability}-${pokemon.nature}`} pokemon={pokemon} />
              ))}
            </div>
          </div>

          {/* Team Recommendations Section - Right */}
          {matchup && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
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
