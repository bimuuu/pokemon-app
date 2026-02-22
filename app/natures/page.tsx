import { Metadata } from 'next'
import { fetchAllNatures } from '@/lib/api'
import { NaturesListClient } from './client'

export const metadata: Metadata = {
  title: 'Pokemon Natures - Complete Nature Database',
  description: 'Browse all Pokemon natures with detailed information about stat modifications and battle effects.'
}

export default async function NaturesPage() {
  const naturesData = await fetchAllNatures() // Fetch all natures
  
  return <NaturesListClient initialNatures={naturesData} />
}
