import { CobblemonPokemon } from '@/types/pokemon'
import { PokemonCardClient } from './PokemonCardClient'

interface PokemonCardProps {
  pokemon: CobblemonPokemon
  types?: string[]
}

export function PokemonCard({ pokemon, types }: PokemonCardProps) {
  return <PokemonCardClient pokemon={pokemon} types={types} />
}
