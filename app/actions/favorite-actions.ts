'use server'

import { revalidateTag } from 'next/cache'

export interface FavoritePokemon {
  id: string
  name: string
  types: string[]
  addedAt: Date
}

// In a real app, this would be stored in a database with user sessions
const favorites = new Set<string>()

export async function toggleFavorite(pokemonId: string, pokemonName: string, types: string[]) {
  if (favorites.has(pokemonId)) {
    favorites.delete(pokemonId)
  } else {
    favorites.add(pokemonId)
  }
  
  // Revalidate cache for favorites
  revalidateTag('favorites', 'favorite-pokemon')
  
  return { isFavorite: favorites.has(pokemonId) }
}

export async function getFavorites(): Promise<string[]> {
  return Array.from(favorites)
}

export async function isFavorite(pokemonId: string): Promise<boolean> {
  return favorites.has(pokemonId)
}
