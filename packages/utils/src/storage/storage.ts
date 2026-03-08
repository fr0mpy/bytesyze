/**
 * Type-safe localStorage utilities
 *
 * Provides a simple API for reading/writing to localStorage with
 * JSON serialization and error handling for SSR environments.
 */

/**
 * Check if localStorage is available (client-side only)
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const test = '__storage_test__'
    window.localStorage.setItem(test, test)
    window.localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Set a raw string value in localStorage (no JSON serialization)
 *
 * @param key - Storage key
 * @param value - String value to store
 *
 * @example
 * setStorageString('theme', 'dark')
 */
export function setStorageString(key: string, value: string): void {
  if (!isStorageAvailable()) return

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage full or other error - fail silently
  }
}
