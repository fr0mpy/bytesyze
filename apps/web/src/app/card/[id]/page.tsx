import { notFound } from 'next/navigation'
import { NewsCard } from '@/components/card'
import { FlagButton } from '@/components/flag'
import { ShareButton } from '@/components/share'
import { getCardById } from '@/lib/data/cards'
import { CardDetailPageStyles as S } from './styles'

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
    <main className={S.main}>
      <NewsCard card={card} expanded />
      <div className={S.actions}>
        <ShareButton
          card={{ id: card.id, title: card.title, teaser: card.teaser }}
        />
        <FlagButton cardId={card.id} />
      </div>
    </main>
  )
}
