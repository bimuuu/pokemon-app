'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface NatureDetailClientProps {
  nature: any
}

export function NatureDetailClient({ nature }: NatureDetailClientProps) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main natures page
    router.replace('/natures')
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center">
        <p>Redirecting to natures page...</p>
      </div>
    </div>
  )
}
