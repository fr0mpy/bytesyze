import { NextResponse } from 'next/server'
import { RATE_LIMITS, PIPELINE_MAX_DURATION } from '@/lib/config'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = PIPELINE_MAX_DURATION

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const { allowed, retryAfterMs } = checkRateLimit(`pipeline:${ip}`, RATE_LIMITS.pipeline.maxRequests, RATE_LIMITS.pipeline.windowMs)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
      },
    )
  }

  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { runPipeline } = await import('@bytesyze/pipeline')
    const cards = await runPipeline()

    return NextResponse.json({
      success: true,
      cardsPublished: cards.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[pipeline] Run failed:', message)
    return NextResponse.json(
      { success: false, error: 'Pipeline run failed' },
      { status: 500 },
    )
  }
}
