import { describe, it, expect } from 'vitest'
import { scoreArticles } from '../scorer.js'
import type { ProcessedArticle, FeedSource } from '../types.js'

const FEEDS: FeedSource[] = [
  { name: 'TechCrunch AI', url: 'https://tc.com', authorityWeight: 0.9 },
  { name: 'OpenAI Blog', url: 'https://openai.com', authorityWeight: 1.0 },
]

function makeProcessed(overrides: Partial<ProcessedArticle> = {}): ProcessedArticle {
  return {
    title: 'Test Article',
    teaser: 'A test teaser',
    keyPoints: ['Point 1', 'Point 2'],
    sourceUrl: 'https://example.com/article',
    sourceName: 'TechCrunch AI',
    category: 'Industry',
    visualType: null,
    visualData: null,
    publishedAt: new Date().toISOString(),
    sourceHash: 'sha256-abc123',
    ...overrides,
  }
}

describe('scoreArticles', () => {
  it('returns scored articles sorted by score descending', () => {
    const articles = [
      makeProcessed({
        title: 'Old article',
        publishedAt: '2024-01-01T00:00:00Z',
        sourceHash: 'hash-1',
      }),
      makeProcessed({
        title: 'Recent article',
        publishedAt: new Date().toISOString(),
        sourceHash: 'hash-2',
      }),
    ]

    const scored = scoreArticles(articles, FEEDS)
    expect(scored).toHaveLength(2)
    expect(scored[0].score).toBeGreaterThanOrEqual(scored[1].score)
    // Recent article should score higher
    expect(scored[0].article.title).toBe('Recent article')
  })

  it('returns scores in 0-100 range', () => {
    const articles = [makeProcessed()]
    const scored = scoreArticles(articles, FEEDS)
    expect(scored[0].score).toBeGreaterThanOrEqual(0)
    expect(scored[0].score).toBeLessThanOrEqual(100)
  })

  it('gives higher scores to articles with visual data', () => {
    const withVisual = makeProcessed({
      title: 'Visual article with charts',
      sourceHash: 'hash-v',
      visualType: 'bar',
      visualData: { label: 'Test', items: [{ name: 'A', value: 1 }] },
    })
    const withoutVisual = makeProcessed({
      title: 'Plain text article here',
      sourceHash: 'hash-p',
      visualType: null,
      visualData: null,
    })

    const scored = scoreArticles([withVisual, withoutVisual], FEEDS)
    const visualScore = scored.find((s) => s.article.sourceHash === 'hash-v')!.score
    const plainScore = scored.find((s) => s.article.sourceHash === 'hash-p')!.score
    expect(visualScore).toBeGreaterThan(plainScore)
  })

  it('gives higher authority score to known sources', () => {
    const known = makeProcessed({
      title: 'Article from known source blog',
      sourceName: 'OpenAI Blog',
      sourceHash: 'hash-k',
    })
    const unknown = makeProcessed({
      title: 'Article from unknown random source',
      sourceName: 'Random Blog',
      sourceHash: 'hash-u',
    })

    const scored = scoreArticles([known, unknown], FEEDS)
    const knownScore = scored.find((s) => s.article.sourceHash === 'hash-k')!.score
    const unknownScore = scored.find((s) => s.article.sourceHash === 'hash-u')!.score
    expect(knownScore).toBeGreaterThan(unknownScore)
  })

  it('handles empty input', () => {
    expect(scoreArticles([], FEEDS)).toEqual([])
  })

  it('handles single article', () => {
    const scored = scoreArticles([makeProcessed()], FEEDS)
    expect(scored).toHaveLength(1)
    expect(scored[0].score).toBeGreaterThan(0)
  })
})
