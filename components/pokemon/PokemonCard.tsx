'use client'

import { useState, useEffect } from 'react'
import { CobblemonPokemon, PokemonVariety } from '@/types/pokemon'
import { PokemonCardClient } from './PokemonCardClient'
import { fetchPokemonVarietiesWithDetails } from '@/lib/pokemon-api'
import { formatPokemonName } from '@/lib/utils'

interface PokemonCardProps {
  pokemon: CobblemonPokemon
  types?: string[]
}

export function PokemonCard({ pokemon, types }: PokemonCardProps) {
  const [varieties, setVarieties] = useState<PokemonVariety[]>([])
  const [loadingVarieties, setLoadingVarieties] = useState(false)

  useEffect(() => {
    const loadVarieties = async () => {
      if (!pokemon?.POKÉMON) return
      
      setLoadingVarieties(true)
      try {
        const pokemonName = formatPokemonName(pokemon.POKÉMON.toLowerCase())
        const varietiesData = await fetchPokemonVarietiesWithDetails(pokemonName)
        setVarieties(varietiesData)
      } catch (error) {
        console.error(`Failed to load varieties for ${pokemon.POKÉMON}:`, error)
      } finally {
        setLoadingVarieties(false)
      }
    }

    loadVarieties()
  }, [pokemon.POKÉMON])

  return <PokemonCardClient pokemon={pokemon} types={types} varieties={varieties} />
}
