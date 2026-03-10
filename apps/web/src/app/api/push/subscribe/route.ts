import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

interface PushSubscriptionBody {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PushSubscriptionBody

    if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          endpoint: body.endpoint,
          p256dh_key: body.keys.p256dh,
          auth_key: body.keys.auth,
        },
        { onConflict: 'endpoint' }
      )

    if (error) {
      console.error('[push/subscribe] Supabase error:', error.message)
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
