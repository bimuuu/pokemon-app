'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { MoveRecommendation, MovesetAnalysis } from '@/types/pokemon'
import { MoveTooltip } from '@/components/common/MoveTooltip'
import { MovesetRecommendationService } from '@/features/training/services/MovesetRecommendationService'
import { 
  getLearnMethodIcon,
  getMoveCategoryColor,
  getMoveCategoryIcon,
  getMoveCategoryLabel,
  getLearnMethodColor
} from './utils'
import { Sword, Target, Zap, RefreshCw, Loader2, Star } from 'lucide-react'

interface MovesSectionProps {
  selectedMoves: MoveRecommendation[]
  movesetAnalysis: MovesetAnalysis | null
  isGeneratingMoveset: boolean
  onMoveSelect: (move: MoveRecommendation, slotIndex: number) => void
  onMoveRemove: (slotIndex: number) => void
  onGenerateMoveset: () => void
}

export function MovesSection({
  selectedMoves,
  movesetAnalysis,
  isGeneratingMoveset,
  onMoveSelect,
  onMoveRemove,
  onGenerateMoveset
}: MovesSectionProps) {
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
            Selected Moves ({selectedMoves.length}/4)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map(slotIndex => (
              <MoveTooltip 
                key={slotIndex} 
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

        {/* Generate Button */}
        <Button 
          onClick={onGenerateMoveset}
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
