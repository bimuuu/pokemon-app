'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { NatureAnalysis } from '@/types/pokemon'
import { NatureTooltip } from '@/components/common/NatureTooltip'
import { TrendingUp, Target } from 'lucide-react'

interface NatureSectionProps {
  selectedNature: string | null
  natureAnalysis: NatureAnalysis | null
  onNatureSelect: (nature: string) => void
}

export function NatureSection({
  selectedNature,
  natureAnalysis,
  onNatureSelect
}: NatureSectionProps) {
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
        key="nature"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="space-y-6"
      >
        {/* Selected Nature */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Selected Nature
          </h4>
          {selectedNature && (
            <NatureTooltip nature={selectedNature}>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="border rounded-lg p-4 bg-green-50 border-green-200 cursor-pointer"
              >
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
              </motion.div>
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
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`border rounded-lg p-4 cursor-pointer ${
                      nature.name === selectedNature ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                    onClick={() => onNatureSelect(nature.name)}
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
                  </motion.div>
                </NatureTooltip>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
