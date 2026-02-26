"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Badge } from "@/components/ui/badge"
import { AnimatedTooltip } from "@/components/ui/AnimatedTooltip"
import { Sword, Target, Star } from "lucide-react"
import { getTypeColor } from "@/lib/utils"
import { ColorUtils } from "@/utils/colorUtils"
import type { Move } from "pokenode-ts"
import { MoveService } from "@/services/moveService"

interface MoveTooltipProps {
  move: Move | { name: string; [key: string]: any }
  children: React.ReactNode
}

export function MoveTooltip({ move, children }: MoveTooltipProps) {
  const [fullMoveData, setFullMoveData] = useState<Move | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    async function fetchMoveData() {
      if (move?.name && !fullMoveData) {
        setIsLoading(true)
        try {
          // Format move name for API - replace spaces with hyphens and lowercase
          const formattedName = move.name.toLowerCase().replace(/\s+/g, '-')
          console.log('Fetching move data for:', formattedName)
          const data = await MoveService.fetchMoveDetails(formattedName)
          setFullMoveData(data)
        } catch (error) {
          console.error('Failed to fetch move data:', error)
          // Don't set loading to false on error to allow retry
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchMoveData()
  }, [move?.name, fullMoveData])

  const displayMove = fullMoveData || move
  
  const getDescription = () => {
    if (isLoading) return 'Loading...'
    
    if (displayMove) {
      // Try to get flavor text first, then fallback to short effect
      const flavorText = displayMove.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text
      const shortEffect = displayMove.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect
      
      let description = flavorText || shortEffect || 'No description available.'
      
      // Replace $effect_chance% with actual number if available
      if (displayMove.effect_chance && description.includes('$effect_chance%')) {
        description = description.replace(/\$effect_chance%/g, displayMove.effect_chance.toString())
      }
      
      return description
    }
    
    return 'No description available.'
  }

  const formatMoveName = (name: string) => {
    return name.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }

  const tooltipContent = (
    <div className="max-w-xs p-4 rounded-md border bg-popover text-sm text-popover-foreground shadow-md">
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold capitalize text-sm">
            {isLoading ? 'Loading...' : formatMoveName(displayMove?.name || 'Unknown Move')}
          </h4>
          {displayMove?.type && (
            <Badge 
              className="text-white border-0 text-xs"
              style={{ backgroundColor: getTypeColor(displayMove.type.name) }}
            >
              {displayMove.type.name.toUpperCase()}
            </Badge>
          )}
          <Badge 
            className={`${ColorUtils.getDamageClassColor(displayMove?.damage_class?.name || 'status')} text-white text-xs`}
          >
            {displayMove?.damage_class?.name?.toUpperCase() || 'STATUS'}
          </Badge>
        </div>
        
        {/* Basic Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Sword className="h-3 w-3 text-muted-foreground" />
            <span className={`font-medium ${ColorUtils.getPowerColor(displayMove?.power)}`}>
              {isLoading ? '—' : (displayMove?.power || '—')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3 text-muted-foreground" />
            <span className={`font-medium ${ColorUtils.getAccuracyColor(displayMove?.accuracy || 0)}`}>
              {isLoading ? '—' : (displayMove?.accuracy ? `${displayMove.accuracy}%` : '—')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-blue-600">
              {isLoading ? '—' : (displayMove?.pp || '—')}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {getDescription()}
        </p>
      </div>
    </div>
  )

  return (
    <div 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      {typeof window !== 'undefined' && createPortal(
        <AnimatedTooltip
          isOpen={isOpen}
          position={position}
          preventOverflow={{ width: 320, offset: 10 }}
          className="max-w-xs"
        >
          {tooltipContent}
        </AnimatedTooltip>, 
        document.body
      )}
    </div>
  )
}
