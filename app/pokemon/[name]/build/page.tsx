'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Pokemon } from '@/types/pokemon'
import { TrainingSummary } from '@/components/training/TrainingSummary'
import { BuildPageSkeleton } from '@/components/loading/BuildPageSkeleton'
import { formatPokemonName } from '@/lib/utils'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'

export default function PokemonBuildPage() {
  const { getCachedPokemon } = usePokemonCache()
  const params = useParams()
  const pokemonName = params.name as string
  
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
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
      }
    } catch (error) {
      console.error('Failed to load Pokemon:', error)
    } finally {
      setIsLoading(false)
    }
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
          <Link href={`/pokemon/${pokemonName}`} className="inline-flex items-center text-blue-500 hover:underline">
            <motion.div
              whileHover={{ x: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
            </motion.div>
            Back to {formatPokemonName(pokemon.name)}
          </Link>
          <div></div>
        </motion.div>

        {/* Integrated Training Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        >
          <TrainingSummary
            pokemon={pokemon}
            isBuildPage={true}
            onOptimize={() => {
              // TODO: Implement comprehensive optimization
              console.log('Optimize build for', pokemon.name)
            }}
            onExport={() => {
              // TODO: Implement export functionality
              console.log('Export build for', pokemon.name)
            }}
            onShare={() => {
              // TODO: Implement share functionality
              console.log('Share build for', pokemon.name)
            }}
          />
        </motion.div>

      </main>
    </motion.div>
  )
}
