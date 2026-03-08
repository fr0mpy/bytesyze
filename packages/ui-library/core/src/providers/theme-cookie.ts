/**
 * Theme Cookie Utilities
 *
 * Server-side and client-side utilities for reading/writing theme preference cookies.
 * This enables server-side theme detection, eliminating the need for inline scripts.
 */

export const THEME_COOKIE_NAME = 'bytesyze-theme'
export const THEME_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds

export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Server-side: Read theme from cookies (for layout.tsx)
 * Uses next/headers which is server-only
 */
export async function getThemeFromCookies(): Promise<ThemeMode> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const theme = cookieStore.get(THEME_COOKIE_NAME)?.value

  if (theme === 'dark' || theme === 'light') {
    return theme
  }
  return 'system'
}

/**
 * Client-side: Set theme cookie
 * Used by ThemeProvider toggle
 */
export function setThemeCookie(theme: ThemeMode): void {
  if (typeof document === 'undefined') return

  if (theme === 'system') {
    // Remove cookie to fall back to system preference
    document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`
  } else {
    document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`
  }
}

/**
 * Client-side: Read theme cookie (for hydration check)
 */
export function getThemeCookieClient(): ThemeMode {
  if (typeof document === 'undefined') return 'system'

  const match = document.cookie.match(new RegExp(`${THEME_COOKIE_NAME}=([^;]+)`))
  const value = match?.[1]

  if (value === 'dark' || value === 'light') {
    return value
  }
  return 'system'
}

/**
 * One-time migration: localStorage to cookie
 * Call on first client render to migrate existing users
 */
export function migrateLocalStorageToCookie(): void {
  if (typeof window === 'undefined') return

  const LEGACY_KEY = 'bytesyze-theme'

  try {
    const legacyValue = localStorage.getItem(LEGACY_KEY)

    // Only migrate if we have a localStorage value and no cookie yet
    if (legacyValue && !document.cookie.includes(THEME_COOKIE_NAME)) {
      if (legacyValue === 'dark' || legacyValue === 'light') {
        setThemeCookie(legacyValue)
        localStorage.removeItem(LEGACY_KEY)
      }
    }
  } catch {
    // localStorage may be unavailable (private browsing, etc.)
  }
}
