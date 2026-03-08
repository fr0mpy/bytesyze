/**
 * Pagination number item - either a page number or an ellipsis marker
 */
export type PaginationItem = number | 'ellipsis'

/**
 * Generate page numbers with ellipsis for pagination display.
 *
 * @param currentPage - The currently active page (1-indexed)
 * @param totalPages - Total number of pages
 * @param siblings - Number of page numbers to show on each side of current page (default: 1)
 * @returns Array of page numbers and 'ellipsis' markers
 *
 * @example
 * generatePaginationNumbers(1, 10) // [1, 2, 3, 'ellipsis', 10]
 * generatePaginationNumbers(5, 10) // [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 * generatePaginationNumbers(10, 10) // [1, 'ellipsis', 8, 9, 10]
 */
export function generatePaginationNumbers(
  currentPage: number,
  totalPages: number,
  siblings = 1,
): PaginationItem[] {
  if (totalPages <= 0) return []
  if (totalPages === 1) return [1]

  const range = (start: number, end: number): number[] =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  // Total page numbers to show (siblings on each side + current + first + last)
  const totalNumbers = siblings * 2 + 3
  // Total blocks including potential ellipses
  const totalBlocks = totalNumbers + 2

  // If total pages fit without ellipsis, show all
  if (totalPages <= totalBlocks) {
    return range(1, totalPages)
  }

  const leftSiblingIndex = Math.max(currentPage - siblings, 1)
  const rightSiblingIndex = Math.min(currentPage + siblings, totalPages)

  const showLeftEllipsis = leftSiblingIndex > 2
  const showRightEllipsis = rightSiblingIndex < totalPages - 1

  // Case 1: No left ellipsis, show right ellipsis
  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, 3 + 2 * siblings)
    return [...leftRange, 'ellipsis', totalPages]
  }

  // Case 2: Show left ellipsis, no right ellipsis
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(totalPages - (2 + 2 * siblings), totalPages)
    return [1, 'ellipsis', ...rightRange]
  }

  // Case 3: Show both ellipses
  const middleRange = range(leftSiblingIndex, rightSiblingIndex)
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages]
}
