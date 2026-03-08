import { notFound } from 'next/navigation'
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
      <h1 className="text-2xl font-bold">{card.title}</h1>
    </main>
  )
}
