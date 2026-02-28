import { Users, Shield, Search, RotateCcw, Filter, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'

interface TeamLoadingSkeletonProps {
  onClearAll: () => void
  loadingTypes?: boolean
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
}

const pulseVariants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: 1,
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
}

const spinVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

export function TeamLoadingSkeleton({ onClearAll, loadingTypes = false }: TeamLoadingSkeletonProps) {
  const { t } = useLanguage()

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-center"
        variants={itemVariants}
      >
        <h1 className="text-4xl font-bold mb-4">{t('team.title')}</h1>
        <motion.p 
          className="text-gray-400 max-w-2xl mx-auto"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        >
          {t('team.subtitle')}
        </motion.p>
        {loadingTypes && (
          <motion.div 
            className="mt-4 inline-flex items-center gap-2 text-blue-400"
            variants={itemVariants}
          >
            <motion.div 
              className="rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"
              variants={spinVariants}
              animate="animate"
            />
            <span className="text-sm">{t('common.loading')} {t('types.types')}...</span>
          </motion.div>
        )}
      </motion.div>

      <motion.div 
        className="flex flex-col lg:flex-row gap-8"
        variants={containerVariants}
      >
        <motion.div 
          className="flex-1"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center text-white">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Users className="w-5 h-5 mr-2" />
                </motion.div>
                {t('team.yourTeam')}
              </h2>
              <motion.button
                onClick={onClearAll}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.div>
                {t('team.clearAll')}
              </motion.button>
            </div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div 
                  key={index} 
                  className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-4"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: "#6b7280",
                    backgroundColor: "#374151"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="text-center text-gray-400">
                    <motion.div 
                      className="h-4 bg-gray-600 rounded w-20 mx-auto mb-2"
                      variants={pulseVariants}
                      initial="initial"
                      animate="animate"
                    />
                    <div className="text-sm">{t('team.slot')} {index + 1}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="lg:w-96"
          variants={containerVariants}
        >
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
          >
            <motion.div 
              className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
              }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center text-green-400">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Shield className="w-5 h-5 mr-2" />
                </motion.div>
                {t('team.teamStrengths')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="rounded-full h-4 w-4 border-2 border-green-400 border-t-transparent"
                    variants={spinVariants}
                    animate="animate"
                  />
                  <span className="text-sm text-gray-400">{t('common.loading')} analysis...</span>
                </div>
                <motion.div 
                  className="space-y-2"
                  variants={containerVariants}
                >
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="h-3 bg-gray-700 rounded"
                      variants={pulseVariants}
                      initial="initial"
                      animate="animate"
                      style={{ width: `${75 - i * 10}%` }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
              }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center text-red-400">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                >
                  <Shield className="w-5 h-5 mr-2" />
                </motion.div>
                {t('team.teamWeaknesses')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent"
                    variants={spinVariants}
                    animate="animate"
                  />
                  <span className="text-sm text-gray-400">{t('common.loading')} analysis...</span>
                </div>
                <motion.div 
                  className="space-y-2"
                  variants={containerVariants}
                >
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="h-3 bg-gray-700 rounded"
                      variants={pulseVariants}
                      initial="initial"
                      animate="animate"
                      style={{ width: `${60 + i * 10}%` }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6"
        variants={itemVariants}
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center text-white">
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              <Search className="w-5 h-5 mr-2" />
            </motion.div>
            {t('team.pokemonLibrary')}
          </h2>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          variants={containerVariants}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              className="h-10 bg-gray-700 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            />
          ))}
        </motion.div>
        
        <motion.div 
          className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          variants={containerVariants}
        >
          <motion.div 
            className="h-5 bg-gray-700 rounded w-48"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div 
            className="h-5 bg-gray-700 rounded w-24"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
        </motion.div>

        <motion.div 
          className="border-t border-b border-gray-700 bg-gray-900/50 -mx-6 px-6 py-6 mb-6"
          variants={containerVariants}
        >
          {loadingTypes && (
            <motion.div 
              className="col-span-full text-center py-4 mb-4"
              variants={itemVariants}
            >
              <div className="inline-flex items-center gap-2 text-blue-400 bg-blue-900/50 px-4 py-2 rounded-lg border border-blue-700">
                <motion.div 
                  className="rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"
                  variants={spinVariants}
                  animate="animate"
                />
                <span className="text-sm">{t('common.loading')} {t('types.types')} for Pokemon...</span>
              </div>
            </motion.div>
          )}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto p-2"
            variants={containerVariants}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-800 border border-gray-600 rounded-lg p-5 h-32"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "#6b7280",
                  backgroundColor: "#374151"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="flex items-center h-full space-x-3">
                  <motion.div 
                    className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0"
                    variants={pulseVariants}
                    initial="initial"
                    animate="animate"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <motion.div 
                      className="h-3 bg-gray-700 rounded w-3/4 mb-2"
                      variants={pulseVariants}
                      initial="initial"
                      animate="animate"
                    />
                    <div className="flex gap-1">
                      <motion.div 
                        className="h-4 w-8 bg-gray-700 rounded-full"
                        variants={pulseVariants}
                        initial="initial"
                        animate="animate"
                      />
                      <motion.div 
                        className="h-4 w-8 bg-gray-700 rounded-full"
                        variants={pulseVariants}
                        initial="initial"
                        animate="animate"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex flex-col items-center space-y-4 pt-4 border-t border-gray-700"
          variants={containerVariants}
        >
          <motion.div 
            className="h-5 bg-gray-700 rounded w-32"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div 
            className="h-8 bg-gray-700 rounded w-64"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
