'use client'

import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback, type ReactNode } from 'react'
import {
  setThemeCookie,
  migrateLocalStorageToCookie,
  type ThemeMode,
} from './theme-cookie'

// Re-export type for consumers
export type { ThemeMode } from './theme-cookie'

// =============================================================================
// Types
// =============================================================================

interface ThemeContextValue {
  /** Current theme preference ('light', 'dark', or 'system') */
  theme: ThemeMode
  /** Resolved theme - actual applied value (resolves 'system' to 'light' or 'dark') */
  resolvedTheme: 'light' | 'dark'
  /** Toggle between light and dark mode */
  toggle: () => void
  /** Set specific theme mode */
  setTheme: (theme: ThemeMode) => void
}

interface ThemeProviderProps {
  children: ReactNode
  /** Initial theme from server cookie read. Defaults to 'system'. */
  initialTheme?: ThemeMode
}

// =============================================================================
// Context
// =============================================================================

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Get system color scheme preference
 */
function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Resolve theme mode to actual light/dark value
 */
function resolveTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemPreference()
  }
  return theme
}

// =============================================================================
// Provider
// =============================================================================

export function ThemeProvider({
  children,
  initialTheme = 'system',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    resolveTheme(initialTheme),
  )

  // Track first render to skip class toggle (ThemeScript already set it)
  const isFirstRender = useRef(true)

  // Migrate localStorage to cookie on first mount (backwards compatibility)
  useEffect(() => {
    migrateLocalStorageToCookie()
  }, [])

  // Listen for system preference changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handler = (e: MediaQueryListEvent) => {
      const newResolved = e.matches ? 'dark' : 'light'
      setResolvedTheme(newResolved)
      document.documentElement.classList.toggle('dark', e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  // Apply theme class to document when resolvedTheme changes
  // Skip on first render - ThemeScript in <head> already set the correct class
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  // Set theme and persist to cookie
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeCookie(newTheme)
    setThemeState(newTheme)
    setResolvedTheme(resolveTheme(newTheme))
  }, [])

  // Toggle between light and dark (skips system)
  const toggle = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }, [resolvedTheme, setTheme])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, toggle, setTheme }),
    [theme, resolvedTheme, toggle, setTheme],
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// =============================================================================
// Hook
// =============================================================================

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
