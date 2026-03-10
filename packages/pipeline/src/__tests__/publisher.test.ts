import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ScoredArticle } from '../scorer.js'
import type { ProcessedArticle } from '../types.js'

// Mock Supabase before importing publisher
vi.mock('../supabase.js', () => ({
  createPipelineClient: vi.fn(() => ({
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({ error: null })),
    })),
  })),
}))

const { publishCards } = await import('../publisher.js')

function makeScoredArticle(overrides: Partial<ProcessedArticle> = {}): ScoredArticle {
  return {
    article: {
      title: 'Test Article',
      teaser: 'A test teaser for the article.',
      keyPoints: ['Point one', 'Point two'],
      sourceUrl: 'https://example.com/article',
      sourceName: 'Test Source',
      category: 'Industry',
      visualType: null,
      visualData: null,
      publishedAt: new Date().toISOString(),
      sourceHash: 'sha256-abc123def4',
      ...overrides,
    },
    score: 75,
  }
}

describe('publishCards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns published cards with correct field mapping', async () => {
    const scored = [makeScoredArticle()]
    const cards = await publishCards(scored)

    expect(cards).toHaveLength(1)
    expect(cards[0].title).toBe('Test Article')
    expect(cards[0].teaser).toBe('A test teaser for the article.')
    expect(cards[0].key_points).toEqual(['Point one', 'Point two'])
    expect(cards[0].source_url).toBe('https://example.com/article')
    expect(cards[0].source_name).toBe('Test Source')
    expect(cards[0].category).toBe('Industry')
    expect(cards[0].status).toBe('published')
    expect(cards[0].locale).toBe('en')
  })

  it('sets relevance_score from normalized score', async () => {
    const scored = [{ ...makeScoredArticle(), score: 80 }]
    const cards = await publishCards(scored)
    expect(cards[0].relevance_score).toBe(0.8)
  })

  it('generates UUID for card id', async () => {
    const cards = await publishCards([makeScoredArticle()])
    expect(cards[0].id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  })

  it('returns empty array for empty input', async () => {
    const cards = await publishCards([])
    expect(cards).toEqual([])
  })

  it('sets image_url to null', async () => {
    const cards = await publishCards([makeScoredArticle()])
    expect(cards[0].image_url).toBeNull()
  })
})
