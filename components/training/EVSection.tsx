'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EVSpread, EVAnalysis } from '@/types/pokemon'
import { EVCalculationService } from '@/features/training/services/EVCalculationService'
import { 
  getStatColor,
  getTotalEVs,
  getRemainingEVs,
  isValidSpread
} from './utils'
import { Calculator, TrendingUp } from 'lucide-react'

interface EVSectionProps {
  evTab: 'recommended' | 'custom'
  setEvTab: (tab: 'recommended' | 'custom') => void
  evAnalysis: EVAnalysis | null
  selectedEVSpread: EVSpread | null
  customEVSpread: EVSpread
  onEVSpreadSelect: (spread: EVSpread) => void
  onCustomEVChange: (stat: keyof EVSpread, value: number) => void
}

export function EVSection({
  evTab,
  setEvTab,
  evAnalysis,
  selectedEVSpread,
  customEVSpread,
  onEVSpreadSelect,
  onCustomEVChange
}: EVSectionProps) {
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
        key="evs"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="space-y-6"
      >
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
                  <motion.div
                    key={`${recommendation.role}-${index}`}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedEVSpread && JSON.stringify(selectedEVSpread) === JSON.stringify(recommendation.spread)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => onEVSpreadSelect(recommendation.spread)}
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
                  </motion.div>
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
                      onChange={(e) => onCustomEVChange(stat as keyof EVSpread, parseInt(e.target.value) || 0)}
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
                    onCustomEVChange('hp', 252)
                    onCustomEVChange('attack', 0)
                    onCustomEVChange('defense', 0)
                    onCustomEVChange('specialAttack', 0)
                    onCustomEVChange('specialDefense', 0)
                    onCustomEVChange('speed', 0)
                    onEVSpreadSelect(preset)
                  }}
                >
                  Max HP
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const preset = { hp: 0, attack: 252, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 }
                    onCustomEVChange('hp', 0)
                    onCustomEVChange('attack', 252)
                    onCustomEVChange('defense', 0)
                    onCustomEVChange('specialAttack', 0)
                    onCustomEVChange('specialDefense', 0)
                    onCustomEVChange('speed', 0)
                    onEVSpreadSelect(preset)
                  }}
                >
                  Max Attack
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const preset = { hp: 0, attack: 0, defense: 0, specialAttack: 252, specialDefense: 0, speed: 0 }
                    onCustomEVChange('hp', 0)
                    onCustomEVChange('attack', 0)
                    onCustomEVChange('defense', 0)
                    onCustomEVChange('specialAttack', 252)
                    onCustomEVChange('specialDefense', 0)
                    onCustomEVChange('speed', 0)
                    onEVSpreadSelect(preset)
                  }}
                >
                  Max Sp. Attack
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const preset = { hp: 0, attack: 0, defense: 252, specialAttack: 0, specialDefense: 0, speed: 0 }
                    onCustomEVChange('hp', 0)
                    onCustomEVChange('attack', 0)
                    onCustomEVChange('defense', 252)
                    onCustomEVChange('specialAttack', 0)
                    onCustomEVChange('specialDefense', 0)
                    onCustomEVChange('speed', 0)
                    onEVSpreadSelect(preset)
                  }}
                >
                  Max Defense
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const preset = { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 252, speed: 0 }
                    onCustomEVChange('hp', 0)
                    onCustomEVChange('attack', 0)
                    onCustomEVChange('defense', 0)
                    onCustomEVChange('specialAttack', 0)
                    onCustomEVChange('specialDefense', 252)
                    onCustomEVChange('speed', 0)
                    onEVSpreadSelect(preset)
                  }}
                >
                  Max Sp. Defense
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const preset = { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 252 }
                    onCustomEVChange('hp', 0)
                    onCustomEVChange('attack', 0)
                    onCustomEVChange('defense', 0)
                    onCustomEVChange('specialAttack', 0)
                    onCustomEVChange('specialDefense', 0)
                    onCustomEVChange('speed', 252)
                    onEVSpreadSelect(preset)
                  }}
                >
                  Max Speed
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
