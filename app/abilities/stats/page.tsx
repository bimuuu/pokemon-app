import { Metadata } from 'next'
import { getAbilityStats, getExpectedAbilityStats } from '@/lib/ability-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Users, Zap, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pokemon Ability Statistics - Analysis',
  description: 'Detailed statistics about Pokemon ability distribution and counts.'
}

export default async function AbilityStatsPage() {
  let actualStats
  try {
    actualStats = await getAbilityStats()
  } catch (error) {
    console.error('Failed to fetch actual stats, using expected values:', error)
    actualStats = getExpectedAbilityStats()
  }
  
  const expectedStats = getExpectedAbilityStats()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Pokemon Ability Statistics</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Analysis of Pokemon ability distribution across all Pokemon species.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pokemon</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actualStats.totalPokemon}</div>
            <p className="text-xs text-muted-foreground">All Pokemon species</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Single Ability</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{actualStats.singleAbilityPokemon}</div>
            <p className="text-xs text-muted-foreground">
              {((actualStats.singleAbilityPokemon / actualStats.totalPokemon) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dual Ability</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{actualStats.dualAbilityPokemon}</div>
            <p className="text-xs text-muted-foreground">
              {((actualStats.dualAbilityPokemon / actualStats.totalPokemon) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analysis</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {actualStats.singleAbilityPokemon + actualStats.dualAbilityPokemon}
            </div>
            <p className="text-xs text-muted-foreground">Pokemon analyzed</p>
          </CardContent>
        </Card>
      </div>

      {/* Expected vs Actual Comparison */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Expected vs Actual Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-blue-600">Expected Values</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span>Single Ability Pokemon</span>
                  <Badge variant="secondary">{expectedStats.singleAbilityPokemon}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span>Dual Ability Pokemon</span>
                  <Badge variant="secondary">{expectedStats.dualAbilityPokemon}</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-green-600">Actual Values</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span>Single Ability Pokemon</span>
                  <Badge variant="secondary">{actualStats.singleAbilityPokemon}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span>Dual Ability Pokemon</span>
                  <Badge variant="secondary">{actualStats.dualAbilityPokemon}</Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comparison Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Comparison Summary</h3>
            <div className="space-y-1 text-sm">
              <p>
                Single Ability Difference: 
                <span className={`font-semibold ml-2 ${actualStats.singleAbilityPokemon >= expectedStats.singleAbilityPokemon ? 'text-green-600' : 'text-red-600'}`}>
                  {actualStats.singleAbilityPokemon - expectedStats.singleAbilityPokemon >= 0 ? '+' : ''}{actualStats.singleAbilityPokemon - expectedStats.singleAbilityPokemon}
                </span>
              </p>
              <p>
                Dual Ability Difference: 
                <span className={`font-semibold ml-2 ${actualStats.dualAbilityPokemon >= expectedStats.dualAbilityPokemon ? 'text-green-600' : 'text-red-600'}`}>
                  {actualStats.dualAbilityPokemon - expectedStats.dualAbilityPokemon >= 0 ? '+' : ''}{actualStats.dualAbilityPokemon - expectedStats.dualAbilityPokemon}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Sample Single Ability Pokemon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {actualStats.singleAbilityPokemonList.slice(0, 20).map((pokemon) => (
                  <Badge key={pokemon} variant="outline" className="justify-start">
                    {pokemon.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
              {actualStats.singleAbilityPokemonList.length > 20 && (
                <p className="text-sm text-muted-foreground mt-2">
                  ... and {actualStats.singleAbilityPokemonList.length - 20} more
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-purple-600">Sample Dual Ability Pokemon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {actualStats.dualAbilityPokemonList.slice(0, 20).map((pokemon) => (
                  <Badge key={pokemon} variant="outline" className="justify-start">
                    {pokemon.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
              {actualStats.dualAbilityPokemonList.length > 20 && (
                <p className="text-sm text-muted-foreground mt-2">
                  ... and {actualStats.dualAbilityPokemonList.length - 20} more
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
