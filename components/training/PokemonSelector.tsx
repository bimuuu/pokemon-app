'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Pokemon } from '@/types/pokemon'
import { formatPokemonName, formatPokemonId } from '@/lib/utils'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { 
  Search,
  Loader2,
  Star,
  Sparkles
} from 'lucide-react'

interface PokemonSelectorProps {
  onPokemonSelect: (pokemon: Pokemon) => void
  selectedPokemon?: Pokemon | null
  className?: string
}

export function PokemonSelector({ 
  onPokemonSelect, 
  selectedPokemon,
  className = ''
}: PokemonSelectorProps) {
  const { getCachedPokemon } = usePokemonCache()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Pokemon[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentPokemon, setRecentPokemon] = useState<Pokemon[]>([])

  useEffect(() => {
    loadRecentPokemon()
  }, [])

  const loadRecentPokemon = async () => {
    // Load some popular Pokemon as defaults
    const popularPokemon = [
      'pikachu', 'charizard', 'blastoise', 'venusaur', 
      'gengar', 'dragonite', 'mewtwo', 'lucario', 'greninja', 'zamazenta'
    ]
    
    const pokemonData: Pokemon[] = []
    for (const name of popularPokemon) {
      try {
        const cachedData = await getCachedPokemon(name)
        if (cachedData) {
          pokemonData.push(cachedData.pokemon)
        }
      } catch (error) {
        console.warn(`Failed to load ${name}:`, error)
      }
    }
    
    setRecentPokemon(pokemonData)
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    try {
      // Try to get cached data first
      const cachedData = await getCachedPokemon(searchTerm.toLowerCase())
      if (cachedData) {
        setSearchResults([cachedData.pokemon])
      } else {
        // If not cached, try to fetch from API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`)
        if (response.ok) {
          const data = await response.json()
          const pokemon: Pokemon = {
            id: data.id,
            name: data.name,
            order: data.order,
            height: data.height,
            weight: data.weight,
            base_experience: data.base_experience,
            is_default: data.is_default,
            location_area_encounters: data.location_area_encounters,
            sprites: data.sprites,
            stats: data.stats,
            types: data.types,
            abilities: data.abilities,
            moves: data.moves,
            species: data.species
          }
          setSearchResults([pokemon])
        } else {
          setSearchResults([])
        }
      }
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-gray-500',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-500',
      grass: 'bg-green-500',
      ice: 'bg-cyan-500',
      fighting: 'bg-orange-500',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-500',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-700',
      steel: 'bg-gray-600',
      fairy: 'bg-pink-400'
    }
    return colors[type] || 'bg-gray-500'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Select Pokemon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Search Pokemon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
            size="sm"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Selected Pokemon Display */}
        {selectedPokemon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Selected: {formatPokemonName(selectedPokemon.name)} {formatPokemonId(selectedPokemon.id)}
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Search Results</h4>
            {searchResults.map((pokemon) => (
              <motion.div
                key={pokemon.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant={selectedPokemon?.id === pokemon.id ? "default" : "outline"}
                  className="w-full justify-between h-auto p-3"
                  onClick={() => onPokemonSelect(pokemon)}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">
                        {formatPokemonName(pokemon.name)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatPokemonId(pokemon.id)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type.type.name}
                        variant="secondary"
                        className={`text-xs text-white ${getTypeColor(type.type.name)}`}
                      >
                        {type.type.name.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recent/Popular Pokemon */}
        {recentPokemon.length > 0 && searchResults.length === 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4" />
              Popular Pokemon
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {recentPokemon.map((pokemon) => (
                <motion.div
                  key={pokemon.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  <Button
                    variant={selectedPokemon?.id === pokemon.id ? "default" : "outline"}
                    className="w-full justify-between h-auto p-2"
                    onClick={() => onPokemonSelect(pokemon)}
                  >
                    <div className="text-left">
                      <div className="text-xs font-medium truncate">
                        {formatPokemonName(pokemon.name)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatPokemonId(pokemon.id)}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {pokemon.types.slice(0, 2).map((type) => (
                        <Badge
                          key={type.type.name}
                          variant="secondary"
                          className={`w-2 h-2 rounded-full p-0 ${getTypeColor(type.type.name)}`}
                        />
                      ))}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {searchResults.length === 0 && recentPokemon.length === 0 && !isSearching && (
          <div className="text-center py-6 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Search for a Pokemon to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
