'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { Pokemon, MoveRecommendation, ItemRecommendation, EVSpread, MovesetAnalysis, ItemOptimizationAnalysis, EVAnalysis, NatureAnalysis, AbilityAnalysis } from '@/types/pokemon'
import { formatPokemonName } from '@/lib/utils'
import { MovesetRecommendationService } from '@/features/training/services/MovesetRecommendationService'
import { HeldItemOptimizationService } from '@/features/training/services/HeldItemOptimizationService'
import { EVCalculationService } from '@/features/training/services/EVCalculationService'
import { NatureOptimizationService } from '@/features/training/services/NatureOptimizationService'
import { AbilityOptimizationService } from '@/features/training/services/AbilityOptimizationService'
import { PokemonStats } from '@/components/pokemon/PokemonStats'
import { AbilityTooltip } from '@/components/common/AbilityTooltip'
import { HeldItemTooltip } from '@/components/common/HeldItemTooltip'
import { MoveTooltip } from '@/components/common/MoveTooltip'
import { NatureTooltip } from '@/components/common/NatureTooltip'
import { 
  Sword, 
  Target, 
  Package, 
  Zap, 
  Shield, 
  TrendingUp, 
  Star,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Share2,
  Calculator,
  RefreshCw,
  Loader2,
  Heart,
  Cloud,
  Mountain,
  Info
} from 'lucide-react'

interface TrainingSummaryProps {
  pokemon: Pokemon
  onOptimize?: () => void
  onExport?: () => void
  onShare?: () => void
  isBuildPage?: boolean
}

export function TrainingSummary({ 
  pokemon, 
  onOptimize,
  onExport,
  onShare,
  isBuildPage = false
}: TrainingSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState<'moves' | 'item' | 'evs' | 'nature' | 'ability'>('moves')
  
  // Moveset state
  const [movesetAnalysis, setMovesetAnalysis] = useState<MovesetAnalysis | null>(null)
  const [selectedMoves, setSelectedMoves] = useState<MoveRecommendation[]>([])
  const [isGeneratingMoveset, setIsGeneratingMoveset] = useState(false)
  
  // Item state
  const [itemAnalysis, setItemAnalysis] = useState<ItemOptimizationAnalysis | null>(null)
  const [selectedItem, setSelectedItem] = useState<ItemRecommendation | null>(null)
  
  // EV state
  const [evAnalysis, setEvAnalysis] = useState<EVAnalysis | null>(null)
  const [selectedEVSpread, setSelectedEVSpread] = useState<EVSpread | null>(null)
  const [customEVSpread, setCustomEVSpread] = useState<EVSpread>({
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0
  })
  const [evTab, setEvTab] = useState<'recommended' | 'custom'>('recommended')
  
  // Nature state
  const [natureAnalysis, setNatureAnalysis] = useState<NatureAnalysis | null>(null)
  const [selectedNature, setSelectedNature] = useState<string | null>(null)
  
  // Ability state
  const [abilityAnalysis, setAbilityAnalysis] = useState<AbilityAnalysis | null>(null)
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)

  // Calculate total base stats
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  
  // Translation function (placeholder - should be passed from parent)
  const t = (key: string) => key // Simplified for now

  useEffect(() => {
    initializeTrainingData()
  }, [pokemon])

  const initializeTrainingData = async () => {
    setIsLoading(true)
    try {
      // Initialize all data in parallel
      const [movesetResult, itemResult, evResult, natureResult, abilityResult] = await Promise.all([
        MovesetRecommendationService.analyzePokemonMoves(pokemon),
        HeldItemOptimizationService.analyzeOptimalItems(pokemon),
        EVCalculationService.analyzeEVOptimization(pokemon),
        NatureOptimizationService.analyzeOptimalNatures(pokemon),
        AbilityOptimizationService.analyzeOptimalAbilities(pokemon)
      ])
      
      setMovesetAnalysis(movesetResult)
      setItemAnalysis(itemResult)
      setEvAnalysis(evResult)
      setNatureAnalysis(natureResult)
      setAbilityAnalysis(abilityResult)
      
      // Auto-select balanced recommendations with buff/debuff support
      const balancedMoveset = MovesetRecommendationService.generateBalancedMoveset(movesetResult)
      setSelectedMoves(balancedMoveset)
      
      const bestItem = HeldItemOptimizationService.getBestItemForRole(itemResult)
      if (bestItem) {
        setSelectedItem(bestItem)
      }
      
      // Auto-select optimal nature and ability
      if (natureResult?.optimalNature) {
        setSelectedNature(natureResult.optimalNature.name)
      }
      
      if (abilityResult?.optimalAbility) {
        setSelectedAbility(abilityResult.optimalAbility.name)
      }
      
      setSelectedEVSpread(evResult.optimalSpread.spread)
    } catch (error) {
      console.error('Failed to initialize training data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotalPower = () => {
    return selectedMoves.reduce((total, move) => total + (move.power || 0), 0)
  }

  const calculateTypeCoverage = () => {
    const coverage = new Set<string>()
    selectedMoves.forEach(move => {
      coverage.add(move.type)
    })
    return coverage.size
  }

  const calculateSTABCount = () => {
    const pokemonTypes = pokemon.types.map(t => t.type.name)
    return selectedMoves.filter(move => 
      pokemonTypes.includes(move.type)
    ).length
  }

  const getLearnMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      'level-up': '📈',
      'machine': '💿',
      'egg': '🥚',
      'tutor': '👨‍🏫',
      'other': '⭐'
    }
    return icons[method] || '❓'
  }

  const getMoveCategoryColor = (category: string) => {
    const colors = {
      attacking: 'bg-red-500',
      buff: 'bg-green-500',
      debuff: 'bg-purple-500',
      support: 'bg-blue-500',
      recovery: 'bg-pink-500',
      weather: 'bg-yellow-500',
      terrain: 'bg-orange-500'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-500'
  }

  const getMoveCategoryIcon = (category: string) => {
    const icons = {
      attacking: Sword,
      buff: TrendingUp,
      debuff: Target,
      support: Shield,
      recovery: Heart,
      weather: Cloud,
      terrain: Mountain
    }
    return icons[category as keyof typeof icons] || Target
  }

  const getMoveCategoryLabel = (category: string) => {
    const labels = {
      attacking: 'Attack',
      buff: 'Buff',
      debuff: 'Debuff',
      support: 'Support',
      recovery: 'Recovery',
      weather: 'Weather',
      terrain: 'Terrain'
    }
    return labels[category as keyof typeof labels] || category
  }

  const getLearnMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      'level-up': 'bg-green-100 text-green-800',
      'machine': 'bg-blue-100 text-blue-800',
      'egg': 'bg-pink-100 text-pink-800',
      'tutor': 'bg-purple-100 text-purple-800',
      'other': 'bg-gray-100 text-gray-800'
    }
    return colors[method] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'mega-stone': <Zap className="h-4 w-4 text-orange-500" />,
      'plate': <Star className="h-4 w-4 text-purple-500" />,
      'choice-item': <Sword className="h-4 w-4 text-red-500" />,
      'offensive-item': <Zap className="h-4 w-4 text-blue-500" />,
      'defensive-item': <Shield className="h-4 w-4 text-green-500" />,
      'recovery-item': <Package className="h-4 w-4 text-teal-500" />,
      'resist-berry': <Package className="h-4 w-4 text-pink-500" />,
      'survival-item': <Shield className="h-4 w-4 text-yellow-500" />
    }
    return icons[category] || <Package className="h-4 w-4 text-gray-500" />
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'mega-stone': 'bg-orange-100 text-orange-800 border-orange-200',
      'plate': 'bg-purple-100 text-purple-800 border-purple-200',
      'choice-item': 'bg-red-100 text-red-800 border-red-200',
      'offensive-item': 'bg-blue-100 text-blue-800 border-blue-200',
      'defensive-item': 'bg-green-100 text-green-800 border-green-200',
      'recovery-item': 'bg-teal-100 text-teal-800 border-teal-200',
      'resist-berry': 'bg-pink-100 text-pink-800 border-pink-200',
      'survival-item': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatColor = (stat: keyof EVSpread, value: number) => {
    if (value === 0) return 'text-gray-400'
    if (value <= 50) return 'text-blue-600'
    if (value <= 100) return 'text-green-600'
    if (value <= 200) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEffectivenessColor = (value: number) => {
    if (value >= 90) return 'text-green-600'
    if (value >= 75) return 'text-blue-600'
    if (value >= 60) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const handleCopyBuild = async () => {
    const buildData = {
      pokemon: pokemon.name,
      moves: selectedMoves.map(m => m.name),
      item: selectedItem?.name,
      evs: selectedEVSpread,
      timestamp: new Date().toISOString()
    }
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildData, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy build:', error)
    }
  }

  // Moveset handlers
  const handleMoveSelect = (move: MoveRecommendation, slotIndex: number) => {
    const newMoves = [...selectedMoves]
    const existingIndex = newMoves.findIndex(m => m.name === move.name)
    
    if (existingIndex !== -1) {
      newMoves[existingIndex] = selectedMoves[slotIndex] || null
    }
    
    newMoves[slotIndex] = move
    setSelectedMoves(newMoves.filter(Boolean))
  }

  const handleMoveRemove = (slotIndex: number) => {
    const newMoves = [...selectedMoves]
    newMoves[slotIndex] = null as any
    setSelectedMoves(newMoves.filter(Boolean))
  }

  const handleGenerateMoveset = async () => {
    if (!movesetAnalysis) return
    
    setIsGeneratingMoveset(true)
    try {
      const balancedMoveset = MovesetRecommendationService.generateBalancedMoveset(movesetAnalysis)
      setSelectedMoves(balancedMoveset)
    } catch (error) {
      console.error('Failed to generate moveset:', error)
    } finally {
      setIsGeneratingMoveset(false)
    }
  }

  const calculateMovesetDiversity = () => {
    if (selectedMoves.length === 0) return { score: 0, categories: [] }
    
    const categories = selectedMoves.map(m => m.category)
    const uniqueCategories = [...new Set(categories)]
    const categoryCount = uniqueCategories.length
    
    // Higher score for having different move types
    let diversityScore = categoryCount * 0.3
    
    // Bonus for having setup moves
    if (categories.includes('buff')) diversityScore += 0.3
    
    // Bonus for having utility moves
    if (categories.includes('debuff') || categories.includes('support')) diversityScore += 0.2
    
    // Bonus for having recovery
    if (categories.includes('recovery')) diversityScore += 0.2
    
    return {
      score: Math.min(diversityScore, 1.0),
      categories: uniqueCategories
    }
  }

  // Item handlers
  const handleItemSelect = (item: ItemRecommendation) => {
    setSelectedItem(item)
  }

  // EV handlers
  const handleEVSpreadSelect = (spread: EVSpread) => {
    setSelectedEVSpread(spread)
  }

  const handleCustomEVChange = (stat: keyof EVSpread, value: number) => {
    const newSpread = { ...customEVSpread }
    newSpread[stat] = Math.max(0, Math.min(252, value))
    setCustomEVSpread(newSpread)
    setSelectedEVSpread(newSpread)
  }

  const getTotalEVs = (spread: EVSpread) => {
    return Object.values(spread).reduce((sum, evs) => sum + evs, 0)
  }

  const getRemainingEVs = (spread: EVSpread) => {
    return 510 - getTotalEVs(spread)
  }

  const isValidSpread = (spread: EVSpread) => {
    return EVCalculationService.validateEVSpread(spread)
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading training data...</span>
        </CardContent>
      </Card>
    )
  }

  const totalPower = calculateTotalPower()
  const typeCoverage = calculateTypeCoverage()
  const stabCount = calculateSTABCount()
  const isComplete = selectedMoves.length === 4 && selectedItem
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Training Summary
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className={isExpanded ? '' : 'hidden'}>
        <div className="space-y-6">
          {/* Pokemon Overview */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <img 
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{formatPokemonName(pokemon.name)}</h3>
                <div className="flex items-center gap-2 mb-2">
                  {pokemon.types.map(type => (
                    <TypeBadge key={type.type.name} type={type.type.name} />
                  ))}
                </div>
                
                {/* Weak to section */}
                {movesetAnalysis?.weaknesses && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Weak to:</h4>
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(movesetAnalysis.weaknesses)
                        .map(([type, multiplier]) => [type, Number(multiplier)] as [string, number])
                        .filter(([_, multiplier]) => multiplier > 1)
                        .sort(([_, a], [__, b]) => b - a)
                        .map(([type, multiplier]) => (
                          <div key={type} className="flex items-center gap-1">
                            <TypeBadge type={type} className="text-xs" />
                            <span className="text-xs text-red-600 font-medium">
                              {multiplier}x
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <Badge variant={isComplete ? "default" : "secondary"} className="mb-2">
                  {isComplete ? 'Complete' : 'In Progress'}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {selectedMoves.length}/4 Moves
                </div>
              </div>
            </div>

            {/* Enhanced Stats with EV and Nature */}
            <PokemonStats 
              pokemon={pokemon} 
              totalStats={totalStats} 
              t={t}
              evSpread={selectedEVSpread}
              selectedNature={selectedNature}
              showNatureStatus={isBuildPage}
            />
          </div>

          {/* Section Navigation */}
          <div className="flex gap-2 border-b">
            <Button
              variant={activeSection === 'moves' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('moves')}
              className="flex items-center gap-2"
            >
              <Sword className="h-4 w-4" />
              Moves
              {selectedMoves.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedMoves.length}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeSection === 'item' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('item')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Item
              {selectedItem && (
                <Badge variant="secondary" className="text-xs">✓</Badge>
              )}
            </Button>
            <Button
              variant={activeSection === 'evs' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('evs')}
              className="flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              EVs
              {selectedEVSpread && (
                <Badge variant="secondary" className="text-xs">✓</Badge>
              )}
            </Button>
            <Button
              variant={activeSection === 'nature' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('nature')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Nature
              {selectedNature && (
                <Badge variant="secondary" className="text-xs">✓</Badge>
              )}
            </Button>
            <Button
              variant={activeSection === 'ability' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('ability')}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Ability
              {selectedAbility && (
                <Badge variant="secondary" className="text-xs">✓</Badge>
              )}
            </Button>
          </div>

          {/* Build Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-blue-800">Offensive Power</h4>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Total Power:</span>
                  <span className="font-medium">{totalPower}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Type Coverage:</span>
                  <span className="font-medium">{typeCoverage}/18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>STAB Moves:</span>
                  <span className="font-medium">{stabCount}/4</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-green-600" />
                <h4 className="font-medium text-green-800">Item Setup</h4>
              </div>
              <div className="space-y-1">
                {selectedItem ? (
                  <>
                    <div className="text-sm font-medium capitalize">
                      {selectedItem.name.replace('-', ' ')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge className="text-xs bg-green-100 text-green-800">
                        {selectedItem.category.replace('-', ' ')}
                      </Badge>
                      <span className={`text-xs ${getEffectivenessColor(selectedItem.effectiveness)}`}>
                        {selectedItem.effectiveness}% effective
                      </span>
                    </div>
                    {selectedItem.transformation && (
                      <div className="text-xs text-green-700">
                        {selectedItem.transformation.result}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No item selected
                  </div>
                )}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium text-purple-800">Training Progress</h4>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Moveset:</span>
                  <span className={`font-medium ${selectedMoves.length === 4 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedMoves.length}/4
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Item:</span>
                  <span className={`font-medium ${selectedItem ? 'text-green-600' : 'text-gray-400'}`}>
                    {selectedItem ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>EVs:</span>
                  <span className={`font-medium ${selectedEVSpread ? 'text-green-600' : 'text-gray-400'}`}>
                    {selectedEVSpread ? '✓' : '○'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Moves Summary */}
          {activeSection === 'moves' && (
            <div className="space-y-6">
              {/* Selected Moves */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Sword className="h-4 w-4" />
                  Selected Moves ({selectedMoves.length}/4)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map(slotIndex => (
                    <MoveTooltip 
                      key={slotIndex} 
                      move={selectedMoves[slotIndex] ? { name: selectedMoves[slotIndex].name, type: selectedMoves[slotIndex].type, power: selectedMoves[slotIndex].power } : { name: '', type: '', power: 0 }}
                    >
                      <div
                        className={`border rounded-lg p-3 cursor-pointer ${
                          selectedMoves[slotIndex] 
                            ? 'border-blue-200 bg-blue-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          Slot {slotIndex + 1}
                        </div>
                        {selectedMoves[slotIndex] ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-sm capitalize truncate cursor-help">
                                {selectedMoves[slotIndex].name.replace('-', ' ')}
                              </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMoveRemove(slotIndex)}
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>
                          <div className="flex items-center gap-1">
                            <TypeBadge type={selectedMoves[slotIndex].type} className="text-xs" />
                            {selectedMoves[slotIndex].isStab && (
                              <Badge variant="secondary" className="text-xs">STAB</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Power: {selectedMoves[slotIndex].power || '—'}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{getLearnMethodIcon(selectedMoves[slotIndex].learnMethod)}</span>
                            <Badge className={`text-xs ${getLearnMethodColor(selectedMoves[slotIndex].learnMethod)}`}>
                              {selectedMoves[slotIndex].learnMethod}
                              {selectedMoves[slotIndex].level && ` Lv.${selectedMoves[slotIndex].level}`}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground text-center py-2">
                          Empty
                        </div>
                      )}
                      </div>
                      </MoveTooltip>
                  ))}
                </div>
              </div>

              {/* Moveset Diversity Analysis */}
              {selectedMoves.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Strategic Analysis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-sm font-medium mb-2">Move Categories</div>
                      <div className="flex flex-wrap gap-1">
                        {calculateMovesetDiversity().categories.map(category => (
                          <Badge key={category} className={`text-xs text-white ${getMoveCategoryColor(category)}`}>
                            {getMoveCategoryLabel(category)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="text-sm font-medium mb-2">Strategic Diversity</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${calculateMovesetDiversity().score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(calculateMovesetDiversity().score * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="text-sm font-medium mb-2">Setup Potential</div>
                      <div className="text-sm text-muted-foreground">
                        {calculateMovesetDiversity().categories.includes('buff') ? (
                          <span className="text-green-600">✓ Has setup moves</span>
                        ) : (
                          <span className="text-orange-600">⚠ No setup moves</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {calculateMovesetDiversity().categories.includes('recovery') ? (
                          <span className="text-green-600">✓ Has recovery</span>
                        ) : (
                          <span className="text-orange-600">⚠ No recovery</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <Button 
                onClick={handleGenerateMoveset}
                disabled={isGeneratingMoveset}
                className="w-full"
              >
                {isGeneratingMoveset ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Generate Strategic Moveset
              </Button>

              {/* Move Recommendations */}
              {movesetAnalysis && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Recommended Moves
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {movesetAnalysis.recommendations.map((move, index) => (
                      <MoveTooltip 
                        key={`${move.name}-${index}`}
                        move={{ name: move.name, type: move.type, power: move.power }}
                      >
                        <div
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            const emptySlot = selectedMoves.findIndex((m, i) => !m || i >= 4)
                            if (emptySlot !== -1 && emptySlot < 4) {
                              handleMoveSelect(move, emptySlot)
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium capitalize text-sm">
                              <span>{move.name.replace('-', ' ')}</span>
                            </h4>
                            <div className="flex items-center gap-1">
                              {move.isStab && <Star className="h-3 w-3 text-yellow-500" />}
                              <span className="text-xs text-muted-foreground">
                                {move.score.toFixed(0)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Move Category Badge */}
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs text-white ${getMoveCategoryColor(move.category)}`}>
                              {React.createElement(getMoveCategoryIcon(move.category), { className: "h-3 w-3 mr-1" })}
                              {getMoveCategoryLabel(move.category)}
                            </Badge>
                            {move.strategicValue > 0.7 && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                High Value
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <TypeBadge type={move.type} className="text-xs" />
                            <span className="text-xs text-muted-foreground">
                              Power: {move.power || '—'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-2">
                            <span className="text-xs">{getLearnMethodIcon(move.learnMethod)}</span>
                            <Badge className={`text-xs ${getLearnMethodColor(move.learnMethod)}`}>
                              {move.learnMethod}
                              {move.level && ` Lv.${move.level}`}
                            </Badge>
                          </div>
                          
                          {/* Strategic Move Description */}
                          {move.category !== 'attacking' && (
                            <p className="text-xs text-blue-600 mb-1">
                              {MovesetRecommendationService.getMoveDescription(move.name)}
                            </p>
                          )}
                          
                          <p className="text-xs text-muted-foreground">
                            {move.reason}
                          </p>
                        </div>
                      </MoveTooltip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Item Selection */}
          {activeSection === 'item' && (
            <div className="space-y-6">
              {/* Selected Item */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Selected Item
                </h4>
                {selectedItem ? (
                  <HeldItemTooltip itemName={selectedItem.name}>
                    <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(selectedItem.category)}
                          <div>
                            <h4 className="font-medium capitalize cursor-help">
                              {selectedItem.name.replace('-', ' ')}
                            </h4>
                            <Badge className={`text-xs ${getCategoryColor(selectedItem.category)}`}>
                              {selectedItem.category.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${getEffectivenessColor(selectedItem.effectiveness)}`}>
                            {selectedItem.effectiveness}% Effective
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {selectedItem.synergy}% Synergy
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectedItem.reason}
                      </p>
                      
                      {selectedItem.transformation && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-800">
                              {selectedItem.transformation.type === 'mega' && 'Mega Evolution'}
                              {selectedItem.transformation.type === 'plate' && 'Type Change'}
                              {selectedItem.transformation.type === 'form' && 'Form Change'}
                            </span>
                          </div>
                          <p className="text-xs text-blue-700 mt-1">
                            {selectedItem.transformation.result}
                          </p>
                        </div>
                      )}
                    </div>
                  </HeldItemTooltip>
                ) : (
                  <div className="text-center text-muted-foreground p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No item selected</p>
                  </div>
                )}
              </div>

              {/* Item Recommendations */}
              {itemAnalysis && (
                <div className="space-y-4">
                  {/* Mega Stones */}
                  {itemAnalysis.megaStones.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        Mega Stones
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {itemAnalysis.megaStones.map((item, index) => (
                          <HeldItemTooltip key={`${item.name}-${index}`} itemName={item.name}>
                            <div
                              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                selectedItem?.name === item.name 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'hover:border-gray-300'
                              }`}
                              onClick={() => handleItemSelect(item)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium capitalize text-sm cursor-help">
                                  {item.name.replace('-', ' ')}
                                </span>
                              <span className={`text-xs ${getEffectivenessColor(item.effectiveness)}`}>
                                {item.effectiveness}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {item.reason}
                            </p>
                          </div>
                          </HeldItemTooltip>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Standard Items */}
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Standard Items
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {itemAnalysis.standardItems.map((item, index) => (
                        <HeldItemTooltip key={`${item.name}-${index}`} itemName={item.name}>
                          <div
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedItem?.name === item.name 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'hover:border-gray-300'
                            }`}
                            onClick={() => handleItemSelect(item)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(item.category)}
                                <span className="font-medium capitalize text-sm cursor-help">
                                  {item.name.replace('-', ' ')}
                                </span>
                              </div>
                            <span className={`text-xs ${getEffectivenessColor(item.effectiveness)}`}>
                              {item.effectiveness}%
                            </span>
                          </div>
                          <Badge className={`text-xs mb-2 ${getCategoryColor(item.category)}`}>
                            {item.category.replace('-', ' ')}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {item.reason}
                          </p>
                        </div>
                        </HeldItemTooltip>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EV Selection */}
          {activeSection === 'evs' && (
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex gap-2">
                <Button
                  variant={evTab === 'recommended' ? 'default' : 'outline'}
                  onClick={() => setEvTab('recommended')}
                >
                  Recommended
                </Button>
                <Button
                  variant={evTab === 'custom' ? 'default' : 'outline'}
                  onClick={() => setEvTab('custom')}
                >
                  Custom
                </Button>
              </div>

              {evTab === 'recommended' && evAnalysis && (
                <div className="space-y-6">
                  {/* Optimal Spread */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Optimal Spread: {evAnalysis.optimalSpread.role}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {Object.entries(evAnalysis.optimalSpread.spread).map(([stat, evs]) => (
                        <div key={stat} className="text-center">
                          <div className="text-xs text-muted-foreground uppercase mb-1">
                            {stat.replace('special', 'Sp.')}
                          </div>
                          <div className={`text-lg font-bold ${getStatColor(stat as keyof EVSpread, evs)}`}>
                            {evs}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-sm text-green-700">
                      Total: {getTotalEVs(evAnalysis.optimalSpread.spread)}/510 EVs
                    </div>
                  </div>

                  {/* All Recommended Spreads */}
                  <div>
                    <h4 className="font-medium mb-3">All Recommended Spreads</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {evAnalysis.recommendedSpreads.map((recommendation, index) => (
                        <div
                          key={`${recommendation.role}-${index}`}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedEVSpread && JSON.stringify(selectedEVSpread) === JSON.stringify(recommendation.spread)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleEVSpreadSelect(recommendation.spread)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {recommendation.role === 'fast-attacker' && '⚡'}
                                {recommendation.role === 'physical-attacker' && '⚔️'}
                                {recommendation.role === 'special-attacker' && '🔮'}
                                {recommendation.role === 'mixed-attacker' && '🎯'}
                                {recommendation.role === 'tank' && '🛡️'}
                                {recommendation.role === 'wall' && '🧱'}
                                {recommendation.role === 'balanced' && '⚖️'}
                              </span>
                              <span className="font-medium capitalize">{recommendation.role}</span>
                            </div>
                            <Badge className={recommendation.effectiveness >= 80 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                              {recommendation.effectiveness}% Effective
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            {Object.entries(recommendation.spread).map(([stat, evs]) => (
                              <div key={stat} className="text-center">
                                <div className="text-xs text-muted-foreground uppercase">
                                  {stat.replace('special', 'Sp.')}
                                </div>
                                <div className={`font-medium ${getStatColor(stat as keyof EVSpread, evs)}`}>
                                  {evs}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            {recommendation.reasoning}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {evTab === 'custom' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-3">Custom EV Spread</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {Object.entries(customEVSpread).map(([stat, evs]) => (
                        <div key={stat} className="space-y-1">
                          <label className="text-xs text-muted-foreground uppercase">
                            {stat.replace('special', 'Sp.')}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="252"
                            step="4"
                            value={evs}
                            onChange={(e) => handleCustomEVChange(stat as keyof EVSpread, parseInt(e.target.value) || 0)}
                            className={`w-full px-2 py-1 border rounded text-center font-medium ${getStatColor(stat as keyof EVSpread, evs)}`}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total EVs:</span>
                        <span className={`font-medium ${getTotalEVs(customEVSpread) > 510 ? 'text-red-600' : 'text-green-600'}`}>
                          {getTotalEVs(customEVSpread)}/510
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Remaining:</span>
                        <span className={`font-medium ${getRemainingEVs(customEVSpread) < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                          {getRemainingEVs(customEVSpread)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Valid:</span>
                        <span className={`font-medium ${isValidSpread(customEVSpread) ? 'text-green-600' : 'text-red-600'}`}>
                          {isValidSpread(customEVSpread) ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div>
                    <h4 className="font-medium mb-3">Quick Presets</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const preset = { hp: 252, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 }
                          setCustomEVSpread(preset)
                          setSelectedEVSpread(preset)
                        }}
                      >
                        Max HP
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const preset = { hp: 0, attack: 252, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 }
                          setCustomEVSpread(preset)
                          setSelectedEVSpread(preset)
                        }}
                      >
                        Max Attack
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const preset = { hp: 0, attack: 0, defense: 0, specialAttack: 252, specialDefense: 0, speed: 0 }
                          setCustomEVSpread(preset)
                          setSelectedEVSpread(preset)
                        }}
                      >
                        Max Sp. Attack
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const preset = { hp: 0, attack: 0, defense: 252, specialAttack: 0, specialDefense: 0, speed: 0 }
                          setCustomEVSpread(preset)
                          setSelectedEVSpread(preset)
                        }}
                      >
                        Max Defense
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const preset = { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 252, speed: 0 }
                          setCustomEVSpread(preset)
                          setSelectedEVSpread(preset)
                        }}
                      >
                        Max Sp. Defense
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const preset = { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 252 }
                          setCustomEVSpread(preset)
                          setSelectedEVSpread(preset)
                        }}
                      >
                        Max Speed
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nature Selection */}
          {activeSection === 'nature' && (
            <div className="space-y-6">
              {/* Selected Nature */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Selected Nature
                </h4>
                {selectedNature && (
                  <NatureTooltip nature={selectedNature}>
                    <div className="border rounded-lg p-4 bg-green-50 border-green-200 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize cursor-help">
                          {selectedNature}
                        </span>
                      <Badge className="text-xs bg-green-100 text-green-800">
                        {natureAnalysis?.optimalNature?.name === selectedNature ? 'Optimal' : 'Selected'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {natureAnalysis?.recommendations.find(r => r.name === selectedNature)?.description || ''}
                    </div>
                  </div>
                  </NatureTooltip>
                )}
              </div>

              {/* Nature Recommendations */}
              {natureAnalysis && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Recommended Natures
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {natureAnalysis.recommendations.slice(0, 6).map((nature, index) => (
                      <NatureTooltip key={nature.name} nature={nature.name}>
                        <div
                          className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                            nature.name === selectedNature ? 'bg-blue-50 border-blue-200' : 'bg-white'
                          }`}
                          onClick={() => setSelectedNature(nature.name)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium capitalize cursor-help">
                              {nature.name}
                            </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {nature.score.toFixed(0)}
                            </span>
                            {nature.name === natureAnalysis.optimalNature?.name && (
                              <Badge variant="secondary" className="text-xs">Best</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {nature.reasoning}
                        </div>
                        <div className="text-xs text-blue-600">
                          {nature.description}
                        </div>
                      </div>
                      </NatureTooltip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ability Selection */}
          {activeSection === 'ability' && (
            <div className="space-y-6">
              {/* Selected Ability */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Selected Ability
                </h4>
                {selectedAbility && (
                  <AbilityTooltip ability={{ name: selectedAbility }}>
                    <div className="border rounded-lg p-4 bg-purple-50 border-purple-200 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize cursor-help">
                          {selectedAbility}
                        </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {abilityAnalysis?.optimalAbility?.name === selectedAbility ? 'Optimal' : 'Selected'}
                        </span>
                        {abilityAnalysis?.recommendations.find(r => r.name === selectedAbility)?.isHidden && (
                          <Badge variant="secondary" className="text-xs">Hidden</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {abilityAnalysis?.recommendations.find(r => r.name === selectedAbility)?.reasoning || ''}
                    </div>
                  </div>
                  </AbilityTooltip>
                )}
              </div>

              {/* Ability Recommendations */}
              {abilityAnalysis && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Recommended Abilities
                  </h4>
                  <div className="space-y-3">
                    {abilityAnalysis.recommendations.slice(0, 6).map((ability, index) => (
                      <AbilityTooltip key={ability.name} ability={{ name: ability.name }}>
                        <div
                          className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                            ability.name === selectedAbility ? 'bg-purple-50 border-purple-200' : 'bg-white'
                          }`}
                          onClick={() => setSelectedAbility(ability.name)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium capitalize cursor-help">
                              {ability.name}
                            </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {ability.score.toFixed(0)}
                            </span>
                            {ability.name === abilityAnalysis.optimalAbility?.name && (
                              <Badge variant="secondary" className="text-xs">Best</Badge>
                            )}
                            {ability.isHidden && (
                              <Badge variant="outline" className="text-xs">Hidden</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {ability.reasoning}
                        </div>
                        <div className="text-xs text-purple-600">
                          {ability.description}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {ability.effectiveness.toFixed(2)} effectiveness
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Strategic Value: {ability.strategicValue}/10
                          </Badge>
                        </div>
                      </div>
                      </AbilityTooltip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button 
              onClick={handleCopyBuild}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy Build'}
            </Button>
            
            <Button 
              onClick={onExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            
            <Button 
              onClick={onShare}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            
            <Button 
              onClick={onOptimize}
              className="flex items-center gap-2"
              disabled={!isComplete}
            >
              <Star className="h-4 w-4" />
              Optimize Build
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
