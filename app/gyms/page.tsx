'use client'

import { useState, useEffect } from 'react'
import { Trophy, Users, MapPin } from 'lucide-react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { Trainer, Pokemon } from '@/types/pokemon'
import { fetchTrainersByType } from '@/lib/api'
import { REGIONS } from '@/lib/constants'

export default function GymsPage() {
  const [selectedRegion, setSelectedRegion] = useState('kanto')
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRegionTrainers()
  }, [selectedRegion])

  const loadRegionTrainers = async () => {
    setLoading(true)
    try {
      // Load all trainer types from consolidated files
      const [gymLeadersData, eliteFourData, championsData] = await Promise.all([
        fetchTrainersByType('gym_leaders'),
        fetchTrainersByType('elite_four'),
        fetchTrainersByType('champions')
      ])

      // Filter trainers by selected region and format data
      const allTrainers: any[] = []
      
      // Process gym leaders
      Object.entries(gymLeadersData).forEach(([key, trainer]: [string, any]) => {
        if (trainer.region === selectedRegion && trainer.data && trainer.data.team) {
          allTrainers.push({
            ...trainer.data,
            id: key,
            location: trainer.location,
            region: trainer.region,
            type: 'Gym Leader'
          })
        }
      })

      // Process elite four
      Object.entries(eliteFourData).forEach(([key, trainer]: [string, any]) => {
        if (trainer.region === selectedRegion && trainer.data && trainer.data.team) {
          allTrainers.push({
            ...trainer.data,
            id: key,
            location: {
              gym_location: `${selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)} Elite Four Tower`,
              type: "Elite Four",
              badge: "Elite Four Medal"
            },
            region: trainer.region,
            type: 'Elite Four'
          })
        }
      })

      // Process champions
      Object.entries(championsData).forEach(([key, trainer]: [string, any]) => {
        if (trainer.region === selectedRegion && trainer.data && trainer.data.team) {
          allTrainers.push({
            ...trainer.data,
            id: key,
            location: {
              gym_location: `${trainer.region.charAt(0).toUpperCase() + trainer.region.slice(1)} Championship Hall`,
              type: "Champion",
              badge: "Champion Trophy"
            },
            region: trainer.region,
            type: 'Champion'
          })
        }
      })

      // Calculate average level for each trainer and sort
      const trainersWithAvgLevel = allTrainers.map(trainer => ({
        ...trainer,
        avgLevel: trainer.team && trainer.team.length > 0 
          ? trainer.team.reduce((sum: number, pokemon: any) => sum + pokemon.level, 0) / trainer.team.length
          : 0
      }))

      // Sort trainers by level (low to high) by default
      trainersWithAvgLevel.sort((a, b) => a.avgLevel - b.avgLevel)

      setTrainers(trainersWithAvgLevel)
    } catch (error) {
      console.error('Error loading trainers:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleTrainerClick = (trainerId: string) => {
    window.open(`/gyms/${trainerId}`, '_self')
  }

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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
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
                        onClick={() => handleTrainerClick((trainer as any).id)}
                        className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">
                          {typeof trainer.name === 'string' ? trainer.name : (trainer.name?.literal || trainer.name?.toString() || 'Unknown')}
                        </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Avg Lv. {Math.round((trainer as any).avgLevel)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              category === 'Gym Leader' ? 'bg-gray-100 text-gray-800' :
                              category === 'Elite Four' ? 'bg-purple-100 text-purple-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {(trainer as any).type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Users className="w-4 h-4 mr-1" />
                          {(trainer as any).team ? (trainer as any).team.length : 0} Pokemon
                        </div>
                        {(trainer as any).location && (
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {(trainer as any).location.gym_location || (trainer as any).location.type}
                          </div>
                        )}
                        {(trainer as any).location && (trainer as any).location.badge && (trainer as any).location.badge.trim() !== "" && (
                          <div className="flex items-center text-sm text-gray-600 mb-2">
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
                        <div className="text-xs text-gray-500">
                          Levels: {(trainer as any).team && (trainer as any).team.length > 0 
                            ? `${Math.min(...(trainer as any).team.map((p: any) => p.level))} - ${Math.max(...(trainer as any).team.map((p: any) => p.level))}`
                            : 'N/A'
                          }
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
    </div>
  )
}
