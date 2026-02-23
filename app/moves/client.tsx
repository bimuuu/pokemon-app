'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Sword, Target, Star, X, Zap, Shield, Activity, AlertCircle, ArrowUpDown } from 'lucide-react'
import { Pagination } from '@/components/common'
import { getTypeColor } from '@/lib/utils'
import { MoveService, type PokemonWithMove } from '@/services/moveService'
import { ColorUtils } from '@/utils/colorUtils'
import { SortUtils, type SortField, type SortOrder } from '@/utils/sortUtils'
import { FilterUtils, POKEMON_TYPES, ITEMS_PER_PAGE } from '@/utils/filterUtils'
import { MoveDetailModal } from '@/components/modals/MoveDetailModal'
import type { Move } from 'pokenode-ts'

interface MovesListClientProps {
  initialMoves: any
}

export function MovesListClient({ initialMoves }: MovesListClientProps) {
  const searchParams = useSearchParams()
  const [moves, setMoves] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMove, setSelectedMove] = useState<Move | null>(null)
  const [isLoadingMove, setIsLoadingMove] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pokemonWithMove, setPokemonWithMove] = useState<PokemonWithMove[]>([])
  const [isLoadingPokemon, setIsLoadingPokemon] = useState(false)
  const [pokemonSearchTerm, setPokemonSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [selectedType, setSelectedType] = useState<string>('all')
  const itemsPerPage = ITEMS_PER_PAGE

  const pokemonTypes = POKEMON_TYPES

  // Handle URL search parameter
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  // Fetch detailed move data on component mount
  useEffect(() => {
    const fetchDetailedMoves = async () => {
      setIsLoading(true)
      try {
        const detailedMoves = await Promise.all(
          initialMoves.results.map(async (move: any) => {
            const response = await fetch(move.url)
            if (response.ok) {
              return await response.json()
            }
            return null
          })
        )
        setMoves(detailedMoves.filter(Boolean))
      } catch (error) {
        console.error('Failed to fetch detailed moves:', error)
        setMoves(initialMoves.results)
      } finally {
        setIsLoading(false)
      }
    }

    if (initialMoves.results?.length > 0) {
      fetchDetailedMoves()
    }
  }, [initialMoves])

  const handleMoveClick = async (moveName: string) => {
    setIsLoadingMove(true)
    setIsLoadingPokemon(true)
    try {
      const moveData = await MoveService.fetchMoveDetails(moveName)
      if (moveData) {
        setSelectedMove(moveData)
        // Fetch Pokemon that can learn this move using learned_by_pokemon
        const pokemonData = await MoveService.fetchPokemonWithMove(moveName)
        setPokemonWithMove(pokemonData)
      }
    } catch (error) {
      console.error('Failed to fetch move details:', error)
    } finally {
      setIsLoadingMove(false)
      setIsLoadingPokemon(false)
    }
  }

  const closeModal = () => {
    setSelectedMove(null)
    setPokemonWithMove([])
    setPokemonSearchTerm('')
  }

  const handleSort = (field: SortField) => {
    const { field: newField, order: newOrder } = SortUtils.handleSort(sortBy, field, sortOrder)
    setSortBy(newField)
    setSortOrder(newOrder)
    setCurrentPage(1)
  }

  // Data processing
  const filteredMoves = FilterUtils.filterMoves(moves, searchTerm, selectedType)
  const sortedMoves = SortUtils.sortMoves(filteredMoves, sortBy, sortOrder)
  const totalPages = FilterUtils.getTotalPages(sortedMoves.length, itemsPerPage)
  const currentMoves = FilterUtils.paginateMoves(sortedMoves, currentPage, itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedType])
  
  // ESC key handler to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedMove) {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [selectedMove])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Pokemon Moves</h1>
        <p className="text-lg text-muted-foreground mb-2">
          Browse all Pokemon moves with detailed information about power, accuracy, type, and effects.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Showing <span className="font-semibold">{currentMoves.length}</span> of <span className="font-semibold">{filteredMoves.length}</span> moves (Page {currentPage} of {totalPages})
        </p>
        
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search moves by name..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {pokemonTypes.map(type => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
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
              variant={sortBy === 'power' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('power')}
              className="flex items-center gap-1"
            >
              <Zap className="h-3 w-3" />
              Power
              {sortBy === 'power' && (
                <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </Button>
            <Button
              variant={sortBy === 'accuracy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('accuracy')}
              className="flex items-center gap-1"
            >
              <Target className="h-3 w-3" />
              Accuracy
              {sortBy === 'accuracy' && (
                <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </Button>
            <Button
              variant={sortBy === 'pp' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('pp')}
              className="flex items-center gap-1"
            >
              <Star className="h-3 w-3" />
              PP
              {sortBy === 'pp' && (
                <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </Button>
            <Button
              variant={sortBy === 'priority' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('priority')}
              className="flex items-center gap-1"
            >
              <Activity className="h-3 w-3" />
              Priority
              {sortBy === 'priority' && (
                <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading moves...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentMoves.map((move: any) => (
            <Card 
              key={move.name} 
              className="hover:shadow-lg transition-shadow cursor-pointer h-full"
              onClick={() => handleMoveClick(move.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {move.name.replace('-', ' ')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span className={`text-sm ${ColorUtils.getPriorityColor(move.priority || 0)}`}>
                        {move.priority !== undefined ? (move.priority > 0 ? `+${move.priority}` : move.priority) : '—'}
                      </span>
                    </div>
                    <Sword className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge 
                      className="text-white border-0"
                      style={{ backgroundColor: getTypeColor(move.type?.name || 'normal') }}
                    >
                      {move.type?.name?.toUpperCase() || 'NORMAL'}
                    </Badge>
                    <Badge className={`${ColorUtils.getDamageClassColor(move.damage_class?.name || 'status')} text-white`}>
                      {move.damage_class?.name?.toUpperCase() || 'STATUS'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span className="font-medium">Power:</span>
                      <span className={ColorUtils.getPowerColor(move.power)}>
                        {move.power || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span className="font-medium">Acc:</span>
                      <span className={ColorUtils.getAccuracyColor(move.accuracy || 0)}>
                        {move.accuracy ? `${move.accuracy}%` : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span className="font-medium">PP:</span>
                      <span className="text-blue-600">{move.pp || '—'}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {move.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text || 
                     move.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect ||
                     'Click to view detailed information about this move'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentMoves.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No moves found matching your search.</p>
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

      {/* Move Detail Modal */}
      {selectedMove && (
        <MoveDetailModal
          move={selectedMove}
          pokemonWithMove={pokemonWithMove}
          isLoadingPokemon={isLoadingPokemon}
          pokemonSearchTerm={pokemonSearchTerm}
          onPokemonSearchChange={setPokemonSearchTerm}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
