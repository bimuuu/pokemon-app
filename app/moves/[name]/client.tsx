'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sword, 
  Shield, 
  Zap, 
  Heart, 
  Star,
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import type { Move } from 'pokenode-ts'

interface MoveDetailClientProps {
  move: Move
}

export function MoveDetailClient({ move }: MoveDetailClientProps) {
  const englishName = move.names?.find((n: any) => n.language.name === 'en')?.name || move.name
  const englishDescription = move.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text || ''
  const englishEffect = move.effect_entries?.find((e: any) => e.language.name === 'en')?.effect || ''
  const englishShortEffect = move.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect || ''

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-600',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-400'
    }
    return colors[type] || 'bg-gray-400'
  }

  const getDamageClassColor = (damageClass: string) => {
    const colors: Record<string, string> = {
      physical: 'bg-red-500',
      special: 'bg-blue-500',
      status: 'bg-gray-500'
    }
    return colors[damageClass] || 'bg-gray-400'
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600'
    if (accuracy >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPowerColor = (power: number | null) => {
    if (!power) return 'text-gray-500'
    if (power >= 120) return 'text-red-600'
    if (power >= 80) return 'text-orange-600'
    if (power >= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold capitalize">{englishName}</h1>
          <Badge className={`${getTypeColor(move.type.name)} text-white`}>
            {move.type.name.toUpperCase()}
          </Badge>
          <Badge className={`${getDamageClassColor(move.damage_class?.name || 'status')} text-white`}>
            {move.damage_class?.name.toUpperCase() || 'STATUS'}
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground italic">{englishDescription}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Power</CardTitle>
            <Sword className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPowerColor(move.power)}`}>
              {move.power || '—'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAccuracyColor(move.accuracy || 0)}`}>
              {move.accuracy ? `${move.accuracy}%` : '—'}
            </div>
            {move.accuracy && (
              <Progress value={move.accuracy} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PP</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {move.pp}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="effect" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="effect">Effect</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="meta">Meta</TabsTrigger>
        </TabsList>

        <TabsContent value="effect" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Effect Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {englishShortEffect && (
                <div>
                  <h4 className="font-semibold mb-2">Short Effect:</h4>
                  <p className="text-sm text-muted-foreground">{englishShortEffect}</p>
                </div>
              )}
              {englishEffect && (
                <div>
                  <h4 className="font-semibold mb-2">Detailed Effect:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{englishEffect}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <Badge className={`${getTypeColor(move.type.name)} text-white`}>
                    {move.type.name.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Damage Class:</span>
                  <Badge className={`${getDamageClassColor(move.damage_class?.name || 'status')} text-white`}>
                    {move.damage_class?.name.toUpperCase() || 'STATUS'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Priority:</span>
                  <span className={move.priority > 0 ? 'text-green-600 font-bold' : move.priority < 0 ? 'text-red-600 font-bold' : ''}>
                    {move.priority > 0 ? '+' : ''}{move.priority}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Battle Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Power:</span>
                  <span className={`font-bold ${getPowerColor(move.power)}`}>
                    {move.power || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Accuracy:</span>
                  <span className={`font-bold ${getAccuracyColor(move.accuracy || 0)}`}>
                    {move.accuracy ? `${move.accuracy}%` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">PP:</span>
                  <span className="font-bold text-blue-600">{move.pp}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Learned by Pokemon:</h4>
                  <p className="text-sm text-muted-foreground">
                    This move can be learned by various Pokemon through level up, TM/HM, breeding, or tutoring.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Meta Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Move ID:</h4>
                  <p className="text-sm text-muted-foreground">{move.id}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Generation:</h4>
                  <p className="text-sm text-muted-foreground">{move.generation.name.toUpperCase()}</p>
                </div>
              </div>
              
              {move.meta && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Meta Data:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Min Hits:</span>
                      <span className="ml-2">{move.meta.min_hits || '—'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Max Hits:</span>
                      <span className="ml-2">{move.meta.max_hits || '—'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Min Turns:</span>
                      <span className="ml-2">{move.meta.min_turns || '—'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Max Turns:</span>
                      <span className="ml-2">{move.meta.max_turns || '—'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Crit Rate:</span>
                      <span className="ml-2">{move.meta.crit_rate || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium">Drain:</span>
                      <span className="ml-2">{move.meta.drain || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium">Healing:</span>
                      <span className="ml-2">{move.meta.healing || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium">Flinch Chance:</span>
                      <span className="ml-2">{move.meta.flinch_chance || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Stat Changes:</h4>
                {move.stat_changes && move.stat_changes.length > 0 ? (
                  <div className="space-y-1">
                    {move.stat_changes.map((change: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Badge variant={change.change > 0 ? 'default' : 'destructive'}>
                          {change.change > 0 ? '+' : ''}{change.change}
                        </Badge>
                        <span className="capitalize">{change.stat.name.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No stat changes</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
