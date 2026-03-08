import { createLogger } from '@bytesyze/utils'

const log = createLogger('i18n')

interface MissingTranslation {
  key: string
  locale: string
  namespace?: string
  timestamp: string
}

const missingTranslations: MissingTranslation[] = []
let reportTimeout: ReturnType<typeof setTimeout> | undefined

/**
 * Log a missing translation key.
 * Uses central logger (respects __bytesyze.logs toggle).
 * In production: batch and optionally report to monitoring.
 */
export function logMissingTranslation(
  key: string,
  locale: string,
  namespace?: string,
): void {
  const entry: MissingTranslation = {
    key,
    locale,
    namespace,
    timestamp: new Date().toISOString(),
  }

  missingTranslations.push(entry)

  // Log via central logger (respects toggle)
  const fullKey = namespace ? `${namespace}.${key}` : key
  log.warn(`Missing translation: ${fullKey} (${locale})`)

  // In production, batch and report (optional endpoint)
  if (process.env.NODE_ENV === 'production' && process.env.I18N_REPORT_ENDPOINT) {
    debouncedReportMissing()
  }
}

/**
 * Debounced reporter for production - batches missing translations
 */
function debouncedReportMissing(): void {
  if (reportTimeout) {
    clearTimeout(reportTimeout)
  }

  reportTimeout = setTimeout(() => {
    const endpoint = process.env.I18N_REPORT_ENDPOINT
    if (!endpoint || missingTranslations.length === 0) return

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ translations: [...missingTranslations] }),
    }).catch(() => {
      // Silently fail - don't break app for monitoring failures
    })

    missingTranslations.length = 0
  }, 5000)
}

/**
 * Create onError handler for next-intl configuration.
 * Returns formatted fallback string for missing keys.
 */
export function createOnError(locale: string) {
  return (error: { code: string; key?: string }) => {
    if (error.code === 'MISSING_MESSAGE' && error.key) {
      logMissingTranslation(error.key, locale)
    }
  }
}

/**
 * Create getMessageFallback handler for next-intl configuration.
 * Returns visible placeholder for missing keys in development.
 */
export function createGetMessageFallback() {
  return ({ namespace, key }: { namespace?: string; key: string }) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    // Return visible placeholder so missing keys are obvious
    return `[MISSING: ${fullKey}]`
  }
}
