'use client'

import { lazy, Suspense } from 'react'
import { Zap, Star } from 'lucide-react'

const TeamRecommendationWrapper = lazy(() => import('@/components/team').then(module => ({ default: module.TeamRecommendation })))

interface LazyTeamRecommendationProps {
  trainerTeam: any[]
  trainerWeaknesses: string[]
  trainerStrengths: string[]
  averageLevel: number
}

export function LazyTeamRecommendation({
  trainerTeam,
  trainerWeaknesses,
  trainerStrengths,
  averageLevel
}: LazyTeamRecommendationProps) {
  return (
    <Suspense 
      fallback={
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">Analyzing team composition...</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      }
    >
      <TeamRecommendationWrapper
        trainerTeam={trainerTeam}
        trainerWeaknesses={trainerWeaknesses}
        trainerStrengths={trainerStrengths}
        averageLevel={averageLevel}
      />
    </Suspense>
  )
}
