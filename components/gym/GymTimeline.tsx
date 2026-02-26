'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, CheckCircle, ArrowRight } from 'lucide-react'
import { fetchTrainersByType } from '@/lib/api'
import { REGIONS } from '@/lib/constants'

interface TimelineItem {
  id: string
  originalId: string // Original ID for navigation
  name: string
  type: 'Gym Leader' | 'Elite Four' | 'Champion'
  location: string
  badge: string
  avgLevel: number
  completed: boolean
  current: boolean
}

interface GymTimelineProps {
  currentTrainerId: string
  region: string
  className?: string
  showNextRegion?: boolean // New prop to show next region dot
}

export function GymTimeline({ currentTrainerId, region, className = '', showNextRegion = false }: GymTimelineProps) {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if we should show next region button (not last region)
  const shouldShowNextRegionButton = showNextRegion && (() => {
    const regionEntries = Object.entries(REGIONS)
    const currentIndex = regionEntries.findIndex(([key]) => key === region)
    return currentIndex < regionEntries.length - 1
  })()

  useEffect(() => {
    loadTimelineData()
  }, [region, currentTrainerId])

  const loadTimelineData = async () => {
    setLoading(true)
    try {
      // Load all trainer types from consolidated files
      const [gymLeadersData, eliteFourData, championsData] = await Promise.all([
        fetchTrainersByType('gym_leaders'),
        fetchTrainersByType('elite_four'),
        fetchTrainersByType('champions')
      ])

      const allItems: TimelineItem[] = []
      
      // Process gym leaders
      Object.entries(gymLeadersData).forEach(([key, trainer]: [string, any]) => {
        if (trainer.region === region && trainer.data && trainer.data.team && trainer.location) {
          const avgLevel = trainer.data.team.reduce((sum: number, p: any) => sum + p.level, 0) / trainer.data.team.length
          allItems.push({
            id: `${region}_${key}`, // Region-prefixed ID for uniqueness
            originalId: key, // Original ID for navigation
            name: typeof trainer.data.name === 'string' ? trainer.data.name : (trainer.data.name?.literal || trainer.data.name?.toString() || 'Unknown'),
            type: 'Gym Leader',
            location: trainer.location.gym_location || trainer.location.type,
            badge: trainer.location.badge,
            avgLevel: Math.round(avgLevel),
            completed: false,
            current: `${region}_${key}` === currentTrainerId
          })
        }
      })

      // Process elite four
      Object.entries(eliteFourData).forEach(([key, trainer]: [string, any]) => {
        if (trainer.region === region && trainer.data && trainer.data.team) {
          const avgLevel = trainer.data.team.reduce((sum: number, p: any) => sum + p.level, 0) / trainer.data.team.length
          allItems.push({
            id: `${region}_${key}`, // Region-prefixed ID for uniqueness
            originalId: key, // Original ID for navigation
            name: typeof trainer.data.name === 'string' ? trainer.data.name : (trainer.data.name?.literal || trainer.data.name?.toString() || 'Unknown'),
            type: 'Elite Four',
            location: `${region.charAt(0).toUpperCase() + region.slice(1)} Elite Four Tower`,
            badge: 'Elite Four Medal',
            avgLevel: Math.round(avgLevel),
            completed: false,
            current: `${region}_${key}` === currentTrainerId
          })
        }
      })

      // Process champion
      Object.entries(championsData).forEach(([key, trainer]: [string, any]) => {
        if (trainer.region === region && trainer.data && trainer.data.team) {
          const avgLevel = trainer.data.team.reduce((sum: number, p: any) => sum + p.level, 0) / trainer.data.team.length
          allItems.push({
            id: `${region}_${key}`, // Region-prefixed ID for uniqueness
            originalId: key, // Original ID for navigation
            name: typeof trainer.data.name === 'string' ? trainer.data.name : (trainer.data.name?.literal || trainer.data.name?.toString() || 'Unknown'),
            type: 'Champion',
            location: `${region.charAt(0).toUpperCase() + region.slice(1)} Championship Hall`,
            badge: 'Champion Trophy',
            avgLevel: Math.round(avgLevel),
            completed: false,
            current: `${region}_${key}` === currentTrainerId
          })
        }
      })

      // Sort by average level (progression order)
      allItems.sort((a, b) => a.avgLevel - b.avgLevel)

      // Mark completed items (those before current) - check localStorage for progression
      const progressionKey = `gym-progression-${region}`
      const savedProgression = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem(progressionKey) || '[]')
        : []
      
      const currentIndex = allItems.findIndex(item => item.current)
      
      // Apply saved progression if available, but ensure current item matches currentTrainerId
      if (savedProgression.length > 0) {
        allItems.forEach(item => {
          const savedItem = savedProgression.find((saved: any) => saved.gymId === item.id)
          if (savedItem) {
            item.completed = savedItem.completed
            // Only use saved current state if it matches the current trainer
            item.current = savedItem.current && item.id === currentTrainerId
          }
        })
      }
      
      // Always ensure the current trainer is marked as current, overriding saved progression
      console.log('=== Current Trainer Debug ===')
      console.log('currentTrainerId:', currentTrainerId)
      console.log('allItems:', allItems.map(item => ({ id: item.id, name: item.name, type: item.type })))
      
      // Find current trainer by checking both region-prefixed ID and original ID
      const currentTrainerIndex = allItems.findIndex(item => 
        item.id === currentTrainerId || item.originalId === currentTrainerId
      )
      console.log('currentTrainerIndex:', currentTrainerIndex)
      
      if (currentTrainerIndex !== -1) {
        console.log('Setting current trainer:', allItems[currentTrainerIndex].name)
        allItems[currentTrainerIndex].current = true
        
        // Mark all items before current as completed
        for (let i = 0; i < currentTrainerIndex; i++) {
          allItems[i].completed = true
        }
        
        // Mark all items after current as not completed
        for (let i = currentTrainerIndex + 1; i < allItems.length; i++) {
          allItems[i].completed = false
        }
      }
      
      // Save updated progression state
      const updatedProgression = allItems.map(item => ({
        gymId: item.id,
        completed: item.completed,
        current: item.current
      }))
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(progressionKey, JSON.stringify(updatedProgression))
      }

      setTimelineItems(allItems)
    } catch (error) {
      console.error('Error loading timeline data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTimelineClick = (trainerId: string, originalId: string) => {
    console.log('Timeline clicked:', trainerId, originalId)
    
    // Update progression - mark all previous gyms as completed and current gym as current
    const progressionKey = `gym-progression-${region}`
    const savedProgression = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem(progressionKey) || '[]')
      : []
    
    const clickedIndex = timelineItems.findIndex(item => item.id === trainerId)
    
    if (clickedIndex !== -1) {
      // Create new progression state
      const newProgression = timelineItems.map((item, index) => ({
        gymId: item.id,
        completed: index < clickedIndex,
        current: index === clickedIndex
      }))
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(progressionKey, JSON.stringify(newProgression))
      }
      
      // Update current timeline items
      setTimelineItems(prevItems => 
        prevItems.map((item, index) => ({
          ...item,
          completed: index < clickedIndex,
          current: index === clickedIndex
        }))
      )
    }
    
    // Navigate to the specific trainer using region-prefixed ID, properly encoded
    const encodedId = trainerId.replace(/\./g, '%2E')
    const navigationUrl = `/gyms/${encodedId}`
    console.log('Timeline navigating to:', navigationUrl)
    window.open(navigationUrl, '_self')
  }

  const handleNextRegion = async () => {
    try {
      console.log('=== handleNextRegion called ===')
      console.log('Current region:', region)
      
      // Get next region
      const regionEntries = Object.entries(REGIONS)
      const currentIndex = regionEntries.findIndex(([key]) => key === region)
      
      console.log('Region entries:', regionEntries)
      console.log('Current index:', currentIndex, 'Total regions:', regionEntries.length)
      
      if (currentIndex < regionEntries.length - 1) {
        const nextRegion = regionEntries[currentIndex + 1][0]
        console.log('Next region:', nextRegion)
        
        // Fetch all trainers of next region to find the first gym
        const [nextGymLeadersData, nextEliteFourData, nextChampionsData] = await Promise.all([
          fetchTrainersByType('gym_leaders'),
          fetchTrainersByType('elite_four'),
          fetchTrainersByType('champions')
        ])
        
        // Combine all trainer types for next region
        const allNextRegionTrainers = []
        
        // Add gym leaders
        const nextRegionGyms = Object.entries(nextGymLeadersData).filter(
          ([key, trainer]: [string, any]) => trainer.region === nextRegion && trainer.data && trainer.data.team && trainer.location
        )
        
        // Add elite four
        const nextRegionEliteFour = Object.entries(nextEliteFourData).filter(
          ([key, trainer]: [string, any]) => trainer.region === nextRegion && trainer.data && trainer.data.team
        )
        
        // Add champions
        const nextRegionChampions = Object.entries(nextChampionsData).filter(
          ([key, trainer]: [string, any]) => trainer.region === nextRegion && trainer.data && trainer.data.team
        )
        
        console.log('Next region filtering results:')
        console.log('- Gyms found:', nextRegionGyms.length, nextRegionGyms.map(([key]) => key))
        console.log('- Elite Four found:', nextRegionEliteFour.length, nextRegionEliteFour.map(([key]) => key))
        console.log('- Champions found:', nextRegionChampions.length, nextRegionChampions.map(([key]) => key))
        
        // Process and sort all trainers by average level
        const processTrainer = ([key, trainer]: [string, any], type: string) => {
          const avgLevel = trainer.data.team.reduce((sum: number, p: any) => sum + p.level, 0) / trainer.data.team.length
          return { 
            key, 
            trainer, 
            avgLevel,
            type
          }
        }
        
        const allTrainersWithLevel = [
          ...nextRegionGyms.map(([key, trainer]) => processTrainer([key, trainer], 'Gym Leader')),
          ...nextRegionEliteFour.map(([key, trainer]) => processTrainer([key, trainer], 'Elite Four')),
          ...nextRegionChampions.map(([key, trainer]) => processTrainer([key, trainer], 'Champion'))
        ].sort((a, b) => a.avgLevel - b.avgLevel)

        console.log('All next region trainers found:', allTrainersWithLevel.length)
        console.log('Next region trainers details:', allTrainersWithLevel.map(t => ({ name: t.trainer.data.name.literal || t.trainer.data.name, key: t.key, type: t.type, avgLevel: t.avgLevel })))

        if (allTrainersWithLevel.length > 0) {
          const firstTrainer = allTrainersWithLevel[0]
          const firstTrainerId = firstTrainer.key
          console.log('First trainer found:', firstTrainerId, 'Type:', firstTrainer.type, 'Level:', firstTrainer.avgLevel)
          console.log('First trainer name:', firstTrainer.trainer.data.name.literal || firstTrainer.trainer.data.name)
          
          // Store progression in localStorage - mark current region as completed
          const currentProgressionKey = `gym-progression-${region}`
          const currentTimelineItems = timelineItems.map(item => ({
            gymId: item.id,
            completed: true,
            current: false
          }))
          localStorage.setItem(currentProgressionKey, JSON.stringify(currentTimelineItems))
          
          // Initialize next region progression (all locked)
          const nextProgressionKey = `gym-progression-${nextRegion}`
          const nextRegionTrainers = allTrainersWithLevel.map((trainer: any, index: number) => ({
            gymId: `${nextRegion}_${trainer.key}`,
            completed: false,
            current: index === 0 // First trainer is current
          }))
          localStorage.setItem(nextProgressionKey, JSON.stringify(nextRegionTrainers))
          
          // Navigate to the first trainer of next region with region prefix
          const regionPrefixedId = `${nextRegion}_${firstTrainerId}`
          const encodedId = regionPrefixedId.replace(/\./g, '%2E')
          const navigationUrl = `/gyms/${encodedId}`
          console.log('About to navigate to first trainer:', navigationUrl)
          console.log('Trainer ID before encoding:', firstTrainerId)
          console.log('Trainer ID after encoding:', encodedId)
          
          window.location.href = navigationUrl
        } else {
          console.log('No gyms found for next region:', nextRegion)
          // Fallback to region selection if no gyms found
          router.push(`/gyms?region=${nextRegion}`)
        }
      } else {
        console.log('Already at last region, no next region available')
      }
    } catch (error) {
      console.error('Error navigating to next region:', error)
    }
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (timelineItems.length === 0) {
    return null
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
        {region.charAt(0).toUpperCase() + region.slice(1)} Progress
      </h2>
      
      {/* Horizontal Stepper */}
      <div className="relative">
        {/* Stepper items with connecting lines */}
        <div className="relative flex items-start">
          {timelineItems.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center flex-1 relative">
              {/* Connecting line to next item (only if not last) */}
              {index < timelineItems.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-300 z-0"></div>
              )}
              
              {/* Progress line to current item */}
              {index < timelineItems.filter(item => item.completed).length && (
                <div className="absolute top-6 left-1/2 h-0.5 bg-green-500 z-10 transition-all duration-300" style={{ 
                  width: index < timelineItems.filter(item => item.completed).length ? '100%' : '0%'
                }}></div>
              )}
              
              {/* Step circle */}
              <button
                onClick={() => handleTimelineClick(item.id, item.originalId)}
                className={`relative z-20 w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center mb-2 transform hover:scale-110 hover:shadow-lg ${
                  item.current 
                    ? 'bg-blue-500 border-blue-500 hover:bg-blue-600 hover:shadow-blue-200' 
                    : item.completed 
                    ? 'bg-green-500 border-green-500 hover:bg-green-600 hover:shadow-green-200'
                    : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:shadow-gray-200'
                }`}
              >
                {item.completed ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : item.current ? (
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                )}
              </button>
              
              {/* Gym info */}
              <div className="text-center max-w-20 group cursor-pointer" onClick={() => handleTimelineClick(item.id, item.originalId)}>
                <div className={`text-xs font-medium mb-1 transition-all duration-200 group-hover:scale-105 ${
                  item.current ? 'text-blue-700 group-hover:text-blue-800' : 
                  item.completed ? 'text-green-700 group-hover:text-green-800' : 
                  'text-gray-600 group-hover:text-gray-800'
                }`}>
                  {item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name}
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-full transition-all duration-200 group-hover:scale-105 group-hover:shadow-md ${
                  item.type === 'Gym Leader' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' :
                  item.type === 'Elite Four' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' :
                  'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}>
                  {item.type === 'Gym Leader' ? 'Gym' : 
                   item.type === 'Elite Four' ? 'E4' : 
                   'Champ'}
                </span>
              </div>
            </div>
          ))}
          
          {/* Arrow for next region */}
          {shouldShowNextRegionButton && timelineItems.length > 0 && timelineItems[timelineItems.length - 1].completed && (
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Next Region arrow clicked!')
                  handleNextRegion()
                }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
                title="Go to first gym of next region"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="text-xs text-gray-500 mt-1">Next</div>
            </div>
          )}
        </div>
      </div>

      {/* Next Region Button */}
      {shouldShowNextRegionButton && (
        <div className="flex justify-center mt-6">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Next Region button clicked!')
              handleNextRegion()
            }}
            className="group flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            title="Go to first gym of next region"
          >
            <span className="text-sm font-medium">Next Region</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      )}

      {/* Compact progress summary */}
      <div className="mt-6 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium">
            {timelineItems.filter(item => item.completed).length} / {timelineItems.length} completed
          </span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center group cursor-pointer transition-transform duration-200 hover:scale-105">
              <CheckCircle className="w-3 h-3 text-green-500 mr-1 transition-colors duration-200 group-hover:text-green-600" />
              <span className="transition-colors duration-200 group-hover:text-gray-800">Done</span>
            </div>
            <div className="flex items-center group cursor-pointer transition-transform duration-200 hover:scale-105">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1 transition-all duration-200 group-hover:bg-blue-600 group-hover:shadow-md"></div>
              <span className="transition-colors duration-200 group-hover:text-gray-800">Current</span>
            </div>
            <div className="flex items-center group cursor-pointer transition-transform duration-200 hover:scale-105">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-1 transition-all duration-200 group-hover:bg-gray-400 group-hover:shadow-md"></div>
              <span className="transition-colors duration-200 group-hover:text-gray-800">Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
