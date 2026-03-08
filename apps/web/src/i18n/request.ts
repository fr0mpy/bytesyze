import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import {
  locales,
  defaultLocale,
  LOCALE_COOKIE,
  createOnError,
  createGetMessageFallback,
  getWebMessages,
  type Locale,
} from '@bytesyze/i18n'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value

  const locale =
    cookieLocale && locales.includes(cookieLocale as Locale)
      ? (cookieLocale as Locale)
      : defaultLocale

  return {
    locale,
    messages: getWebMessages(locale),
    onError: createOnError(locale),
    getMessageFallback: createGetMessageFallback(),
  }
})
