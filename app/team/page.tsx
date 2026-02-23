'use client'

import { useState, useEffect } from 'react'
import { Search, Users, Shield, Zap, AlertTriangle, Filter, X, RotateCcw } from 'lucide-react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
  CollisionDetection,
  rectIntersection,
  ClientRect,
} from '@dnd-kit/core'
import { TeamSlot } from '@/components/team/TeamSlot'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { DraggablePokemonCard } from '@/components/pokemon/DraggablePokemonCard'
import { IndividualSpecialFormCard } from '@/components/pokemon/IndividualSpecialFormCard'
import { getIndividualSpecialForms } from '@/lib/individual-special-forms'
import { Pagination } from '@/components/common/Pagination'
import { TeamLoadingSkeleton } from '@/components/loading/TeamLoadingSkeleton'
import { SpecialFormsLoadingSkeleton } from '@/components/loading/TeamLoadingSkeleton'
import { Pokemon, TeamAnalysis } from '@/types/pokemon'
import { fetchCobblemonData } from '@/lib/api'
import { calculateTypeWeaknesses, calculateTypeStrengths, formatPokemonName } from '@/lib/utils'
import { POKEMON_TYPES, POKEMON_PER_PAGE } from '@/lib/constants'
import { hasSpecialForms, filterSpecialFormsPokemon } from '@/lib/special-forms'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { TeamAnalysisService } from '@/features/team/services/teamAnalysisService'
import { PokemonDataService } from '@/features/pokemon/services/pokemonDataService'

export default function TeamBuilderPage() {
  const { t } = useLanguage()
  const { getCachedTypes } = usePokemonCache()
  const [team, setTeam] = useState<(Pokemon | null)[]>(Array(6).fill(null))
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showPokemonSelector, setShowPokemonSelector] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [teamAnalysis, setTeamAnalysis] = useState<TeamAnalysis | null>(null)
  const [selectedType, setSelectedType] = useState('')
  const [selectedGeneration, setSelectedGeneration] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('')
  const [draggedPokemon, setDraggedPokemon] = useState<Pokemon | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [showSpecialForms, setShowSpecialForms] = useState(false)
  const [individualSpecialForms, setIndividualSpecialForms] = useState<Pokemon[]>([])
  const [loadingSpecialForms, setLoadingSpecialForms] = useState(false)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Load Pokemon data using service
  useEffect(() => {
    const loadData = async () => {
      try {
        const pokemonData = await PokemonDataService.loadBasicPokemonData()
        
        setAllPokemon(pokemonData)
        setLoading(false)
        
        // Load types in background separately
        const cobblemonData = await fetchCobblemonData()
        loadTypesInBackground(cobblemonData)
      } catch (error) {
        console.error('Error loading Pokemon data:', error)
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Load individual special forms when toggled
  useEffect(() => {
    if (showSpecialForms && individualSpecialForms.length === 0 && !loadingSpecialForms) {
      setLoadingSpecialForms(true)
      getIndividualSpecialForms(allPokemon)
        .then(forms => {
          setIndividualSpecialForms(forms)
        })
        .catch(error => {
          console.error('Error loading individual special forms:', error)
        })
        .finally(() => {
          setLoadingSpecialForms(false)
        })
    }
  }, [showSpecialForms, allPokemon, individualSpecialForms.length, loadingSpecialForms])
  const loadTypesInBackground = async (cobblemonData: any[]) => {
    try {
      setLoadingTypes(true)
      const types = await getCachedTypes()
      
      if (types) {
        // Update Pokemon with types using service
        setAllPokemon(prev => {
          const updated = PokemonDataService.updatePokemonWithTypes(prev, cobblemonData, types)
          
          const withTypes = updated.filter(p => p.types.length > 0)
          return updated
        })
      }
      setLoadingTypes(false)
    } catch (error) {
      console.error('Error loading types in background:', error)
      setLoadingTypes(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeData = active.data.current
    
    if (activeData?.type === 'pokemon') {
      setDraggedPokemon(activeData.pokemon)
      setActiveId(active.id as string)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setDraggedPokemon(null)
      setActiveId(null)
      return
    }

    const activeData = active.data.current
    const overData = over.data.current
    
    if (activeData?.type === 'pokemon' && overData?.type === 'team-slot') {
      const pokemon = activeData.pokemon as Pokemon
      const slotIndex = overData.slotIndex as number
      
      // Check if pokemon is already in team
      const isAlreadyInTeam = team.some(p => p?.id === pokemon.id)
      if (!isAlreadyInTeam) {
        const newTeam = [...team]
        newTeam[slotIndex] = pokemon
        setTeam(newTeam)
      }
    }
    
    setDraggedPokemon(null)
    setActiveId(null)
  }

  const removeFromTeam = (slotIndex: number) => {
    const newTeam = [...team]
    newTeam[slotIndex] = null
    setTeam(newTeam)
  }

  const openPokemonSelector = (slotIndex: number) => {
    setSelectedSlot(slotIndex)
    setShowPokemonSelector(true)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedType, selectedGeneration, selectedRarity])

  const clearAllTeam = () => {
    setTeam(Array(6).fill(null))
  }

  useEffect(() => {
    analyzeTeam()
  }, [team])

  
  const analyzeTeam = () => {
    const analysis = TeamAnalysisService.analyzeTeam(team)
    setTeamAnalysis(analysis)
  }

  const filteredPokemon = PokemonDataService.filterPokemon(
    allPokemon,
    searchTerm,
    selectedType,
    selectedGeneration,
    selectedRarity
  )

  // Filter for special forms Pokemon
  const specialFormsPokemon = showSpecialForms ? individualSpecialForms : []

  const totalPages = Math.ceil(filteredPokemon.length / POKEMON_PER_PAGE)
  const startIndex = (currentPage - 1) * POKEMON_PER_PAGE
  const paginatedPokemon = filteredPokemon.slice(startIndex, startIndex + POKEMON_PER_PAGE)
  
  // Separate special forms pagination
  const specialFormsTotalPages = Math.ceil(specialFormsPokemon.length / POKEMON_PER_PAGE)
  const specialFormsStartIndex = (currentPage - 1) * POKEMON_PER_PAGE
  const paginatedSpecialForms = specialFormsPokemon.slice(specialFormsStartIndex, specialFormsStartIndex + POKEMON_PER_PAGE)

  if (loading || loadingTypes) {
    return <TeamLoadingSkeleton onClearAll={clearAllTeam} loadingTypes={loadingTypes} />
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('team.title')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {t('team.yourTeam')}
                </h2>
                {team.some(p => p !== null) && (
                  <button
                    onClick={clearAllTeam}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t('team.clearAll')}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {team.map((pokemon, index) => (
                  <TeamSlot
                    key={index}
                    pokemon={pokemon}
                    slotNumber={index + 1}
                    slotIndex={index}
                    onRemove={() => removeFromTeam(index)}
                    onAdd={() => openPokemonSelector(index)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:w-96">
            {teamAnalysis && (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-green-600">
                    <Zap className="w-5 h-5 mr-2" />
                    {t('team.teamStrengths')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {teamAnalysis.strengths.map(strength => (
                      <div key={strength.type} className="flex items-center gap-1">
                        <TypeBadge type={strength.type} />
                        <span className={`text-xs font-bold ${
                          strength.multiplier >= 2 ? 'text-green-700' : 
                          strength.multiplier >= 1.5 ? 'text-green-600' : 
                          'text-green-500'
                        }`}>
                          {strength.multiplier}x
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    {t('team.teamWeaknesses')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {teamAnalysis.weaknesses.map(weakness => (
                      <div key={weakness.type} className="flex items-center gap-1">
                        <TypeBadge type={weakness.type} />
                        <span className={`text-xs font-bold ${
                          weakness.multiplier >= 2 ? 'text-red-700' : 
                          weakness.multiplier >= 1.5 ? 'text-red-600' : 
                          'text-red-500'
                        }`}>
                          {weakness.multiplier}x
                        </span>
                        {weakness.count > 1 && (
                          <span className="text-xs text-gray-500">
                            ({weakness.count})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {teamAnalysis.recommendations.length > 0 && (
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-600">
                      <Shield className="w-5 h-5 mr-2" />
                      {t('team.recommendations')}
                    </h3>
                    <ul className="space-y-2">
                      {teamAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>
                            {typeof rec === 'string' ? (
                              rec
                            ) : (
                              <>
                                {rec.text}
                                {rec.types && (
                                  <span className="flex gap-1 ml-2">
                                    {rec.types.map(type => (
                                      <TypeBadge key={type} type={type} className="text-xs" />
                                    ))}
                                  </span>
                                )}
                              </>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Search className="w-5 h-5 mr-2" />
              {t('team.pokemonLibrary')}
            </h2>
            <button
              onClick={() => setShowSpecialForms(!showSpecialForms)}
              className={`
                px-4 py-2 rounded-lg border transition-colors flex items-center gap-2
                ${showSpecialForms 
                  ? 'bg-purple-900 border-purple-700 text-purple-300' 
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              <span className="text-lg">✨</span>
              {showSpecialForms ? t('team.showAllPokemon') : t('team.showSpecialForms')}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder={t('team.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('team.allTypes')}</option>
              {POKEMON_TYPES.map(type => (
                <option key={type} value={type}>
                  {t(`types.${type}`)}
                </option>
              ))}
            </select>
            
            <select
              value={selectedGeneration}
              onChange={(e) => setSelectedGeneration(e.target.value)}
              className="px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('team.allGenerations')}</option>
              <option value="Gen 1">{t('generations.gen1')}</option>
              <option value="Gen 2">{t('generations.gen2')}</option>
              <option value="Gen 3">{t('generations.gen3')}</option>
              <option value="Gen 4">{t('generations.gen4')}</option>
              <option value="Gen 5">{t('generations.gen5')}</option>
              <option value="Gen 6">{t('generations.gen6')}</option>
              <option value="Gen 7">{t('generations.gen7')}</option>
              <option value="Gen 8">{t('generations.gen8')}</option>
              <option value="Gen 9">{t('generations.gen9')}</option>
            </select>
            
            {(selectedType || selectedGeneration || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedType('')
                  setSelectedGeneration('')
                  setSearchTerm('')
                }}
                className="px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                {t('team.clearFilters')}
              </button>
            )}
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-400">
              {showSpecialForms 
                ? t('team.specialFormsFound').replace('{count}', specialFormsPokemon.length.toString())
                : t('team.pokemonFound').replace('{count}', filteredPokemon.length.toString())
              }
              <span className="ml-2 text-xs text-gray-500">
                ({t('pagination.showing').replace('{start}', ((currentPage - 1) * POKEMON_PER_PAGE + 1).toString())
                  .replace('{end}', Math.min(currentPage * POKEMON_PER_PAGE, showSpecialForms ? specialFormsPokemon.length : filteredPokemon.length).toString())
                  .replace('{total}', (showSpecialForms ? specialFormsPokemon.length : filteredPokemon.length).toString())})
              </span>
            </div>
            
            {(showSpecialForms ? specialFormsTotalPages > 1 : totalPages > 1) && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{t('pagination.page')} {currentPage} {t('pagination.of')} {showSpecialForms ? specialFormsTotalPages : totalPages}</span>
              </div>
            )}
          </div>

          <div className="border-t border-b border-gray-700 bg-gray-900/50 -mx-6 px-6 py-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
              {showSpecialForms ? (
                loadingSpecialForms ? (
                  <SpecialFormsLoadingSkeleton />
                ) : paginatedSpecialForms.length > 0 ? (
                  paginatedSpecialForms.map(pokemon => (
                    <IndividualSpecialFormCard
                      key={`special-${pokemon.id}-${pokemon.name}`}
                      basePokemon={pokemon}
                      formName={pokemon.name}
                      formData={pokemon.form_data!}
                      isDisabled={team.some(p => p?.id === pokemon.id)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <div className="text-gray-400">{t('common.noDataFound')}</div>
                  </div>
                )
              ) : (
                paginatedPokemon.map(pokemon => (
                  <DraggablePokemonCard
                    key={`${pokemon.id}-${pokemon.types.length}`} // Force re-render when types change
                    pokemon={pokemon}
                    isDisabled={team.some(p => p?.id === pokemon.id)}
                  />
                ))
              )}
            </div>
          </div>

          {(showSpecialForms ? specialFormsTotalPages > 1 : totalPages > 1) && (
            <div className="flex flex-col items-center space-y-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                {t('pagination.resultsPerPage')}: {POKEMON_PER_PAGE}
              </div>
              <nav aria-label={t('pagination.navigation') || 'Pagination'} className="w-full max-w-md">
                <Pagination
                  currentPage={currentPage}
                  totalPages={showSpecialForms ? specialFormsTotalPages : totalPages}
                  onPageChange={setCurrentPage}
                />
              </nav>
            </div>
          )}
        </div>


        <DragOverlay>
          {draggedPokemon && (
            <div className="opacity-90 rotate-3 scale-105">
              <DraggablePokemonCard pokemon={draggedPokemon} isDisabled={false} />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
