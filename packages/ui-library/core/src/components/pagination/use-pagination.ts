import { useState, useMemo, useCallback, useEffect } from 'react'

export interface UsePaginationOptions {
  /** Default page size (default: 20) */
  defaultPageSize?: number
  /** Available page size options */
  pageSizeOptions?: readonly number[]
  /** Callback when page changes - useful for scroll reset */
  onPageChange?: (page: number) => void
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void
  /** Dependencies that should reset pagination to page 1 when changed */
  resetDeps?: readonly unknown[]
}

export interface UsePaginationResult<T> {
  /** Current page number (1-indexed) */
  currentPage: number
  /** Number of items per page */
  pageSize: number
  /** Total number of pages */
  totalPages: number
  /** Starting index in the data array (0-indexed) */
  startIndex: number
  /** Ending index in the data array (exclusive) */
  endIndex: number
  /** Slice of data for current page */
  paginatedData: T[]
  /** Total number of items */
  totalItems: number
  /** Whether there is a previous page */
  hasPreviousPage: boolean
  /** Whether there is a next page */
  hasNextPage: boolean
  /** Go to a specific page */
  goToPage: (page: number) => void
  /** Go to next page */
  goToNextPage: () => void
  /** Go to previous page */
  goToPreviousPage: () => void
  /** Go to first page */
  goToFirstPage: () => void
  /** Go to last page */
  goToLastPage: () => void
  /** Change the page size (resets to page 1) */
  setPageSize: (size: number) => void
}

const DEFAULT_PAGE_SIZE = 20

/**
 * Hook for managing pagination state and logic.
 *
 * @param data - Array of items to paginate
 * @param options - Pagination configuration options
 * @returns Pagination state and control functions
 *
 * @example
 * const {
 *   paginatedData,
 *   currentPage,
 *   totalPages,
 *   goToPage,
 *   setPageSize,
 * } = usePagination(logs, {
 *   defaultPageSize: 25,
 *   onPageChange: () => scrollRef.current?.scrollTo({ top: 0 }),
 *   resetDeps: [sortState],
 * })
 */
export function usePagination<T>(
  data: readonly T[],
  options: UsePaginationOptions = {},
): UsePaginationResult<T> {
  const {
    defaultPageSize = DEFAULT_PAGE_SIZE,
    onPageChange,
    onPageSizeChange,
    resetDeps = [],
  } = options

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(defaultPageSize)

  // Calculate pagination values
  const totalItems = data.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  // Memoize paginated data slice
  const paginatedData = useMemo(
    () => data.slice(startIndex, endIndex) as T[],
    [data, startIndex, endIndex],
  )

  // Navigation state
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  // Navigation handlers
  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(validPage)
      onPageChange?.(validPage)
    },
    [totalPages, onPageChange],
  )

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(currentPage + 1)
    }
  }, [hasNextPage, currentPage, goToPage])

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      goToPage(currentPage - 1)
    }
  }, [hasPreviousPage, currentPage, goToPage])

  const goToFirstPage = useCallback(() => {
    goToPage(1)
  }, [goToPage])

  const goToLastPage = useCallback(() => {
    goToPage(totalPages)
  }, [goToPage, totalPages])

  const setPageSize = useCallback(
    (size: number) => {
      setPageSizeState(size)
      setCurrentPage(1)
      onPageSizeChange?.(size)
      onPageChange?.(1)
    },
    [onPageSizeChange, onPageChange],
  )

  // Reset to page 1 when dependencies change
  useEffect(() => {
    if (resetDeps.length > 0) {
      setCurrentPage(1)
      onPageChange?.(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps)

  // Ensure current page is valid when data length changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
      onPageChange?.(totalPages)
    }
  }, [currentPage, totalPages, onPageChange])

  return {
    currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    paginatedData,
    totalItems,
    hasPreviousPage,
    hasNextPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setPageSize,
  }
}
