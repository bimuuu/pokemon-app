'use client'

import { POKEMON_TYPES } from '@/lib/constants'
import { getTypeColor } from '@/lib/utils'

interface TypeMatchup {
  type: string
  effectiveness: number
}

interface TypeSummaryCardProps {
  title: string
  icon: string
  gradientClass: string
  borderClass: string
  matchups: TypeMatchup[]
  type: 'offensive' | 'defensive'
}

export default function TypeSummaryCard({ 
  title, 
  icon, 
  gradientClass, 
  borderClass, 
  matchups, 
  type 
}: TypeSummaryCardProps) {
  const getSuperEffective = () => {
    if (type === 'offensive') {
      return matchups.filter(m => m.effectiveness > 1)
    } else {
      return matchups.filter(m => m.effectiveness < 1 && m.effectiveness > 0)
    }
  }

  const getNotVeryEffective = () => {
    if (type === 'offensive') {
      return matchups.filter(m => m.effectiveness < 1 && m.effectiveness > 0)
    } else {
      return matchups.filter(m => m.effectiveness > 1)
    }
  }

  const superEffective = getSuperEffective()
  const notVeryEffective = getNotVeryEffective()

  return (
    <div className={`space-y-4 animate-fadeIn`}>
      <div className={`${gradientClass} p-4 rounded-lg border ${borderClass} transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
        <h5 className={`font-semibold mb-3 text-center transform transition-all duration-300 hover:scale-110`}>
          {icon} {title}
        </h5>
        
        <div className="space-y-3">
          <div className="bg-green-800 p-3 rounded-lg transform transition-all duration-300 hover:bg-green-700 hover:scale-102">
            <h6 className="font-medium text-green-300 mb-2 text-sm">
              {type === 'offensive' ? 'Super Effective Against' : 'Resists'}
            </h6>
            <div className="flex flex-wrap gap-2">
              {superEffective.map(({ type: typeName }) => (
                <span 
                  key={`${type}-${typeName}`}
                  className="px-3 py-1 rounded-full text-white text-xs font-medium shadow-sm transform transition-all duration-200 hover:scale-110 hover:shadow-lg"
                  style={{ backgroundColor: getTypeColor(typeName) }}
                >
                  {typeName}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-orange-800 p-3 rounded-lg transform transition-all duration-300 hover:bg-orange-700 hover:scale-102">
            <h6 className="font-medium text-orange-300 mb-2 text-sm">
              {type === 'offensive' ? 'Not Very Effective Against' : 'Weak To'}
            </h6>
            <div className="flex flex-wrap gap-2">
              {notVeryEffective.map(({ type: typeName }) => (
                <span 
                  key={`${type}-${typeName}`}
                  className="px-3 py-1 rounded-full text-white text-xs font-medium shadow-sm transform transition-all duration-200 hover:scale-110 hover:shadow-lg"
                  style={{ backgroundColor: getTypeColor(typeName) }}
                >
                  {typeName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
