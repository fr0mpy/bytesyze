// ---------------------------------------------------------------------------
// Card Publisher
// Upserts scored articles to Supabase as published cards
// ---------------------------------------------------------------------------

import { randomUUID } from 'node:crypto'
import { createPipelineClient } from './supabase.js'
import type { PublishableCard } from './types.js'
import type { ScoredArticle } from './scorer.js'
import { PUBLISHER_RETRY } from './config.js'

const MAX_RETRIES = PUBLISHER_RETRY.maxAttempts
const BASE_DELAY_MS = PUBLISHER_RETRY.baseDelayMs

/**
 * Convert a scored article into a publishable card matching the web app's Card type.
 */
function toPublishableCard(scored: ScoredArticle): PublishableCard {
  const { article, score } = scored

  return {
    id: randomUUID(),
    title: article.title,
    teaser: article.teaser,
    key_points: article.keyPoints,
    source_url: article.sourceUrl,
    source_name: article.sourceName,
    source_favicon: null,
    category: article.category,
    visual_type: article.visualType,
    visual_data: article.visualData,
    image_url: null,
    locale: 'en',
    status: 'published',
    relevance_score: score / 100,
    source_hash: article.sourceHash,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
}

/**
 * Sleep for a given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Publish scored articles to Supabase with retry logic.
 * Upserts on source_hash to avoid duplicates.
 *
 * @param scored - Scored articles sorted by relevance
 * @returns Array of published cards
 */
export async function publishCards(
  scored: ScoredArticle[]
): Promise<PublishableCard[]> {
  const cards = scored.map(toPublishableCard)

  if (cards.length === 0) {
    console.log('[publisher] No cards to publish')
    return []
  }

  // Log each card
  for (const card of cards) {
    console.log(
      `[publisher] Card: "${card.title}" ` +
        `| score: ${card.relevance_score} ` +
        `| category: ${card.category} ` +
        `| source: ${card.source_name}`
    )
  }

  // Upsert to Supabase with retry
  const supabase = createPipelineClient()
  let lastError: unknown = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { error } = await supabase
        .from('cards')
        .upsert(cards, { onConflict: 'source_hash' })

      if (error) {
        throw new Error(`Supabase upsert error: ${error.message}`)
      }

      console.log(`[publisher] Upserted ${cards.length} cards to Supabase`)
      return cards
    } catch (error: unknown) {
      lastError = error
      const message = error instanceof Error ? error.message : String(error)
      console.error(
        `[publisher] Attempt ${attempt}/${MAX_RETRIES} failed: ${message}`
      )

      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1)
        console.log(`[publisher] Retrying in ${delay}ms...`)
        await sleep(delay)
      }
    }
  }

  // Persistent failure: log and continue (don't crash pipeline)
  const message = lastError instanceof Error ? lastError.message : String(lastError)
  console.error(
    `[publisher] Failed to publish ${cards.length} cards after ${MAX_RETRIES} attempts: ${message}`
  )

  return cards
}
