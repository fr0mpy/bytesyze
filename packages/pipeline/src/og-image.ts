// ---------------------------------------------------------------------------
// OG Image Extractor
// Fetches article URLs and extracts Open Graph image meta tags
// ---------------------------------------------------------------------------

import type { ScoredArticle } from './scorer.js'
import { OG_IMAGE_TIMEOUT_MS, OG_IMAGE_MAX_URL_LENGTH, OG_IMAGE_BATCH_SIZE, OG_IMAGE_MAX_HTML_LENGTH, USER_AGENT } from './config.js'

/**
 * Extract og:image or twitter:image URL from HTML head.
 */
function extractImageUrl(html: string): string | null {
  // Only parse the <head> section for performance
  const headMatch = html.match(/<head[\s>]([\s\S]*?)<\/head>/i)
  const headHtml = headMatch?.[1] ?? html.slice(0, OG_IMAGE_MAX_HTML_LENGTH)

  // Try og:image first, then twitter:image
  const patterns = [
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*\/?>/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*\/?>/i,
    /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*\/?>/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["'][^>]*\/?>/i,
  ]

  for (const pattern of patterns) {
    const match = headHtml.match(pattern)
    if (match?.[1]) {
      const url = match[1].trim()
      if (isValidImageUrl(url)) {
        return url
      }
    }
  }

  return null
}

/**
 * Validate an image URL.
 */
function isValidImageUrl(url: string): boolean {
  if (url.length > OG_IMAGE_MAX_URL_LENGTH) return false
  if (!url.startsWith('https://') && !url.startsWith('http://')) return false
  return true
}

/**
 * Fetch OG image for a single article URL.
 * Returns null on any failure (non-blocking).
 */
async function fetchOgImage(sourceUrl: string): Promise<string | null> {
  try {
    const response = await fetch(sourceUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(OG_IMAGE_TIMEOUT_MS),
      redirect: 'follow',
    })

    if (!response.ok) return null

    // Only read enough to get the <head> section
    const text = await response.text()
    return extractImageUrl(text)
  } catch {
    return null
  }
}

/**
 * Enrich scored articles with OG images from their source URLs.
 * Processes in batches to avoid thundering herd.
 * Non-blocking: failures leave imageUrl undefined.
 */
export async function enrichWithOgImages(
  scored: ScoredArticle[]
): Promise<ScoredArticle[]> {
  if (scored.length === 0) return scored

  const enriched = [...scored]

  for (let i = 0; i < enriched.length; i += OG_IMAGE_BATCH_SIZE) {
    const batch = enriched.slice(i, i + OG_IMAGE_BATCH_SIZE)
    const results = await Promise.allSettled(
      batch.map((s) => fetchOgImage(s.article.sourceUrl))
    )

    for (let j = 0; j < results.length; j++) {
      const result = results[j]
      if (result.status === 'fulfilled' && result.value) {
        enriched[i + j] = {
          ...enriched[i + j],
          imageUrl: result.value,
        }
      }
    }
  }

  const withImages = enriched.filter((s) => s.imageUrl).length
  console.log(`[og-image] Extracted ${withImages}/${enriched.length} OG images`)

  return enriched
}
