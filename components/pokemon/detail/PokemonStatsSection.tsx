'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { PokemonStats } from '@/components/pokemon/PokemonStats'
import { Pokemon } from '@/types/pokemon'
import { calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'
import { itemVariants, containerVariants } from '../animations'

interface PokemonStatsSectionProps {
  pokemon: Pokemon
  totalStats: number
  t: (key: string) => string
}

export function PokemonStatsSection({ pokemon, totalStats, t }: PokemonStatsSectionProps) {
  const weaknesses = calculateTypeWeaknesses(pokemon.types.map(t => t.type.name))
  const strengths = calculateTypeStrengths(pokemon.types.map(t => t.type.name))

  return (
    <motion.div className="space-y-6" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <PokemonStats pokemon={pokemon} totalStats={totalStats} t={t} />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.h2 
          className="text-xl font-semibold mb-4 flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            <Shield className="w-5 h-5 mr-2" />
          </motion.div>
          {t('pokemon.typeMatchups') || 'Type Matchups'}
        </motion.h2>
        <motion.div 
          className="grid grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          <motion.div variants={itemVariants}>
            <h3 className="font-medium text-green-600 mb-2">{t('pokemon.strongAgainst') || 'Strong Against'}</h3>
            <motion.div 
              className="flex flex-wrap gap-1"
              variants={containerVariants}
            >
              {Object.entries(strengths)
                .sort(([_, a], [__, b]) => b - a)
                .map(([type, multiplier], index) => (
                  <motion.div 
                    key={type} 
                    className="flex items-center gap-1"
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
                  >
                    <TypeBadge type={type} className="text-xs" />
                    <span className={`text-xs font-medium ${
                      multiplier >= 2 ? 'text-green-700' : 
                      multiplier > 1 ? 'text-green-600' : 
                      multiplier === 1 ? 'text-gray-500' : 'text-gray-400'
                    }`}>×{multiplier}</span>
                  </motion.div>
                ))}
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="font-medium text-red-600 mb-2">{t('pokemon.weakAgainst') || 'Weak Against'}</h3>
            <motion.div 
              className="flex flex-wrap gap-1"
              variants={containerVariants}
            >
              {Object.entries(weaknesses)
                .sort(([_, a], [__, b]) => b - a)
                .map(([type, multiplier], index) => (
                  <motion.div 
                    key={type} 
                    className="flex items-center gap-1"
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
                  >
                    <TypeBadge type={type} className="text-xs" />
                    <span className={`text-xs font-medium ${
                      multiplier >= 2 ? 'text-red-700' : 
                      multiplier > 1 ? 'text-red-600' : 
                      multiplier === 1 ? 'text-gray-500' : 'text-gray-400'
                    }`}>×{multiplier}</span>
                  </motion.div>
                ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
