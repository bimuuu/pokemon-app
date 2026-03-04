'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Pokemon, PokemonFormData } from '@/types/pokemon'
import { TrainingSummary } from '@/components/training/TrainingSummary'
import { FormSelector } from '@/components/training/FormSelector'
import { BuildPageSkeleton } from '@/components/loading/BuildPageSkeleton'
import { formatPokemonName } from '@/lib/utils'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'

export default function PokemonBuildPage() {
  const { getCachedPokemon } = usePokemonCache()
  const params = useParams()
  const pokemonName = params.name as string
  
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [selectedForm, setSelectedForm] = useState<string>('base')
  const [selectedFormData, setSelectedFormData] = useState<PokemonFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPokemon()
  }, [pokemonName])

  const loadPokemon = async () => {
    setIsLoading(true)
    try {
      const cachedData = await getCachedPokemon(pokemonName)
      if (cachedData) {
        setPokemon(cachedData.pokemon)
        // Set initial form - check if pokemon name includes a form suffix
        if (pokemonName.includes('-')) {
          setSelectedForm(pokemonName) // Use the form from URL
        } else {
          setSelectedForm('base') // Default to base form for regular Pokemon
        }
      }
    } catch (error) {
      console.error('Failed to load Pokemon:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSelect = (formName: string, formData?: PokemonFormData) => {
    setSelectedForm(formName)
    setSelectedFormData(formData || null)
  }

  const handleFormChange = () => {
    // Force refresh by clearing and re-initializing
    console.log('Form changed, refreshing recommendations...')
    
    // Force re-render of TrainingSummary by updating key
    setSelectedForm(prev => prev) // This will trigger the key change in TrainingSummary
    
    // Clear selected moves, items, EVs, nature, and abilities to force refresh
    if (typeof window !== 'undefined' && window.localStorage) {
      // Clear cached training data for this Pokemon
      const cacheKey = `training-${pokemon?.name || pokemonName}-${selectedForm || 'base'}`
      localStorage.removeItem(cacheKey)
    }
  }

  // Convert PokemonFormData to Pokemon format for TrainingSummary
  const getPokemonForTraining = (): Pokemon => {
    if (selectedFormData) {
      // Convert form data to Pokemon format
      return {
        id: selectedFormData.id,
        name: selectedFormData.name,
        order: selectedFormData.order,
        height: pokemon?.height || 0,
        weight: pokemon?.weight || 0,
        base_experience: pokemon?.base_experience || 0,
        is_default: selectedFormData.is_default,
        location_area_encounters: pokemon?.location_area_encounters || '',
        sprites: selectedFormData.sprites,
        stats: selectedFormData.stats,
        types: selectedFormData.types,
        abilities: selectedFormData.abilities,
        moves: pokemon?.moves || [], // Use base Pokemon moves as fallback
        species: pokemon?.species || { name: selectedFormData.name, url: '' }
      }
    }
    return pokemon!
  }

  if (isLoading) {
    return <BuildPageSkeleton />
  }

  if (!pokemon) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Pokemon not found.</p>
        <Link href={`/pokemon/${pokemonName}`} className="text-blue-500 hover:underline mt-4 inline-block">
          Back to Pokemon details
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <main className="max-w-6xl mx-auto space-y-8">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Link href={`/pokemon/${pokemonName.split('-')[0]}`} className="inline-flex items-center text-blue-500 hover:underline">
            <motion.div
              whileHover={{ x: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
            </motion.div>
            Back to {formatPokemonName(pokemon.name.split('-')[0])}
          </Link>
          <div></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Selection Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:w-80 flex-shrink-0"
          >
            <FormSelector
              pokemon={pokemon}
              selectedForm={selectedForm}
              onFormSelect={handleFormSelect}
              onFormChange={handleFormChange}
            />
          </motion.div>

          {/* Build Content - Centered */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 max-w-4xl mx-auto w-full"
          >
            {/* Integrated Training Summary */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            >
              <TrainingSummary
                key={`${selectedForm || 'base'}-${pokemon?.id}-${getPokemonForTraining().types.map(t => t.type.name).join('-')}`}
                pokemon={getPokemonForTraining()}
                isBuildPage={true}
                onOptimize={() => {
                  // TODO: Implement comprehensive optimization
                  console.log('Optimize build for', pokemon.name, selectedForm || '')
                }}
                onExport={() => {
                  // TODO: Implement export functionality
                  console.log('Export build for', pokemon.name, selectedForm || '')
                }}
                onShare={() => {
                  // TODO: Implement share functionality
                  console.log('Share build for', pokemon.name, selectedForm || '')
                }}
              />
            </motion.div>
          </motion.div>
        </div>

      </main>
    </motion.div>
  )
}
