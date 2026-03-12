'use client'

import { useState } from 'react'
import { testPokemonImageSources } from '@/lib/optimized-api'

interface ImageTestButtonProps {
  pokemonId: number
  pokemonName: string
}

export function ImageTestButton({ pokemonId, pokemonName }: ImageTestButtonProps) {
  const [testing, setTesting] = useState(false)
  const [tested, setTested] = useState(false)

  const handleTest = async () => {
    if (testing || tested) return
    
    setTesting(true)
    try {
      await testPokemonImageSources(pokemonId)
      setTested(true)
    } catch (error) {
      console.error('Failed to test image sources:', error)
    } finally {
      setTesting(false)
    }
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <button
      onClick={handleTest}
      disabled={testing || tested}
      className={`px-2 py-1 text-xs rounded ${
        testing 
          ? 'bg-gray-200 text-gray-500' 
          : tested 
          ? 'bg-green-100 text-green-700' 
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`}
      title={`Test image sources for ${pokemonName} (check console)`}
    >
      {testing ? 'Testing...' : tested ? 'Tested' : 'Test Images'}
    </button>
  )
}
