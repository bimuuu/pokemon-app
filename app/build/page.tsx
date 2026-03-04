'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pokemon, PokemonFormData } from '@/types/pokemon'
import { TrainingSummary } from '@/components/training/TrainingSummary'
import { FormSelector } from '@/components/training/FormSelector'
import { PokemonSelector } from '@/components/training/PokemonSelector'
import { formatPokemonName } from '@/lib/utils'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { 
  ArrowLeft,
  Loader2,
  Wrench,
  Sparkles,
  Target,
  Zap
} from 'lucide-react'

export default function BuildPage() {
  const { getCachedPokemon } = usePokemonCache()
  
  // Pokemon selection state
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [selectedForm, setSelectedForm] = useState<string>('')
  const [selectedFormData, setSelectedFormData] = useState<PokemonFormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Build state
  const [buildData, setBuildData] = useState<{
    pokemon: Pokemon
    form?: PokemonFormData
  } | null>(null)

  const handlePokemonSelect = async (pokemon: Pokemon) => {
    setIsLoading(true)
    setSelectedPokemon(pokemon)
    setSelectedForm('')
    setSelectedFormData(null)
    
    try {
      // Set initial build data
      setBuildData({
        pokemon
      })
    } catch (error) {
      console.error('Failed to load Pokemon:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSelect = (formName: string, formData?: PokemonFormData) => {
    if (!selectedPokemon) return
    
    setSelectedForm(formName)
    setSelectedFormData(formData || null)
    
    // Update build data with form information
    setBuildData({
      pokemon: selectedPokemon,
      form: formData
    })
  }

  const handleOptimize = () => {
    if (!buildData) return
    console.log('Optimize build for', buildData.pokemon.name, buildData.form?.form_name || '')
    // TODO: Implement comprehensive optimization
  }

  const handleExport = () => {
    if (!buildData) return
    console.log('Export build for', buildData.pokemon.name, buildData.form?.form_name || '')
    // TODO: Implement export functionality
  }

  const handleShare = () => {
    if (!buildData) return
    console.log('Share build for', buildData.pokemon.name, buildData.form?.form_name || '')
    // TODO: Implement share functionality
  }

  const getBuildTitle = () => {
    if (!buildData) return 'Pokemon Build Builder'
    
    const pokemonName = formatPokemonName(buildData.pokemon.name)
    if (buildData.form) {
      const formName = buildData.form.form_name || selectedForm
      const parts = formName.split('-')
      if (parts.length > 1) {
        const formSuffix = parts.slice(1).join(' ')
        return `${pokemonName} (${formSuffix.charAt(0).toUpperCase() + formSuffix.slice(1)}) Build`
      }
    }
    return `${pokemonName} Build`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Wrench className="h-8 w-8 text-blue-600" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {getBuildTitle()}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Create optimal builds for any Pokemon and their forms
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selection Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              <PokemonSelector 
                onPokemonSelect={handlePokemonSelect}
                selectedPokemon={selectedPokemon}
              />
              
              {selectedPokemon && (
                <FormSelector
                  pokemon={selectedPokemon}
                  selectedForm={selectedForm}
                  onFormSelect={handleFormSelect}
                />
              )}
              
              {buildData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Build Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={handleOptimize}
                      className="w-full"
                      variant="default"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Optimize Build
                    </Button>
                    <Button 
                      onClick={handleExport}
                      className="w-full"
                      variant="outline"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Export Build
                    </Button>
                    <Button 
                      onClick={handleShare}
                      className="w-full"
                      variant="outline"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Share Build
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>

          {/* Build Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {isLoading && (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-6 w-6" />
                    </motion.div>
                    <span>Loading build data...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {!isLoading && !buildData && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Wrench className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Pokemon to Start Building</h3>
                  <p className="text-muted-foreground max-w-md">
                    Choose a Pokemon from the selector to begin creating an optimal build with moves, items, EVs, nature, and abilities.
                  </p>
                </CardContent>
              </Card>
            )}

            {!isLoading && buildData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TrainingSummary
                  pokemon={buildData.pokemon}
                  isBuildPage={true}
                  onOptimize={handleOptimize}
                  onExport={handleExport}
                  onShare={handleShare}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
