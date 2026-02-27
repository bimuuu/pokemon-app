'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pokemon, MoveRecommendation, ItemRecommendation, EVSpread, MovesetAnalysis, ItemOptimizationAnalysis, EVAnalysis, NatureAnalysis, AbilityAnalysis } from '@/types/pokemon'
import { formatPokemonName } from '@/lib/utils'
import { MovesetRecommendationService } from '@/features/training/services/MovesetRecommendationService'
import { HeldItemOptimizationService } from '@/features/training/services/HeldItemOptimizationService'
import { EVCalculationService } from '@/features/training/services/EVCalculationService'
import { NatureOptimizationService } from '@/features/training/services/NatureOptimizationService'
import { AbilityOptimizationService } from '@/features/training/services/AbilityOptimizationService'
import { PokemonOverview } from './PokemonOverview'
import { SectionNavigation } from './SectionNavigation'
import { BuildStatistics } from './BuildStatistics'
import { MovesSection } from './MovesSection'
import { ItemSection } from './ItemSection'
import { EVSection } from './EVSection'
import { NatureSection } from './NatureSection'
import { AbilitySection } from './AbilitySection'
import { ActionButtons } from './ActionButtons'
import { 
  getTotalEVs,
  getRemainingEVs,
  isValidSpread
} from './utils'
import { 
  TrendingUp,
  ChevronDown,
  Loader2,
  Star
} from 'lucide-react'

interface TrainingSummaryProps {
  pokemon: Pokemon
  onOptimize?: () => void
  onExport?: () => void
  onShare?: () => void
  isBuildPage?: boolean
}

export function TrainingSummary({ 
  pokemon, 
  onOptimize,
  onExport,
  onShare,
  isBuildPage = false
}: TrainingSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState<'moves' | 'item' | 'evs' | 'nature' | 'ability'>('moves')
  
  // Moveset state
  const [movesetAnalysis, setMovesetAnalysis] = useState<MovesetAnalysis | null>(null)
  const [selectedMoves, setSelectedMoves] = useState<MoveRecommendation[]>([])
  const [isGeneratingMoveset, setIsGeneratingMoveset] = useState(false)
  
  // Item state
  const [itemAnalysis, setItemAnalysis] = useState<ItemOptimizationAnalysis | null>(null)
  const [selectedItem, setSelectedItem] = useState<ItemRecommendation | null>(null)
  
  // EV state
  const [evAnalysis, setEvAnalysis] = useState<EVAnalysis | null>(null)
  const [selectedEVSpread, setSelectedEVSpread] = useState<EVSpread | null>(null)
  const [customEVSpread, setCustomEVSpread] = useState<EVSpread>({
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0
  })
  const [evTab, setEvTab] = useState<'recommended' | 'custom'>('recommended')
  
  // Nature state
  const [natureAnalysis, setNatureAnalysis] = useState<NatureAnalysis | null>(null)
  const [selectedNature, setSelectedNature] = useState<string | null>(null)
  
  // Ability state
  const [abilityAnalysis, setAbilityAnalysis] = useState<AbilityAnalysis | null>(null)
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)

  // Calculate total base stats
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  
  // Translation function (placeholder - should be passed from parent)
  const t = (key: string) => key // Simplified for now

  const calculateTotalPower = () => {
    return selectedMoves.reduce((total, move) => total + (move.power || 0), 0)
  }

  const calculateTypeCoverage = () => {
    const coverage = new Set<string>()
    selectedMoves.forEach(move => {
      coverage.add(move.type)
    })
    return coverage.size
  }

  const calculateSTABCount = () => {
    const pokemonTypes = pokemon.types.map(t => t.type.name)
    return selectedMoves.filter(move => 
      pokemonTypes.includes(move.type)
    ).length
  }

  const totalPower = calculateTotalPower()
  const typeCoverage = calculateTypeCoverage()
  const stabCount = calculateSTABCount()
  const isComplete = selectedMoves.length === 4 && !!selectedItem

  useEffect(() => {
    initializeTrainingData()
  }, [pokemon])

  const initializeTrainingData = async () => {
    setIsLoading(true)
    try {
      // Initialize all data in parallel
      const [movesetResult, itemResult, evResult, natureResult, abilityResult] = await Promise.all([
        MovesetRecommendationService.analyzePokemonMoves(pokemon),
        HeldItemOptimizationService.analyzeOptimalItems(pokemon),
        EVCalculationService.analyzeEVOptimization(pokemon),
        NatureOptimizationService.analyzeOptimalNatures(pokemon),
        AbilityOptimizationService.analyzeOptimalAbilities(pokemon)
      ])
      
      setMovesetAnalysis(movesetResult)
      setItemAnalysis(itemResult)
      setEvAnalysis(evResult)
      setNatureAnalysis(natureResult)
      setAbilityAnalysis(abilityResult)
      
      // Auto-select balanced recommendations with buff/debuff support
      const balancedMoveset = MovesetRecommendationService.generateBalancedMoveset(movesetResult)
      setSelectedMoves(balancedMoveset)
      
      const bestItem = HeldItemOptimizationService.getBestItemForRole(itemResult)
      if (bestItem) {
        setSelectedItem(bestItem)
      }
      
      // Auto-select optimal nature and ability
      if (natureResult?.optimalNature) {
        setSelectedNature(natureResult.optimalNature.name)
      }
      
      if (abilityResult?.optimalAbility) {
        setSelectedAbility(abilityResult.optimalAbility.name)
      }
      
      setSelectedEVSpread(evResult.optimalSpread.spread)
    } catch (error) {
      console.error('Failed to initialize training data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyBuild = async () => {
    const buildData = {
      pokemon: pokemon.name,
      moves: selectedMoves.map(m => m.name),
      item: selectedItem?.name,
      evs: selectedEVSpread,
      timestamp: new Date().toISOString()
    }
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildData, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy build:', error)
    }
  }

  // Moveset handlers
  const handleMoveSelect = (move: MoveRecommendation, slotIndex: number) => {
    const newMoves = [...selectedMoves]
    const existingIndex = newMoves.findIndex(m => m.name === move.name)
    
    if (existingIndex !== -1) {
      newMoves[existingIndex] = selectedMoves[slotIndex] || null
    }
    
    newMoves[slotIndex] = move
    setSelectedMoves(newMoves.filter(Boolean))
  }

  const handleMoveRemove = (slotIndex: number) => {
    const newMoves = [...selectedMoves]
    newMoves[slotIndex] = null as any
    setSelectedMoves(newMoves.filter(Boolean))
  }

  const handleGenerateMoveset = async () => {
    if (!movesetAnalysis) return
    
    setIsGeneratingMoveset(true)
    try {
      const balancedMoveset = MovesetRecommendationService.generateBalancedMoveset(movesetAnalysis)
      setSelectedMoves(balancedMoveset)
    } catch (error) {
      console.error('Failed to generate moveset:', error)
    } finally {
      setIsGeneratingMoveset(false)
    }
  }

  const calculateMovesetDiversity = () => {
    if (selectedMoves.length === 0) return { score: 0, categories: [] }
    
    const categories = selectedMoves.map(m => m.category)
    const uniqueCategories = [...new Set(categories)]
    const categoryCount = uniqueCategories.length
    
    // Higher score for having different move types
    let diversityScore = categoryCount * 0.3
    
    // Bonus for having setup moves
    if (categories.includes('buff')) diversityScore += 0.3
    
    // Bonus for having utility moves
    if (categories.includes('debuff') || categories.includes('support')) diversityScore += 0.2
    
    // Bonus for having recovery
    if (categories.includes('recovery')) diversityScore += 0.2
    
    return {
      score: Math.min(diversityScore, 1.0),
      categories: uniqueCategories
    }
  }

  // Item handlers
  const handleItemSelect = (item: ItemRecommendation) => {
    setSelectedItem(item)
  }

  // EV handlers
  const handleEVSpreadSelect = (spread: EVSpread) => {
    setSelectedEVSpread(spread)
  }

  const handleCustomEVChange = (stat: keyof EVSpread, value: number) => {
    const newSpread = { ...customEVSpread }
    newSpread[stat] = Math.max(0, Math.min(252, value))
    setCustomEVSpread(newSpread)
    setSelectedEVSpread(newSpread)
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-6 w-6" />
            </motion.div>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading training data...
            </motion.span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <TrendingUp className="h-5 w-5" />
              </motion.div>
              Training Summary
            </CardTitle>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: 'hidden' }}
            >
              <CardContent className="pt-0">
        <div className="space-y-6">
          {/* Pokemon Overview */}
          <PokemonOverview
            pokemon={pokemon}
            movesetAnalysis={movesetAnalysis}
            selectedMoves={selectedMoves}
            selectedItem={selectedItem}
            selectedEVSpread={selectedEVSpread}
            selectedNature={selectedNature}
            totalStats={totalStats}
            isBuildPage={isBuildPage}
            t={t}
          />

          {/* Section Navigation */}
          <SectionNavigation
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            selectedMoves={selectedMoves}
            selectedItem={selectedItem}
            selectedEVSpread={selectedEVSpread}
            selectedNature={selectedNature}
            selectedAbility={selectedAbility}
          />

          {/* Build Statistics */}
          <BuildStatistics
            totalPower={totalPower}
            typeCoverage={typeCoverage}
            stabCount={stabCount}
            selectedItem={selectedItem}
            selectedMoves={selectedMoves}
            selectedEVSpread={selectedEVSpread}
          />

          {/* Selected Moves Summary */}
          <AnimatePresence mode="wait">
            {activeSection === 'moves' && (
              <MovesSection
                selectedMoves={selectedMoves}
                movesetAnalysis={movesetAnalysis}
                isGeneratingMoveset={isGeneratingMoveset}
                onMoveSelect={handleMoveSelect}
                onMoveRemove={handleMoveRemove}
                onGenerateMoveset={handleGenerateMoveset}
              />
            )}
          </AnimatePresence>

          {/* Item Selection */}
          <AnimatePresence mode="wait">
            {activeSection === 'item' && (
              <ItemSection
                selectedItem={selectedItem}
                itemAnalysis={itemAnalysis}
                onItemSelect={handleItemSelect}
              />
            )}
          </AnimatePresence>

          {/* EV Selection */}
          <AnimatePresence mode="wait">
            {activeSection === 'evs' && (
              <EVSection
                evTab={evTab}
                setEvTab={setEvTab}
                evAnalysis={evAnalysis}
                selectedEVSpread={selectedEVSpread}
                customEVSpread={customEVSpread}
                onEVSpreadSelect={handleEVSpreadSelect}
                onCustomEVChange={handleCustomEVChange}
              />
            )}
          </AnimatePresence>

          {/* Nature Selection */}
          <AnimatePresence mode="wait">
            {activeSection === 'nature' && (
              <NatureSection
                selectedNature={selectedNature}
                natureAnalysis={natureAnalysis}
                onNatureSelect={setSelectedNature}
              />
            )}
          </AnimatePresence>

          {/* Ability Selection */}
          <AnimatePresence mode="wait">
            {activeSection === 'ability' && (
              <AbilitySection
                selectedAbility={selectedAbility}
                abilityAnalysis={abilityAnalysis}
                onAbilitySelect={setSelectedAbility}
              />
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <ActionButtons
            copied={copied}
            isComplete={isComplete}
            onCopyBuild={handleCopyBuild}
            onExport={onExport || (() => {})}
            onShare={onShare || (() => {})}
            onOptimize={onOptimize || (() => {})}
          />
        </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
