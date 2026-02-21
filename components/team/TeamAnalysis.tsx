'use client'

import { Zap, AlertTriangle, Shield } from 'lucide-react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { type TeamAnalysis } from '@/types/pokemon'
import { useLanguage } from '@/contexts/LanguageContext'

interface TeamAnalysisProps {
  teamAnalysis: TeamAnalysis | null
}

export function TeamAnalysis({ teamAnalysis }: TeamAnalysisProps) {
  const { t } = useLanguage()

  if (!teamAnalysis) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-green-600">
          <Zap className="w-5 h-5 mr-2" />
          {t('team.teamStrengths')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {teamAnalysis.strengths.map(strength => (
            <div key={strength.type} className="flex items-center gap-1">
              <TypeBadge type={strength.type} />
              <span className={`text-xs font-bold ${
                strength.multiplier >= 2 ? 'text-green-700' : 
                strength.multiplier >= 1.5 ? 'text-green-600' : 
                'text-green-500'
              }`}>
                {strength.multiplier}x
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {t('team.teamWeaknesses')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {teamAnalysis.weaknesses.map(weakness => (
            <div key={weakness.type} className="flex items-center gap-1">
              <TypeBadge type={weakness.type} />
              <span className={`text-xs font-bold ${
                weakness.multiplier >= 2 ? 'text-red-700' : 
                weakness.multiplier >= 1.5 ? 'text-red-600' : 
                'text-red-500'
              }`}>
                {weakness.multiplier}x
              </span>
              {weakness.count > 1 && (
                <span className="text-xs text-gray-500">
                  ({weakness.count})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {teamAnalysis.recommendations.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-600">
            <Shield className="w-5 h-5 mr-2" />
            {t('team.recommendations')}
          </h3>
          <ul className="space-y-2">
            {teamAnalysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  {typeof rec === 'string' ? (
                    rec
                  ) : (
                    <>
                      {rec.text}
                      {rec.types && (
                        <span className="flex gap-1 ml-2">
                          {rec.types.map(type => (
                            <TypeBadge key={type} type={type} className="text-xs" />
                          ))}
                        </span>
                      )}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
