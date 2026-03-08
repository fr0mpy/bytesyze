import { getTranslations } from '@bytesyze/i18n'

export default async function HomePage() {
  const t = await getTranslations('brand')

  return (
    <main>
      <h1>{t('name')}</h1>
    </main>
  )
}
