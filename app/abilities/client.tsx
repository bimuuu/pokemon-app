'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Zap, Shield, Star, X, ArrowUpDown, Activity } from 'lucide-react'
import { Pagination } from '@/components/common'
import { AbilityService, type PokemonWithAbility } from '@/services/abilityService'
import { ColorUtils } from '@/utils/colorUtils'
import { SortUtils, type AbilitySortField, type SortOrder } from '@/utils/sortUtils'
import { FilterUtils, ITEMS_PER_PAGE } from '@/utils/filterUtils'
import { AbilityDetailModal } from '@/components/modals/AbilityDetailModal'
import type { Ability } from 'pokenode-ts'

interface AbilitiesListClientProps {
  initialAbilities: any
}

export function AbilitiesListClient({ initialAbilities }: AbilitiesListClientProps) {
  const [abilities, setAbilities] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null)
  const [isLoadingAbility, setIsLoadingAbility] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pokemonWithAbility, setPokemonWithAbility] = useState<PokemonWithAbility[]>([])
  const [isLoadingPokemon, setIsLoadingPokemon] = useState(false)
  const [pokemonSearchTerm, setPokemonSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<AbilitySortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [selectedGeneration, setSelectedGeneration] = useState<string>('all')
  const itemsPerPage = ITEMS_PER_PAGE

  const generations = [
    'all',
    'generation-i',
    'generation-ii', 
    'generation-iii',
    'generation-iv',
    'generation-v',
    'generation-vi',
    'generation-vii',
    'generation-viii',
    'generation-ix'
  ]

  // Fetch detailed ability data on component mount
  useEffect(() => {
    const fetchDetailedAbilities = async () => {
      setIsLoading(true)
      try {
        const detailedAbilities = await Promise.all(
          initialAbilities.results.map(async (ability: any) => {
            const response = await fetch(ability.url)
            if (response.ok) {
              return await response.json()
            }
            return null
          })
        )
        setAbilities(detailedAbilities.filter(Boolean))
      } catch (error) {
        console.error('Failed to fetch detailed abilities:', error)
        setAbilities(initialAbilities.results)
      } finally {
        setIsLoading(false)
      }
    }

    if (initialAbilities.results?.length > 0) {
      fetchDetailedAbilities()
    }
  }, [initialAbilities])

  const handleAbilityClick = async (abilityName: string) => {
    setIsLoadingAbility(true)
    setIsLoadingPokemon(true)
    try {
      const abilityData = await AbilityService.fetchAbilityDetails(abilityName)
      if (abilityData) {
        setSelectedAbility(abilityData)
        // Fetch Pokemon that have this ability
        const pokemonData = await AbilityService.fetchPokemonWithAbility(abilityName)
        setPokemonWithAbility(pokemonData)
      }
    } catch (error) {
      console.error('Failed to fetch ability details:', error)
    } finally {
      setIsLoadingAbility(false)
      setIsLoadingPokemon(false)
    }
  }

  const closeModal = () => {
    console.log('Closing ability modal')
    setSelectedAbility(null)
    setPokemonWithAbility([])
    setPokemonSearchTerm('')
  }

  const handleSort = (field: AbilitySortField) => {
    const { field: newField, order: newOrder } = SortUtils.handleAbilitySort(sortBy, field, sortOrder)
    setSortBy(newField)
    setSortOrder(newOrder)
    setCurrentPage(1)
  }

  // Data processing
  const filteredAbilities = FilterUtils.filterAbilities(abilities, searchTerm, selectedGeneration)
  const sortedAbilities = SortUtils.sortAbilities(filteredAbilities, sortBy, sortOrder)
  const totalPages = FilterUtils.getTotalPages(sortedAbilities.length, itemsPerPage)
  const currentAbilities = FilterUtils.paginateAbilities(sortedAbilities, currentPage, itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedGeneration])
  
  // ESC key handler to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedAbility) {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [selectedAbility])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Pokemon Abilities</h1>
        <p className="text-lg text-muted-foreground mb-2">
          Browse all Pokemon abilities with detailed information about their effects and which Pokemon have them.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Showing <span className="font-semibold">{filteredAbilities.length}</span> of <span className="font-semibold">{abilities.length}</span> total abilities
        </p>
        
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search abilities by name..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Generation:</span>
            <select
              value={selectedGeneration}
              onChange={(e) => {
                setSelectedGeneration(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {generations.map(gen => (
                <option key={gen} value={gen}>
                  {gen === 'all' ? 'All Generations' : gen.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('name')}
              className="flex items-center gap-1"
            >
              <ArrowUpDown className="h-3 w-3" />
              A-Z
              {sortBy === 'name' && (
                <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </Button>
            <Button
              variant={sortBy === 'generation' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('generation')}
              className="flex items-center gap-1"
            >
              <Activity className="h-3 w-3" />
              Generation
              {sortBy === 'generation' && (
                <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading abilities...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentAbilities.map((ability: any) => (
            <Card 
              key={ability.name} 
              className="hover:shadow-lg transition-shadow cursor-pointer h-full"
              onClick={() => handleAbilityClick(ability.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {ability.name.replace('-', ' ')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span className={`text-sm ${ColorUtils.getGenerationColor(ability.generation?.name || '')}`}>
                        {ability.generation?.name?.replace('generation-', '').toUpperCase() || '—'}
                      </span>
                    </div>
                    <Zap className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge 
                      className="text-white border-0"
                      style={{ backgroundColor: ColorUtils.getGenerationColor(ability.generation?.name || '') }}
                    >
                      {ability.generation?.name?.replace('-', ' ').toUpperCase() || 'UNKNOWN'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ability.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text || 
                     ability.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect ||
                     'Click to view detailed information about this ability'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentAbilities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No abilities found matching your search.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Ability Detail Modal */}
      {selectedAbility && (
        <AbilityDetailModal
          ability={selectedAbility}
          pokemonWithAbility={pokemonWithAbility}
          isLoadingPokemon={isLoadingPokemon}
          pokemonSearchTerm={pokemonSearchTerm}
          onPokemonSearchChange={setPokemonSearchTerm}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
