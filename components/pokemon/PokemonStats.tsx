'use client'

import { Zap, TrendingUp, Plus, Minus, X, Check } from 'lucide-react'
import { Pokemon, EVSpread } from '@/types/pokemon'
import { NatureOptimizationService } from '@/features/training/services/NatureOptimizationService'

interface PokemonStatsProps {
  pokemon: Pokemon
  totalStats: number
  t: (key: string) => string
  evSpread?: EVSpread | null
  selectedNature?: string | null
  comparisonPokemon?: Pokemon | null
  onNatureChange?: (nature: string | null) => void
  showNatureStatus?: boolean
}

export function PokemonStats({ pokemon, totalStats, t, evSpread, selectedNature, comparisonPokemon, onNatureChange, showNatureStatus = false }: PokemonStatsProps) {
  const formatStatName = (statName: string) => {
    const statKey = statName.replace('-', '')
    const translationKey = `pokemon.${statKey === 'specialattack' ? 'spAttack' : statKey === 'specialdefense' ? 'spDefense' : statKey}`
    const translation = t(translationKey)
    return translation !== translationKey ? translation : statName.toUpperCase()
  }

  const getNatureEffect = (statName: string): { multiplier: number; isIncreased: boolean; isDecreased: boolean } => {
    if (!selectedNature) return { multiplier: 1, isIncreased: false, isDecreased: false }
    
    const natureEffect = NatureOptimizationService.getNatureEffect(selectedNature)
    const multiplier = natureEffect.multiplier[statName] || 1
    const isIncreased = multiplier > 1
    const isDecreased = multiplier < 1
    
    return { multiplier, isIncreased, isDecreased }
  }

  const calculateFinalStat = (baseStat: number, statName: string): number => {
    const evBonus = evSpread ? Math.floor((evSpread[statName as keyof EVSpread] || 0) / 4) : 0
    const natureEffect = getNatureEffect(statName)
    const natureBonus = Math.floor(baseStat * (natureEffect.multiplier - 1))
    
    return baseStat + evBonus + natureBonus
  }

  const getEVContribution = (statName: string): number => {
    if (!evSpread) return 0
    return Math.floor((evSpread[statName as keyof EVSpread] || 0) / 4)
  }

  const getNatureContribution = (statName: string): number => {
    const baseStat = pokemon.stats.find(s => s.stat.name === statName)?.base_stat || 0
    const natureEffect = getNatureEffect(statName)
    return Math.floor(baseStat * (natureEffect.multiplier - 1))
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Zap className="w-5 h-5 mr-2" />
        {t('pokemon.baseStats')}
      </h2>
      
      {/* Nature Control */}
      {showNatureStatus && (
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{t('pokemon.nature') || 'Nature'}:</span>
            {selectedNature ? (
              <span className="text-sm font-semibold capitalize text-blue-600">{selectedNature}</span>
            ) : (
              <span className="text-sm text-gray-500">{t('pokemon.none') || 'None'}</span>
            )}
          </div>
          {onNatureChange && (
            <div className="flex items-center gap-2">
              {selectedNature ? (
                <button
                  onClick={() => onNatureChange(null)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                  {t('pokemon.removeNature') || 'Remove'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    // Auto-select optimal nature based on highest stat
                    const highestStat = pokemon.stats.reduce((prev, current) => 
                      prev.base_stat > current.base_stat ? prev : current
                    )
                    const lowestStat = pokemon.stats.reduce((prev, current) => 
                      prev.base_stat < current.base_stat ? prev : current
                    )
                    
                    // Simple nature mapping (you can expand this)
                    const natureMap: { [key: string]: string } = {
                      'attack': 'adamant',
                      'defense': 'bold',
                      'special-attack': 'modest',
                      'special-defense': 'calm',
                      'speed': 'timid',
                      'hp': 'hardy'
                    }
                    
                    const optimalNature = natureMap[highestStat.stat.name] || 'hardy'
                    onNatureChange(optimalNature)
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  {t('pokemon.autoNature') || 'Auto'}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Nature Effects Display */}
        {selectedNature && (
          <div className="mt-2 text-xs text-gray-600">
            {(() => {
              const natureEffect = NatureOptimizationService.getNatureEffect(selectedNature)
              
              return (
                <div className="flex gap-3">
                  {natureEffect.increased !== 'none' && natureEffect.increased !== natureEffect.decreased && (
                    <span className="text-green-600">
                      +{formatStatName(natureEffect.increased)}
                    </span>
                  )}
                  {natureEffect.decreased !== 'none' && natureEffect.increased !== natureEffect.decreased && (
                    <span className="text-red-600">
                      -{formatStatName(natureEffect.decreased)}
                    </span>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </div>
      )}
      <div className="space-y-2">
        {pokemon.stats.map(stat => {
          const baseStat = stat.base_stat
          const finalStat = calculateFinalStat(baseStat, stat.stat.name)
          const evContribution = getEVContribution(stat.stat.name)
          const natureContribution = getNatureContribution(stat.stat.name)
          const natureEffect = getNatureEffect(stat.stat.name)
          const percentage = (finalStat / 255) * 100
          
          // Calculate difference with comparison Pokemon
          const comparisonStat = comparisonPokemon?.stats.find(s => s.stat.name === stat.stat.name)
          const comparisonStatValue = comparisonStat?.base_stat || 0
          const difference = comparisonPokemon ? finalStat - comparisonStatValue : 0
          
          return (
            <div key={stat.stat.name}>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium flex items-center gap-1">
                  {formatStatName(stat.stat.name)}
                  {natureEffect.isIncreased && <TrendingUp className="w-3 h-3 text-green-600" />}
                  {natureEffect.isDecreased && <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {finalStat}
                    {(evContribution > 0 || natureContribution !== 0) && (
                      <span className="text-xs">
                        {evContribution > 0 && (
                          <span className="text-green-600 font-medium">
                            {' +'}{evContribution}
                          </span>
                        )}
                        {natureContribution !== 0 && (
                          <span className={`font-medium ${natureContribution > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {natureContribution > 0 ? ' +' : ' '}{natureContribution}
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                  {comparisonPokemon && difference !== 0 && (
                    <span className={`text-xs font-medium ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({difference > 0 ? '+' : ''}{difference})
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    comparisonPokemon 
                      ? difference > 0 ? 'bg-green-500' : difference < 0 ? 'bg-red-500' : 'bg-blue-500'
                      : natureEffect.isIncreased ? 'bg-green-500' : natureEffect.isDecreased ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              {/* Stat Breakdown */}
              {(evContribution > 0 || natureContribution !== 0) && (
                <div className="text-xs text-muted-foreground mt-1 space-y-1">
                  {evContribution > 0 && (
                    <div className="flex items-center gap-1">
                      <Plus className="w-3 h-3 text-green-600" />
                      <span>EVs: +{evContribution}</span>
                    </div>
                  )}
                  {natureContribution > 0 && (
                    <div className="flex items-center gap-1">
                      <Plus className="w-3 h-3 text-blue-600" />
                      <span>Nature: +{natureContribution}</span>
                    </div>
                  )}
                  {natureContribution < 0 && (
                    <div className="flex items-center gap-1">
                      <Minus className="w-3 h-3 text-red-600" />
                      <span>Nature: {natureContribution}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
        
        {/* Total Stats */}
        <div className="pt-3 mt-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span>{t('pokemon.totalStats')}</span>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">
                {(() => {
                  let finalTotal = totalStats
                  if (evSpread) {
                    finalTotal += Math.floor(Object.values(evSpread).reduce((sum, val) => sum + val, 0) / 4)
                  }
                  if (selectedNature) {
                    pokemon.stats.forEach(stat => {
                      const natureContribution = getNatureContribution(stat.stat.name)
                      finalTotal += natureContribution
                    })
                  }
                  return finalTotal
                })()}
              </span>
              {comparisonPokemon && (
                (() => {
                  let currentTotal = totalStats
                  let comparisonTotal = comparisonPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
                  
                  if (evSpread) {
                    currentTotal += Math.floor(Object.values(evSpread).reduce((sum, val) => sum + val, 0) / 4)
                  }
                  if (selectedNature) {
                    pokemon.stats.forEach(stat => {
                      const natureContribution = getNatureContribution(stat.stat.name)
                      currentTotal += natureContribution
                    })
                  }
                  
                  const difference = currentTotal - comparisonTotal
                  return difference !== 0 ? (
                    <span className={`text-xs font-medium ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({difference > 0 ? '+' : ''}{difference})
                    </span>
                  ) : null
                })()
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ 
                width: `${(() => {
                  let finalTotal = totalStats
                  if (evSpread) {
                    finalTotal += Math.floor(Object.values(evSpread).reduce((sum, val) => sum + val, 0) / 4)
                  }
                  if (selectedNature) {
                    pokemon.stats.forEach(stat => {
                      const natureContribution = getNatureContribution(stat.stat.name)
                      finalTotal += natureContribution
                    })
                  }
                  return (finalTotal / (255 * 6)) * 100
                })()}%` 
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
