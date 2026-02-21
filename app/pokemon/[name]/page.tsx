'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, MapPin, Star, Zap, Shield, Heart, Layers, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { EvolutionStage } from '@/components/pokemon/EvolutionStage'
import { Pokemon, CobblemonPokemon, EvolutionChain, PokemonForm, PokemonFormData, FormTransformationCondition } from '@/types/pokemon'
import { formatPokemonId, formatPokemonName, calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { translateCondition } from '@/lib/i18n'
import { fetchPokemonForms, fetchAllFormsData, getFormTransformationConditions, getFormDisplayName, getGmaxMoveName } from '@/lib/pokemon-api'
import { FormTransformationService } from '@/lib/form-transformations'

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

      {/* Forms Section */}
      {forms.length > 1 && (
        <section className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            {t('pokemon.formTransformation') || 'Form Transformation'}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Forms Gallery */}
            <div>
              <h3 className="font-medium mb-4">{t('pokemon.availableForms') || 'Available Forms'} ({forms.length})</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {forms.map((form, index) => {
                  const formData = formsData[form.name]
                  const isSelected = selectedForm?.name === form.name
                  const displayName = getFormDisplayName(form.name)
                  
                  return (
                    <div
                      key={form.name}
                      className={`
                        relative cursor-pointer border-2 rounded-lg p-2 transition-all
                        hover:scale-105 hover:shadow-md
                        ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}
                      `}
                      onClick={() => setSelectedForm(form)}
                    >
                      <div className="w-16 h-16 mx-auto mb-1 bg-gray-100 rounded flex items-center justify-center">
                        <img
                          src={formData?.sprites?.front_default || pokemon.sprites.front_default}
                          alt={displayName}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <p className="text-xs text-center font-medium truncate">
                        {displayName || 'Default'}
                      </p>
                      {formData?.is_default && (
                        <span className="absolute top-0 right-0 text-xs bg-blue-500 text-white px-1 rounded">
                          {t('common.default') || 'Default'}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Form Details */}
            <div>
              <h3 className="font-medium mb-4">{t('pokemon.formDetails') || 'Form Details'}</h3>
              {selectedForm && (
                <div className="space-y-4">
                  {/* Large Pokemon Sprite Preview */}
                  <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                    <div className="flex flex-col items-center">
                      <div className="w-48 h-48 bg-gray-800 rounded-lg shadow-sm border border-gray-700 flex items-center justify-center mb-4">
                        <img
                          src={formsData[selectedForm.name]?.sprites?.front_default || pokemon.sprites.front_default}
                          alt={getFormDisplayName(selectedForm.name)}
                          className="w-40 h-40 object-contain"
                        />
                      </div>
                      <h4 className="text-lg font-bold text-gray-200 mb-2">
                        {getFormDisplayName(selectedForm.name) || 'Default Form'}
                      </h4>
                      {/* Type Badges in Image */}
                      {formsData[selectedForm.name]?.types && (
                        <div className="flex gap-2 mt-3">
                          {formsData[selectedForm.name].types.map(type => (
                            <TypeBadge key={type.type.name} type={type.type.name} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Stats Comparison */}
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-gray-300">{t('pokemon.formStats') || 'Form Stats Comparison'}</h4>
                    {(() => {
                      const formStats = formsData[selectedForm?.name]?.stats || pokemon.stats
                      
                      if (!formStats || formStats.length === 0) {
                        return (
                          <p className="text-sm text-gray-600">
                            {t('pokemon.noFormStats') || 'No stats data available for this form'}
                          </p>
                        )
                      }
                      
                      return (
                        <div className="space-y-2">
                          {formStats.map(stat => {
                            const formStatValue = stat.base_stat
                            const baseStat = pokemon.stats.find(s => s.stat.name === stat.stat.name)
                            const baseStatValue = baseStat?.base_stat || 0
                            const difference = formStatValue - baseStatValue
                            const percentage = (formStatValue / 255) * 100
                            
                            return (
                              <div key={stat.stat.name}>
                                <div className="flex justify-between items-center text-sm mb-1">
                                  <span className="font-medium">
                                    {(() => {
                                      const statKey = stat.stat.name.replace('-', '')
                                      const translationKey = `pokemon.${statKey === 'specialattack' ? 'spAttack' : statKey === 'specialdefense' ? 'spDefense' : statKey}`
                                      const translation = t(translationKey)
                                      return translation !== translationKey ? translation : stat.stat.name.toUpperCase()
                                    })()}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{formStatValue}</span>
                                    {difference !== 0 && (
                                      <span className={`text-xs font-medium ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ({difference > 0 ? '+' : ''}{difference})
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${difference > 0 ? 'bg-green-500' : difference < 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Form Abilities */}
                  {formsData[selectedForm.name]?.abilities && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">{t('pokemon.abilities') || 'Abilities'}</h4>
                      <div className="space-y-2">
                        {formsData[selectedForm.name].abilities.map(ability => (
                          <div key={ability.ability.name} className="flex items-center justify-between text-sm">
                            <span className="font-medium capitalize">
                              {ability.ability.name.replace('-', ' ')}
                            </span>
                            {ability.is_hidden && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {t('pokemon.hidden') || 'Hidden'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form Type Matchups */}
                  {formsData[selectedForm.name]?.types && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">{t('pokemon.formTypeMatchups') || 'Form Type Matchups'}</h4>
                      {(() => {
                        const formTypes = formsData[selectedForm.name].types.map(t => t.type.name)
                        const formWeaknesses = calculateTypeWeaknesses(formTypes)
                        const formStrengths = calculateTypeStrengths(formTypes)
                        
                        return (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-green-600 mb-2 text-sm">{t('pokemon.strongAgainst') || 'Strong Against'}</h5>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(formStrengths)
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
                              <h5 className="font-medium text-red-600 mb-2 text-sm">{t('pokemon.weakAgainst') || 'Weak Against'}</h5>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(formWeaknesses)
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
                        )
                      })()}
                    </div>
                  )}

                  {/* Transformation Conditions */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">{t('pokemon.transformationConditions') || 'Transformation Conditions'}</h4>
                    <div className="space-y-2">
                      {(() => {
                      const conditions = FormTransformationService.getFormTransformationConditions(selectedForm.name)
                        if (conditions.length === 0) {
                          return <p className="text-sm text-gray-600">No special transformation conditions</p>
                        }
                        return conditions.map((condition, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium capitalize">{condition.type}:</span> {condition.description}
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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

      <section className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-xl font-semibold mb-4">Training Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Recommended Nature</h3>
            <p className="text-gray-600">Based on highest base stat: {pokemon.stats.reduce((prev, current) => 
              prev.base_stat > current.base_stat ? prev : current
            ).stat.name}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">EV Training Focus</h3>
            <p className="text-gray-600">Prioritize HP and highest offensive/defensive stat</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Best Held Items</h3>
            <p className="text-gray-600">Type-enhancing items or choice items based on role</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Leveling Strategy</h3>
            <p className="text-gray-600">Train against Pokemon weak to your types for efficient EXP gain</p>
          </div>
        </div>
      </section>
    </main>
  )
}

