'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { ItemRecommendation, ItemOptimizationAnalysis } from '@/types/pokemon'
import { HeldItemTooltip } from '@/components/common/HeldItemTooltip'
import { 
  getEffectivenessColor,
  getCategoryIcon,
  getCategoryColor
} from './utils'
import { Package, Zap, Sword, Shield } from 'lucide-react'

interface ItemSectionProps {
  selectedItem: ItemRecommendation | null
  itemAnalysis: ItemOptimizationAnalysis | null
  onItemSelect: (item: ItemRecommendation) => void
}

export function ItemSection({
  selectedItem,
  itemAnalysis,
  onItemSelect
}: ItemSectionProps) {
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
        key="item"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="space-y-6"
      >
        {/* Selected Item */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Selected Item
          </h4>
          {selectedItem ? (
            <HeldItemTooltip itemName={selectedItem.name}>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="border rounded-lg p-4 bg-green-50 border-green-200 cursor-pointer"
              >
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
              </motion.div>
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
                      <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className={`border rounded-lg p-3 cursor-pointer ${
                          selectedItem?.name === item.name 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200'
                        }`}
                        onClick={() => onItemSelect(item)}
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
                      </motion.div>
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
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className={`border rounded-lg p-3 cursor-pointer ${
                        selectedItem?.name === item.name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200'
                      }`}
                      onClick={() => onItemSelect(item)}
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
                    </motion.div>
                  </HeldItemTooltip>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
