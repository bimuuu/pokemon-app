import type { Metadata } from 'next'
import { fetchPokemonByName } from '@/lib/api'

interface PokemonPageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: PokemonPageProps): Promise<Metadata> {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  
  try {
    const pokemon = await fetchPokemonByName(decodedName)
    
    if (!pokemon) {
      return {
        title: 'Pokemon Not Found',
        description: 'The requested Pokemon could not be found.',
      }
    }

    const capitalizedName = pokemon.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return {
      title: `${capitalizedName} - Pokemon Cobbleverse Planner`,
      description: `Detailed information about ${capitalizedName} in Pokemon Cobbleverse modpack. Stats, abilities, moves, and evolution data.`,
      keywords: [
        pokemon.name,
        capitalizedName,
        'pokemon',
        'cobbleverse',
        'stats',
        'abilities',
        'moves',
        'evolution'
      ],
      openGraph: {
        title: `${capitalizedName} - Pokemon Cobbleverse Planner`,
        description: `Detailed information about ${capitalizedName} in Pokemon Cobbleverse modpack.`,
        images: pokemon.sprites?.front_default ? [
          {
            url: pokemon.sprites.front_default,
            width: 96,
            height: 96,
            alt: capitalizedName,
          }
        ] : undefined,
      },
      twitter: {
        title: `${capitalizedName} - Pokemon Cobbleverse Planner`,
        description: `Detailed information about ${capitalizedName} in Pokemon Cobbleverse modpack.`,
        images: pokemon.sprites?.front_default ? [pokemon.sprites.front_default] : undefined,
      },
    }
  } catch (error) {
    return {
      title: 'Error - Pokemon Cobbleverse Planner',
      description: 'An error occurred while loading Pokemon data.',
    }
  }
}
