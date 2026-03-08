import { notFound } from 'next/navigation'
import { NewsCard } from '@/components/card'
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
    </main>
  )
}
