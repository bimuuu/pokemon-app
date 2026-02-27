'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Search } from 'lucide-react'
import { MoveTooltip } from '@/components/common/MoveTooltip'
import { PokemonMovesService, type MoveLearnMethod } from '@/services/pokemonMovesService'
import { containerVariants, itemVariants, moveCategoryVariants, sectionVariants } from '../animations'

interface MovesSectionProps {
  pokemonName: string
  pokemonMoves: {
    levelUp: MoveLearnMethod[]
    tm: MoveLearnMethod[]
    egg: MoveLearnMethod[]
    tutor: MoveLearnMethod[]
    other: MoveLearnMethod[]
  } | null
  loadingMoves: boolean
  onMoveClick: (moveName: string) => void
  t: (key: string) => string
}

export function MovesSection({ 
  pokemonName, 
  pokemonMoves, 
  loadingMoves, 
  onMoveClick, 
  t 
}: MovesSectionProps) {
  const [moveSearchTerm, setMoveSearchTerm] = useState('')
  const [selectedMoveCategory, setSelectedMoveCategory] = useState<string>('all')

  // Filter moves based on search term and category
  const filterMoves = (moves: MoveLearnMethod[]) => {
    return moves.filter(move => 
      move.name.toLowerCase().includes(moveSearchTerm.toLowerCase())
    )
  }

  // Get filtered moves by category
  const getFilteredMoves = () => {
    if (!pokemonMoves) return { levelUp: [], tm: [], egg: [], tutor: [], other: [] }
    
    if (selectedMoveCategory === 'all') {
      return {
        levelUp: filterMoves(pokemonMoves.levelUp),
        tm: filterMoves(pokemonMoves.tm),
        egg: filterMoves(pokemonMoves.egg),
        tutor: filterMoves(pokemonMoves.tutor),
        other: filterMoves(pokemonMoves.other)
      }
    }
    
    return {
      levelUp: selectedMoveCategory === 'level-up' ? filterMoves(pokemonMoves.levelUp) : [],
      tm: selectedMoveCategory === 'tm' ? filterMoves(pokemonMoves.tm) : [],
      egg: selectedMoveCategory === 'egg' ? filterMoves(pokemonMoves.egg) : [],
      tutor: selectedMoveCategory === 'tutor' ? filterMoves(pokemonMoves.tutor) : [],
      other: selectedMoveCategory === 'other' ? filterMoves(pokemonMoves.other) : []
    }
  }

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
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <motion.div
          animate={{ rotate: [0, 20, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, repeatDelay: 7 }}
        >
          <Zap className="w-5 h-5 mr-2" />
        </motion.div>
        {t('pokemon.moves') || 'Moves'}
      </motion.h2>
      
      <AnimatePresence mode="wait">
        {loadingMoves ? (
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
            <p className="text-gray-600">Loading moves data...</p>
          </motion.div>
        ) : pokemonMoves ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Search and Filter Controls */}
            <motion.div 
              className="mb-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              {/* Search Bar */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <motion.input
                  type="text"
                  placeholder={t('pokemon.searchMoves') || 'Search moves...'}
                  value={moveSearchTerm}
                  onChange={(e) => setMoveSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.2 }}
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              {/* Category Filter */}
              <motion.div 
                className="flex flex-wrap gap-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.3 }}
              >
                {[
                  { key: 'all', label: t('pokemon.allMoves') || 'All Moves', icon: '' },
                  { key: 'level-up', label: t('pokemon.levelUpMoves') || 'Level Up', icon: '📈' },
                  { key: 'tm', label: t('pokemon.tmMoves') || 'TM', icon: '💿' },
                  { key: 'egg', label: t('pokemon.eggMoves') || 'Egg', icon: '🥚' },
                  { key: 'tutor', label: t('pokemon.tutorMoves') || 'Tutor', icon: '👨‍🏫' },
                  { key: 'other', label: t('pokemon.otherMoves') || 'Other', icon: '⭐' }
                ].map((category, index) => (
                  <motion.button
                    key={category.key}
                    onClick={() => setSelectedMoveCategory(category.key)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedMoveCategory === category.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    variants={moveCategoryVariants}
                    custom={index}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {category.icon} {category.label}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            {/* Filtered Moves Display */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              {(() => {
                const filteredMoves = getFilteredMoves()
                const hasAnyMoves = filteredMoves.levelUp.length > 0 || 
                                 filteredMoves.tm.length > 0 || 
                                 filteredMoves.egg.length > 0 || 
                                 filteredMoves.tutor.length > 0 || 
                                 filteredMoves.other.length > 0

                if (!hasAnyMoves) {
                  return (
                    <motion.div 
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-gray-600">
                        {moveSearchTerm 
                          ? (t('pokemon.noMovesFound') || 'No moves found matching your search.')
                          : (t('pokemon.noMovesInCategory') || 'No moves in this category.')
                        }
                      </p>
                    </motion.div>
                  )
                }

                return (
                  <>
                    {/* Level Up Moves */}
                    {filteredMoves.levelUp.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.5 }}
                      >
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <span className="mr-2">📈</span>
                          {t('pokemon.levelUpMoves') || 'Level Up Moves'} ({filteredMoves.levelUp.length})
                        </h3>
                        <motion.div 
                          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 1.6 }}
                        >
                          {filteredMoves.levelUp.map((move, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              custom={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <MoveTooltip move={{ name: move.name }}>
                                <div 
                                  onClick={() => onMoveClick(move.name)}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:shadow-md cursor-pointer"
                                >
                                  <span className="font-medium capitalize text-sm">{move.name}</span>
                                  <span className="text-sm font-semibold text-blue-600">Lv. {move.level}</span>
                                </div>
                              </MoveTooltip>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}

                    {/* TM Moves */}
                    {filteredMoves.tm.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.7 }}
                      >
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <span className="mr-2">💿</span>
                          {t('pokemon.tmMoves') || 'TM Moves'} ({filteredMoves.tm.length})
                        </h3>
                        <motion.div 
                          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 1.8 }}
                        >
                          {filteredMoves.tm.map((move, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              custom={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <MoveTooltip move={{ name: move.name }}>
                                <div 
                                  onClick={() => onMoveClick(move.name)}
                                  className="block p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:shadow-md cursor-pointer"
                                >
                                  <span className="font-medium capitalize text-sm">{move.name}</span>
                                </div>
                              </MoveTooltip>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Egg Moves */}
                    {filteredMoves.egg.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.9 }}
                      >
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <span className="mr-2">🥚</span>
                          {t('pokemon.eggMoves') || 'Egg Moves'} ({filteredMoves.egg.length})
                        </h3>
                        <motion.div 
                          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 2.0 }}
                        >
                          {filteredMoves.egg.map((move, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              custom={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <MoveTooltip move={{ name: move.name }}>
                                <div 
                                  onClick={() => onMoveClick(move.name)}
                                  className="block p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:shadow-md cursor-pointer"
                                >
                                  <span className="font-medium capitalize text-sm">{move.name}</span>
                                </div>
                              </MoveTooltip>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Tutor Moves */}
                    {filteredMoves.tutor.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 2.1 }}
                      >
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <span className="mr-2">👨‍🏫</span>
                          {t('pokemon.tutorMoves') || 'Tutor Moves'} ({filteredMoves.tutor.length})
                        </h3>
                        <motion.div 
                          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 2.2 }}
                        >
                          {filteredMoves.tutor.map((move, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              custom={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <MoveTooltip move={{ name: move.name }}>
                                <div 
                                  onClick={() => onMoveClick(move.name)}
                                  className="block p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:shadow-md cursor-pointer"
                                >
                                  <span className="font-medium capitalize text-sm">{move.name}</span>
                                </div>
                              </MoveTooltip>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Other Moves */}
                    {filteredMoves.other.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 2.3 }}
                      >
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <span className="mr-2">⭐</span>
                          {t('pokemon.otherMoves') || 'Other Moves'} ({filteredMoves.other.length})
                        </h3>
                        <motion.div 
                          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 2.4 }}
                        >
                          {filteredMoves.other.map((move, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              custom={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <MoveTooltip move={{ name: move.name }}>
                                <div 
                                  onClick={() => onMoveClick(move.name)}
                                  className="block p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:shadow-md cursor-pointer"
                                >
                                  <span className="font-medium capitalize text-sm">{move.name}</span>
                                </div>
                              </MoveTooltip>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-gray-600">Failed to load moves data.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
