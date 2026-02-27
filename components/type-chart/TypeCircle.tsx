'use client'

import { POKEMON_TYPES } from '@/lib/constants'
import { getTypeColor } from '@/lib/utils'

interface TypeMatchup {
  type: string
  effectiveness: number
}

interface TypeCircleProps {
  type: string
  index: number
  offensiveEffectiveness: number
  defensiveEffectiveness: number
  isSelected: boolean
  selectedTypes: string[]
  onClick: (type: string) => void
}

export default function TypeCircle({ 
  type, 
  index, 
  offensiveEffectiveness, 
  defensiveEffectiveness, 
  isSelected, 
  selectedTypes, 
  onClick 
}: TypeCircleProps) {
  const angle = (index * 360) / POKEMON_TYPES.length
  const radius = 200
  const x = Math.cos((angle * Math.PI) / 180) * radius + 250
  const y = Math.sin((angle * Math.PI) / 180) * radius + 250

  const getBorderColor = () => {
    if (isSelected) return 'border-yellow-400 shadow-yellow-400/50'
    if (offensiveEffectiveness > 1 || defensiveEffectiveness > 1) return 'border-red-400 shadow-red-400/50'
    if ((offensiveEffectiveness < 1 && offensiveEffectiveness > 0) || (defensiveEffectiveness < 1 && defensiveEffectiveness > 0)) {
      return 'border-orange-400 shadow-orange-400/50'
    }
    if (offensiveEffectiveness === 0 || defensiveEffectiveness === 0) return 'border-gray-400 shadow-gray-400/50'
    return 'border-gray-600'
  }

  const getOpacity = () => {
    if (isSelected) return 1
    if (offensiveEffectiveness === 1 && defensiveEffectiveness === 1) return 0.6
    return 1
  }

  return (
    <div
      data-type={type}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${
        isSelected ? 'scale-125 z-20 animate-pulse' : 'hover:scale-110 z-10'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        animation: isSelected ? 'pulse 2s infinite' : undefined,
      }}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer border-4 relative transform transition-all duration-300 hover:rotate-12 ${getBorderColor()}`}
        style={{ 
          backgroundColor: getTypeColor(type),
          opacity: getOpacity()
        }}
        onClick={() => onClick(type)}
      >
        <div className="text-center">
          <div className="text-xs font-bold">{type.charAt(0).toUpperCase()}</div>
          <div className="flex justify-center gap-1">
            {offensiveEffectiveness !== 1 && !isSelected && (
              <div className="text-xs font-bold animate-bounce" style={{ fontSize: '8px' }}>
                {offensiveEffectiveness > 1 ? '⚔️' : offensiveEffectiveness === 0 ? '✗' : '↓'}
              </div>
            )}
            {defensiveEffectiveness !== 1 && !isSelected && (
              <div className="text-xs font-bold animate-bounce" style={{ fontSize: '8px', animationDelay: '0.2s' }}>
                {defensiveEffectiveness > 1 ? '🛡️' : defensiveEffectiveness === 0 ? '✗' : '↑'}
              </div>
            )}
          </div>
        </div>
        {isSelected && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold animate-bounce">
            {selectedTypes.indexOf(type) + 1}
          </span>
        )}
      </div>
      <div className="text-xs text-center mt-1 text-gray-300 font-medium transform transition-all duration-300 hover:scale-110">
        {type}
      </div>
    </div>
  )
}
