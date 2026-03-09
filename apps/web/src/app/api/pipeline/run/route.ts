import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function POST(request: Request) {
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
