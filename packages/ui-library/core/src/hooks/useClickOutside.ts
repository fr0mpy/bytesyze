'use client'

import { useEffect, useRef, type RefObject } from 'react'

/**
 * Hook to detect clicks outside of an element.
 *
 * @param ref - Ref to the element to detect clicks outside of
 * @param callback - Function to call when clicked outside
 * @param enabled - Whether the listener is active (default: true)
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
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

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callbackRef.current()
      }
    }

    // Use mousedown for better UX (catches click before button release)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, enabled])
}

/**
 * Variant that accepts multiple refs (useful for dropdown with trigger)
 */
export function useClickOutsideMultiple<T extends HTMLElement>(
  refs: RefObject<T | null>[],
  callback: () => void,
  enabled: boolean = true,
): void {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = refs.every(
        ref => ref.current && !ref.current.contains(event.target as Node),
      )
      if (isOutside) {
        callbackRef.current()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [refs, enabled])
}
