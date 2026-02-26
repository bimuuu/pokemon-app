"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Badge } from "@/components/ui/badge"
import { AnimatedTooltip } from "@/components/ui/AnimatedTooltip"
import { MapPin, Mountain, Trees, Sun, Cloud, Droplets } from "lucide-react"

interface LocationTooltipProps {
  pokemonName: string
  children: React.ReactNode
}

interface CobbleverseData {
  "N.": string
  "POKÉMON": string
  "SOURCE": string
  "SPAWN": string
  "RARITY": string
  "CONDITION": string
  "FORMS": string
}

export function LocationTooltip({ pokemonName, children }: LocationTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [pokemonData, setPokemonData] = useState<CobbleverseData | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchCobbleverseData() {
      if (isOpen && pokemonName) {
        try {
          // Fetch Cobbleverse data
          const response = await fetch('/data/cobbleverseData.json')
          if (response.ok) {
            const cobbleverseData: CobbleverseData[] = await response.json()
            
            // Find Pokemon data (case-insensitive search)
            const pokemonInfo = cobbleverseData.find(p => 
              p["POKÉMON"].toLowerCase() === pokemonName.toLowerCase()
            )
            
            setPokemonData(pokemonInfo || null)
          }
        } catch (error) {
          console.error('Failed to fetch Cobbleverse data:', error)
        }
      }
    }

    fetchCobbleverseData()
  }, [isOpen, pokemonName])

  const getSpawnIcon = (spawnLocation: string) => {
    const location = spawnLocation.toLowerCase()
    if (location.includes('jungle') || location.includes('forest')) return Trees
    if (location.includes('mountain') || location.includes('peak') || location.includes('hill')) return Mountain
    if (location.includes('ocean') || location.includes('beach') || location.includes('water')) return Droplets
    if (location.includes('desert') || location.includes('savanna')) return Sun
    return MapPin
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }

  const tooltipContent = (
    <div className="max-w-sm p-4 rounded-md border bg-popover text-sm text-popover-foreground shadow-md">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-500" />
          <h4 className="font-semibold text-sm">
            {pokemonName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Location
          </h4>
          <Badge variant="secondary" className="text-xs">
            COBBLEVERSE
          </Badge>
        </div>
        
        {pokemonData ? (
          <div className="space-y-2">
            {/* Spawn Location */}
            <div className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
              {(() => {
                const Icon = getSpawnIcon(pokemonData["SPAWN"])
                return <Icon className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
              })()}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-xs">Spawn Location</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {pokemonData["SPAWN"]}
                </div>
              </div>
            </div>

            {/* Condition */}
            {pokemonData["CONDITION"] && (
              <div className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
                <Cloud className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs">Condition</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {pokemonData["CONDITION"]}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground italic">
            {isOpen ? 'Loading location data...' : 'No location data available'}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      {typeof window !== 'undefined' && createPortal(
        <AnimatedTooltip
          isOpen={isOpen}
          position={position}
          preventOverflow={{ width: 350, offset: 10 }}
          className="max-w-sm"
        >
          {tooltipContent}
        </AnimatedTooltip>, 
        document.body
      )}
    </div>
  )
}
