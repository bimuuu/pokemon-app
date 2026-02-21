'use client'

import { Target, AlertTriangle } from 'lucide-react'
import { TypeBadge } from '@/components/ui/TypeBadge'

interface TypeTargetsProps {
  weaknesses: string[]
  strengths: string[]
}

export function TypeTargets({ weaknesses, strengths }: TypeTargetsProps) {
  return (
    <>
      {/* Target These Types */}
      <div className="bg-green-50 rounded-lg p-3 mb-3">
        <h4 className="font-medium mb-2 flex items-center text-green-700">
          <Target className="w-4 h-4 mr-2" />
          Target These Types
        </h4>
        <div className="flex flex-wrap gap-2">
          {weaknesses.slice(0, 4).map(type => (
            <div key={type} className="flex items-center gap-1">
              <TypeBadge type={type} />
              <span className="text-xs font-bold text-green-600">2x</span>
            </div>
          ))}
        </div>
      </div>

      {/* Avoid These Types */}
      <div className="bg-red-50 rounded-lg p-3 mb-3">
        <h4 className="font-medium mb-2 flex items-center text-red-700">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Avoid These Types
        </h4>
        <div className="flex flex-wrap gap-2">
          {strengths.slice(0, 4).map(type => (
            <div key={type} className="flex items-center gap-1">
              <TypeBadge type={type} />
              <span className="text-xs font-bold text-red-600">2x</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
