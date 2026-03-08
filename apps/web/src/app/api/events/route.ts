import type { EventType } from '@/lib/supabase/types'

export const runtime = 'edge'

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

  if (typeof obj.cardId !== 'string' || obj.cardId.length === 0) return false
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

  // Log the event (no DB yet)
  // eslint-disable-next-line no-console
  console.log('[event]', {
    cardId: body.cardId,
    eventType: body.eventType,
    metadata: body.metadata,
    timestamp: new Date().toISOString(),
  })

  return new Response(null, { status: 204 })
}
