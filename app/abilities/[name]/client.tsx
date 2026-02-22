'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Zap, 
  Shield, 
  Star,
  Users,
  Info,
  List
} from 'lucide-react'

interface AbilityDetailClientProps {
  ability: any
}

export function AbilityDetailClient({ ability }: AbilityDetailClientProps) {
  const englishName = ability.names?.find((n: any) => n.language.name === 'en')?.name || ability.name
  const englishDescription = ability.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text || ''
  const englishEffect = ability.effect_entries?.find((e: any) => e.language.name === 'en')?.effect || ''
  const englishShortEffect = ability.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect || ''

  const getGenerationColor = (generation: string) => {
    const colors: Record<string, string> = {
      'generation-i': 'bg-red-500',
      'generation-ii': 'bg-blue-500',
      'generation-iii': 'bg-green-500',
      'generation-iv': 'bg-purple-500',
      'generation-v': 'bg-yellow-500',
      'generation-vi': 'bg-pink-500',
      'generation-vii': 'bg-cyan-500',
      'generation-viii': 'bg-orange-500',
      'generation-ix': 'bg-indigo-500'
    }
    return colors[generation] || 'bg-gray-500'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold capitalize">{englishName}</h1>
          <Badge className="bg-purple-500 text-white">
            ABILITY
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground italic">{englishDescription}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generation</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={`${getGenerationColor(ability.generation?.name || 'generation-i')} text-white`}>
              {ability.generation?.name.toUpperCase().replace('-', ' ') || 'UNKNOWN'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Is Main Series</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={ability.is_main_series ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
              {ability.is_main_series ? 'YES' : 'NO'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="effect" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="effect">Effect</TabsTrigger>
          <TabsTrigger value="pokemon">Pokemon</TabsTrigger>
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

        <TabsContent value="pokemon" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pokemon with this Ability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This ability can be found on various Pokemon. Some Pokemon may have this as their primary ability, 
                  while others may have it as a hidden ability.
                </p>
                
                {ability.pokemon && ability.pokemon.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Example Pokemon:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {ability.pokemon.slice(0, 12).map((pokemon: any, index: number) => (
                        <Badge key={index} variant="outline" className="justify-center">
                          {pokemon.pokemon.name.replace('-', ' ').toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                    {ability.pokemon.length > 12 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        ...and {ability.pokemon.length - 12} more Pokemon
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Meta Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Ability ID:</h4>
                  <p className="text-sm text-muted-foreground">{ability.id}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Generation:</h4>
                  <p className="text-sm text-muted-foreground">
                    {ability.generation?.name.toUpperCase().replace('-', ' ') || 'UNKNOWN'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Main Series:</h4>
                  <Badge className={ability.is_main_series ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                    {ability.is_main_series ? 'YES' : 'NO'}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold">Pokemon Count:</h4>
                  <p className="text-sm text-muted-foreground">
                    {ability.pokemon?.length || 0} Pokemon have this ability
                  </p>
                </div>
              </div>

              {ability.names && ability.names.length > 1 && (
                <div>
                  <h4 className="font-semibold mb-2">Names in Other Languages:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {ability.names.slice(0, 9).map((name: any, index: number) => (
                      <div key={index}>
                        <span className="font-medium capitalize">{name.language.name}:</span>
                        <span className="ml-2">{name.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
