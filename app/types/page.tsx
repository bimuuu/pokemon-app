'use client'

import { useState } from 'react'
import { POKEMON_TYPES, TYPE_EFFECTIVENESS } from '@/lib/constants'
import { getTypeColor } from '@/lib/utils'

export default function TypeChartPage() {
  const [selectedType, setSelectedType] = useState<string>('')
  const [viewMode, setViewMode] = useState<'offensive' | 'defensive'>('offensive')

  const getEffectivenessColor = (multiplier: number) => {
    switch (multiplier) {
      case 0: return 'bg-gray-900 text-white'
      case 0.25: return 'bg-gray-700 text-white'
      case 0.5: return 'bg-orange-600 text-white'
      case 1: return 'bg-gray-600 text-white'
      case 2: return 'bg-green-600 text-white'
      case 4: return 'bg-green-800 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const getEffectivenessText = (multiplier: number) => {
    switch (multiplier) {
      case 0: return 'Immune'
      case 0.25: return '¼x'
      case 0.5: return '½x'
      case 1: return '1x'
      case 2: return '2x'
      case 4: return '4x'
      default: return '1x'
    }
  }

  const getAttackingEffectiveness = (attackingType: string, defendingType: string) => {
    const attacker = TYPE_EFFECTIVENESS[attackingType as keyof typeof TYPE_EFFECTIVENESS]
    if (!attacker) return 1
    return attacker.attacking[defendingType as keyof typeof attacker.attacking] || 1
  }

  const getDefendingEffectiveness = (defendingType: string, attackingType: string) => {
    const defender = TYPE_EFFECTIVENESS[defendingType as keyof typeof TYPE_EFFECTIVENESS]
    if (!defender) return 1
    return defender.defending[attackingType as keyof typeof defender.defending] || 1
  }

  const getTypeMatchups = (type: string) => {
    const offensive = POKEMON_TYPES.map(targetType => ({
      type: targetType,
      effectiveness: getAttackingEffectiveness(type, targetType)
    })).sort((a, b) => b.effectiveness - a.effectiveness)

    const defensive = POKEMON_TYPES.map(attackingType => ({
      type: attackingType,
      effectiveness: getDefendingEffectiveness(type, attackingType)
    })).sort((a, b) => b.effectiveness - a.effectiveness)

    return { offensive, defensive }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Type Chart</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Interactive type effectiveness chart. Click on any type to see detailed matchups.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm border p-6">
        <div className="mb-6 bg-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-gray-200">Effectiveness Legend:</h4>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-xs">4x</div>
              <span>Ultra Effective</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs">2x</div>
              <span>Super Effective</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1x</div>
              <span>Neutral</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center font-bold text-xs">½x</div>
              <span>Not Very Effective</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-xs">0x</div>
              <span>No Effect</span>
            </div>
          </div>
        </div>

        {selectedType && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-blue-400">Summary for {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-900 p-4 rounded-lg border border-green-700">
                <h5 className="font-medium text-green-300 mb-2">Super Effective Against</h5>
                <div className="flex flex-wrap gap-2">
                  {getTypeMatchups(selectedType).offensive
                    .filter(({ effectiveness }) => effectiveness > 1)
                    .map(({ type }) => (
                      <span 
                        key={type}
                        className="px-3 py-1 rounded-full text-white text-xs font-medium shadow-sm"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        {type}
                      </span>
                    ))}
                </div>
              </div>
              <div className="bg-orange-900 p-4 rounded-lg border border-orange-700">
                <h5 className="font-medium text-orange-300 mb-2">Not Very Effective Against</h5>
                <div className="flex flex-wrap gap-2">
                  {getTypeMatchups(selectedType).offensive
                    .filter(({ effectiveness }) => effectiveness < 1 && effectiveness > 0)
                    .map(({ type }) => (
                      <span 
                        key={type}
                        className="px-3 py-1 rounded-full text-white text-xs font-medium shadow-sm"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        {type}
                      </span>
                    ))}
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <h5 className="font-medium text-gray-300 mb-2">No Effect Against</h5>
                <div className="flex flex-wrap gap-2">
                  {getTypeMatchups(selectedType).offensive
                    .filter(({ effectiveness }) => effectiveness === 0)
                    .map(({ type }) => (
                      <span 
                        key={type}
                        className="px-3 py-1 rounded-full text-white text-xs font-medium shadow-sm"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        {type}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-300">Select Type:</label>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedType('')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedType === '' 
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              Overview
            </button>
            {POKEMON_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                  selectedType === type 
                    ? 'ring-2 ring-offset-2 ring-blue-400 shadow-lg transform scale-105' 
                    : 'hover:opacity-80 hover:shadow-md'
                }`}
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {selectedType ? (
          <div className="space-y-6">
            <div className="text-center">
              <div 
                className="inline-block px-6 py-3 rounded-lg text-white text-xl font-bold shadow-lg"
                style={{ backgroundColor: getTypeColor(selectedType) }}
              >
                {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Type
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-900 to-orange-900 p-6 rounded-lg border border-red-700">
                <h3 className="text-lg font-semibold mb-4 text-red-300">Offensive Matchups</h3>
                <div className="space-y-3">
                  {getTypeMatchups(selectedType).offensive.map(({ type, effectiveness }) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                          style={{ backgroundColor: getTypeColor(type) }}
                        >
                          {type.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium capitalize text-gray-300">{type}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getEffectivenessColor(effectiveness)}`}>
                        {getEffectivenessText(effectiveness)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-6 rounded-lg border border-blue-700">
                <h3 className="text-lg font-semibold mb-4 text-blue-300">Defensive Matchups</h3>
                <div className="space-y-3">
                  {getTypeMatchups(selectedType).defensive.map(({ type, effectiveness }) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                          style={{ backgroundColor: getTypeColor(type) }}
                        >
                          {type.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium capitalize text-gray-300">{type}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getEffectivenessColor(effectiveness)}`}>
                        {getEffectivenessText(effectiveness)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center text-gray-400">
              <p className="text-lg">Select a type above to see detailed matchups</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {POKEMON_TYPES.map(type => {
                const matchups = getTypeMatchups(type)
                const superEffective = matchups.offensive.filter(m => m.effectiveness > 1).length
                const weakTo = matchups.defensive.filter(m => m.effectiveness > 1).length
                const resistant = matchups.defensive.filter(m => m.effectiveness < 1 && m.effectiveness > 0).length
                
                return (
                  <div 
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        {type.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold capitalize text-lg text-gray-200">{type}</h3>
                        <p className="text-sm text-gray-400">Click for details</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-green-400">{superEffective}</div>
                        <div className="text-gray-400">Strong vs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-red-400">{weakTo}</div>
                        <div className="text-gray-400">Weak to</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-400">{resistant}</div>
                        <div className="text-gray-400">Resists</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
