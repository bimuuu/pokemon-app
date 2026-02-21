'use client'

import { Search } from 'lucide-react'
import { DraggablePokemonCard } from '@/components/pokemon/DraggablePokemonCard'
import { Pagination } from '@/components/common/Pagination'
import { TeamFilters } from '@/components/team/TeamFilters'
import { Pokemon } from '@/types/pokemon'
import { POKEMON_PER_PAGE } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'

interface PokemonLibraryProps {
  allPokemon: Pokemon[]
  filteredPokemon: Pokemon[]
  searchTerm: string
  selectedType: string
  selectedGeneration: string
  currentPage: number
  team: (Pokemon | null)[]
  onSearchChange: (term: string) => void
  onTypeChange: (type: string) => void
  onGenerationChange: (generation: string) => void
  onClearFilters: () => void
  onPageChange: (page: number) => void
}

export function PokemonLibrary({
  allPokemon,
  filteredPokemon,
  searchTerm,
  selectedType,
  selectedGeneration,
  currentPage,
  team,
  onSearchChange,
  onTypeChange,
  onGenerationChange,
  onClearFilters,
  onPageChange
}: PokemonLibraryProps) {
  const { t } = useLanguage()

  const totalPages = Math.ceil(filteredPokemon.length / POKEMON_PER_PAGE)
  const startIndex = (currentPage - 1) * POKEMON_PER_PAGE
  const paginatedPokemon = filteredPokemon.slice(startIndex, startIndex + POKEMON_PER_PAGE)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Search className="w-5 h-5 mr-2" />
        {t('team.pokemonLibrary')}
      </h2>
      
      <TeamFilters
        searchTerm={searchTerm}
        selectedType={selectedType}
        selectedGeneration={selectedGeneration}
        onSearchChange={onSearchChange}
        onTypeChange={onTypeChange}
        onGenerationChange={onGenerationChange}
        onClearFilters={onClearFilters}
      />
      
      <div className="mb-4 text-sm text-gray-600">
        {t('team.pokemonFound').replace('{count}', filteredPokemon.length.toString())}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
        {paginatedPokemon.map(pokemon => (
          <DraggablePokemonCard
            key={`${pokemon.id}-${pokemon.types.length}`} // Force re-render when types change
            pokemon={pokemon}
            isDisabled={team.some(p => p?.id === pokemon.id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav aria-label={t('pagination.navigation') || 'Pagination'} className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </nav>
      )}
    </div>
  )
}
