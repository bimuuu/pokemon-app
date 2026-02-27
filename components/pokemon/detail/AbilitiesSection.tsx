'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import { AbilityTooltip } from '@/components/common/AbilityTooltip'
import { Pokemon } from '@/types/pokemon'
import { containerVariants, abilityCardVariants, sectionVariants } from '../animations'

interface AbilitiesSectionProps {
  pokemon: Pokemon
  onAbilityClick: (abilityName: string) => void
  t: (key: string) => string
}

export function AbilitiesSection({ pokemon, onAbilityClick, t }: AbilitiesSectionProps) {
  return (
    <motion.section 
      className="bg-white rounded-lg shadow-sm border p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.6 }}
    >
      <motion.h2 
        className="text-xl font-semibold mb-6 flex items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
        >
          <Star className="w-5 h-5 mr-2" />
        </motion.div>
        {t('pokemon.abilities') || 'Abilities'}
      </motion.h2>
      
      <AnimatePresence>
        {pokemon.abilities && pokemon.abilities.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            {pokemon.abilities.map((ability, index) => (
              <motion.div
                key={index}
                variants={abilityCardVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
              >
                <AbilityTooltip ability={ability.ability}>
                  <div 
                    onClick={() => onAbilityClick(ability.ability.name)}
                    className="flex flex-col p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize text-sm">
                        {ability.ability.name.replace('-', ' ')}
                      </span>
                      {ability.is_hidden && (
                        <motion.span 
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          {t('pokemon.hidden') || 'Hidden'}
                        </motion.span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Slot {ability.slot}
                    </div>
                  </div>
                </AbilityTooltip>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-gray-600">No ability data available for this Pokemon.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
