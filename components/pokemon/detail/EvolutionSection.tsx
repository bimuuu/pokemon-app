'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import { EvolutionStage } from '@/components/pokemon/EvolutionStage'
import { EvolutionChain, Pokemon } from '@/types/pokemon'
import { sectionVariants } from '../animations'

interface EvolutionSectionProps {
  evolutionChain: EvolutionChain | null
  pokemon: Pokemon
  t: (key: string) => string
}

export function EvolutionSection({ evolutionChain, pokemon, t }: EvolutionSectionProps) {
  return (
    <AnimatePresence>
      {evolutionChain && (
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
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 6 }}
            >
              <Star className="w-5 h-5 mr-2" />
            </motion.div>
            Evolution Chain
          </motion.h2>
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <EvolutionStage 
              evolution={evolutionChain.chain} 
              currentPokemonName={pokemon.name}
            />
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
