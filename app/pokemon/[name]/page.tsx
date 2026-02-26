'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, MapPin, Star, Zap, Shield, Heart, Layers, ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { EvolutionStage } from '@/components/pokemon/EvolutionStage'
import { AbilityTooltip } from '@/components/common/AbilityTooltip'
import { NatureTooltip } from '@/components/common/NatureTooltip'
import { MoveTooltip } from '@/components/common/MoveTooltip'
import { Pokemon, CobblemonPokemon, EvolutionChain, PokemonForm, PokemonFormData, FormTransformationCondition, PokemonVariety } from '@/types/pokemon'
import { formatPokemonId, formatPokemonName, calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'
import { renderStatBar, renderAbilities, renderTypeMatchups, renderTransformationConditions, renderFormTypeBadge, formatStatName } from '@/utils/pokemon-detail-utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { translateCondition } from '@/lib/i18n'
import { fetchPokemonForms, fetchAllFormsData, getFormTransformationConditions, getFormDisplayName, getGmaxMoveName, fetchPokemonVarietiesWithDetails, getCobbleverseTransformationConditions } from '@/lib/pokemon-api'
import { fetchPokemonSpeciesByName } from '@/lib/api'
import { FormTransformationService } from '@/lib/form-transformations'
import { PokemonMovesService, type MoveLearnMethod } from '@/services/pokemonMovesService'

// Utility function to format search terms
const formatSearchTerm = (term: string): string => {
  return term
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/ /g, '-')
}

export default function PokemonDetailPage() {
  const { t } = useLanguage()
  const { getCachedPokemon } = usePokemonCache()
  const params = useParams()
  const pokemonName = params.name as string
  
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [cobblemonData, setCobblemonData] = useState<CobblemonPokemon | null>(null)
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null)
  const [loading, setLoading] = useState(true)
  const [forms, setForms] = useState<PokemonForm[]>([])
  const [formsData, setFormsData] = useState<Record<string, PokemonFormData>>({})
  const [loadingForms, setLoadingForms] = useState(false)
  const [selectedForm, setSelectedForm] = useState<PokemonForm | null>(null)
  const [showFormDetails, setShowFormDetails] = useState(false)
  const [pokemonSpecies, setPokemonSpecies] = useState<any>(null)
  const [loadingSpecies, setLoadingSpecies] = useState(false)
  const [varieties, setVarieties] = useState<PokemonVariety[]>([])
  const [loadingVarieties, setLoadingVarieties] = useState(false)
  const [showAllVarieties, setShowAllVarieties] = useState(false)
  const [selectedVariety, setSelectedVariety] = useState<PokemonVariety | null>(null)
  const [cobbleverseConditions, setCobbleverseConditions] = useState<any[]>([])
  const [pokemonMoves, setPokemonMoves] = useState<{
    levelUp: MoveLearnMethod[]
    tm: MoveLearnMethod[]
    egg: MoveLearnMethod[]
    tutor: MoveLearnMethod[]
    other: MoveLearnMethod[]
  } | null>(null)
  const [loadingMoves, setLoadingMoves] = useState(false)
  const [moveSearchTerm, setMoveSearchTerm] = useState('')
  const [selectedMoveCategory, setSelectedMoveCategory] = useState<string>('all')

  useEffect(() => {
    const loadData = async () => {
      try {
        const cachedData = await getCachedPokemon(pokemonName)
        
        if (cachedData) {
          setPokemon(cachedData.pokemon)
          setCobblemonData(cachedData.cobblemonData)
          setEvolutionChain(cachedData.evolutionChain)
          
          // Load forms data if Pokemon is available
          if (cachedData.pokemon?.id) {
            await loadFormsData(cachedData.pokemon.id)
          }
          
          // Load Pokemon species data for varieties
          await loadPokemonSpecies()
          
          // Load Pokemon moves
          await loadPokemonMoves()
        }
      } catch (error) {
        console.error('Error loading Pokemon data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (pokemonName) {
      loadData()
    }
  }, [pokemonName, getCachedPokemon])
  
  
  // Load Cobbleverse conditions
  const loadCobbleverseConditions = async (pokemonName: string) => {
    try {
      const conditions = await getCobbleverseTransformationConditions(pokemonName)
      setCobbleverseConditions(conditions)
    } catch (error) {
      console.error('Error loading Cobbleverse conditions:', error)
      setCobbleverseConditions([])
    }
  }

  // Load forms data
  const loadFormsData = async (pokemonId: number) => {
    setLoadingForms(true)
    try {
      const pokemonForms = await fetchPokemonForms(pokemonId)
      const allFormsData = await fetchAllFormsData(pokemonId)
      
      setForms(pokemonForms)
      setFormsData(allFormsData)
      
      // Set default form to first non-default form if available
      const defaultForm = pokemonForms.find(form => !form.name.includes('-default')) || pokemonForms[0]
      setSelectedForm(defaultForm)
    } catch (error) {
      console.error('Error loading forms data:', error)
    } finally {
      setLoadingForms(false)
    }
  }

  // Load Pokemon moves
  const loadPokemonMoves = async () => {
    setLoadingMoves(true)
    try {
      const moves = await PokemonMovesService.fetchPokemonMoves(pokemonName)
      const processedMoves = PokemonMovesService.processMovesByMethod(moves)
      setPokemonMoves(processedMoves)
    } catch (error) {
      console.error('Error loading Pokemon moves:', error)
    } finally {
      setLoadingMoves(false)
    }
  }

  // Load Pokemon species data for varieties
  const loadPokemonSpecies = async () => {
    setLoadingSpecies(true)
    setLoadingVarieties(true)
    try {
      const speciesData = await fetchPokemonSpeciesByName(pokemonName)
      setPokemonSpecies(speciesData)
      
      // Load varieties data
      const varietiesData = await fetchPokemonVarietiesWithDetails(pokemonName)
      setVarieties(varietiesData)
      
      // Load Cobbleverse conditions
      await loadCobbleverseConditions(pokemonName)
    } catch (error) {
      console.error('Error loading Pokemon species:', error)
    } finally {
      setLoadingSpecies(false)
      setLoadingVarieties(false)
    }
  }

  // Handle move click to navigate to moves page
  const handleMoveClick = (moveName: string) => {
    const formattedMove = formatSearchTerm(moveName)
    window.open(`/moves?search=${encodeURIComponent(formattedMove)}`, '_blank')
  }

  // Handle ability click to navigate to abilities page
  const handleAbilityClick = (abilityName: string) => {
    const formattedAbility = formatSearchTerm(abilityName)
    window.open(`/abilities?search=${encodeURIComponent(formattedAbility)}`, '_blank')
  }

  // Filter moves based on search term and category
  const filterMoves = (moves: MoveLearnMethod[]) => {
    return moves.filter(move => 
      move.name.toLowerCase().includes(moveSearchTerm.toLowerCase())
    )
  }

  // Get filtered moves by category
  const getFilteredMoves = () => {
    if (!pokemonMoves) return { levelUp: [], tm: [], egg: [], tutor: [], other: [] }
    
    if (selectedMoveCategory === 'all') {
      return {
        levelUp: filterMoves(pokemonMoves.levelUp),
        tm: filterMoves(pokemonMoves.tm),
        egg: filterMoves(pokemonMoves.egg),
        tutor: filterMoves(pokemonMoves.tutor),
        other: filterMoves(pokemonMoves.other)
      }
    }
    
    return {
      levelUp: selectedMoveCategory === 'level-up' ? filterMoves(pokemonMoves.levelUp) : [],
      tm: selectedMoveCategory === 'tm' ? filterMoves(pokemonMoves.tm) : [],
      egg: selectedMoveCategory === 'egg' ? filterMoves(pokemonMoves.egg) : [],
      tutor: selectedMoveCategory === 'tutor' ? filterMoves(pokemonMoves.tutor) : [],
      other: selectedMoveCategory === 'other' ? filterMoves(pokemonMoves.other) : []
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Pokemon details...</p>
        </div>
      </div>
    )
  }

  if (!pokemon) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Pokemon not found.</p>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Back to Pokemon list
        </Link>
      </div>
    )
  }

  const weaknesses = calculateTypeWeaknesses(pokemon.types.map(t => t.type.name))
  const strengths = calculateTypeStrengths(pokemon.types.map(t => t.type.name))

  // Calculate total base stats
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)

  return (
    <main className="max-w-6xl mx-auto space-y-8">
      <Link href="/" className="inline-flex items-center text-blue-500 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('common.back') || 'Back to Pokemon list'}
      </Link>

      <section className="bg-white rounded-lg shadow-sm border p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="w-64 h-64 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <img 
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-56 h-56 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">{formatPokemonName(pokemon.name)}</h1>
            <p className="text-gray-500 mb-4">{formatPokemonId(pokemon.id)}</p>
            <div className="flex justify-center gap-2 mb-4">
              {pokemon.types.map(type => (
                <TypeBadge key={type.type.name} type={type.type.name} />
              ))}
            </div>
            {cobblemonData && (
              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-semibold text-blue-600">{t('pokemon.source')}</span>
                </div>
                <dl className="space-y-1 text-left">
                  <div><strong>{t('pokemon.spawn')}: </strong> {cobblemonData.SPAWN}</div>
                  <div><strong>{t('pokemon.rarity')}: </strong> {cobblemonData.RARITY}</div>
                  {cobblemonData.CONDITION && (
                    <div><strong>{t('pokemon.condition')}: </strong> {translateCondition(cobblemonData.CONDITION)}</div>
                  )}
                </dl>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                {t('pokemon.baseStats')}
              </h2>
              <div className="space-y-3">
                {pokemon.stats.map(stat => {
                  const percentage = (stat.base_stat / 255) * 100
                  return (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">
                          {(() => {
                            const statKey = stat.stat.name.replace('-', '')
                            const translationKey = `pokemon.${statKey === 'specialattack' ? 'spAttack' : statKey === 'specialdefense' ? 'spDefense' : statKey}`
                            const translation = t(translationKey)
                            return translation !== translationKey ? translation : stat.stat.name.toUpperCase()
                          })()}
                        </span>
                        <span>{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                {/* Total Stats */}
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{t('pokemon.totalStats')}</span>
                    <span className="text-blue-600">{totalStats}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${(totalStats / (255 * 6)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                {t('pokemon.typeMatchups') || 'Type Matchups'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-green-600 mb-2">{t('pokemon.strongAgainst') || 'Strong Against'}</h3>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(strengths)
                      .sort(([_, a], [__, b]) => b - a)
                      .map(([type, multiplier]) => (
                        <div key={type} className="flex items-center gap-1">
                          <TypeBadge type={type} className="text-xs" />
                          <span className={`text-xs font-medium ${
                            multiplier >= 2 ? 'text-green-700' : 
                            multiplier > 1 ? 'text-green-600' : 
                            multiplier === 1 ? 'text-gray-500' : 'text-gray-400'
                          }`}>×{multiplier}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-red-600 mb-2">{t('pokemon.weakAgainst') || 'Weak Against'}</h3>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(weaknesses)
                      .sort(([_, a], [__, b]) => b - a)
                      .map(([type, multiplier]) => (
                        <div key={type} className="flex items-center gap-1">
                          <TypeBadge type={type} className="text-xs" />
                          <span className={`text-xs font-medium ${
                            multiplier >= 2 ? 'text-red-700' : 
                            multiplier > 1 ? 'text-red-600' : 
                            multiplier === 1 ? 'text-gray-500' : 'text-gray-400'
                          }`}>×{multiplier}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* Abilities Section */}
      <section className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Star className="w-5 h-5 mr-2" />
          {t('pokemon.abilities') || 'Abilities'}
        </h2>
        
        {pokemon.abilities && pokemon.abilities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pokemon.abilities.map((ability, index) => (
              <AbilityTooltip key={index} ability={ability.ability}>
                <div 
                  onClick={() => handleAbilityClick(ability.ability.name)}
                  className="flex flex-col p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize text-sm">
                      {ability.ability.name.replace('-', ' ')}
                    </span>
                    {ability.is_hidden && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {t('pokemon.hidden') || 'Hidden'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Slot {ability.slot}
                  </div>
                </div>
              </AbilityTooltip>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No ability data available for this Pokemon.</p>
          </div>
        )}
      </section>

      {/* Varieties Section */}
      {varieties.length > 1 && (
        <section className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            {t('pokemon.formTransformation') || 'Form Transformation'}
          </h2>
          
          {loadingVarieties ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading varieties data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stats Section - Left Side */}
              <div className="lg:col-span-2">
                {selectedVariety ? (
                  <div className="space-y-6">
                    {/* Selected Variety Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <img
                            src={selectedVariety.sprites.front_default || pokemon.sprites.front_default}
                            alt={selectedVariety.display_name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{selectedVariety.display_name}</h4>
                          {renderFormTypeBadge(selectedVariety)}
                        </div>
                      </div>
                      
                      {/* Types */}
                      <div className="flex gap-2">
                        {selectedVariety.types.map(type => (
                          <TypeBadge key={type.type.name} type={type.type.name} />
                        ))}
                      </div>
                    </div>

                    {/* Stats Comparison */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm">{t('pokemon.stats') || 'Stats'}</h4>
                      <div className="space-y-2">
                        {selectedVariety.stats.map(stat => {
                          const baseStat = pokemon.stats.find(s => s.stat.name === stat.stat.name)
                          const baseStatValue = baseStat?.base_stat || 0
                          const difference = stat.base_stat - baseStatValue
                          const percentage = (stat.base_stat / 255) * 100
                          
                          return (
                            <div key={stat.stat.name}>
                              <div className="flex justify-between items-center text-xs mb-1">
                                <span className="font-medium">
                                  {(() => {
                                    const statKey = stat.stat.name.replace('-', '')
                                    const translationKey = `pokemon.${statKey === 'specialattack' ? 'spAttack' : statKey === 'specialdefense' ? 'spDefense' : statKey}`
                                    const translation = t(translationKey)
                                    return translation !== translationKey ? translation : stat.stat.name.toUpperCase()
                                  })()}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{stat.base_stat}</span>
                                  {difference !== 0 && (
                                    <span className={`text-xs font-medium ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      ({difference > 0 ? '+' : ''}{difference})
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${difference > 0 ? 'bg-green-500' : difference < 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                        {/* Total Stats for Variety */}
                        <div className="pt-3 mt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span>{t('pokemon.totalStats')}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600">
                                {selectedVariety.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                              </span>
                              {(() => {
                                const baseTotal = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
                                const varietyTotal = selectedVariety.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
                                const difference = varietyTotal - baseTotal
                                return difference !== 0 ? (
                                  <span className={`text-xs font-medium ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ({difference > 0 ? '+' : ''}{difference})
                                  </span>
                                ) : null
                              })()}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${(selectedVariety.stats.reduce((sum, stat) => sum + stat.base_stat, 0) / (255 * 6)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Abilities */}
                    <div>
                      <h4 className="font-medium mb-2 text-sm">{t('pokemon.abilities') || 'Abilities'}</h4>
                      {renderAbilities(selectedVariety.abilities, handleAbilityClick, t)}
                    </div>

                    {/* Type Matchups */}
                    <div>
                      <h4 className="font-medium mb-2 text-sm">{t('pokemon.typeMatchups') || 'Type Matchups'}</h4>
                      {renderTypeMatchups(selectedVariety.types.map(t => t.type.name), t)}
                    </div>

                    {/* Transformation Conditions */}
                    <div>
                      <h4 className="font-medium mb-2 text-sm">{t('pokemon.transformationConditions') || 'Transformation Conditions'}</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        {renderTransformationConditions(
                          FormTransformationService.getFormTransformationConditions(selectedVariety.name),
                          cobbleverseConditions,
                          t
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="font-medium mb-4">{t('pokemon.baseStats') || 'Base Stats'}</h3>
                    {pokemon.stats.map(stat => renderStatBar(stat))}

                    {/* Base Pokemon Transformation Conditions */}
                    {(() => {
                      const formConditions = FormTransformationService.getFormTransformationConditions(pokemon.name)
                      const allConditions = [...formConditions, ...cobbleverseConditions]
                      
                      if (allConditions.length > 0) {
                        return (
                          <div className="mt-6">
                            <h4 className="font-medium mb-2 text-sm">{t('pokemon.transformationConditions') || 'Transformation Conditions'}</h4>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              {renderTransformationConditions(formConditions, cobbleverseConditions, t)}
                            </div>
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                )}
              </div>

              {/* Available Forms - Right Side */}
              <div>
                <h3 className="font-medium mb-4">{t('pokemon.availableForms') || 'Available Forms'} ({varieties.length})</h3>
                <div className="space-y-3">
                  {(showAllVarieties ? varieties : varieties.slice(0, 4)).map((variety) => (
                    <div
                      key={variety.name}
                      onClick={() => setSelectedVariety(variety)}
                      className={`
                        relative border-2 rounded-lg p-3 transition-all cursor-pointer
                        hover:scale-105 hover:shadow-md
                        ${variety.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                        ${selectedVariety?.name === variety.name ? 'ring-2 ring-purple-500 shadow-lg' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <img
                            src={variety.sprites.front_default || pokemon.sprites.front_default}
                            alt={variety.display_name}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate mb-1">
                            {variety.display_name}
                          </p>
                          
                          {/* Form Type Badge */}
                          {renderFormTypeBadge(variety)}
                        </div>
                        
                        {/* Types */}
                        <div className="flex gap-1 flex-shrink-0">
                          {variety.types.map(type => (
                            <TypeBadge key={type.type.name} type={type.type.name} className="text-xs" />
                          ))}
                        </div>
                      </div>
                      
                      {variety.is_default && (
                        <span className="absolute top-0 right-0 text-xs bg-blue-500 text-white px-1 rounded">
                          {t('common.default') || 'Default'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Show More/Less Button */}
                {varieties.length > 4 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setShowAllVarieties(!showAllVarieties)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium w-full"
                    >
                      {showAllVarieties 
                        ? `Show Less (${varieties.length - 4} hidden)` 
                        : `Show More (${varieties.length - 4} more)`
                      }
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}


      {evolutionChain && (
        <section className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Evolution Chain
          </h2>
          <div className="flex justify-center">
            <EvolutionStage 
              evolution={evolutionChain.chain} 
              currentPokemonName={pokemon.name}
            />
          </div>
        </section>
      )}

      {/* Moves Section */}
      <section className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          {t('pokemon.moves') || 'Moves'}
        </h2>
        
        {loadingMoves ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading moves data...</p>
          </div>
        ) : pokemonMoves ? (
          <div>
            {/* Search and Filter Controls */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={t('pokemon.searchMoves') || 'Search moves...'}
                  value={moveSearchTerm}
                  onChange={(e) => setMoveSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMoveCategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMoveCategory === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('pokemon.allMoves') || 'All Moves'}
                </button>
                <button
                  onClick={() => setSelectedMoveCategory('level-up')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMoveCategory === 'level-up'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📈 {t('pokemon.levelUpMoves') || 'Level Up'}
                </button>
                <button
                  onClick={() => setSelectedMoveCategory('tm')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMoveCategory === 'tm'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💿 {t('pokemon.tmMoves') || 'TM'}
                </button>
                <button
                  onClick={() => setSelectedMoveCategory('egg')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMoveCategory === 'egg'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🥚 {t('pokemon.eggMoves') || 'Egg'}
                </button>
                <button
                  onClick={() => setSelectedMoveCategory('tutor')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMoveCategory === 'tutor'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👨‍🏫 {t('pokemon.tutorMoves') || 'Tutor'}
                </button>
                <button
                  onClick={() => setSelectedMoveCategory('other')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMoveCategory === 'other'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⭐ {t('pokemon.otherMoves') || 'Other'}
                </button>
              </div>
            </div>

            {/* Filtered Moves Display */}
            <div className="space-y-8">
              {(() => {
                const filteredMoves = getFilteredMoves()
                const hasAnyMoves = filteredMoves.levelUp.length > 0 || 
                                 filteredMoves.tm.length > 0 || 
                                 filteredMoves.egg.length > 0 || 
                                 filteredMoves.tutor.length > 0 || 
                                 filteredMoves.other.length > 0

                if (!hasAnyMoves) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-gray-600">
                        {moveSearchTerm 
                          ? (t('pokemon.noMovesFound') || 'No moves found matching your search.')
                          : (t('pokemon.noMovesInCategory') || 'No moves in this category.')
                        }
                      </p>
                    </div>
                  )
                }

                return (
                  <>
                    {/* Level Up Moves */}
                    {filteredMoves.levelUp.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <span className="mr-2">📈</span>
                          {t('pokemon.levelUpMoves') || 'Level Up Moves'} ({filteredMoves.levelUp.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {filteredMoves.levelUp.map((move, index) => (
                            <MoveTooltip key={index} move={{ name: move.name }}>
                              <div 
                                onClick={() => handleMoveClick(move.name)}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer"
                              >
                                <span className="font-medium capitalize text-sm">{move.name}</span>
                                <span className="text-sm font-semibold text-blue-600">Lv. {move.level}</span>
                              </div>
                            </MoveTooltip>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TM Moves */}
                    {filteredMoves.tm.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <span className="mr-2">💿</span>
                          {t('pokemon.tmMoves') || 'TM Moves'} ({filteredMoves.tm.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {filteredMoves.tm.map((move, index) => (
                            <MoveTooltip key={index} move={{ name: move.name }}>
                              <div 
                                onClick={() => handleMoveClick(move.name)}
                                className="block p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer"
                              >
                                <span className="font-medium capitalize text-sm">{move.name}</span>
                              </div>
                            </MoveTooltip>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Egg Moves */}
                    {filteredMoves.egg.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <span className="mr-2">🥚</span>
                          {t('pokemon.eggMoves') || 'Egg Moves'} ({filteredMoves.egg.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {filteredMoves.egg.map((move, index) => (
                            <MoveTooltip key={index} move={{ name: move.name }}>
                              <div 
                                onClick={() => handleMoveClick(move.name)}
                                className="block p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer"
                              >
                                <span className="font-medium capitalize text-sm">{move.name}</span>
                              </div>
                            </MoveTooltip>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tutor Moves */}
                    {filteredMoves.tutor.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <span className="mr-2">👨‍🏫</span>
                          {t('pokemon.tutorMoves') || 'Tutor Moves'} ({filteredMoves.tutor.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {filteredMoves.tutor.map((move, index) => (
                            <MoveTooltip key={index} move={{ name: move.name }}>
                              <div 
                                onClick={() => handleMoveClick(move.name)}
                                className="block p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer"
                              >
                                <span className="font-medium capitalize text-sm">{move.name}</span>
                              </div>
                            </MoveTooltip>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Other Moves */}
                    {filteredMoves.other.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <span className="mr-2">⭐</span>
                          {t('pokemon.otherMoves') || 'Other Moves'} ({filteredMoves.other.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {filteredMoves.other.map((move, index) => (
                            <MoveTooltip key={index} move={{ name: move.name }}>
                              <div 
                                onClick={() => handleMoveClick(move.name)}
                                className="block p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer"
                              >
                                <span className="font-medium capitalize text-sm">{move.name}</span>
                              </div>
                            </MoveTooltip>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Failed to load moves data.</p>
          </div>
        )}
      </section>

      </main>
  )
}

