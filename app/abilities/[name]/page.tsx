import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchAbilityByName } from '@/lib/api'
import { AbilityDetailClient } from './client'

interface AbilityPageProps {
  params: { name: string }
}

export async function generateMetadata({ params }: AbilityPageProps): Promise<Metadata> {
  try {
    const ability = await fetchAbilityByName(params.name)
    return {
      title: `${ability.names?.find((n: any) => n.language.name === 'en')?.name || ability.name} - Ability Details`,
      description: ability.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text || `Detailed information about ${ability.name} ability`
    }
  } catch {
    return {
      title: 'Ability Not Found',
      description: 'The requested ability could not be found'
    }
  }
}

export default async function AbilityPage({ params }: AbilityPageProps) {
  try {
    const ability = await fetchAbilityByName(params.name)
    return <AbilityDetailClient ability={ability} />
  } catch (error) {
    console.error('Error fetching ability:', error)
    notFound()
  }
}
