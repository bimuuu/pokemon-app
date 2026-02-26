"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { Badge } from "@/components/ui/badge"
import { AnimatedTooltip } from "@/components/ui/AnimatedTooltip"
import { TrendingUp, TrendingDown } from "lucide-react"

interface NatureTooltipProps {
  nature: string
  children: React.ReactNode
}

// Nature stat modifications (increased stat, decreased stat)
const NATURE_STATS: Record<string, { increased: string; decreased: string; increasedValue: number; decreasedValue: number }> = {
  'hardy': { increased: 'attack', decreased: 'attack', increasedValue: 10, decreasedValue: -10 },
  'lonely': { increased: 'attack', decreased: 'defense', increasedValue: 10, decreasedValue: -10 },
  'brave': { increased: 'attack', decreased: 'speed', increasedValue: 10, decreasedValue: -10 },
  'adamant': { increased: 'attack', decreased: 'special-attack', increasedValue: 10, decreasedValue: -10 },
  'naughty': { increased: 'attack', decreased: 'special-defense', increasedValue: 10, decreasedValue: -10 },
  'bold': { increased: 'defense', decreased: 'attack', increasedValue: 10, decreasedValue: -10 },
  'docile': { increased: 'defense', decreased: 'defense', increasedValue: 10, decreasedValue: -10 },
  'relaxed': { increased: 'defense', decreased: 'speed', increasedValue: 10, decreasedValue: -10 },
  'impish': { increased: 'defense', decreased: 'special-attack', increasedValue: 10, decreasedValue: -10 },
  'lax': { increased: 'defense', decreased: 'special-defense', increasedValue: 10, decreasedValue: -10 },
  'timid': { increased: 'speed', decreased: 'attack', increasedValue: 10, decreasedValue: -10 },
  'hasty': { increased: 'speed', decreased: 'defense', increasedValue: 10, decreasedValue: -10 },
  'serious': { increased: 'speed', decreased: 'speed', increasedValue: 10, decreasedValue: -10 },
  'jolly': { increased: 'speed', decreased: 'special-attack', increasedValue: 10, decreasedValue: -10 },
  'naive': { increased: 'speed', decreased: 'special-defense', increasedValue: 10, decreasedValue: -10 },
  'modest': { increased: 'special-attack', decreased: 'attack', increasedValue: 10, decreasedValue: -10 },
  'mild': { increased: 'special-attack', decreased: 'defense', increasedValue: 10, decreasedValue: -10 },
  'quiet': { increased: 'special-attack', decreased: 'speed', increasedValue: 10, decreasedValue: -10 },
  'bashful': { increased: 'speed', decreased: 'speed', increasedValue: 10, decreasedValue: -10 },
  'rash': { increased: 'special-attack', decreased: 'special-defense', increasedValue: 10, decreasedValue: -10 },
  'calm': { increased: 'special-defense', decreased: 'attack', increasedValue: 10, decreasedValue: -10 },
  'gentle': { increased: 'special-defense', decreased: 'defense', increasedValue: 10, decreasedValue: -10 },
  'sassy': { increased: 'special-defense', decreased: 'speed', increasedValue: 10, decreasedValue: -10 },
  'careful': { increased: 'special-defense', decreased: 'special-attack', increasedValue: 10, decreasedValue: -10 },
  'quirky': { increased: 'special-defense', decreased: 'special-defense', increasedValue: 10, decreasedValue: -10 }
}

const STAT_NAMES: Record<string, string> = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  'speed': 'Speed',
  'none': 'None'
}

export function NatureTooltip({ nature, children }: NatureTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const natureData = NATURE_STATS[nature.toLowerCase()] || { increased: 'none', decreased: 'none', increasedValue: 0, decreasedValue: 0 }

  const formatStatChange = (stat: string, value: number) => {
    if (stat === 'none' || value === 0) return null
    
    const statName = STAT_NAMES[stat] || stat
    const color = value > 0 ? 'text-green-600' : 'text-red-600'
    const icon = value > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
    
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="text-xs font-medium">{statName}: {value > 0 ? '+' : ''}{value}%</span>
      </div>
    )
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }

  const tooltipContent = (
    <div className="max-w-xs p-4 rounded-md border bg-popover text-sm text-popover-foreground shadow-md">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold capitalize text-sm">
            {nature.replace('-', ' ')}
          </h4>
          <Badge variant="secondary" className="text-xs">
            NATURE
          </Badge>
        </div>
        
        <div className="space-y-2">
          {formatStatChange(natureData.increased, natureData.increasedValue)}
          {formatStatChange(natureData.decreased, natureData.decreasedValue)}
        </div>
        
        {(natureData.increased === 'none' && natureData.decreased === 'none') && (
          <p className="text-xs text-muted-foreground">
            Neutral nature - no stat changes
          </p>
        )}
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
