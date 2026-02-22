import { Metadata } from 'next'
import { fetchAllMovesComplete } from '@/lib/api'
import { MovesListClient } from './client'

export const metadata: Metadata = {
  title: 'Pokemon Moves - Complete Move Database',
  description: 'Browse all Pokemon moves with detailed information about power, accuracy, type, and effects.'
}

export default async function MovesPage() {
  const movesData = await fetchAllMovesComplete() // Fetch ALL moves
  
  return <MovesListClient initialMoves={movesData} />
}
