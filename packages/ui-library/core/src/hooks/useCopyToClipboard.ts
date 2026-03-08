'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

/** Duration to show "copied" state in milliseconds */
const DEFAULT_COPIED_DURATION = 2000

export interface UseCopyToClipboardOptions {
  /** Duration to show copied state (default: 2000ms) */
  duration?: number
}

export interface UseCopyToClipboardReturn {
  /** Copy text to clipboard */
  copy: (text: string) => Promise<void>
  /** Whether text was recently copied */
  copied: boolean
  /** Reset copied state manually */
  reset: () => void
}

/**
 * Hook for copying text to clipboard with visual feedback
 *
 * @param options - Configuration options
 * @returns Object with copy function, copied state, and reset function
 *
 * @example
 * ```tsx
 * const { copy, copied } = useCopyToClipboard()
 *
 * <button onClick={() => copy(url)}>
 *   {copied ? 'Copied!' : 'Copy'}
 * </button>
 * ```
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
  const { duration = DEFAULT_COPIED_DURATION } = options
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setCopied(false)
  }, [])

  const copy = useCallback(
    async (text: string) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)

        // Reset after delay
        timeoutRef.current = setTimeout(() => {
          setCopied(false)
          timeoutRef.current = null
        }, duration)
      } catch {
        // Fallback for older browsers or when clipboard API is unavailable
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
          document.execCommand('copy')
          setCopied(true)
          timeoutRef.current = setTimeout(() => {
            setCopied(false)
            timeoutRef.current = null
          }, duration)
        } catch {
          console.error('Failed to copy text to clipboard')
        }

        document.body.removeChild(textArea)
      }
    },
    [duration],
  )

  return { copy, copied, reset }
}
