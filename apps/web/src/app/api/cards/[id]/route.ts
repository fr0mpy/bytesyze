import { NextResponse } from 'next/server'
import { getCardById } from '@/lib/data/cards'
import { CACHE_CONTROL } from '@/lib/config'

export const runtime = 'edge'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  if (!id || !UUID_REGEX.test(id)) {
    return NextResponse.json(
      { error: 'Valid UUID id parameter is required' },
      { status: 400 },
    )
  }

  const result = await getCardById(id)

  if (!result) {
    return NextResponse.json(
      { error: 'Card not found' },
      { status: 404 },
    )
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': CACHE_CONTROL.cardDetail,
    },
  })
}
