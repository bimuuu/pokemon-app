import { Metadata } from 'next'
import { fetchAllAbilities } from '@/lib/api'
import { AbilitiesListClient } from './client'

export const metadata: Metadata = {
  title: 'Pokemon Abilities - Complete Ability Database',
  description: 'Browse all Pokemon abilities with detailed information about effects and Pokemon that have them.'
}

export default async function AbilitiesPage() {
  const abilitiesData = await fetchAllAbilities(1000, 0) // Fetch first 1000 abilities
  
  return <AbilitiesListClient initialAbilities={abilitiesData} />
}
