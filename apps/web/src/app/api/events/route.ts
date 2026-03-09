import { after } from 'next/server'
import { createAnonClient } from '@/lib/supabase/client'
import type { EventType } from '@/lib/supabase/types'

export const runtime = 'edge'

/** UUID v4 format validation */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const VALID_EVENT_TYPES: ReadonlySet<string> = new Set<EventType>([
  'view',
  'share',
  'click_source',
  'flag',
])

interface EventPayload {
  cardId: string
  eventType: EventType
  metadata?: Record<string, unknown>
}

function isValidPayload(body: unknown): body is EventPayload {
  if (typeof body !== 'object' || body === null) return false

  const obj = body as Record<string, unknown>

  if (typeof obj.cardId !== 'string' || !UUID_PATTERN.test(obj.cardId)) return false
  if (typeof obj.eventType !== 'string' || !VALID_EVENT_TYPES.has(obj.eventType)) return false

  if (obj.metadata !== undefined) {
    if (typeof obj.metadata !== 'object' || obj.metadata === null || Array.isArray(obj.metadata)) {
      return false
    }
  }

  return true
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  if (!isValidPayload(body)) {
    return new Response(
      JSON.stringify({
        error: 'Invalid payload. Required: { cardId: string, eventType: "view" | "share" | "click_source" | "flag", metadata?: object }',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  after(async () => {
    const supabase = createAnonClient()
    const { error } = await supabase.from('card_events').insert({
      card_id: body.cardId,
      event_type: body.eventType,
    })
    if (error) {
      console.error('[event] Insert failed:', error.message)
    }
  })

  return new Response(null, { status: 204 })
}
