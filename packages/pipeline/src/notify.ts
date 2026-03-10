// ---------------------------------------------------------------------------
// Push Notification Trigger
// Sends push notifications for high-scoring cards after publishing.
// Disabled without VAPID keys and ADMIN_PASSWORD.
// ---------------------------------------------------------------------------

import type { PublishableCard } from './types.js'
import { PUSH_SCORE_THRESHOLD } from './config.js'

/**
 * Send push notifications for high-scoring cards.
 * Calls the web app's /api/push/send endpoint.
 */
export async function notifyHighScoreCards(
  cards: PublishableCard[],
  appUrl?: string
): Promise<void> {
  const adminPassword = process.env['ADMIN_PASSWORD']
  const baseUrl = appUrl ?? process.env['NEXT_PUBLIC_APP_URL']

  if (!adminPassword || !baseUrl) {
    console.log('[notify] Skipped — no ADMIN_PASSWORD or NEXT_PUBLIC_APP_URL configured')
    return
  }

  const highScoreCards = cards.filter(
    (card) => card.relevance_score !== null && card.relevance_score >= PUSH_SCORE_THRESHOLD
  )

  if (highScoreCards.length === 0) {
    console.log('[notify] No cards above push threshold')
    return
  }

  // Send notification for the top card
  const topCard = highScoreCards[0]
  const payload = {
    title: topCard.title,
    body: topCard.teaser,
    url: `/${topCard.id}`,
  }

  try {
    const response = await fetch(`${baseUrl}/api/push/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminPassword}`,
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      const result = (await response.json()) as { sent: number; failed: number }
      console.log(`[notify] Push sent: ${result.sent} delivered, ${result.failed} failed`)
    } else {
      console.warn(`[notify] Push API returned ${response.status}`)
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.warn(`[notify] Push failed: ${msg}`)
  }
}
