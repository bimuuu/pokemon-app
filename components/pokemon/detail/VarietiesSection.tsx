'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Layers } from 'lucide-react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { Pokemon, PokemonVariety } from '@/types/pokemon'
import { renderAbilities, renderTypeMatchups, renderTransformationConditions, renderFormTypeBadge, renderStatBar } from '@/utils/pokemon-detail-utils'
import { FormTransformationService } from '@/lib/form-transformations'
import { containerVariants, itemVariants, varietyCardVariants, sectionVariants } from '../animations'

interface VarietiesSectionProps {
  pokemon: Pokemon
  varieties: PokemonVariety[]
  selectedVariety: PokemonVariety | null
  showAllVarieties: boolean
  loadingVarieties: boolean
  cobbleverseConditions: any[]
  onVarietySelect: (variety: PokemonVariety) => void
  onToggleShowAll: () => void
  onAbilityClick: (abilityName: string) => void
  t: (key: string) => string
}

export function VarietiesSection({ 
  pokemon, 
  varieties, 
  selectedVariety, 
  showAllVarieties, 
  loadingVarieties,
  cobbleverseConditions,
  onVarietySelect,
  onToggleShowAll,
  onAbilityClick,
  t 
}: VarietiesSectionProps) {
  if (varieties.length <= 1) return null

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
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 5 }}
        >
          <Layers className="w-5 h-5 mr-2" />
        </motion.div>
        {t('pokemon.formTransformation') || 'Form Transformation'}
      </motion.h2>
      
      <AnimatePresence mode="wait">
        {loadingVarieties ? (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-gray-600">Loading varieties data...</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Stats Section - Left Side */}
            <motion.div className="lg:col-span-2" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <AnimatePresence mode="wait">
                {selectedVariety ? (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                  >
                    {/* Selected Variety Header */}
                    <motion.div 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
                        >
                          <motion.img
                            src={selectedVariety.sprites.front_default || pokemon.sprites.front_default}
                            alt={selectedVariety.display_name}
                            className="w-12 h-12 object-contain"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          />
                        </motion.div>
                        <div>
                          <h4 className="font-bold text-lg">{selectedVariety.display_name}</h4>
                          {renderFormTypeBadge(selectedVariety)}
                        </div>
                      </div>
                      
                      {/* Types */}
                      <motion.div 
                        className="flex gap-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                      >
                        {selectedVariety.types.map((type, index) => (
                          <motion.div
                            key={type.type.name}
                            variants={itemVariants}
                            custom={index}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
                          >
                            <TypeBadge type={type.type.name} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>

                    {/* Stats Comparison */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <h4 className="font-medium mb-3 text-sm">{t('pokemon.stats') || 'Stats'}</h4>
                      <div className="space-y-2">
                        {selectedVariety.stats.map((stat, index) => {
                          const baseStat = pokemon.stats.find(s => s.stat.name === stat.stat.name)
                          const baseStatValue = baseStat?.base_stat || 0
                          const difference = stat.base_stat - baseStatValue
                          const percentage = (stat.base_stat / 255) * 100
                          
                          return (
                            <motion.div 
                              key={stat.stat.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                            >
                              <div className="flex justify-between items-center text-xs mb-1">
                                <span className="font-medium">
                                  {(() => {
                                    const statKey = stat.stat.name.replace('-', '')
                                    const translationKey = `pokemon.${statKey === 'specialattack' ? 'spAttack' : statKey === 'specialdefense' ? 'spDefense' : statKey}`
                                    const translation = t(translationKey)
                                    return translation !== translationKey ? translation : stat.stat.name.toUpperCase()
                                  })()}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{stat.base_stat}</span>
                                  {difference !== 0 && (
                                    <motion.span 
                                      className={`text-xs font-medium ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                                    >
                                      ({difference > 0 ? '+' : ''}{difference})
                                    </motion.span>
                                  )}
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <motion.div 
                                  className={`h-1.5 rounded-full ${difference > 0 ? 'bg-green-500' : difference < 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.8, delay: 0.7 + index * 0.05, ease: 'easeOut' }}
                                />
                              </div>
                            </motion.div>
                          )
                        })}
                        {/* Total Stats for Variety */}
                        <motion.div 
                          className="pt-3 mt-3 border-t border-gray-200"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 1.0 }}
                        >
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span>{t('pokemon.totalStats')}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600">
                                {selectedVariety.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                              </span>
                              {(() => {
                                const baseTotal = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
                                const varietyTotal = selectedVariety.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
                                const difference = varietyTotal - baseTotal
                                return difference !== 0 ? (
                                  <motion.span 
                                    className={`text-xs font-medium ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 1.1 }}
                                  >
                                    ({difference > 0 ? '+' : ''}{difference})
                                  </motion.span>
                                ) : null
                              })()}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <motion.div 
                              className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(selectedVariety.stats.reduce((sum, stat) => sum + stat.base_stat, 0) / (255 * 6)) * 100}%` }}
                              transition={{ duration: 1.0, delay: 1.2, ease: 'easeOut' }}
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Abilities */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.3 }}
                    >
                      <h4 className="font-medium mb-2 text-sm">{t('pokemon.abilities') || 'Abilities'}</h4>
                      {renderAbilities(selectedVariety.abilities, onAbilityClick, t)}
                    </motion.div>

                    {/* Type Matchups */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.4 }}
                    >
                      <h4 className="font-medium mb-2 text-sm">{t('pokemon.typeMatchups') || 'Type Matchups'}</h4>
                      {renderTypeMatchups(selectedVariety.types.map(t => t.type.name), t)}
                    </motion.div>

                    {/* Transformation Conditions */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.5 }}
                    >
                      <h4 className="font-medium mb-2 text-sm">{t('pokemon.transformationConditions') || 'Transformation Conditions'}</h4>
                      <motion.div 
                        className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.6 }}
                      >
                        {renderTransformationConditions(
                          FormTransformationService.getFormTransformationConditions(selectedVariety.name),
                          cobbleverseConditions,
                          t
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                  >
                    <motion.h3 
                      className="font-medium mb-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {t('pokemon.baseStats') || 'Base Stats'}
                    </motion.h3>
                    <motion.div 
                      className="space-y-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.2 }}
                    >
                      {pokemon.stats.map((stat, index) => (
                        <motion.div 
                          key={stat.stat.name}
                          variants={itemVariants}
                          custom={index}
                        >
                          {renderStatBar(stat)}
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Base Pokemon Transformation Conditions */}
                    {(() => {
                      const formConditions = FormTransformationService.getFormTransformationConditions(pokemon.name)
                      const allConditions = [...formConditions, ...cobbleverseConditions]
                      
                      if (allConditions.length > 0) {
                        return (
                          <motion.div 
                            className="mt-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            <h4 className="font-medium mb-2 text-sm">{t('pokemon.transformationConditions') || 'Transformation Conditions'}</h4>
                            <motion.div 
                              className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                            >
                              {renderTransformationConditions(formConditions, cobbleverseConditions, t)}
                            </motion.div>
                          </motion.div>
                        )
                      }
                      return null
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Available Forms - Right Side */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <motion.h3 
                className="font-medium mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                {t('pokemon.availableForms') || 'Available Forms'} ({varieties.length})
              </motion.h3>
              <motion.div 
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.1 }}
              >
                {(showAllVarieties ? varieties : varieties.slice(0, 4)).map((variety, index) => (
                  <motion.div
                    key={variety.name}
                    variants={varietyCardVariants}
                    custom={index}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    animate={selectedVariety?.name === variety.name ? "selected" : "visible"}
                    onClick={() => onVarietySelect(variety)}
                    className={`
                      relative border-2 rounded-lg p-3 cursor-pointer
                      ${variety.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                      ${selectedVariety?.name === variety.name ? 'ring-2 ring-purple-500 shadow-lg' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
                      >
                        <motion.img
                          src={variety.sprites.front_default || pokemon.sprites.front_default}
                          alt={variety.display_name}
                          className="w-10 h-10 object-contain"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 1.2 + index * 0.05 }}
                        />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate mb-1">
                          {variety.display_name}
                        </p>
                        
                        {/* Form Type Badge */}
                        {renderFormTypeBadge(variety)}
                      </div>
                      
                      {/* Types */}
                      <motion.div 
                        className="flex gap-1 flex-shrink-0"
                        variants={containerVariants}
                      >
                        {variety.types.map((type, typeIndex) => (
                          <motion.div
                            key={type.type.name}
                            variants={itemVariants}
                            custom={typeIndex}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
                          >
                            <TypeBadge type={type.type.name} className="text-xs" />
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                    
                    {variety.is_default && (
                      <motion.span 
                        className="absolute top-0 right-0 text-xs bg-blue-500 text-white px-1 rounded"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1.3 + index * 0.05 }}
                      >
                        {t('common.default') || 'Default'}
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Show More/Less Button */}
              {varieties.length > 4 && (
                <motion.div 
                  className="text-center mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <motion.button
                    onClick={onToggleShowAll}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium w-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showAllVarieties 
                      ? `Show Less (${varieties.length - 4} hidden)` 
                      : `Show More (${varieties.length - 4} more)`
                    }
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
