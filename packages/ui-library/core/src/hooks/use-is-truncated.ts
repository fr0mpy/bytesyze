'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * Hook to detect if an element's text content is truncated (overflow hidden with ellipsis).
 * Uses ResizeObserver to re-check on element resize.
 *
 * @example
 * ```tsx
 * function TruncatedText({ text }: { text: string }) {
 *   const { ref, isTruncated } = useIsTruncated<HTMLSpanElement>()
 *
 *   const content = <span ref={ref} className="truncate">{text}</span>
 *
 *   return isTruncated ? <Tooltip content={text}>{content}</Tooltip> : content
 * }
 * ```
 */
export function useIsTruncated<T extends HTMLElement>() {
  const [isTruncated, setIsTruncated] = useState(false)
  const elementRef = useRef<T | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)
  const rafRef = useRef<number | null>(null)

  // Deferred state update to prevent infinite loops when tree structure changes
  const updateTruncated = useCallback((value: boolean) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      setIsTruncated(value)
    })
  }, [])

  const ref = useCallback((node: T | null) => {
    // Clean up old observer when element changes
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    elementRef.current = node

    if (node) {
      // Check truncation (deferred to prevent render loop)
      const truncated = node.scrollWidth > node.clientWidth
      updateTruncated(truncated)

      // Set up observer for future resize changes
      observerRef.current = new ResizeObserver(() => {
        if (elementRef.current) {
          updateTruncated(elementRef.current.scrollWidth > elementRef.current.clientWidth)
        }
      })
      observerRef.current.observe(node)
    }
    // Don't set false when node is null - element may just be remounting
  }, [updateTruncated])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return { ref, isTruncated }
}
