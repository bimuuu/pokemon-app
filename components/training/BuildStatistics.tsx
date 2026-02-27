'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { ItemRecommendation, MoveRecommendation, EVSpread } from '@/types/pokemon'
import { getEffectivenessColor } from './utils'
import { Target, Package, TrendingUp } from 'lucide-react'

interface BuildStatisticsProps {
  totalPower: number
  typeCoverage: number
  stabCount: number
  selectedItem: ItemRecommendation | null
  selectedMoves: MoveRecommendation[]
  selectedEVSpread: EVSpread | null
}

export function BuildStatistics({
  totalPower,
  typeCoverage,
  stabCount,
  selectedItem,
  selectedMoves,
  selectedEVSpread
}: BuildStatisticsProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-blue-50 p-4 rounded-lg"
        >
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
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-green-50 p-4 rounded-lg"
        >
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
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-purple-50 p-4 rounded-lg"
        >
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
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
