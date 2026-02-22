import { redirect } from 'next/navigation'

interface NaturePageProps {
  params: { name: string }
}

export default async function NaturePage({ params }: NaturePageProps) {
  // Redirect to the main natures page since individual detail pages are no longer needed
  // All nature information is now consolidated on the main natures page
  redirect('/natures')
}
