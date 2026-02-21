'use client'

import { BrainCircuit } from 'lucide-react'
import { TrainerTeamData } from '../services/teamAnalysisService'

interface BattleStrategyProps {
  strategies: string[]
}

export function BattleStrategy({ strategies }: BattleStrategyProps) {
  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2 flex items-center text-purple-700">
        <BrainCircuit className="w-4 h-4 mr-2" />
        Battle Strategy
      </h4>
      <div className="bg-purple-50 rounded-lg p-3">
        <ul className="text-sm text-purple-800 space-y-1">
          {strategies.map((strategy, index) => (
            <li key={index} className="flex items-center">
              <span className="text-purple-500 mr-2">•</span>
              <span>{strategy}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
