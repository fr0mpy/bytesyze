import enCommon from '../messages/en/common.json'
import frCommon from '../messages/fr/common.json'
import type { Locale } from './config'
import type { AbstractIntlMessages } from 'next-intl'

const messages = {
  en: {
    common: enCommon,
  },
  fr: {
    common: frCommon,
  },
} as const

export type MessageNamespace = 'common'

/**
 * Get messages for a specific locale and namespace(s).
 * Merges multiple namespaces into a single object.
 */
export function getMessages(
  locale: Locale,
  namespaceList: MessageNamespace[],
): AbstractIntlMessages {
  const result: AbstractIntlMessages = {}

  for (const ns of namespaceList) {
    Object.assign(result, messages[locale]?.[ns] ?? messages.en[ns])
  }

  return result
}

/**
 * Get web app messages (common namespace)
 */
export function getWebMessages(locale: Locale): AbstractIntlMessages {
  return getMessages(locale, ['common'])
}
