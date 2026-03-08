'use client'

import { useEffect, useRef } from 'react'

/**
 * Hook to detect Escape key press.
 *
 * @param callback - Function to call when Escape is pressed
 * @param enabled - Whether the listener is active (default: true)
 */
export function useEscapeKey(
  callback: () => void,
  enabled: boolean = true,
): void {
  // Use ref to avoid re-adding listener when callback changes
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callbackRef.current()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled])
}
