import { ImageResponse } from 'next/og'
import { getCardById } from '@/lib/data/cards'

export const runtime = 'edge'

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}\u2026`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return new Response('Missing id parameter', { status: 400 })
  }

  const result = await getCardById(id)

  if (!result) {
    return new Response('Card not found', { status: 404 })
  }

  const { card } = result
  const title = truncate(card.title, 47)
  const teaser = truncate(card.teaser, 81)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '60px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              {card.category}
            </span>
          </div>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#18181b',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: '#71717a',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {teaser}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#2563eb',
            }}
          >
            bytesyze.ai
          </span>
          <span
            style={{
              fontSize: '18px',
              color: '#a1a1aa',
            }}
          >
            AI News, Byte-Sized
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, s-maxage=86400',
      },
    },
  )
}
