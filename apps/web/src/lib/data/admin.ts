import 'server-only'
import { createServiceClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Admin Dashboard Data Queries
// Uses service role client (RLS restricts anon to insert-only on card_events)
// ---------------------------------------------------------------------------

export interface AdminStats {
  totalCards: number
  totalViews: number
  totalShares: number
  totalFlags: number
}

export interface CategoryCount {
  category: string
  count: number
}

export interface FlaggedCard {
  id: string
  title: string
  source_name: string
  category: string
  published_at: string
  flagCount: number
}

export interface SourceHealthRow {
  source_id: string
  source_name: string
  status: string
  consecutive_failures: number
  last_success_at: string | null
  last_failure_at: string | null
  updated_at: string
}

/**
 * Get aggregate stats for the admin dashboard.
 */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createServiceClient()

  const [cardsRes, viewRes, shareRes, flagRes] = await Promise.all([
    supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase
      .from('card_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'view'),
    supabase
      .from('card_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'share'),
    supabase
      .from('card_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'flag'),
  ])

  return {
    totalCards: cardsRes.count ?? 0,
    totalViews: viewRes.count ?? 0,
    totalShares: shareRes.count ?? 0,
    totalFlags: flagRes.count ?? 0,
  }
}

/**
 * Get card counts grouped by category.
 */
export async function getCardsByCategory(): Promise<CategoryCount[]> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from('cards')
    .select('category')
    .eq('status', 'published')

  if (!data) return []

  // Group and count in JS (Supabase doesn't support GROUP BY in REST API)
  const counts = new Map<string, number>()
  for (const row of data) {
    const cat = (row as { category: string }).category
    counts.set(cat, (counts.get(cat) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Get flagged cards with their flag counts.
 */
export async function getFlaggedCards(): Promise<FlaggedCard[]> {
  const supabase = createServiceClient()

  // Get all flag events
  const { data: flagEvents } = await supabase
    .from('card_events')
    .select('card_id')
    .eq('event_type', 'flag')

  if (!flagEvents || flagEvents.length === 0) return []

  // Count flags per card
  const flagCounts = new Map<string, number>()
  for (const event of flagEvents) {
    const cardId = (event as { card_id: string }).card_id
    flagCounts.set(cardId, (flagCounts.get(cardId) ?? 0) + 1)
  }

  // Fetch the flagged cards
  const cardIds = Array.from(flagCounts.keys())
  const { data: cards } = await supabase
    .from('cards')
    .select('id, title, source_name, category, published_at')
    .in('id', cardIds)

  if (!cards) return []

  interface FlaggedCard {
    id: string
    title: string
    source_name: string
    category: string
    published_at: string
  }

  return (cards as FlaggedCard[])
    .map((card) => ({
      ...card,
      flagCount: flagCounts.get(card.id) ?? 0,
    }))
    .sort((a, b) => b.flagCount - a.flagCount)
}

/**
 * Get source health data.
 */
export async function getSourceHealth(): Promise<SourceHealthRow[]> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from('source_health')
    .select('*')
    .order('source_name')

  if (!data) return []
  return data as SourceHealthRow[]
}
