import { notFound } from 'next/navigation'
import { NewsCard } from '@/components/card'
import { FlagButton } from '@/components/flag'
import { ShareButton } from '@/components/share'
import { getCardById } from '@/lib/data/cards'

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getCardById(id)

  if (!result) {
    notFound()
  }

  const { card } = result

  return (
    <main className="flex flex-col items-center p-4">
      <NewsCard card={card} expanded />
      <div className="mt-4 flex w-full max-w-lg items-center justify-between">
        <ShareButton
          card={{ id: card.id, title: card.title, teaser: card.teaser }}
        />
        <FlagButton cardId={card.id} />
      </div>
    </main>
  )
}
