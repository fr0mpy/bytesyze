// ---------------------------------------------------------------------------
// Article Summarizer
// Uses Claude Haiku API to generate summaries with editorial voice.
// Falls back to keyword-based mock logic on API failure.
// ---------------------------------------------------------------------------

import { createHash } from 'node:crypto'
import Anthropic from '@anthropic-ai/sdk'
import type { RawArticle, ProcessedArticle, CardCategory, VisualType } from './types.js'
import {
  MODELS,
  SUMMARIZER_BATCH_SIZE,
  SUMMARIZER_MAX_TOKENS,
  SUMMARIZER_TEMPERATURE,
  TITLE_MAX_LENGTH,
  TEASER_MAX_LENGTH,
  KEY_POINTS_MAX_LENGTH,
  KEY_POINTS_MAX_COUNT,
  VALID_CATEGORIES,
  VALID_VISUAL_TYPES,
  CATEGORY_KEYWORDS,
} from './config.js'

const SYSTEM_PROMPT = `You are a news summarizer for bytesyze.ai, an AI news app for non-technical readers.

## Editorial Voice
- Confident, not hedging. "OpenAI shipped GPT-5" not "It appears OpenAI may have released"
- Concise. Every word earns its place.
- Slightly opinionated. "The big deal here is..."
- Accessible to non-technical readers. Explain jargon in parentheses on first use.
- Never clickbait, never sycophantic.

## Copyright Rules
- NEVER reproduce the original headline verbatim.
- NEVER mirror the source article's narrative structure.
- Extract facts only. Reframe in original language.
- Key points are self-contained insights, not paraphrased source sentences.
- Max one short phrase (under 10 words) from the original text.

## Visual Detection
If the article contains quantitative data:
- Benchmarks, rankings, scores → visual_type: "bar"
- Growth over time, trend data → visual_type: "line"
- Head-to-head comparisons → visual_type: "vs"
- Single striking metric → visual_type: "stat"
- Qualitative content (no numbers) → visual_type: null

Output ONLY valid JSON matching this schema:
{
  "title": "string (max 47 chars, compelling headline)",
  "teaser": "string (max 81 chars, one-line plain English explanation)",
  "keyPoints": ["2-3 strings, each a standalone insight for non-technical readers"],
  "category": "OpenAI|Anthropic|Google|Meta|Open Source|Research|Startups|Tools|Policy|Industry",
  "visualType": "bar|line|vs|stat" or null,
  "visualData": { schema matching visualType } or null
}

Visual data schemas:
- bar: { "label": "string", "items": [{"name": "string", "value": number}] }
- line: { "label": "string", "series": [{"name": "string", "points": [{"x": "string", "y": number}]}] }
- vs: { "left": {"name": "string", "metrics": {...}}, "right": {"name": "string", "metrics": {...}} }
- stat: { "value": "string", "label": "string" }`

/** Visual types for mock fallback */
const VISUAL_TYPES: (VisualType | null)[] = ['bar', 'line', 'stat', 'vs', null]

/** Batch size for concurrent API calls */
const BATCH_SIZE = SUMMARIZER_BATCH_SIZE

// ---------------------------------------------------------------------------
// Fallback helpers (used when API call fails)
// ---------------------------------------------------------------------------

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

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3).trimEnd() + '...'
}

function generateMockKeyPoints(description: string): string[] {
  const sentences = description
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15)

  if (sentences.length >= 3) {
    return sentences.slice(0, KEY_POINTS_MAX_COUNT).map((s) => truncate(s, KEY_POINTS_MAX_LENGTH))
  }

  return [
    truncate(description, KEY_POINTS_MAX_LENGTH),
    'Further details expected as the story develops.',
    'Industry analysts are watching closely for broader impact.',
  ]
}

function generateMockVisualData(visualType: VisualType | null): Record<string, unknown> | null {
  if (visualType === null) return null

  switch (visualType) {
    case 'stat':
      return { value: '42%', label: 'Key metric from article' }
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
        series: [{
          name: 'Growth',
          points: [
            { x: 'Q1', y: 20 },
            { x: 'Q2', y: 35 },
            { x: 'Q3', y: 55 },
            { x: 'Q4', y: 78 },
          ],
        }],
      }
    case 'vs':
      return {
        left: { name: 'Option A', metrics: { Score: 91, Cost: 5 } },
        right: { name: 'Option B', metrics: { Score: 88, Cost: 3 } },
      }
  }
}

/**
 * Generate mock summary when API is unavailable.
 */
function mockSummarize(article: RawArticle): Omit<ProcessedArticle, 'sourceUrl' | 'sourceName' | 'publishedAt' | 'sourceHash'> {
  const combinedText = `${article.title} ${article.description}`
  const category = detectCategory(combinedText)
  const hashNum = createHash('md5').update(article.url).digest()[0]
  const visualType = VISUAL_TYPES[hashNum % VISUAL_TYPES.length] ?? null

  return {
    title: truncate(article.title, TITLE_MAX_LENGTH),
    teaser: truncate(article.description, TEASER_MAX_LENGTH),
    keyPoints: generateMockKeyPoints(article.description),
    category,
    visualType,
    visualData: generateMockVisualData(visualType),
  }
}

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

/**
 * Generate a deterministic hash for an article URL.
 */
export function generateSourceHash(url: string): string {
  return `sha256-${createHash('sha256').update(url).digest('hex').slice(0, 12)}`
}

/**
 * Call Claude Haiku to summarize a single article.
 * Returns null on failure (caller should fall back to mock).
 */
async function callHaiku(
  client: Anthropic,
  article: RawArticle
): Promise<Omit<ProcessedArticle, 'sourceUrl' | 'sourceName' | 'publishedAt' | 'sourceHash'> | null> {
  const userMessage = [
    `Title: ${article.title}`,
    `Source: ${article.sourceName}`,
    `Published: ${article.publishedAt}`,
    '',
    article.description,
  ].join('\n')

  const response = await client.messages.create({
    model: MODELS.summarizer,
    max_tokens: SUMMARIZER_MAX_TOKENS,
    temperature: SUMMARIZER_TEMPERATURE,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') return null

  // Strip markdown code fences if present (e.g. ```json ... ```)
  let rawText = textBlock.text.trim()
  const fenceMatch = rawText.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i)
  if (fenceMatch?.[1]) {
    rawText = fenceMatch[1].trim()
  }

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(rawText) as Record<string, unknown>
  } catch {
    console.warn(`[summarizer] Failed to parse JSON response for "${article.title}"`)
    return null
  }

  if (typeof parsed.title !== 'string' || typeof parsed.teaser !== 'string') return null

  // Validate category
  const category: CardCategory = VALID_CATEGORIES.includes(parsed.category as CardCategory)
    ? (parsed.category as CardCategory)
    : detectCategory(`${article.title} ${article.description}`)

  // Validate visual type
  const visualType: VisualType | null =
    parsed.visualType === null || VALID_VISUAL_TYPES.includes(parsed.visualType as VisualType)
      ? (parsed.visualType as VisualType | null)
      : null

  // Validate visualData is a plain object if present
  const visualData = (
    visualType !== null &&
    parsed.visualData !== null &&
    typeof parsed.visualData === 'object' &&
    !Array.isArray(parsed.visualData)
  )
    ? (parsed.visualData as Record<string, unknown>)
    : (visualType !== null ? null : null)

  return {
    title: parsed.title.slice(0, TITLE_MAX_LENGTH),
    teaser: parsed.teaser.slice(0, TEASER_MAX_LENGTH),
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, KEY_POINTS_MAX_COUNT) : [],
    category,
    visualType,
    visualData,
  }
}

/**
 * Summarize a single article using Claude Haiku, with mock fallback.
 */
async function summarizeArticle(
  client: Anthropic,
  article: RawArticle
): Promise<ProcessedArticle> {
  let summary: Omit<ProcessedArticle, 'sourceUrl' | 'sourceName' | 'publishedAt' | 'sourceHash'> | null = null

  try {
    summary = await callHaiku(client, article)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[summarizer] Haiku API failed for "${article.title}": ${message}`)
  }

  if (!summary) {
    console.warn(`[summarizer] Using mock fallback for "${article.title}"`)
    summary = mockSummarize(article)
  }

  return {
    ...summary,
    sourceUrl: article.url,
    sourceName: article.sourceName,
    publishedAt: article.publishedAt,
    sourceHash: generateSourceHash(article.url),
  }
}

/**
 * Summarize all validated articles using Claude Haiku API.
 * Processes articles in batches of 5 concurrently.
 * Falls back to mock logic for individual API failures.
 *
 * @returns Array of processed articles with summaries
 */
export async function summarizeArticles(articles: RawArticle[]): Promise<ProcessedArticle[]> {
  const client = new Anthropic()
  const processed: ProcessedArticle[] = []

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE)
    const results = await Promise.allSettled(
      batch.map((article) => summarizeArticle(client, article))
    )

    for (const result of results) {
      if (result.status === 'fulfilled') {
        processed.push(result.value)
      }
    }
  }

  console.log(`[summarizer] Summarized ${processed.length} articles`)
  return processed
}
