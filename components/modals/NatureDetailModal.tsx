'use client'

import { X, TrendingUp, TrendingDown, Heart, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NatureDetailModalProps {
  nature: string | null
  onClose: () => void
}

export function NatureDetailModal({ nature, onClose }: NatureDetailModalProps) {
  if (!nature) return null

  const getNatureData = (name: string) => {
    const natureDescriptions: Record<string, string> = {
      'hardy': 'Neutral nature with no stat changes.',
      'lonely': 'Increases Attack, decreases Defense.',
      'brave': 'Increases Attack, decreases Speed.',
      'adamant': 'Increases Attack, decreases Special Attack.',
      'naughty': 'Increases Attack, decreases Special Defense.',
      'bold': 'Increases Defense, decreases Attack.',
      'docile': 'Neutral nature with no stat changes.',
      'relaxed': 'Increases Defense, decreases Speed.',
      'impish': 'Increases Defense, decreases Special Attack.',
      'lax': 'Increases Defense, decreases Special Defense.',
      'timid': 'Increases Speed, decreases Attack.',
      'hasty': 'Increases Speed, decreases Defense.',
      'serious': 'Neutral nature with no stat changes.',
      'jolly': 'Increases Speed, decreases Special Attack.',
      'naive': 'Increases Speed, decreases Special Defense.',
      'modest': 'Increases Special Attack, decreases Attack.',
      'mild': 'Increases Special Attack, decreases Defense.',
      'bashful': 'Neutral nature with no stat changes.',
      'rash': 'Increases Special Attack, decreases Special Defense.',
      'quiet': 'Increases Special Attack, decreases Speed.',
      'calm': 'Increases Special Defense, decreases Attack.',
      'gentle': 'Increases Special Defense, decreases Defense.',
      'sassy': 'Increases Special Defense, decreases Speed.',
      'careful': 'Increases Special Defense, decreases Special Attack.',
      'quirky': 'Neutral nature with no stat changes.',
    }

    const statChanges: Record<string, { increased: string; decreased: string }> = {
      'hardy': { increased: 'None', decreased: 'None' },
      'lonely': { increased: 'Attack', decreased: 'Defense' },
      'brave': { increased: 'Attack', decreased: 'Speed' },
      'adamant': { increased: 'Attack', decreased: 'Special Attack' },
      'naughty': { increased: 'Attack', decreased: 'Special Defense' },
      'bold': { increased: 'Defense', decreased: 'Attack' },
      'docile': { increased: 'None', decreased: 'None' },
      'relaxed': { increased: 'Defense', decreased: 'Speed' },
      'impish': { increased: 'Defense', decreased: 'Special Attack' },
      'lax': { increased: 'Defense', decreased: 'Special Defense' },
      'timid': { increased: 'Speed', decreased: 'Attack' },
      'hasty': { increased: 'Speed', decreased: 'Defense' },
      'serious': { increased: 'None', decreased: 'None' },
      'jolly': { increased: 'Speed', decreased: 'Special Attack' },
      'naive': { increased: 'Speed', decreased: 'Special Defense' },
      'modest': { increased: 'Special Attack', decreased: 'Attack' },
      'mild': { increased: 'Special Attack', decreased: 'Defense' },
      'bashful': { increased: 'None', decreased: 'None' },
      'rash': { increased: 'Special Attack', decreased: 'Special Defense' },
      'quiet': { increased: 'Special Attack', decreased: 'Speed' },
      'calm': { increased: 'Special Defense', decreased: 'Attack' },
      'gentle': { increased: 'Special Defense', decreased: 'Defense' },
      'sassy': { increased: 'Special Defense', decreased: 'Speed' },
      'careful': { increased: 'Special Defense', decreased: 'Special Attack' },
      'quirky': { increased: 'None', decreased: 'None' },
    }

    return {
      description: natureDescriptions[name] || 'Unknown nature.',
      ...statChanges[name]
    }
  }

  const natureData = getNatureData(nature)
  const isNeutral = natureData.increased === 'None' && natureData.decreased === 'None'

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-background/95 backdrop-blur-sm absolute inset-0" onClick={onClose} />
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
        {/* Modal Header */}
        <div className="sticky top-0 bg-card border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold capitalize">{nature.replace('-', ' ')}</h2>
            <Badge className={`${isNeutral ? 'bg-gray-500' : 'bg-green-500'} text-white`}>
              {isNeutral ? 'NEUTRAL' : 'NATURE'}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {natureData.description}
              </p>
            </CardContent>
          </Card>

          {/* Stat Changes */}
          {!isNeutral && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stat Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-green-950/20 border border-green-400 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-sm text-gray-400">Increased</div>
                      <div className="font-semibold text-green-300">
                        {natureData.increased} (+10%)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-950/20 border border-red-400 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                    <div>
                      <div className="text-sm text-gray-400">Decreased</div>
                      <div className="font-semibold text-red-300">
                        {natureData.decreased} (-10%)
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Neutral Nature Info */}
          {isNeutral && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Balanced Nature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This is a neutral nature that doesn't affect any stats. All stats remain at their base values.
                  These natures are good for Pokemon that need balanced stats or when you don't want to specialize
                  in any particular stat.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Battle Strategy Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Battle Strategy Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                {!isNeutral ? (
                  <>
                    <p>• Choose natures that complement your Pokemon's role and base stats</p>
                    <p>• Physical attackers benefit from Attack-boosting natures (Adamant, Jolly)</p>
                    <p>• Special attackers benefit from Special Attack-boosting natures (Modest, Timid)</p>
                    <p>• Tanks benefit from Defense or Special Defense-boosting natures (Bold, Careful)</p>
                    <p>• Consider your team composition when choosing natures</p>
                  </>
                ) : (
                  <>
                    <p>• Good for mixed attackers who use both physical and special moves</p>
                    <p>• Useful for Pokemon with already balanced base stats</p>
                    <p>• Can be used when you're unsure about the Pokemon's intended role</p>
                    <p>• Provides flexibility in battle strategy</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
