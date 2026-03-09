// ---------------------------------------------------------------------------
// Article Summarizer
// Placeholder implementation that generates mock summaries.
// In production, this would call Claude Haiku API.
// ---------------------------------------------------------------------------

import { createHash } from 'node:crypto'
import type { RawArticle, ProcessedArticle, CardCategory, VisualType } from './types.js'

/** Visual types to randomly assign */
const VISUAL_TYPES: (VisualType | null)[] = ['bar', 'line', 'stat', 'vs', null]

/** Category detection keywords */
const CATEGORY_KEYWORDS: Array<{ category: CardCategory; keywords: string[] }> = [
  { category: 'OpenAI', keywords: ['openai', 'gpt', 'chatgpt', 'dall-e', 'sora'] },
  { category: 'Anthropic', keywords: ['anthropic', 'claude'] },
  { category: 'Google', keywords: ['google', 'gemini', 'deepmind', 'bard'] },
  { category: 'Meta', keywords: ['meta', 'llama', 'facebook'] },
  { category: 'Open Source', keywords: ['open source', 'open-source', 'hugging face', 'huggingface', 'mistral', 'deepseek'] },
  { category: 'Research', keywords: ['arxiv', 'paper', 'research', 'study', 'findings'] },
  { category: 'Startups', keywords: ['startup', 'funding', 'series', 'raised', 'valuation'] },
  { category: 'Tools', keywords: ['tool', 'ide', 'editor', 'plugin', 'extension', 'cursor', 'copilot'] },
  { category: 'Policy', keywords: ['regulation', 'policy', 'eu', 'act', 'law', 'govern', 'compliance'] },
  { category: 'Industry', keywords: ['enterprise', 'industry', 'market', 'revenue', 'billion', 'adoption'] },
]

/**
 * Detect the most likely category for an article based on keywords.
 */
function detectCategory(text: string): CardCategory {
  const lower = text.toLowerCase()
  let bestMatch: CardCategory = 'Industry'
  let bestScore = 0

  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    let score = 0
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score++
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = category
    }
  }

  return bestMatch
}

/**
 * Truncate text to a maximum length, appending ellipsis if needed.
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3).trimEnd() + '...'
}

/**
 * Generate a deterministic hash for an article URL.
 */
function generateSourceHash(url: string): string {
  return `sha256-${createHash('sha256').update(url).digest('hex').slice(0, 12)}`
}

/**
 * Generate mock visual data based on visual type.
 */
function generateMockVisualData(visualType: VisualType | null): Record<string, unknown> | null {
  if (visualType === null) return null

  switch (visualType) {
    case 'stat':
      return {
        value: '42%',
        label: 'Key metric from article',
      }
    case 'bar':
      return {
        label: 'Comparison',
        items: [
          { name: 'Model A', value: 92 },
          { name: 'Model B', value: 87 },
          { name: 'Model C', value: 84 },
        ],
      }
    case 'line':
      return {
        label: 'Trend',
        series: [
          {
            name: 'Growth',
            points: [
              { x: 'Q1', y: 20 },
              { x: 'Q2', y: 35 },
              { x: 'Q3', y: 55 },
              { x: 'Q4', y: 78 },
            ],
          },
        ],
      }
    case 'vs':
      return {
        left: { name: 'Option A', metrics: { Score: 91, Cost: 5 } },
        right: { name: 'Option B', metrics: { Score: 88, Cost: 3 } },
      }
  }
}

/**
 * Generate mock key points from an article description.
 */
function generateMockKeyPoints(description: string): string[] {
  const sentences = description
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15)

  if (sentences.length >= 3) {
    return sentences.slice(0, 3).map((s) => truncate(s, 120))
  }

  // Fall back to generated points
  return [
    truncate(description, 120),
    'Further details expected as the story develops.',
    'Industry analysts are watching closely for broader impact.',
  ]
}

/**
 * Summarize a single article.
 * Placeholder: generates mock summaries. Production would use Claude Haiku.
 */
function summarizeArticle(article: RawArticle): ProcessedArticle {
  const combinedText = `${article.title} ${article.description}`
  const category = detectCategory(combinedText)

  // Deterministic visual type selection based on URL hash
  const hashNum = createHash('md5').update(article.url).digest()[0]
  const visualType = VISUAL_TYPES[hashNum % VISUAL_TYPES.length] ?? null

  return {
    title: truncate(article.title, 47),
    teaser: truncate(article.description, 81),
    keyPoints: generateMockKeyPoints(article.description),
    sourceUrl: article.url,
    sourceName: article.sourceName,
    category,
    visualType,
    visualData: generateMockVisualData(visualType),
    publishedAt: article.publishedAt,
    sourceHash: generateSourceHash(article.url),
  }
}

/**
 * Summarize all validated articles.
 * In production, this would batch-call Claude Haiku API.
 *
 * @returns Array of processed articles with summaries
 */
export function summarizeArticles(articles: RawArticle[]): ProcessedArticle[] {
  const processed = articles.map(summarizeArticle)
  console.log(`[summarizer] Summarized ${processed.length} articles`)
  return processed
}
