import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchMoveByName } from '@/lib/api'
import { MoveDetailClient } from './client'

interface MovePageProps {
  params: { name: string }
}

export async function generateMetadata({ params }: MovePageProps): Promise<Metadata> {
  try {
    const move = await fetchMoveByName(params.name)
    return {
      title: `${move.names?.find((n: any) => n.language.name === 'en')?.name || move.name} - Move Details`,
      description: move.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text || `Detailed information about ${move.name} move`
    }
  } catch {
    return {
      title: 'Move Not Found',
      description: 'The requested move could not be found'
    }
  }
}

export default async function MovePage({ params }: MovePageProps) {
  try {
    const move = await fetchMoveByName(params.name)
    return <MoveDetailClient move={move} />
  } catch (error) {
    console.error('Error fetching move:', error)
    notFound()
  }
}
