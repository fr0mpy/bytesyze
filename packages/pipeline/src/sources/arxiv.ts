// ---------------------------------------------------------------------------
// arXiv Fetcher
// Fetches recent AI/ML/NLP papers from arXiv Atom API
// ---------------------------------------------------------------------------

import type { RawArticle } from '../types.js'
import { USER_AGENT, REQUEST_TIMEOUT_MS, ARXIV_API_BASE, ARXIV_CATEGORIES, ARXIV_MAX_RESULTS, ARXIV_MAX_AUTHORS } from '../config.js'

const ARXIV_QUERY_URL = `${ARXIV_API_BASE}?search_query=${ARXIV_CATEGORIES.map((c) => `cat:${c}`).join('+OR+')}&sortBy=submittedDate&sortOrder=descending&max_results=${ARXIV_MAX_RESULTS}`

/**
 * Extract text content between XML tags.
 * Handles CDATA sections and basic entity decoding.
 */
function extractTagContent(xml: string, tag: string): string | null {
  const patterns = [
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i'),
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'),
  ]

  for (const pattern of patterns) {
    const match = xml.match(pattern)
    if (match?.[1]) {
      return match[1].trim()
    }
  }

  return null
}

/** Extract href from Atom-style <link> elements (prefer alternate) */
function extractAtomLink(xml: string): string | null {
  // Prefer rel="alternate" link
  const altMatch = xml.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["'][^>]*\/?>/i)
  if (altMatch?.[1]) return altMatch[1]

  // Fallback to first link with href
  const match = xml.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i)
  return match?.[1] ?? null
}

/** Extract author names from <author><name>...</name></author> blocks */
function extractAuthors(xml: string): string[] {
  const authors: string[] = []
  const authorPattern = /<author>\s*<name>([^<]+)<\/name>/gi
  let match = authorPattern.exec(xml)
  while (match !== null) {
    authors.push(match[1].trim())
    match = authorPattern.exec(xml)
  }
  return authors
}

/**
 * Fetch recent AI/ML papers from arXiv.
 *
 * Queries cs.AI, cs.CL (Computation and Language), and cs.LG (Machine Learning)
 * categories sorted by submission date.
 */
export async function fetchArxiv(): Promise<RawArticle[]> {
  try {
    const response = await fetch(ARXIV_QUERY_URL, {
      headers: {
        'User-Agent': USER_AGENT,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      console.warn(`[arxiv] Failed to fetch: HTTP ${response.status}`)
      return []
    }

    const xml = await response.text()
    const articles: RawArticle[] = []

    // Split by <entry> (Atom format)
    const entryPattern = /<entry>([\s\S]*?)<\/entry>/gi
    let match = entryPattern.exec(xml)

    while (match !== null) {
      const entryXml = match[1]

      const rawTitle = extractTagContent(entryXml, 'title')
      const summary = extractTagContent(entryXml, 'summary')
      const link = extractAtomLink(entryXml)
      const published = extractTagContent(entryXml, 'published')
      const authors = extractAuthors(entryXml)

      if (rawTitle && link) {
        // Strip newlines from title and trim whitespace
        const title = rawTitle.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
        const description = summary
          ? summary.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
          : title

        const authorSuffix = authors.length > 0
          ? ` (${authors.slice(0, ARXIV_MAX_AUTHORS).join(', ')}${authors.length > ARXIV_MAX_AUTHORS ? ' et al.' : ''})`
          : ''

        articles.push({
          title: `${title}${authorSuffix}`,
          url: link.trim(),
          description,
          publishedAt: published ? new Date(published).toISOString() : new Date().toISOString(),
          sourceName: 'arXiv',
          sourceType: 'arxiv',
        })
      }

      match = entryPattern.exec(xml)
    }

    console.log(`[arxiv] ${articles.length} papers fetched`)
    return articles
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[arxiv] Error: ${message}`)
    return []
  }
}
