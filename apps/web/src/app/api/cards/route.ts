import { NextResponse } from 'next/server'
import { getCards } from '@/lib/data/cards'
import type { CardCategory } from '@/lib/supabase/types'

export const runtime = 'edge'

const VALID_CATEGORIES: ReadonlySet<string> = new Set<CardCategory>([
  'OpenAI',
  'Anthropic',
  'Google',
  'Meta',
  'Open Source',
  'Research',
  'Startups',
  'Tools',
  'Policy',
  'Industry',
])

const MIN_LIMIT = 1
const MAX_LIMIT = 100
const DEFAULT_LIMIT = 20

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Validate limit
  const limitParam = searchParams.get('limit')
  let limit = DEFAULT_LIMIT
  if (limitParam !== null) {
    const parsed = Number(limitParam)
    if (!Number.isInteger(parsed) || parsed < MIN_LIMIT || parsed > MAX_LIMIT) {
      return NextResponse.json(
        { error: `limit must be an integer between ${MIN_LIMIT} and ${MAX_LIMIT}` },
        { status: 400 },
      )
    }
    limit = parsed
  }

  // Validate cursor (optional, must be non-empty string if provided)
  const cursorParam = searchParams.get('cursor')
  if (cursorParam?.length === 0) {
    return NextResponse.json(
      { error: 'cursor must be a non-empty string' },
      { status: 400 },
    )
  }
  const cursor = cursorParam ?? undefined

  // Validate category (optional, must be a known category)
  const categoryParam = searchParams.get('category')
  let category: CardCategory | undefined
  if (categoryParam !== null) {
    if (!VALID_CATEGORIES.has(categoryParam)) {
      return NextResponse.json(
        { error: `Invalid category. Valid values: ${[...VALID_CATEGORIES].join(', ')}` },
        { status: 400 },
      )
    }
    category = categoryParam as CardCategory
  }

  const result = await getCards({ cursor, limit, category })

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  })
}
