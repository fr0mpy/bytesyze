import { NextResponse } from 'next/server'
import { Routes } from '@/lib/routes'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

interface SendPushBody {
  title: string
  body: string
  url?: string
}

interface WebPushModule {
  setVapidDetails: (subject: string, publicKey: string, privateKey: string) => void
  sendNotification: (
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
    payload: string,
  ) => Promise<unknown>
}

export async function POST(request: Request) {
  // Auth gate: require admin password
  const authHeader = request.headers.get('authorization')
  const adminPassword = process.env['ADMIN_PASSWORD']

  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Dynamically import web-push (it's a Node.js module)
  let webpush: WebPushModule
  try {
    webpush = await import('web-push') as unknown as WebPushModule
  } catch {
    return NextResponse.json(
      { error: 'web-push not installed' },
      { status: 500 },
    )
  }

  const vapidPublicKey = process.env['VAPID_PUBLIC_KEY']
  const vapidPrivateKey = process.env['VAPID_PRIVATE_KEY']

  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json(
      { error: 'VAPID keys not configured' },
      { status: 500 },
    )
  }

  webpush.setVapidDetails(
    'mailto:admin@bytesyze.ai',
    vapidPublicKey,
    vapidPrivateKey,
  )

  try {
    const body = (await request.json()) as SendPushBody

    if (!body.title || !body.body) {
      return NextResponse.json(
        { error: 'title and body are required' },
        { status: 400 },
      )
    }

    const supabase = createServiceClient()
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh_key, auth_key')

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0 })
    }

    const payload = JSON.stringify({
      title: body.title,
      body: body.body,
      url: body.url ?? Routes.home,
    })

    let sent = 0
    let failed = 0
    const staleEndpoints: string[] = []

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: (sub as { endpoint: string }).endpoint,
            keys: {
              p256dh: (sub as { p256dh_key: string }).p256dh_key,
              auth: (sub as { auth_key: string }).auth_key,
            },
          },
          payload,
        ),
      ),
    )

    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.status === 'fulfilled') {
        sent++
      } else {
        failed++
        // Remove stale subscriptions (410 Gone)
        const err = result.reason as { statusCode?: number }
        if (err.statusCode === 410) {
          staleEndpoints.push(
            (subscriptions[i] as { endpoint: string }).endpoint,
          )
        }
      }
    }

    // Clean up stale subscriptions
    if (staleEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', staleEndpoints)
    }

    return NextResponse.json({ sent, failed, cleaned: staleEndpoints.length })
  } catch {
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 },
    )
  }
}
