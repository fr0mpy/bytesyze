import { mockCards } from '@/lib/mocks/cards'
import type { Card, CardCategory } from '@/lib/supabase/types'

interface GetCardsOptions {
  cursor?: string
  limit?: number
  category?: CardCategory
}

interface GetCardsResult {
  cards: Card[]
  nextCursor: string | null
}

interface GetCardByIdResult {
  card: Card
  prevId: string | null
  nextId: string | null
}

/**
 * Fetches a paginated list of published cards.
 * Currently backed by mock data; will be replaced with Supabase queries.
 */
export async function getCards(options?: GetCardsOptions): Promise<GetCardsResult> {
  const limit = options?.limit ?? 20
  const cursor = options?.cursor
  const category = options?.category

  let cards = mockCards.filter((c) => c.status === 'published')

  if (category) {
    cards = cards.filter((c) => c.category === category)
  }

  // Sort by published_at descending (newest first)
  cards.sort((a, b) => {
    const dateA = a.published_at ?? a.created_at
    const dateB = b.published_at ?? b.created_at
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })

  // Apply cursor-based pagination
  let startIndex = 0
  if (cursor) {
    const cursorIndex = cards.findIndex((c) => c.id === cursor)
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1
    }
  }

  const page = cards.slice(startIndex, startIndex + limit)
  const hasMore = startIndex + limit < cards.length
  const nextCursor = hasMore ? page[page.length - 1]?.id ?? null : null

  return { cards: page, nextCursor }
}

/**
 * Fetches a single card by ID with prev/next IDs for swipe navigation.
 * Currently backed by mock data; will be replaced with Supabase queries.
 */
export async function getCardById(id: string): Promise<GetCardByIdResult | null> {
  const published = mockCards
    .filter((c) => c.status === 'published')
    .sort((a, b) => {
      const dateA = a.published_at ?? a.created_at
      const dateB = b.published_at ?? b.created_at
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })

  const index = published.findIndex((c) => c.id === id)

  if (index === -1) {
    return null
  }

  const card = published[index]
  const prevId = index > 0 ? published[index - 1].id : null
  const nextId = index < published.length - 1 ? published[index + 1].id : null

  return { card, prevId, nextId }
}
