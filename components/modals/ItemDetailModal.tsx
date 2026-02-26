'use client'

import { X, Package, Star, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ColorUtils } from '@/utils/colorUtils'
import type { Item } from 'pokenode-ts'

interface ItemDetailModalProps {
  item: Item | null
  onClose: () => void
}

export function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  if (!item) return null

  const getEffectText = () => {
    const effectEntry = item.effect_entries?.find((entry: any) => entry.language.name === 'en')
    return effectEntry?.effect || effectEntry?.short_effect || 'No effect description available.'
  }

  const getFlavorText = () => {
    const flavorEntry = item.flavor_text_entries?.find((entry: any) => entry.language.name === 'en')
    return flavorEntry?.text || ''
  }

  const getAttributes = () => {
    const attributes = []
    
    if (item.category) {
      attributes.push({
        label: 'Category',
        value: item.category.name.replace('-', ' ').toUpperCase(),
        color: ColorUtils.getCategoryColor(item.category.name)
      })
    }

    // Check for holdable attributes
    const itemAttributes = item.attributes?.map((attr: any) => attr.name) || []
    if (itemAttributes.includes('holdable')) {
      attributes.push({
        label: 'Holdable',
        value: 'Yes',
        color: '#10b981'
      })
    }
    if (itemAttributes.includes('holdable-active')) {
      attributes.push({
        label: 'Holdable Active',
        value: 'Yes',
        color: '#ef4444'
      })
    }

    if (item.fling_power !== null && item.fling_power !== undefined) {
      attributes.push({
        label: 'Fling Power',
        value: item.fling_power,
        color: '#ef4444'
      })
    }

    return attributes
  }

  const getHeldByPokemon = () => {
    return item.held_by_pokemon?.slice(0, 10) || []
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {item.sprites?.default && (
              <img 
                src={item.sprites.default} 
                alt={item.name}
                className="w-8 h-8 object-contain"
              />
            )}
            <h2 className="text-2xl font-bold capitalize">
              {item.name.replace('-', ' ')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Item Details */}
            <div className="space-y-6">
              {/* Attributes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Item Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {getAttributes().map((attr, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">
                          {attr.label}
                        </span>
                        <Badge 
                          className="text-white border-0"
                          style={{ backgroundColor: attr.color }}
                        >
                          {attr.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Effect Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Effect Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getEffectText()}
                  </p>
                </CardContent>
              </Card>

              {/* Flavor Text */}
              {getFlavorText() && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      {getFlavorText()}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Held By Pokemon */}
            <div className="space-y-6">
              {getHeldByPokemon().length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Can be Held By
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {getHeldByPokemon().map((pokemon: any, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 p-2 bg-muted rounded-md"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {pokemon.pokemon.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium capitalize">
                            {pokemon.pokemon.name.replace('-', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                    {item.held_by_pokemon?.length > 10 && (
                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        ...and {item.held_by_pokemon.length - 10} more Pokemon
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
