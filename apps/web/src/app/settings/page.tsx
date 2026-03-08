import { getTranslations, settings } from '@bytesyze/i18n'

export default async function SettingsPage() {
  const t = await getTranslations()

  return (
    <main className="flex flex-col p-4">
      <h1 className="text-2xl font-bold">{t(settings.title)}</h1>
    </main>
  )
}
