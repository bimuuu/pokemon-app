"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Badge } from "@/components/ui/badge"
import { AnimatedTooltip } from "@/components/ui/AnimatedTooltip"
import { Zap } from "lucide-react"
import type { Ability } from "pokenode-ts"
import { AbilityService } from "@/services/abilityService"

interface AbilityTooltipProps {
  ability: Ability | { name: string; [key: string]: any }
  children: React.ReactNode
}

export function AbilityTooltip({ ability, children }: AbilityTooltipProps) {
  const [fullAbilityData, setFullAbilityData] = useState<Ability | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    async function fetchAbilityData() {
      if (ability?.name && !fullAbilityData) {
        setIsLoading(true)
        try {
          const data = await AbilityService.fetchAbilityDetails(ability.name)
          setFullAbilityData(data)
        } catch (error) {
          console.error('Failed to fetch ability data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchAbilityData()
  }, [ability?.name, fullAbilityData])

  const displayAbility = fullAbilityData || ability
  
  const getDescription = () => {
    if (isLoading) return 'Loading...'
    
    if (displayAbility) {
      // Try to get short effect first, then fallback to flavor text
      const shortEffect = displayAbility.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect
      const flavorText = displayAbility.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text
      
      return shortEffect || flavorText || 'No description available.'
    }
    
    return 'No description available.'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }

  const tooltipContent = (
    <div className="max-w-xs p-4 rounded-md border bg-popover text-sm text-popover-foreground shadow-md">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-purple-500" />
          <h4 className="font-semibold capitalize text-sm">
            {displayAbility?.name?.replace('-', ' ') || 'Unknown Ability'}
          </h4>
          <Badge variant="secondary" className="text-xs">
            ABILITY
          </Badge>
        </div>
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
