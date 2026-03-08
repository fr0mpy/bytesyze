'use client'

import { useEffect, useRef } from 'react'

// Track how many components are currently locking scroll
// This prevents issues when multiple modals are open
let lockCount = 0
let originalOverflow = ''

/**
 * Hook to lock body scroll when a modal/drawer is open.
 * Uses a counter to handle nested modals correctly.
 *
 * @param isLocked - Whether scroll should be locked
 */
export function useBodyScrollLock(isLocked: boolean): void {
  const wasLocked = useRef(false)

  useEffect(() => {
    if (isLocked && !wasLocked.current) {
      // First lock: save original overflow
      if (lockCount === 0) {
        originalOverflow = document.body.style.overflow
      }
      lockCount++
      document.body.style.overflow = 'hidden'
      wasLocked.current = true
    } else if (!isLocked && wasLocked.current) {
      // Unlock
      lockCount--
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow
      }
      wasLocked.current = false
    }

    // Cleanup on unmount
    return () => {
      if (wasLocked.current) {
        lockCount--
        if (lockCount === 0) {
          document.body.style.overflow = originalOverflow
        }
        wasLocked.current = false
      }
    }
  }, [isLocked])
}
