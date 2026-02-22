import { Metadata } from 'next'
import ShopClient from './client'

export const metadata: Metadata = {
  title: 'Pokemon Shop - CobbleDollar Store',
  description: 'Browse and purchase Pokemon items, Poke Balls, medicine, and more using CobbleDollars.'
}

export default async function ShopPage() {
  return <ShopClient />
}
