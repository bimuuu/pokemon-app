'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { Pokemon } from '@/types/pokemon'
import { TrainingSummary } from '@/components/training/TrainingSummary'
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
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Pokemon build data...</p>
        </div>
      </div>
    )
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
    <main className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href={`/pokemon/${pokemonName}`} className="inline-flex items-center text-blue-500 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {formatPokemonName(pokemon.name)}
        </Link>
        <h1 className="text-3xl font-bold">Pokemon Build</h1>
        <div></div>
      </div>

      {/* Integrated Training Summary */}
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

      </main>
  )
}
