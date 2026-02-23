import { Suspense } from 'react'
import { PokemonGrid } from '@/components/pokemon/PokemonGrid'
import { PokemonFiltersServer } from '@/components/filters/PokemonFiltersServer'
import { PokemonPageLoading } from '@/components/loading/PokemonPageLoading'
import { fetchCobblemonData } from '@/lib/api'

export default async function HomePage() {
  // Fetch data on server
  const pokemonData = await fetchCobblemonData()

  return (
    <section className="space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">Pokemon Cobbleverse Planner</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A comprehensive planning tool for Pokemon Cobbleverse modpack
        </p>
      </header>

      <Suspense fallback={<PokemonPageLoading />}>
        <PokemonFiltersServer />
      </Suspense>

      <Suspense fallback={<PokemonPageLoading />}>
        <PokemonGrid initialData={pokemonData} />
      </Suspense>
    </section>
  )
}
