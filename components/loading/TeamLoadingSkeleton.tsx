import { Users, Shield, Search } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface TeamLoadingSkeletonProps {
  onClearAll: () => void
  loadingTypes?: boolean
}

// Special Forms Loading Component
export function SpecialFormsLoadingSkeleton() {
  const { t } = useLanguage()

  return (
    <div className="col-span-full text-center py-8">
      <div className="inline-flex items-center gap-2 text-purple-600">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
        <span className="text-sm">{t('common.loading')} special forms...</span>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3 animate-pulse">
            <div className="h-16 bg-purple-100 rounded mb-2"></div>
            <div className="h-3 bg-purple-100 rounded w-3/4 mb-1"></div>
            <div className="h-2 bg-purple-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TeamLoadingSkeleton({ onClearAll, loadingTypes = false }: TeamLoadingSkeletonProps) {
  const { t } = useLanguage()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('team.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('team.subtitle')}
        </p>
        {loadingTypes && (
          <div className="mt-4 inline-flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm">{t('common.loading')} {t('types.types')}...</span>
          </div>
        )}
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
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-green-600">
                <Shield className="w-5 h-5 mr-2" />
                {t('team.teamStrengths')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                  <span className="text-sm text-gray-500">{t('common.loading')} types...</span>
                </div>
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
                <Shield className="w-5 h-5 mr-2" />
                {t('team.teamWeaknesses')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                  <span className="text-sm text-gray-500">{t('common.loading')} types...</span>
                </div>
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Search className="w-5 h-5 mr-2" />
            {t('team.pokemonLibrary')}
          </h2>
          <div className="h-8 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>

        <div className="border-t border-b border-gray-100 bg-gray-50/50 -mx-6 px-6 py-4 mb-6">
          {loadingTypes && (
            <div className="col-span-full text-center py-4 mb-4">
              <div className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm">{t('common.loading')} {t('types.types')} for Pokemon...</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-white border rounded-lg p-3 animate-pulse">
                <div className="h-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-1 mt-2">
                  <div className="h-4 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4 pt-4 border-t border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
