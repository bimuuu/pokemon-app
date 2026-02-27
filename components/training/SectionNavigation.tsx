'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sword, Package, Calculator, TrendingUp, Zap } from 'lucide-react'

type SectionType = 'moves' | 'item' | 'evs' | 'nature' | 'ability'

interface SectionNavigationProps {
  activeSection: SectionType
  onSectionChange: (section: SectionType) => void
  selectedMoves: any[]
  selectedItem: any
  selectedEVSpread: any
  selectedNature: string | null
  selectedAbility: string | null
}

export function SectionNavigation({
  activeSection,
  onSectionChange,
  selectedMoves,
  selectedItem,
  selectedEVSpread,
  selectedNature,
  selectedAbility
}: SectionNavigationProps) {
  return (
    <div className="flex gap-2 border-b">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={activeSection === 'moves' ? 'default' : 'ghost'}
          onClick={() => onSectionChange('moves')}
          className="flex items-center gap-2"
        >
          <Sword className="h-4 w-4" />
          Moves
          {selectedMoves.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="secondary" className="text-xs">
                {selectedMoves.length}
              </Badge>
            </motion.div>
          )}
        </Button>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={activeSection === 'item' ? 'default' : 'ghost'}
          onClick={() => onSectionChange('item')}
          className="flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          Item
          {selectedItem && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="secondary" className="text-xs">✓</Badge>
            </motion.div>
          )}
        </Button>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={activeSection === 'evs' ? 'default' : 'ghost'}
          onClick={() => onSectionChange('evs')}
          className="flex items-center gap-2"
        >
          <Calculator className="h-4 w-4" />
          EVs
          {selectedEVSpread && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="secondary" className="text-xs">✓</Badge>
            </motion.div>
          )}
        </Button>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={activeSection === 'nature' ? 'default' : 'ghost'}
          onClick={() => onSectionChange('nature')}
          className="flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Nature
          {selectedNature && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="secondary" className="text-xs">✓</Badge>
            </motion.div>
          )}
        </Button>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={activeSection === 'ability' ? 'default' : 'ghost'}
          onClick={() => onSectionChange('ability')}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Ability
          {selectedAbility && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="secondary" className="text-xs">✓</Badge>
            </motion.div>
          )}
        </Button>
      </motion.div>
    </div>
  )
}
