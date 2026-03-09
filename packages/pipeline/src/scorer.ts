// ---------------------------------------------------------------------------
// Article Scorer
// Weighted scoring algorithm: recency, authority, engagement, visuals, novelty
// ---------------------------------------------------------------------------

import type { ProcessedArticle, ScoringWeights, FeedSource } from './types.js'

/** Default scoring weights */
export const DEFAULT_WEIGHTS: ScoringWeights = {
  recency: 0.35,
  sourceAuthority: 0.25,
  engagementProxy: 0.2,
  visualRichness: 0.1,
  novelty: 0.1,
}

/** 24 hours in milliseconds */
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

/**
 * Calculate recency score (0-1).
 * Articles from the last 24h get the highest scores, with exponential decay.
 */
function recencyScore(publishedAt: string): number {
  const now = Date.now()
  const published = new Date(publishedAt).getTime()
  const ageMs = now - published

  if (ageMs <= 0) return 1

  // Exponential decay: half-life of 12 hours
  const halfLife = TWENTY_FOUR_HOURS_MS / 2
  return Math.max(0, Math.exp((-ageMs * Math.LN2) / halfLife))
}

/**
 * Get source authority score (0-1) from feed configuration.
 */
function sourceAuthorityScore(
  sourceName: string,
  feeds: FeedSource[]
): number {
  const feed = feeds.find(
    (f) => f.name.toLowerCase() === sourceName.toLowerCase()
  )
  return feed?.authorityWeight ?? 0.5
}

/**
 * Placeholder engagement proxy (0-1).
 * In production, this would use social signals, click data, etc.
 */
function engagementProxyScore(): number {
  return 0.5
}

/**
 * Visual richness score (0-1).
 * Articles with visual data score higher.
 */
function visualRichnessScore(article: ProcessedArticle): number {
  if (article.visualData !== null && article.visualType !== null) {
    return 1.0
  }
  return 0.2
}

/**
 * Novelty score (0-1).
 * Measures how different this article is from others in the batch.
 * Simple implementation: uses title word diversity.
 */
function noveltyScore(
  article: ProcessedArticle,
  allArticles: ProcessedArticle[]
): number {
  if (allArticles.length <= 1) return 1.0

  const words = new Set(article.title.toLowerCase().split(/\s+/))
  let totalSimilarity = 0
  let comparisons = 0

  for (const other of allArticles) {
    if (other.sourceHash === article.sourceHash) continue

    const otherWords = new Set(other.title.toLowerCase().split(/\s+/))
    let overlap = 0
    for (const word of words) {
      if (otherWords.has(word)) overlap++
    }

    const unionSize = new Set([...words, ...otherWords]).size
    if (unionSize > 0) {
      totalSimilarity += overlap / unionSize
      comparisons++
    }
  }

  if (comparisons === 0) return 1.0

  // Invert: less similar = more novel
  const avgSimilarity = totalSimilarity / comparisons
  return 1.0 - avgSimilarity
}

/**
 * Score a single article using the weighted algorithm.
 * Returns a score from 0-100.
 */
function scoreArticle(
  article: ProcessedArticle,
  allArticles: ProcessedArticle[],
  feeds: FeedSource[],
  weights: ScoringWeights
): number {
  const components = {
    recency: recencyScore(article.publishedAt) * weights.recency,
    sourceAuthority:
      sourceAuthorityScore(article.sourceName, feeds) * weights.sourceAuthority,
    engagementProxy: engagementProxyScore() * weights.engagementProxy,
    visualRichness: visualRichnessScore(article) * weights.visualRichness,
    novelty: noveltyScore(article, allArticles) * weights.novelty,
  }

  const rawScore =
    components.recency +
    components.sourceAuthority +
    components.engagementProxy +
    components.visualRichness +
    components.novelty

  // Normalize to 0-100
  return Math.round(rawScore * 100)
}

export interface ScoredArticle {
  article: ProcessedArticle
  score: number
}

/**
 * Score all articles and return them sorted by score (highest first).
 */
export function scoreArticles(
  articles: ProcessedArticle[],
  feeds: FeedSource[],
  weights: ScoringWeights = DEFAULT_WEIGHTS
): ScoredArticle[] {
  const scored: ScoredArticle[] = articles.map((article) => ({
    article,
    score: scoreArticle(article, articles, feeds, weights),
  }))

  scored.sort((a, b) => b.score - a.score)

  console.log(
    `[scorer] Scored ${scored.length} articles ` +
      `(top: ${scored[0]?.score ?? 0}, bottom: ${scored[scored.length - 1]?.score ?? 0})`
  )

  return scored
}
