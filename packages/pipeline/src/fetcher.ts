// ---------------------------------------------------------------------------
// RSS Feed Fetcher
// Fetches and parses RSS/Atom feeds using built-in fetch + lightweight XML parsing
// ---------------------------------------------------------------------------

import type { RawArticle, FeedSource } from './types.js'

/** Default RSS feed sources for AI news */
export const DEFAULT_FEEDS: FeedSource[] = [
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    authorityWeight: 0.9,
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    authorityWeight: 0.85,
  },
  {
    name: 'Ars Technica AI',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    authorityWeight: 0.85,
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    authorityWeight: 0.95,
  },
]

/**
 * Extract text content between XML tags.
 * Handles CDATA sections and basic HTML entity decoding.
 */
function extractTagContent(xml: string, tag: string): string | null {
  // Try with namespace prefix first (e.g., <content:encoded>)
  const patterns = [
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i'),
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'),
  ]

  for (const pattern of patterns) {
    const match = xml.match(pattern)
    if (match?.[1]) {
      return decodeXmlEntities(match[1].trim())
    }
  }

  return null
}

/** Decode common XML/HTML entities */
function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

/** Strip HTML tags from a string */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

/** Parse RSS/Atom XML into RawArticle array */
function parseRssFeed(xml: string, sourceName: string): RawArticle[] {
  const articles: RawArticle[] = []

  // Split by <item> (RSS 2.0) or <entry> (Atom)
  const itemPattern = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi
  let match: RegExpExecArray | null = itemPattern.exec(xml)

  while (match !== null) {
    const itemXml = match[1]

    const title = extractTagContent(itemXml, 'title')
    const link =
      extractTagContent(itemXml, 'link') ??
      extractAtomLink(itemXml)
    const description =
      extractTagContent(itemXml, 'description') ??
      extractTagContent(itemXml, 'summary') ??
      extractTagContent(itemXml, 'content') ??
      ''
    const pubDate =
      extractTagContent(itemXml, 'pubDate') ??
      extractTagContent(itemXml, 'published') ??
      extractTagContent(itemXml, 'updated') ??
      new Date().toISOString()

    if (title && link) {
      articles.push({
        title: stripHtml(title),
        url: link.trim(),
        description: stripHtml(description),
        publishedAt: normalizeDate(pubDate),
        sourceName,
      })
    }

    match = itemPattern.exec(xml)
  }

  return articles
}

/** Extract href from Atom-style <link> elements */
function extractAtomLink(xml: string): string | null {
  const match = xml.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i)
  return match?.[1] ?? null
}

/** Normalize various date formats to ISO string */
function normalizeDate(dateStr: string): string {
  const parsed = new Date(dateStr)
  if (isNaN(parsed.getTime())) {
    return new Date().toISOString()
  }
  return parsed.toISOString()
}

/** Fetch a single RSS feed and return parsed articles */
async function fetchSingleFeed(feed: FeedSource): Promise<RawArticle[]> {
  try {
    const response = await fetch(feed.url, {
      headers: {
        'User-Agent': 'bytesyze-pipeline/0.0.1',
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
      console.warn(`[fetcher] Failed to fetch ${feed.name}: HTTP ${response.status}`)
      return []
    }

    const xml = await response.text()
    const articles = parseRssFeed(xml, feed.name)
    console.log(`[fetcher] ${feed.name}: ${articles.length} articles`)
    return articles
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[fetcher] Error fetching ${feed.name}: ${message}`)
    return []
  }
}

/**
 * Fetch articles from all configured RSS feeds in parallel.
 */
export async function fetchArticles(feeds: FeedSource[]): Promise<RawArticle[]> {
  const results = await Promise.allSettled(
    feeds.map((feed) => fetchSingleFeed(feed))
  )

  const articles: RawArticle[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value)
    }
  }

  return articles
}
