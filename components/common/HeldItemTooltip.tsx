"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Badge } from "@/components/ui/badge"
import { AnimatedTooltip } from "@/components/ui/AnimatedTooltip"
import { Package } from "lucide-react"
import { ItemService } from "@/services/itemService"

interface HeldItemTooltipProps {
  itemName: string
  children: React.ReactNode
}

export function HeldItemTooltip({ itemName, children }: HeldItemTooltipProps) {
  const [itemData, setItemData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    async function fetchItemData() {
      if (itemName && !itemData && !hasError) {
        setIsLoading(true)
        try {
          const data = await ItemService.fetchItemDetails(itemName)
          setItemData(data)
          setHasError(false)
        } catch (error) {
          console.warn(`Could not fetch item data for: ${itemName}`)
          setHasError(true)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchItemData()
  }, [itemName, itemData, hasError])
  
  const getDescription = () => {
    if (hasError) return 'Item information not available.'
    if (isLoading) return 'Loading...'
    
    if (itemData) {
      // Try to get short effect first, then fallback to flavor text
      const shortEffect = itemData.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect
      const flavorText = itemData.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text
      
      return shortEffect || flavorText || 'No description available.'
    }
    
    return 'No description available.'
  }

  const getCategory = () => {
    if (hasError) return 'UNKNOWN'
    if (itemData?.category?.name) {
      return itemData.category.name.replace('-', ' ').toUpperCase()
    }
    return 'UNKNOWN'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }

  const tooltipContent = (
    <div className="max-w-xs p-4 rounded-md border bg-popover text-sm text-popover-foreground shadow-md">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Package className={`h-4 w-4 ${hasError ? 'text-gray-400' : 'text-orange-500'}`} />
          <h4 className="font-semibold capitalize text-sm">
            {itemName?.replace(/_/g, ' ').replace(/-/g, ' ') || 'Unknown Item'}
          </h4>
          <Badge variant="secondary" className="text-xs">
            {getCategory()}
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
