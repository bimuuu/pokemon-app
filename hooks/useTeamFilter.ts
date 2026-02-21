'use client'

import { useState, useEffect } from 'react'
import { Pokemon } from '@/types/pokemon'

interface UseTeamFilterProps {
  allPokemon: Pokemon[]
}

export function useTeamFilter({ allPokemon }: UseTeamFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedGeneration, setSelectedGeneration] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedType, selectedGeneration])

  useEffect(() => {
    let filtered = allPokemon.filter(pokemon => {
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesType = true
      if (selectedType) {
        matchesType = pokemon.types.some(t => t.type.name.toLowerCase() === selectedType.toLowerCase())
      }
      
      let matchesGeneration = true
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
          matchesGeneration = pokemon.id >= range.start && pokemon.id <= range.end
        }
      }
      
      return matchesSearch && matchesType && matchesGeneration
    })

    setFilteredPokemon(filtered)
  }, [searchTerm, selectedType, selectedGeneration, allPokemon])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('')
    setSelectedGeneration('')
  }

  return {
    searchTerm,
    selectedType,
    selectedGeneration,
    currentPage,
    filteredPokemon,
    setSearchTerm,
    setSelectedType,
    setSelectedGeneration,
    setCurrentPage,
    clearFilters
  }
}
