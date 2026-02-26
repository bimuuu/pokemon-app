import { Metadata } from 'next'
import { fetchAllItems } from '@/lib/api'
import { HeldItemsListClient } from './client'

export const metadata: Metadata = {
  title: 'Pokemon Held Items - Complete Item Database',
  description: 'Browse all Pokemon held items with detailed information about effects, stats, and which Pokemon can use them.'
}

export default async function HeldItemsPage() {
  const itemsData = await fetchAllItems(500, 0) // Fetch first 500 items
  
  return <HeldItemsListClient initialItems={itemsData} />
}
