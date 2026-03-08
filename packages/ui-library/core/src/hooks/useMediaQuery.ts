'use client'

import { useState, useEffect } from 'react'
import { MEDIA_QUERIES } from '../config'

/**
 * Hook to track a CSS media query match state.
 * Uses matchMedia API for efficient tracking.
 *
 * @param query - CSS media query string (e.g., '(max-width: 767px)')
 * @returns Whether the media query currently matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    // SSR-safe: default to false on server
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Create listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern API (addEventListener) with fallback for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [query])

  return matches
}

/**
 * Convenience hook for detecting mobile viewport (< 768px).
 * Uses Tailwind's md breakpoint as the threshold.
 *
 * @returns Whether the viewport is mobile-sized
 */
export function useIsMobile(): boolean {
  return useMediaQuery(MEDIA_QUERIES.mobile)
}

/**
 * Convenience hook for detecting touch/coarse pointer devices.
 * More reliable than viewport-based detection for touch support.
 *
 * @returns Whether the device has a coarse pointer (touch)
 */
export function useIsTouchDevice(): boolean {
  return useMediaQuery(MEDIA_QUERIES.touch)
}
