'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Pokemon, CobblemonPokemon, EvolutionChain, PokemonForm, PokemonFormData, FormTransformationCondition, PokemonVariety } from '@/types/pokemon'
import { formatPokemonName, calculateTypeWeaknesses, calculateTypeStrengths } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePokemonCache } from '@/contexts/PokemonCacheContext'
import { fetchPokemonForms, fetchAllFormsData, getFormTransformationConditions, getFormDisplayName, getGmaxMoveName, fetchPokemonVarietiesWithDetails, getCobbleverseTransformationConditions } from '@/lib/pokemon-api'
import { fetchPokemonSpeciesByName } from '@/lib/api'
import { PokemonMovesService, type MoveLearnMethod } from '@/services/pokemonMovesService'
import { 
  PokemonHeader, 
  AbilitiesSection, 
  VarietiesSection, 
  EvolutionSection, 
  MovesSection 
} from '@/components/pokemon/detail'
import { containerVariants, getAnimationProps } from '@/components/pokemon/animations'


export default function PokemonDetailPage() {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
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

  // Utility function to format search terms
  const formatSearchTerm = (term: string): string => {
    return term
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/ /g, '-')
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

  const getAnimationProps = (variants: any, customDelay = 0) => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2, delay: customDelay * 0.1 },
      }
    }
    return {
      variants,
      initial: 'hidden',
      animate: 'visible',
      transition: { delay: customDelay },
    }
  }

  if (loading) {
    return (
      <motion.div 
        className="flex justify-center items-center min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <motion.div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-600">Loading Pokemon details...</p>
        </div>
      </motion.div>
    )
  }

  if (!pokemon) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-gray-500">Pokemon not found.</p>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Back to Pokemon list
        </Link>
      </motion.div>
    )
  }

  const weaknesses = calculateTypeWeaknesses(pokemon.types.map(t => t.type.name))
  const strengths = calculateTypeStrengths(pokemon.types.map(t => t.type.name))

  // Calculate total base stats
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)

  return (
    <motion.main 
      className="max-w-6xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PokemonHeader 
        pokemon={pokemon} 
        cobblemonData={cobblemonData} 
        totalStats={totalStats}
        t={t} 
      />

      <AbilitiesSection 
        pokemon={pokemon} 
        onAbilityClick={handleAbilityClick} 
        t={t} 
      />

      <VarietiesSection 
        pokemon={pokemon}
        varieties={varieties}
        selectedVariety={selectedVariety}
        showAllVarieties={showAllVarieties}
        loadingVarieties={loadingVarieties}
        cobbleverseConditions={cobbleverseConditions}
        onVarietySelect={setSelectedVariety}
        onToggleShowAll={() => setShowAllVarieties(!showAllVarieties)}
        onAbilityClick={handleAbilityClick}
        t={t}
      />

      <EvolutionSection 
        evolutionChain={evolutionChain} 
        pokemon={pokemon}
        t={t} 
      />

      <MovesSection 
        pokemonName={pokemonName}
        pokemonMoves={pokemonMoves}
        loadingMoves={loadingMoves}
        onMoveClick={handleMoveClick}
        t={t}
      />
    </motion.main>
  )
}

