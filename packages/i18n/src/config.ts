export const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
}

// Namespaces available for the app
export const namespaces = {
  web: ['common'] as const,
}

// Cookie name for locale persistence
export const LOCALE_COOKIE = 'NEXT_LOCALE'
