import { NextResponse } from 'next/server'
import { getCardById } from '@/lib/data/cards'

export const runtime = 'edge'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  if (!id || id.length === 0) {
    return NextResponse.json(
      { error: 'id parameter is required' },
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
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
