'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { AbilityAnalysis } from '@/types/pokemon'
import { AbilityTooltip } from '@/components/common/AbilityTooltip'
import { Zap } from 'lucide-react'

interface AbilitySectionProps {
  selectedAbility: string | null
  abilityAnalysis: AbilityAnalysis | null
  onAbilitySelect: (ability: string) => void
}

export function AbilitySection({
  selectedAbility,
  abilityAnalysis,
  onAbilitySelect
}: AbilitySectionProps) {
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
        key="ability"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="space-y-6"
      >
        {/* Selected Ability */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Selected Ability
          </h4>
          {selectedAbility && (
            <AbilityTooltip ability={{ name: selectedAbility }}>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="border rounded-lg p-4 bg-purple-50 border-purple-200 cursor-pointer"
              >
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
              </motion.div>
            </AbilityTooltip>
          )}
        </div>

        {/* Ability Recommendations */}
        {abilityAnalysis && abilityAnalysis.recommendations && abilityAnalysis.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Recommended Abilities
            </h4>
            <div className="space-y-3">
              {abilityAnalysis.recommendations.slice(0, 6).map((ability, index) => (
                <AbilityTooltip key={ability.name} ability={{ name: ability.name }}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`border rounded-lg p-4 cursor-pointer ${
                      ability.name === selectedAbility ? 'bg-purple-50 border-purple-200' : 'bg-white'
                    }`}
                    onClick={() => onAbilitySelect(ability.name)}
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
                  </motion.div>
                </AbilityTooltip>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
