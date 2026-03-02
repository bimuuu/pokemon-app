'use client'

import { useState } from 'react'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { Input } from '@/components/ui/input'
import { MoveRecommendation, MovesetAnalysis, DefensiveRecommendation } from '@/types/pokemon'
import { MoveTooltip } from '@/components/common/MoveTooltip'
import { MovesetRecommendationService } from '@/features/training/services/MovesetRecommendationService'
import { 
  getLearnMethodIcon,
  getMoveCategoryColor,
  getMoveCategoryIcon,
  getMoveCategoryLabel,
  getLearnMethodColor
} from './utils'
import { Sword, Target, Zap, RefreshCw, Loader2, Star, Shield, AlertTriangle, RotateCcw, Search } from 'lucide-react'

interface MovesSectionProps {
  selectedMoves: (MoveRecommendation | null)[]
  movesetAnalysis: MovesetAnalysis | null
  isGeneratingMoveset: boolean
  onMoveSelect: (move: MoveRecommendation, slotIndex: number) => void
  onMoveRemove: (slotIndex: number) => void
  onGenerateMoveset: () => void
  onGenerateDefensiveMoveset?: () => void
  onGenerateBalancedDefensiveMoveset?: () => void
  onRefreshRecommendations?: () => void
  activeMovesetType?: 'offensive' | 'balanced' | 'defensive'
}

export function MovesSection({
  selectedMoves,
  movesetAnalysis,
  isGeneratingMoveset,
  onMoveSelect,
  onMoveRemove,
  onGenerateMoveset,
  onGenerateDefensiveMoveset,
  onGenerateBalancedDefensiveMoveset,
  onRefreshRecommendations,
  activeMovesetType = 'balanced'
}: MovesSectionProps) {
  const [showAllRecommendations, setShowAllRecommendations] = useState(false)
  const [recommendationLimit, setRecommendationLimit] = useState(20)
  const [searchTerm, setSearchTerm] = useState('')
  const calculateMovesetDiversity = () => {
    const validMoves = selectedMoves.filter((m): m is MoveRecommendation => m !== null)
    if (validMoves.length === 0) return { score: 0, categories: [] }
    
    const categories = validMoves.map(m => m.category)
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

  const getThreatLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
    }
  }

  const getCoverageSuggestions = (): DefensiveRecommendation[] => {
    if (!movesetAnalysis) return []
    return MovesetRecommendationService.suggestCoverageMoves(movesetAnalysis, 3)
  }

  const getValidMoves = () => selectedMoves.filter((m): m is MoveRecommendation => m !== null)

  const getCurrentMovesetType = (): 'offensive' | 'balanced' | 'defensive' => {
    if (!movesetAnalysis || getValidMoves().length === 0) return 'balanced'
    
    const validMoves = getValidMoves()
    const moveNames = new Set(validMoves.map(m => m.name))
    
    // Check if current moves match offensive moveset
    const offensiveMoveset = MovesetRecommendationService.generateBalancedMoveset(movesetAnalysis)
    const offensiveNames = new Set(offensiveMoveset.map(m => m.name))
    const isOffensive = [...moveNames].every(name => offensiveNames.has(name)) && 
                       moveNames.size === offensiveNames.size
    
    // Check if current moves match defensive moveset
    const defensiveMoveset = MovesetRecommendationService.generateDefensiveMoveset(movesetAnalysis)
    const defensiveNames = new Set(defensiveMoveset.map(m => m.name))
    const isDefensive = [...moveNames].every(name => defensiveNames.has(name)) && 
                       moveNames.size === defensiveNames.size
    
    // Check if current moves match balanced defensive moveset
    const balancedDefensiveMoveset = MovesetRecommendationService.generateBalancedDefensiveMoveset(movesetAnalysis)
    const balancedDefensiveNames = new Set(balancedDefensiveMoveset.map(m => m.name))
    const isBalancedDefensive = [...moveNames].every(name => balancedDefensiveNames.has(name)) && 
                               moveNames.size === balancedDefensiveNames.size
    
    if (isOffensive) return 'offensive'
    if (isDefensive) return 'defensive'
    if (isBalancedDefensive) return 'balanced'
    
    return activeMovesetType || 'balanced'
  }

  const currentMovesetType = getCurrentMovesetType()

  const getFilteredRecommendations = () => {
    if (!movesetAnalysis) return []
    
    let filtered = movesetAnalysis.recommendations
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(move => 
        move.name.toLowerCase().includes(searchLower) ||
        move.type.toLowerCase().includes(searchLower) ||
        move.category.toLowerCase().includes(searchLower) ||
        move.reason.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply limit filter
    const limit = showAllRecommendations ? filtered.length : recommendationLimit
    
    return filtered.slice(0, limit)
  }

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const cardVariants = {
    hover: { 
      scale: 1.02, 
      y: -4,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="moves"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="space-y-6"
      >
        {/* Selected Moves */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Sword className="h-4 w-4" />
            Selected Moves ({getValidMoves().length}/4)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map(slotIndex => (
              <MoveTooltip 
                key={`${slotIndex}-${selectedMoves[slotIndex]?.name || 'empty'}`} 
                move={selectedMoves[slotIndex] ? { name: selectedMoves[slotIndex].name, type: selectedMoves[slotIndex].type, power: selectedMoves[slotIndex].power } : { name: '', type: '', power: 0 }}
              >
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
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
                          onClick={() => onMoveRemove(slotIndex)}
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
                </motion.div>
              </MoveTooltip>
            ))}
          </div>
        </div>

        {/* Generate Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <Button 
            onClick={onGenerateMoveset}
            disabled={isGeneratingMoveset}
            variant={currentMovesetType === 'offensive' ? 'default' : 'outline'}
            className={currentMovesetType === 'offensive' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isGeneratingMoveset ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Offensive
          </Button>
          
          {onGenerateBalancedDefensiveMoveset && (
            <Button 
              onClick={onGenerateBalancedDefensiveMoveset}
              disabled={isGeneratingMoveset}
              variant={currentMovesetType === 'balanced' ? 'default' : 'outline'}
              className={currentMovesetType === 'balanced' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isGeneratingMoveset ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Target className="h-4 w-4 mr-2" />
              )}
              Balanced
            </Button>
          )}
          
          {onGenerateDefensiveMoveset && (
            <Button 
              onClick={onGenerateDefensiveMoveset}
              disabled={isGeneratingMoveset}
              variant={currentMovesetType === 'defensive' ? 'default' : 'outline'}
              className={currentMovesetType === 'defensive' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {isGeneratingMoveset ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              Defensive
            </Button>
          )}
        </div>

        {/* Moveset Diversity Analysis */}
        {getValidMoves().length > 0 && (
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
                    <motion.div 
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateMovesetDiversity().score * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
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

        {/* Defensive Analysis */}
        {movesetAnalysis && movesetAnalysis.counterTypes && Object.keys(movesetAnalysis.counterTypes).length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Defensive Coverage Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Counter Types */}
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium mb-2">Counter Types</div>
                <div className="space-y-1">
                  {Object.entries(movesetAnalysis.counterTypes)
                    .sort(([_, a], [__, b]) => b - a)
                    .slice(0, 4)
                    .map(([type, multiplier]) => (
                      <div key={type} className="flex items-center justify-between">
                        <TypeBadge type={type} className="text-xs" />
                        <span className="text-xs font-medium text-red-600">
                          ×{multiplier.toFixed(1)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Defensive Coverage */}
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium mb-2">Defensive Coverage</div>
                <div className="space-y-1">
                  {Object.entries(movesetAnalysis.defensiveCoverage || {})
                    .sort(([_, a], [__, b]) => b - a)
                    .slice(0, 4)
                    .map(([type, effectiveness]) => (
                      <div key={type} className="flex items-center justify-between">
                        <TypeBadge type={type} className="text-xs" />
                        <span className="text-xs font-medium text-green-600">
                          ×{effectiveness.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  {Object.keys(movesetAnalysis.defensiveCoverage || {}).length === 0 && (
                    <span className="text-xs text-muted-foreground">No defensive coverage</span>
                  )}
                </div>
              </div>
              
              {/* Threat Level */}
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium mb-2">Overall Threat Level</div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getThreatLevelColor(movesetAnalysis.threatLevel)}`}>
                    {movesetAnalysis.threatLevel.toUpperCase()}
                  </div>
                  {movesetAnalysis.threatLevel === 'high' && (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {movesetAnalysis.coverageGaps.length > 0 
                    ? `${movesetAnalysis.coverageGaps.length} coverage gaps`
                    : 'All major threats covered'
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coverage Suggestions */}
        {movesetAnalysis && movesetAnalysis.coverageGaps && movesetAnalysis.coverageGaps.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Coverage Suggestions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCoverageSuggestions().map((suggestion, index) => (
                <MoveTooltip 
                  key={`suggestion-${index}`}
                  move={{ name: suggestion.move.name, type: suggestion.move.type, power: suggestion.move.power }}
                >
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="border rounded-lg p-4 cursor-pointer border-orange-200 bg-orange-50 h-full flex flex-col"
                    onClick={() => {
                      const emptySlot = selectedMoves.findIndex((m, i) => !m || i >= 4)
                      if (emptySlot !== -1 && emptySlot < 4) {
                        onMoveSelect(suggestion.move, emptySlot)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize text-sm">
                        {suggestion.move.name.replace('-', ' ')}
                      </h4>
                      <Badge variant="outline" className={`text-xs ${
                        suggestion.priority === 'high' ? 'text-red-600 border-red-600' :
                        suggestion.priority === 'medium' ? 'text-orange-600 border-orange-600' :
                        'text-yellow-600 border-yellow-600'
                      }`}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-2">
                      Covers: {suggestion.counteredTypes.map(type => (
                        <TypeBadge key={type} type={type} className="text-xs mr-1" />
                      ))}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {suggestion.move.reason}
                    </p>
                  </motion.div>
                </MoveTooltip>
              ))}
            </div>
          </div>
        )}

        {/* Move Recommendations */}
        {movesetAnalysis && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Recommended Moves
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing: {getFilteredRecommendations().length} / {movesetAnalysis.recommendations.length}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={recommendationLimit === 20 ? "default" : "outline"}
                    onClick={() => setRecommendationLimit(20)}
                  >
                    20
                  </Button>
                  <Button
                    size="sm"
                    variant={recommendationLimit === 50 ? "default" : "outline"}
                    onClick={() => setRecommendationLimit(50)}
                  >
                    50
                  </Button>
                  <Button
                    size="sm"
                    variant={recommendationLimit === 100 ? "default" : "outline"}
                    onClick={() => setRecommendationLimit(100)}
                  >
                    100
                  </Button>
                  <Button
                    size="sm"
                    variant={showAllRecommendations ? "default" : "outline"}
                    onClick={() => setShowAllRecommendations(!showAllRecommendations)}
                  >
                    All
                  </Button>
                  {onRefreshRecommendations && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onRefreshRecommendations}
                      title="Refresh recommendations"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search moves by name, type, category, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredRecommendations().map((move, index) => (
                <MoveTooltip 
                  key={`${move.name}-${index}`}
                  move={{ name: move.name, type: move.type, power: move.power }}
                >
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="border rounded-lg p-4 cursor-pointer"
                    onClick={() => {
                      const emptySlot = selectedMoves.findIndex((m, i) => !m || i >= 4)
                      if (emptySlot !== -1 && emptySlot < 4) {
                        onMoveSelect(move, emptySlot)
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
                  </motion.div>
                </MoveTooltip>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
