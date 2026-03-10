import { CardFeedServer } from '@/components/feed'
import type { CardCategory } from '@/lib/supabase/types'

interface HomePageProps {
  searchParams: Promise<{ category?: string }>
}

const VALID_CATEGORIES = new Set<string>([
  'OpenAI', 'Anthropic', 'Google', 'Meta', 'Open Source',
  'Research', 'Startups', 'Tools', 'Policy', 'Industry',
])

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const category = VALID_CATEGORIES.has(params.category ?? '')
    ? (params.category as CardCategory)
    : undefined

  return (
    <main>
      <CardFeedServer category={category} />
    </main>
  )
}
