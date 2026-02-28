'use client'

import { useState, useRef, useEffect } from 'react'
import { POKEMON_TYPES, TYPE_EFFECTIVENESS } from '@/lib/constants'
import { getTypeColor } from '@/lib/utils'
import { TypeSummaryCard, TypeCircle, RelationshipLines } from '@/components/type-chart'

export default function TypeChartPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [typePositions, setTypePositions] = useState<Record<string, { x: number; y: number }>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  const getEffectivenessColor = (multiplier: number) => {
    switch (multiplier) {
      case 0: return '#1f2937'
      case 0.25: return '#374151'
      case 0.5: return '#ea580c'
      case 1: return '#4b5563'
      case 2: return '#16a34a'
      case 4: return '#14532d'
      default: return '#4b5563'
    }
  }

  const getLineColor = (multiplier: number) => {
    switch (multiplier) {
      case 0: return '#6b7280'
      case 0.25: return '#9ca3af'
      case 0.5: return '#fb923c'
      case 1: return '#d1d5db'
      case 2: return '#22c55e'
      case 4: return '#16a34a'
      default: return '#d1d5db'
    }
  }

  const getLineWidth = (multiplier: number) => {
    switch (multiplier) {
      case 0: return 1
      case 0.25: return 1
      case 0.5: return 2
      case 1: return 1
      case 2: return 3
      case 4: return 4
      default: return 1
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

  const getTypeMatchups = (types: string[]) => {
    const calculateCombinedEffectiveness = (attackingType: string, defendingTypes: string[]) => {
      return defendingTypes.reduce((total, defendingType) => {
        const effectiveness = getDefendingEffectiveness(defendingType, attackingType)
        return total * effectiveness
      }, 1)
    }

    const offensive = POKEMON_TYPES.map(targetType => {
      let effectiveness = 1
      if (types.length === 1) {
        effectiveness = getAttackingEffectiveness(types[0], targetType)
      } else if (types.length === 2) {
        // For dual types, offensive effectiveness is the same (you attack with one type at a time)
        effectiveness = Math.max(
          getAttackingEffectiveness(types[0], targetType),
          getAttackingEffectiveness(types[1], targetType)
        )
      }
      return { type: targetType, effectiveness }
    }).sort((a, b) => b.effectiveness - a.effectiveness)

    const defensive = POKEMON_TYPES.map(attackingType => ({
      type: attackingType,
      effectiveness: calculateCombinedEffectiveness(attackingType, types)
    })).sort((a, b) => b.effectiveness - a.effectiveness)

    return { offensive, defensive }
  }

  const handleTypeSelection = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        // Remove type if already selected
        return prev.filter(t => t !== type)
      } else if (prev.length < 2) {
        // Add type if less than 2 selected
        return [...prev, type]
      }
      // If already have 2 types, replace the first one
      return [prev[1], type]
    })
  }

  const updateTypePositions = () => {
    if (!containerRef.current) return
    
    const positions: Record<string, { x: number; y: number }> = {}
    const typeElements = containerRef.current.querySelectorAll('[data-type]')
    
    typeElements.forEach((element) => {
      const type = element.getAttribute('data-type')
      if (type) {
        const rect = element.getBoundingClientRect()
        const containerRect = containerRef.current!.getBoundingClientRect()
        positions[type] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        }
      }
    })
    
    setTypePositions(positions)
  }

  useEffect(() => {
    if (selectedTypes.length > 0) {
      updateTypePositions()
      const handleResize = () => updateTypePositions()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [selectedTypes])

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Type Relationship Chart</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Interactive type relationship visualization. Select types to see their effectiveness relationships.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm border p-6">
        {selectedTypes.length > 0 && (
          <div className="mb-6 animate-fadeIn">
            <div className="text-center mb-4">
              <h4 className="font-semibold text-blue-400 transform transition-all duration-500 hover:scale-105">
                {selectedTypes.length === 1 
                  ? `${selectedTypes[0].charAt(0).toUpperCase() + selectedTypes[0].slice(1)} Type Analysis`
                  : `${selectedTypes[0].charAt(0).toUpperCase() + selectedTypes[0].slice(1)} / ${selectedTypes[1].charAt(0).toUpperCase() + selectedTypes[1].slice(1)} Type Analysis`
                }
              </h4>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TypeSummaryCard
                title="Offensive Matchups"
                icon="⚔️"
                gradientClass="bg-gradient-to-br from-red-900 to-orange-900"
                borderClass="border-red-700"
                matchups={getTypeMatchups(selectedTypes).offensive}
                type="offensive"
              />
              
              <TypeSummaryCard
                title="Defensive Matchups"
                icon="🛡️"
                gradientClass="bg-gradient-to-br from-blue-900 to-indigo-900"
                borderClass="border-blue-700"
                matchups={getTypeMatchups(selectedTypes).defensive}
                type="defensive"
              />
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Select Types (up to 2): {selectedTypes.length > 0 && 
              <span className="ml-2 text-blue-400">
                {selectedTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' / ')}
              </span>
            }
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {POKEMON_TYPES.map(type => (
              <button
                key={type}
                onClick={() => handleTypeSelection(type)}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-all relative ${
                  selectedTypes.includes(type) 
                    ? 'ring-2 ring-offset-2 ring-blue-400 shadow-lg transform scale-105' 
                    : 'hover:opacity-80 hover:shadow-md'
                }`}
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
                {selectedTypes.includes(type) && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {selectedTypes.indexOf(type) + 1}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative bg-gray-900 rounded-lg p-8 transform transition-all duration-500 hover:shadow-2xl" style={{ minHeight: '600px' }} ref={containerRef}>
            {selectedTypes.length > 0 && (
              <RelationshipLines
                selectedTypes={selectedTypes}
                typePositions={typePositions}
                offensiveMatchups={getTypeMatchups(selectedTypes).offensive}
                defensiveMatchups={getTypeMatchups(selectedTypes).defensive}
                getLineColor={getLineColor}
                getLineWidth={getLineWidth}
                getEffectivenessText={getEffectivenessText}
              />
            )}
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: '500px', height: '500px' }}>
                {POKEMON_TYPES.map((type, index) => {
                  let offensiveEffectiveness = 1
                  let defensiveEffectiveness = 1
                  
                  if (selectedTypes.length > 0) {
                    const matchups = getTypeMatchups(selectedTypes)
                    const offensiveMatchup = matchups.offensive.find(m => m.type === type)
                    const defensiveMatchup = matchups.defensive.find(m => m.type === type)
                    
                    offensiveEffectiveness = offensiveMatchup?.effectiveness || 1
                    defensiveEffectiveness = defensiveMatchup?.effectiveness || 1
                  }
                  
                  const isSelected = selectedTypes.includes(type)
                  
                  return (
                    <TypeCircle
                      key={type}
                      type={type}
                      index={index}
                      offensiveEffectiveness={offensiveEffectiveness}
                      defensiveEffectiveness={defensiveEffectiveness}
                      isSelected={isSelected}
                      selectedTypes={selectedTypes}
                      onClick={handleTypeSelection}
                    />
                  )
                })}
              </div>
            </div>

            <div className="absolute top-4 left-4 bg-gray-800 p-3 rounded-lg text-xs transform transition-all duration-300 hover:scale-105">
              <div className="font-bold mb-2 text-gray-300">Line Legend:</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-green-500"></div>
                  <span className="text-gray-400">Super Effective (2x/4x)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-orange-400"></div>
                  <span className="text-gray-400">Not Very Effective (½x/¼x)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-gray-500" style={{ borderStyle: 'dashed' }}></div>
                  <span className="text-gray-400">No Effect (0x)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-gray-400 opacity-30"></div>
                  <span className="text-gray-400">Neutral (1x)</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-blue-500"></div>
                  <span className="text-gray-400">Solid = Offensive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-blue-300" style={{ borderStyle: 'dashed' }}></div>
                  <span className="text-gray-400">Dashed = Defensive</span>
                </div>
              </div>
              {selectedTypes.length === 2 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="font-bold mb-1 text-gray-300">Dual Type:</div>
                  <div className="text-gray-400">
                    Defensive = Type1 × Type2
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
