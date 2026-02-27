'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Sword, MapPin, Shield } from 'lucide-react'
import Link from 'next/link'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { Button } from '@/components/ui/button'
import { PokemonStats } from '@/components/pokemon/PokemonStats'
import { Pokemon, CobblemonPokemon } from '@/types/pokemon'
import { formatPokemonId, formatPokemonName, calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'
import { translateCondition } from '@/lib/i18n'
import { itemVariants, containerVariants } from '../animations'

interface PokemonHeaderProps {
  pokemon: Pokemon
  cobblemonData: CobblemonPokemon | null
  totalStats: number
  t: (key: string) => string
}

export function PokemonHeader({ pokemon, cobblemonData, totalStats, t }: PokemonHeaderProps) {
  const weaknesses = calculateTypeWeaknesses(pokemon.types.map(t => t.type.name))
  const strengths = calculateTypeStrengths(pokemon.types.map(t => t.type.name))
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Link href="/" className="inline-flex items-center text-blue-500 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back') || 'Back to Pokemon list'}
        </Link>
      </motion.div>

      <motion.section 
        className="bg-white rounded-lg shadow-sm border p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div className="text-center" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <motion.div 
              className="w-64 h-64 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <motion.img 
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-56 h-56 object-contain"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ rotate: [0, -5, 5, 0] }}
              />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {formatPokemonName(pokemon.name)}
            </motion.h1>
            <motion.p 
              className="text-gray-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {formatPokemonId(pokemon.id)}
            </motion.p>
            <motion.div 
              className="flex justify-center gap-2 mb-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
            >
              {pokemon.types.map((type, index) => (
                <motion.div
                  key={type.type.name}
                  variants={itemVariants}
                  custom={index}
                >
                  <TypeBadge type={type.type.name} />
                </motion.div>
              ))}
            </motion.div>

            {/* Moveset Builder Button */}
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href={`/pokemon/${pokemon.name}/build`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button size="lg" className="w-full max-w-xs">
                    <Sword className="h-4 w-4 mr-2" />
                    Build Moveset
                  </Button>
                </motion.div>
              </Link>
              <motion.p 
                className="text-xs text-muted-foreground mt-1 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                Create optimized moveset
              </motion.p>
            </motion.div>

            {cobblemonData && (
              <motion.div 
                className="bg-blue-50 p-4 rounded-lg text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  </motion.div>
                  <span className="font-semibold text-blue-600">{t('pokemon.source')}</span>
                </div>
                <dl className="space-y-1 text-left">
                  <div><strong>{t('pokemon.spawn')}: </strong> {cobblemonData.SPAWN}</div>
                  <div><strong>{t('pokemon.rarity')}: </strong> {cobblemonData.RARITY}</div>
                  {cobblemonData.CONDITION && (
                    <div><strong>{t('pokemon.condition')}: </strong> {translateCondition(cobblemonData.CONDITION)}</div>
                  )}
                </dl>
              </motion.div>
            )}
          </motion.div>

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
        </div>
      </motion.section>
    </>
  )
}
