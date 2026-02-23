'use client'

import { useState, useEffect } from 'react'
import { Trophy, Users, MapPin, Star, Shield, Zap } from 'lucide-react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { SlidePanel } from '@/components/ui/SlidePanel'
import TrainerSlidePanel from '@/components/modals/TrainerSlidePanel'
import { Trainer, Pokemon } from '@/types/pokemon'
import { fetchTrainerData, fetchPokemonByName } from '@/lib/api'
import { REGIONS } from '@/lib/constants'
import { REGION_TRAINERS } from '@/lib/trainers'
import { formatPokemonName, calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'

export default function GymsPage() {
  const [selectedRegion, setSelectedRegion] = useState('kanto')
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [trainerPokemon, setTrainerPokemon] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadRegionTrainers()
  }, [selectedRegion])

  const loadRegionTrainers = async () => {
    setLoading(true)
    try {
      const trainerData = await Promise.all(
        REGION_TRAINERS[selectedRegion as keyof typeof REGION_TRAINERS].map(async (trainerInfo: any) => {
          const data = await fetchTrainerData(selectedRegion, trainerInfo.file)
          return data ? { ...data, type: trainerInfo.type } : null
        })
      )
      setTrainers(trainerData.filter((t: any) => t !== null) as Trainer[])
    } catch (error) {
      console.error('Error loading trainers:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTrainerDetails = async (trainer: Trainer) => {
    setSelectedTrainer(trainer)
    setShowModal(true)
    try {
      const pokemonData = await Promise.all(
        trainer.team.map(async (teamPokemon: any) => {
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
      setTrainerPokemon(pokemonData.filter((p: any): p is NonNullable<typeof p> => p !== null))
    } catch (error) {
      console.error('Error loading trainer Pokemon:', error)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedTrainer(null)
    setTrainerPokemon([])
  }

  const analyzeMatchup = () => {
    if (!selectedTrainer || trainerPokemon.length === 0) return null

    const allTypes = trainerPokemon.flatMap((p: any) => p.types.map((t: any) => t.type.name))
    const typeCount: Record<string, number> = {}
    
    allTypes.forEach((type: string) => {
      typeCount[type] = (typeCount[type] || 0) + 1
    })

    const allWeaknesses: Record<string, number> = {}
    const allStrengths: Record<string, number> = {}
    
    trainerPokemon.forEach((pokemon: any) => {
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
      averageLevel: Math.round(trainerPokemon.reduce((sum, p) => sum + (p as any).level, 0) / trainerPokemon.length)
    }
  }

  const matchup = analyzeMatchup()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Gyms & Elite Trainers</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analyze gym leaders, elite four members, and champions. Plan your strategy with detailed team information and type matchups.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Region:</label>
          <div className="flex gap-2">
            {Object.entries(REGIONS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedRegion(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRegion === key 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trainers...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {['Gym Leader', 'Elite Four', 'Champion'].map(category => {
              const categoryTrainers = trainers.filter(trainer => (trainer as any).type === category)
              if (categoryTrainers.length === 0) return null

              return (
                <div key={category} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center mb-4">
                    <Trophy className={`w-5 h-5 mr-2 ${
                      category === 'Gym Leader' ? 'text-gray-600' :
                      category === 'Elite Four' ? 'text-purple-600' :
                      'text-yellow-600'
                    }`} />
                    <h2 className="text-xl font-bold">{category}</h2>
                    <span className="ml-3 text-sm text-gray-500">
                      ({categoryTrainers.length} trainers)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryTrainers.map((trainer, index) => (
                      <button
                        key={index}
                        onClick={() => loadTrainerDetails(trainer)}
                        className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{trainer.name.literal}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            category === 'Gym Leader' ? 'bg-gray-100 text-gray-800' :
                            category === 'Elite Four' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {(trainer as any).type}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Users className="w-4 h-4 mr-1" />
                          {trainer.team.length} Pokemon
                        </div>
                        <div className="text-xs text-gray-500">
                          Levels: {Math.min(...trainer.team.map(p => p.level))} - {Math.max(...trainer.team.map(p => p.level))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <SlidePanel 
        isOpen={showModal} 
        onClose={closeModal}
        width="w-[600px]"
      >
        <TrainerSlidePanel
          trainer={selectedTrainer}
          trainerPokemon={trainerPokemon}
          matchup={matchup}
          onClose={closeModal}
        />
      </SlidePanel>
    </div>
  )
}
