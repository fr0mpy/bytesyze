import { getTranslations, feed } from '@bytesyze/i18n'

export default async function HomePage() {
  const t = await getTranslations()

  return (
    <main className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold">{t(feed.title)}</h1>
    </main>
  )
}
