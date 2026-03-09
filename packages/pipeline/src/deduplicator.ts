// ---------------------------------------------------------------------------
// Article Deduplicator
// Stage 1: URL hash (exact match)
// Stage 2: Title similarity (Jaccard on word tokens)
// ---------------------------------------------------------------------------

import type { RawArticle } from './types.js'

/**
 * Tokenize a string into lowercase word tokens.
 * Removes punctuation and common stop words.
 */
function tokenize(text: string): Set<string> {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at',
    'to', 'for', 'of', 'and', 'or', 'but', 'with', 'by', 'from', 'as',
    'it', 'its', 'this', 'that', 'has', 'have', 'had', 'be', 'been',
  ])

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w))

  return new Set(words)
}

/**
 * Compute Jaccard similarity between two sets.
 * Returns a value between 0 (no overlap) and 1 (identical).
 */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1

  let intersectionSize = 0
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionSize++
    }
  }

  const unionSize = setA.size + setB.size - intersectionSize
  if (unionSize === 0) return 1

  return intersectionSize / unionSize
}

/**
 * Deduplicate articles using URL matching and title similarity.
 *
 * @param articles - Raw articles to deduplicate
 * @param similarityThreshold - Jaccard threshold for title similarity (default 0.7)
 * @returns Deduplicated articles (keeps earliest published version)
 */
export function deduplicateArticles(
  articles: RawArticle[],
  similarityThreshold: number = 0.7
): RawArticle[] {
  // Sort by published date ascending (keep earliest)
  const sorted = [...articles].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  )

  // Stage 1: URL hash dedup
  const seenUrls = new Set<string>()
  const afterUrlDedup: RawArticle[] = []

  for (const article of sorted) {
    const normalizedUrl = article.url.toLowerCase().replace(/\/$/, '')
    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.add(normalizedUrl)
      afterUrlDedup.push(article)
    }
  }

  console.log(
    `[dedup] URL dedup: ${articles.length} -> ${afterUrlDedup.length} articles`
  )

  // Stage 2: Title similarity dedup
  const kept: RawArticle[] = []
  const keptTokens: Set<string>[] = []

  for (const article of afterUrlDedup) {
    const tokens = tokenize(article.title)
    let isDuplicate = false

    for (const existingTokens of keptTokens) {
      const similarity = jaccardSimilarity(tokens, existingTokens)
      if (similarity >= similarityThreshold) {
        isDuplicate = true
        break
      }
    }

    if (!isDuplicate) {
      kept.push(article)
      keptTokens.push(tokens)
    }
  }

  console.log(
    `[dedup] Title similarity dedup: ${afterUrlDedup.length} -> ${kept.length} articles`
  )

  return kept
}
