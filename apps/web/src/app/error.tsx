'use client'

import { useEffect } from 'react'
import { Button } from '@bytesyze-ui/core/button'
import { Text } from '@bytesyze-ui/core/text'
import { useTranslations } from '@bytesyze/i18n'
import { error as errorKeys } from '@bytesyze/i18n'

export default function Error({
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
      <Text variant="h2">{t(errorKeys.title)}</Text>
      <Text variant="body1" className="text-muted-foreground text-center max-w-md">
        {t(errorKeys.description)}
      </Text>
      <Button onClick={reset} variant="primary">
        {t(errorKeys.tryAgain)}
      </Button>
    </div>
  )
}
