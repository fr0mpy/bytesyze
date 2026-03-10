// ---------------------------------------------------------------------------
// Article Validator
// Recency filter + Keyword filter + LLM borderline check (Claude Haiku)
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk'
import type { RawArticle } from './types.js'
import {
  containsAiKeyword,
  MIN_DESCRIPTION_LENGTH,
  MAX_ARTICLE_AGE_MS as MAX_AGE_MS,
  MODELS,
  TIER_1_SOURCES,
  VALIDATOR_MAX_TOKENS,
} from './config.js'

/**
 * Check if an article was published within the last 48 hours.
 */
function isRecent(article: RawArticle): boolean {
  const publishedAt = new Date(article.publishedAt).getTime()
  if (isNaN(publishedAt)) return false // Unparseable dates are rejected as stale

  const age = Date.now() - publishedAt
  return age <= MAX_AGE_MS
}

/**
 * Use Claude Haiku to validate borderline articles (non-tier-1 sources
 * that pass keyword filter but may not be genuinely AI-focused).
 *
 * Returns true if the article should be kept, false to reject.
 * Falls back to true if the API key is not set or the call fails.
 */
async function aiValidation(
  article: RawArticle,
  client: Anthropic | null
): Promise<boolean> {
  if (!client) return true

  try {
    const response = await client.messages.create({
      model: MODELS.validator,
      max_tokens: VALIDATOR_MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: `Title: ${article.title}\nDescription: ${article.description}\n\nIs this content genuinely about AI/ML and substantial enough to summarise in one card? Respond YES or NO with a one-line reason.`,
        },
      ],
    })

    const text =
      response.content[0].type === 'text' ? response.content[0].text : ''
    const firstWord = text.trim().split(/\s/)[0].toUpperCase()
    return firstWord === 'YES'
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[validator] LLM validation error: ${message}`)
    return true // Graceful fallback: keep the article
  }
}

/**
 * Validate articles for AI relevance, recency, and quality.
 *
 * Filters:
 * 1. Recency: reject articles older than 48 hours
 * 2. Description must be at least 50 characters
 * 3. Title or description must contain an AI-related keyword
 * 4. LLM borderline check for non-tier-1 sources (requires ANTHROPIC_API_KEY)
 *
 * @returns Array of validated articles
 */
export async function validateArticles(articles: RawArticle[]): Promise<RawArticle[]> {
  const validated: RawArticle[] = []
  let staleCount = 0
  let shortCount = 0
  let keywordFailCount = 0
  let llmRejectCount = 0

  // Initialize Anthropic client if API key is available
  const apiKey = process.env['ANTHROPIC_API_KEY']
  const client = apiKey ? new Anthropic({ apiKey }) : null

  if (!client) {
    console.log('[validator] No ANTHROPIC_API_KEY — skipping LLM borderline check')
  }

  for (const article of articles) {
    // Check recency (48 hours)
    if (!isRecent(article)) {
      staleCount++
      continue
    }

    // Check description length
    if (article.description.length < MIN_DESCRIPTION_LENGTH) {
      shortCount++
      continue
    }

    // Check for AI keywords in title + description
    const combinedText = `${article.title} ${article.description}`
    if (!containsAiKeyword(combinedText)) {
      keywordFailCount++
      continue
    }

    // LLM borderline check for non-tier-1 sources
    const isTier1 = TIER_1_SOURCES.has(article.sourceName)
    if (!isTier1) {
      const passes = await aiValidation(article, client)
      if (!passes) {
        llmRejectCount++
        continue
      }
    }

    validated.push(article)
  }

  console.log(
    `[validator] ${articles.length} -> ${validated.length} articles ` +
      `(${staleCount} stale, ${shortCount} too short, ${keywordFailCount} no AI keywords, ${llmRejectCount} LLM rejected)`
  )

  return validated
}
