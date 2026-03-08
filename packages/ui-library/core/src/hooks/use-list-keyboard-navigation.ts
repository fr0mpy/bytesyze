import { useState, useCallback, useEffect, type RefObject } from 'react'

export interface UseListKeyboardNavigationOptions<T> {
  /** Array of items in the list */
  items: readonly T[]
  /** Ref to the scrollable container element */
  containerRef: RefObject<HTMLElement | null>
  /** Callback when Enter is pressed on a focused item */
  onSelect?: (item: T, index: number) => void
  /** Dependencies that should reset focus when changed (e.g., page number) */
  resetDeps?: readonly unknown[]
  /** Data attribute used to find row elements (default: 'data-row-index') */
  rowAttribute?: string
}

export interface UseListKeyboardNavigationResult {
  /** Currently focused row index (-1 if none) */
  focusedIndex: number
  /** Set the focused index manually */
  setFocusedIndex: (index: number) => void
  /** Keyboard event handler for the list container */
  handleKeyDown: (e: React.KeyboardEvent) => void
  /** Keyboard event handler for action buttons (Escape returns focus to list) */
  handleActionKeyDown: (e: React.KeyboardEvent) => void
}

/**
 * Hook for keyboard navigation in virtualized lists/tables.
 * Implements roving tabindex pattern with ArrowUp/Down/Enter/Home/End support.
 *
 * @example
 * const { focusedIndex, handleKeyDown, handleActionKeyDown } = useListKeyboardNavigation({
 *   items: paginatedLogs,
 *   containerRef: scrollContainerRef,
 *   onSelect: (log) => openLogDetail(log),
 *   resetDeps: [currentPage],
 * })
 *
 * <div ref={scrollContainerRef} onKeyDown={handleKeyDown} tabIndex={0}>
 *   {items.map((item, index) => (
 *     <Row key={item.id} isFocused={focusedIndex === index}>
 *       <ActionButton onKeyDown={handleActionKeyDown} />
 *     </Row>
 *   ))}
 * </div>
 */
export function useListKeyboardNavigation<T>({
  items,
  containerRef,
  onSelect,
  resetDeps = [],
  rowAttribute = 'data-row-index',
}: UseListKeyboardNavigationOptions<T>): UseListKeyboardNavigationResult {
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const scrollRowIntoView = useCallback(
    (index: number) => {
      const row = containerRef.current?.querySelector(`[${rowAttribute}="${index}"]`)
      row?.scrollIntoView({ block: 'nearest' })
    },
    [containerRef, rowAttribute],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const itemCount = items.length
      if (itemCount === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) => {
            const next = prev < 0 ? 0 : Math.min(prev + 1, itemCount - 1)
            scrollRowIntoView(next)
            return next
          })
          break

        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => {
            const next = prev < 0 ? 0 : Math.max(prev - 1, 0)
            scrollRowIntoView(next)
            return next
          })
          break

        case 'Enter':
          if (focusedIndex >= 0 && onSelect) {
            e.preventDefault()
            const item = items[focusedIndex]
            if (item) {
              onSelect(item, focusedIndex)
            }
          }
          break

        case 'Home':
          e.preventDefault()
          setFocusedIndex(0)
          containerRef.current?.scrollTo({ top: 0 })
          break

        case 'End':
          e.preventDefault()
          setFocusedIndex(itemCount - 1)
          break
      }
    },
    [items, focusedIndex, onSelect, containerRef, scrollRowIntoView],
  )

  const handleActionKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        containerRef.current?.focus()
      }
    },
    [containerRef],
  )

  // Reset focused index when dependencies change
  useEffect(() => {
    if (resetDeps.length > 0) {
      setFocusedIndex(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps)

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    handleActionKeyDown,
  }
}
