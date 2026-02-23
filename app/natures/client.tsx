'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Heart
} from 'lucide-react'

interface NaturesListClientProps {
  initialNatures: any
}

export function NaturesListClient({ initialNatures }: NaturesListClientProps) {
  const searchParams = useSearchParams()
  const [natures, setNatures] = useState(initialNatures.results || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle URL search parameter
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])


  const getNatureDescription = (name: string) => {
    const descriptions: Record<string, string> = {
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
      'quirky': 'Neutral nature with no stat changes.'
    }
    return descriptions[name] || 'A unique nature that affects Pokemon stats.'
  }

  const getIncreasedStat = (nature: any) => {
    // For neutral natures, show their associated stat
    if (isNeutralNature(nature)) {
      const neutralStats: Record<string, string> = {
        'hardy': 'attack',
        'docile': 'defense', 
        'bashful': 'special attack',
        'quirky': 'special defense',
        'serious': 'speed'
      }
      return neutralStats[nature.name] || null
    }
    if (!nature.increased_stat) return null
    return nature.increased_stat.name.replace('-', ' ')
  }

  const getDecreasedStat = (nature: any) => {
    // For neutral natures, show their associated stat
    if (isNeutralNature(nature)) {
      const neutralStats: Record<string, string> = {
        'hardy': 'attack',
        'docile': 'defense',
        'bashful': 'special Attack', 
        'quirky': 'special defense',
        'serious': 'speed'
      }
      return neutralStats[nature.name] || null
    }
    if (!nature.decreased_stat) return null
    return nature.decreased_stat.name.replace('-', ' ')
  }

  const isNeutralNature = (nature: any) => {
    return !nature.increased_stat && !nature.decreased_stat
  }

  const filteredNatures = natures
    .filter((nature: any) =>
      nature.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => a.name.localeCompare(b.name))

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Pokemon Natures</h1>
        <p className="text-lg text-muted-foreground mb-2">
          Browse all Pokemon natures with detailed information about stat modifications and battle effects.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Showing <span className="font-semibold">{filteredNatures.length}</span> of <span className="font-semibold">{natures.length}</span> total natures
        </p>
        
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search natures by name..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Pokemon Natures ({filteredNatures.length} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Nature</TableHead>
                <TableHead className="w-[150px]">Increases</TableHead>
                <TableHead className="w-[150px]">Decreases</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNatures.map((nature: any) => (
                <TableRow key={nature.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={isNeutralNature(nature) ? "secondary" : "default"}
                        className={isNeutralNature(nature) ? "bg-gray-500 text-white" : "bg-purple-500 text-white"}
                      >
                        NATURE
                      </Badge>
                      <span className="font-medium capitalize">
                        {nature.name.charAt(0).toUpperCase() + nature.name.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getIncreasedStat(nature) ? (
                      <div className="flex items-center gap-1">
                        {isNeutralNature(nature) ? (
                          <>
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-green-600 font-medium">
                              {getIncreasedStat(nature)} (+10%)
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-green-600 font-medium">
                              {getIncreasedStat(nature)} (+10%)
                            </span>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getDecreasedStat(nature) ? (
                      <div className="flex items-center gap-1">
                        {isNeutralNature(nature) ? (
                          <>
                            <TrendingDown className="h-3 w-3 text-red-600" />
                            <span className="text-red-600 font-medium">
                              {getDecreasedStat(nature)} (-10%)
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3 w-3 text-red-600" />
                            <span className="text-red-600 font-medium">
                              {getDecreasedStat(nature)} (-10%)
                            </span>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getNatureDescription(nature.name)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredNatures.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No natures found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
