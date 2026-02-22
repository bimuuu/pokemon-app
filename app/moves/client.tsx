'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Sword, Target, Star } from 'lucide-react'
import { Pagination } from '@/components/common'

interface MovesListClientProps {
  initialMoves: any
}

export function MovesListClient({ initialMoves }: MovesListClientProps) {
  const [moves, setMoves] = useState(initialMoves.results || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 24

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

  const filteredMoves = moves.filter((move: any) =>
    move.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredMoves.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMoves = filteredMoves.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Pokemon Moves</h1>
        <p className="text-lg text-muted-foreground mb-2">
          Browse all Pokemon moves with detailed information about power, accuracy, type, and effects.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Showing <span className="font-semibold">{currentMoves.length}</span> of <span className="font-semibold">{filteredMoves.length}</span> moves (Page {currentPage} of {totalPages})
        </p>
        
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search moves by name..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentMoves.map((move: any) => (
          <Link key={move.name} href={`/moves/${move.name}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {move.name.replace('-', ' ')}
                  </CardTitle>
                  <Sword className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className={`${getTypeColor('normal')} text-white`}>
                    MOVE
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Click to view detailed information about this move
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {currentMoves.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No moves found matching your search.</p>
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
