import { Users, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface TeamLoadingSkeletonProps {
  onClearAll: () => void
}

export function TeamLoadingSkeleton({ onClearAll }: TeamLoadingSkeletonProps) {
  const { t } = useLanguage()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('team.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('team.subtitle')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {t('team.yourTeam')}
              </h2>
              <button
                onClick={onClearAll}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t('team.clearAll')}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 animate-pulse">
                  <div className="text-center text-gray-400">
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
                    <div className="text-sm">{t('team.slot')} {index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-96">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              {t('team.teamStrengths')}
            </h3>
            <div className="space-y-3 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
