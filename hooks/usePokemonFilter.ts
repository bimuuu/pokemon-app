'use client'

import { useState, useEffect } from 'react'
import { CobblemonPokemon } from '@/types/pokemon'

interface UsePokemonFilterProps {
  pokemonData: CobblemonPokemon[]
  pokemonTypes: Record<string, string[]>
}

export function usePokemonFilter({ pokemonData, pokemonTypes }: UsePokemonFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedGeneration, setSelectedGeneration] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [filteredData, setFilteredData] = useState<CobblemonPokemon[]>([])

  useEffect(() => {
    let filtered = pokemonData

    if (searchTerm) {
      filtered = filtered.filter(pokemon =>
        pokemon.POKÉMON.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon['N.'].includes(searchTerm)
      )
    }

    if (selectedType) {
      filtered = filtered.filter(pokemon => {
        const types = pokemonTypes[pokemon.POKÉMON] || []
        return types.includes(selectedType.toLowerCase())
      })
    }

    if (selectedGeneration) {
      const genRanges: Record<string, { start: number; end: number }> = {
        'Gen 1': { start: 1, end: 151 },
        'Gen 2': { start: 152, end: 251 },
        'Gen 3': { start: 252, end: 386 },
        'Gen 4': { start: 387, end: 493 },
        'Gen 5': { start: 495, end: 649 },
        'Gen 6': { start: 650, end: 721 },
        'Gen 7': { start: 722, end: 809 },
        'Gen 8': { start: 810, end: 898 },
        'Gen 9': { start: 906, end: 1025 }
      }
      
      const range = genRanges[selectedGeneration]
      if (range) {
        filtered = filtered.filter(pokemon => {
          const pokemonId = parseInt(pokemon['N.'].replace('#', ''))
          return pokemonId >= range.start && pokemonId <= range.end
        })
      }
    }

    if (selectedRarity) {
      filtered = filtered.filter(pokemon => 
        pokemon.RARITY?.toLowerCase() === selectedRarity.toLowerCase()
      )
    }

    if (selectedLocation) {
      filtered = filtered.filter(pokemon => 
        pokemon.SPAWN?.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    setFilteredData(filtered)
  }, [searchTerm, selectedType, selectedGeneration, selectedRarity, selectedLocation, pokemonData, pokemonTypes])

  const clearAllFilters = () => {
    setSelectedType('')
    setSelectedGeneration('')
    setSelectedRarity('')
    setSelectedLocation('')
  }

  return {
    searchTerm,
    selectedType,
    selectedGeneration,
    selectedRarity,
    selectedLocation,
    filteredData,
    setSearchTerm,
    setSelectedType,
    setSelectedGeneration,
    setSelectedRarity,
    setSelectedLocation,
    clearAllFilters
  }
}
