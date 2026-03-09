import { createAnonClient } from '@/lib/supabase/client'
import type { Card, CardCategory } from '@/lib/supabase/types'

interface GetCardsOptions {
  cursor?: string
  limit?: number
  category?: CardCategory
}

type FreshnessStatus = 'fresh' | 'ok' | 'stale'

interface GetCardsResult {
  cards: Card[]
  nextCursor: string | null
  freshness_status: FreshnessStatus
}

interface GetCardByIdResult {
  card: Card
  prevId: string | null
  nextId: string | null
}

const FRESH_THRESHOLD_MS = 2 * 60 * 60 * 1000 // 2 hours
const STALE_THRESHOLD_MS = 6 * 60 * 60 * 1000 // 6 hours

function computeFreshness(newestPublishedAt: string | null): FreshnessStatus {
  if (!newestPublishedAt) return 'stale'

  const ageMs = Date.now() - new Date(newestPublishedAt).getTime()

  if (ageMs < FRESH_THRESHOLD_MS) return 'fresh'
  if (ageMs > STALE_THRESHOLD_MS) return 'stale'
  return 'ok'
}

/**
 * Fetches a paginated list of published cards from Supabase.
 * Uses keyset pagination on published_at for stable ordering.
 */
export async function getCards(options?: GetCardsOptions): Promise<GetCardsResult> {
  const limit = options?.limit ?? 20
  const cursor = options?.cursor
  const category = options?.category

  const supabase = createAnonClient()

  // If cursor is provided, look up the cursor card's published_at for keyset pagination
  let cursorPublishedAt: string | null = null
  if (cursor) {
    const { data: cursorCard } = await supabase
      .from('cards')
      .select('published_at')
      .eq('id', cursor)
      .single()

    cursorPublishedAt = cursorCard?.published_at ?? null
  }

  // Build query: published cards ordered by published_at DESC
  let query = supabase
    .from('cards')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit + 1) // Fetch one extra to detect next page

  if (category) {
    query = query.eq('category', category)
  }

  if (cursorPublishedAt) {
    query = query.lt('published_at', cursorPublishedAt)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch cards: ${error.message}`)
  }

  const cards = data as Card[]
  const hasMore = cards.length > limit
  const page = hasMore ? cards.slice(0, limit) : cards
  const nextCursor = hasMore ? page[page.length - 1]?.id ?? null : null

  // Determine freshness from the newest card in the full dataset (first page, no cursor)
  let freshness_status: FreshnessStatus
  if (!cursor && page.length > 0) {
    freshness_status = computeFreshness(page[0].published_at)
  } else {
    // For paginated requests, fetch the newest card's published_at
    const { data: newest } = await supabase
      .from('cards')
      .select('published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .single()

    freshness_status = computeFreshness(newest?.published_at ?? null)
  }

  return { cards: page, nextCursor, freshness_status }
}

/**
 * Fetches a single card by ID with prev/next IDs for swipe navigation.
 */
export async function getCardById(id: string): Promise<GetCardByIdResult | null> {
  const supabase = createAnonClient()

  // Fetch the card
  const { data: card, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (error || !card) {
    return null
  }

  // Fetch prev (newer) and next (older) in parallel
  const [prevResult, nextResult] = await Promise.all([
    // Prev = next newer card (published_at > current, order ASC, limit 1)
    supabase
      .from('cards')
      .select('id')
      .eq('status', 'published')
      .gt('published_at', card.published_at)
      .order('published_at', { ascending: true })
      .limit(1)
      .single(),
    // Next = next older card (published_at < current, order DESC, limit 1)
    supabase
      .from('cards')
      .select('id')
      .eq('status', 'published')
      .lt('published_at', card.published_at)
      .order('published_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  const prevId = prevResult.data?.id ?? null
  const nextId = nextResult.data?.id ?? null

  return { card: card as Card, prevId, nextId }
}
