// ---------------------------------------------------------------------------
// Full-Text Content Fetcher
// Fetches article HTML and extracts body text for better summarization
// ---------------------------------------------------------------------------

import type { RawArticle } from './types.js'
import {
  FULL_TEXT_TIMEOUT_MS,
  FULL_TEXT_MAX_LENGTH,
  FULL_TEXT_BATCH_SIZE,
  FULL_TEXT_SKIP_THRESHOLD,
  FULL_TEXT_MIN_CONTENT_LENGTH,
  USER_AGENT,
} from './config.js'

/**
 * Extract article body text from HTML.
 * Looks for <article>, <main>, or [role="main"], falls back to largest text block.
 */
function extractBodyText(html: string): string {
  // Try semantic elements first
  const patterns = [
    /<article[\s>]([\s\S]*?)<\/article>/i,
    /<main[\s>]([\s\S]*?)<\/main>/i,
    /<div[^>]*role=["']main["'][^>]*>([\s\S]*?)<\/div>/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) {
      const text = stripHtml(match[1])
      if (text.length > FULL_TEXT_MIN_CONTENT_LENGTH) return text
    }
  }

  // Fallback: strip everything and take what we get
  return stripHtml(html)
}

/**
 * Strip HTML tags, scripts, styles, and collapse whitespace.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Fetch full text for a single article.
 * Returns null on failure.
 */
async function fetchFullText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(FULL_TEXT_TIMEOUT_MS),
      redirect: 'follow',
    })

    if (!response.ok) return null

    const html = await response.text()
    const text = extractBodyText(html)

    if (text.length < 100) return null

    return text.slice(0, FULL_TEXT_MAX_LENGTH)
  } catch {
    return null
  }
}

/**
 * Enrich articles with full-text content from their source URLs.
 * Skips articles that already have long descriptions (RSS full content).
 * Non-blocking: failures leave fullText undefined.
 */
export async function enrichWithFullText(
  articles: RawArticle[]
): Promise<RawArticle[]> {
  if (articles.length === 0) return articles

  const enriched = [...articles]

  for (let i = 0; i < enriched.length; i += FULL_TEXT_BATCH_SIZE) {
    const batch = enriched.slice(i, i + FULL_TEXT_BATCH_SIZE)
    const results = await Promise.allSettled(
      batch.map((article) => {
        // Skip if description is already long enough
        if (article.description.length >= FULL_TEXT_SKIP_THRESHOLD) {
          return Promise.resolve(null)
        }
        return fetchFullText(article.url)
      })
    )

    for (let j = 0; j < results.length; j++) {
      const result = results[j]
      if (result.status === 'fulfilled' && result.value) {
        enriched[i + j] = {
          ...enriched[i + j],
          fullText: result.value,
        }
      }
    }
  }

  const withFullText = enriched.filter((a) => a.fullText).length
  console.log(
    `[full-text] Enriched ${withFullText}/${enriched.length} articles with full text`
  )

  return enriched
}
