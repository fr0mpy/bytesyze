import { describe, it, expect } from 'vitest'
import { tokenize, jaccardSimilarity, deduplicateArticles } from '../deduplicator.js'
import type { RawArticle } from '../types.js'

function makeArticle(overrides: Partial<RawArticle> = {}): RawArticle {
  return {
    title: 'Test Article',
    url: 'https://example.com/article',
    description: 'A test article description for testing purposes.',
    publishedAt: new Date().toISOString(),
    sourceName: 'Test Source',
    ...overrides,
  }
}

describe('tokenize', () => {
  it('lowercases and splits words', () => {
    const tokens = tokenize('Hello World')
    expect(tokens.has('hello')).toBe(true)
    expect(tokens.has('world')).toBe(true)
  })

  it('removes stop words', () => {
    const tokens = tokenize('The cat is on the mat')
    expect(tokens.has('the')).toBe(false)
    expect(tokens.has('is')).toBe(false)
    expect(tokens.has('on')).toBe(false)
    expect(tokens.has('cat')).toBe(true)
    expect(tokens.has('mat')).toBe(true)
  })

  it('removes punctuation', () => {
    const tokens = tokenize("AI's future: bright!")
    expect(tokens.has('ais')).toBe(true)
    expect(tokens.has('future')).toBe(true)
    expect(tokens.has('bright')).toBe(true)
  })

  it('removes single-character words', () => {
    const tokens = tokenize('I am a test')
    expect(tokens.has('i')).toBe(false)
    expect(tokens.has('a')).toBe(false)
  })

  it('returns empty set for empty string', () => {
    expect(tokenize('').size).toBe(0)
  })
})

describe('jaccardSimilarity', () => {
  it('returns 1 for identical sets', () => {
    const set = new Set(['a', 'b', 'c'])
    expect(jaccardSimilarity(set, set)).toBe(1)
  })

  it('returns 0 for disjoint sets', () => {
    const a = new Set(['a', 'b'])
    const b = new Set(['c', 'd'])
    expect(jaccardSimilarity(a, b)).toBe(0)
  })

  it('returns correct value for partial overlap', () => {
    const a = new Set(['a', 'b', 'c'])
    const b = new Set(['b', 'c', 'd'])
    // intersection = {b, c} = 2, union = {a, b, c, d} = 4
    expect(jaccardSimilarity(a, b)).toBe(0.5)
  })

  it('returns 1 for two empty sets', () => {
    expect(jaccardSimilarity(new Set(), new Set())).toBe(1)
  })
})

describe('deduplicateArticles', () => {
  it('removes exact URL duplicates', () => {
    const articles = [
      makeArticle({ url: 'https://example.com/1', title: 'Article One' }),
      makeArticle({ url: 'https://example.com/1', title: 'Article One Copy' }),
      makeArticle({ url: 'https://example.com/2', title: 'Article Two' }),
    ]
    const result = deduplicateArticles(articles)
    expect(result).toHaveLength(2)
  })

  it('normalizes URLs (trailing slash, case)', () => {
    const articles = [
      makeArticle({ url: 'https://example.com/page/', title: 'Page' }),
      makeArticle({ url: 'https://example.com/page', title: 'Page Copy' }),
    ]
    const result = deduplicateArticles(articles)
    expect(result).toHaveLength(1)
  })

  it('removes articles with similar titles above threshold', () => {
    const articles = [
      makeArticle({ url: 'https://a.com/1', title: 'OpenAI Releases GPT-5 Model' }),
      makeArticle({ url: 'https://b.com/2', title: 'OpenAI Releases GPT-5 Model Today' }),
    ]
    const result = deduplicateArticles(articles, 0.7)
    expect(result).toHaveLength(1)
  })

  it('keeps articles with different titles', () => {
    const articles = [
      makeArticle({ url: 'https://a.com/1', title: 'OpenAI Releases GPT-5 Model' }),
      makeArticle({ url: 'https://b.com/2', title: 'Google Launches New Gemini Features' }),
    ]
    const result = deduplicateArticles(articles, 0.7)
    expect(result).toHaveLength(2)
  })

  it('keeps earliest published version', () => {
    const articles = [
      makeArticle({
        url: 'https://b.com/later',
        title: 'Same News Story',
        publishedAt: '2025-01-02T00:00:00Z',
      }),
      makeArticle({
        url: 'https://a.com/earlier',
        title: 'Same News Story Reported',
        publishedAt: '2025-01-01T00:00:00Z',
      }),
    ]
    const result = deduplicateArticles(articles, 0.7)
    expect(result).toHaveLength(1)
    expect(result[0].url).toBe('https://a.com/earlier')
  })

  it('returns empty array for empty input', () => {
    expect(deduplicateArticles([])).toEqual([])
  })
})
