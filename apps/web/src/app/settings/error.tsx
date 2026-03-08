'use client'

import { useEffect } from 'react'
import { useTranslations, error as errorKeys } from '@bytesyze/i18n'

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8"
    >
      <h2 className="text-xl font-semibold">{t(errorKeys.title)}</h2>
      <p className="text-muted-foreground text-center max-w-md">
        {t(errorKeys.description)}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-md bg-foreground text-background font-medium"
      >
        {t(errorKeys.tryAgain)}
      </button>
    </div>
  )
}
