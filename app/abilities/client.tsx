'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Zap, Shield, Star } from 'lucide-react'
import { Pagination } from '@/components/common'

interface AbilitiesListClientProps {
  initialAbilities: any
}

export function AbilitiesListClient({ initialAbilities }: AbilitiesListClientProps) {
  const [abilities, setAbilities] = useState(initialAbilities.results || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 24

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

  const filteredAbilities = abilities.filter((ability: any) =>
    ability.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredAbilities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAbilities = filteredAbilities.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Pokemon Abilities</h1>
        <p className="text-lg text-muted-foreground mb-2">
          Browse all Pokemon abilities with detailed information about their effects and which Pokemon have them.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Showing <span className="font-semibold">{filteredAbilities.length}</span> of <span className="font-semibold">{abilities.length}</span> total abilities
        </p>
        
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search abilities by name..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentAbilities.map((ability: any) => (
          <Link key={ability.name} href={`/abilities/${ability.name}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {ability.name.replace('-', ' ')}
                  </CardTitle>
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-purple-500 text-white">
                    ABILITY
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Click to view detailed information about this ability
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {currentAbilities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No abilities found matching your search.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
