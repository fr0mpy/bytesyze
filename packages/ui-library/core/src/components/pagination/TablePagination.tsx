'use client'

import { Pagination } from './pagination'
import { generatePaginationNumbers } from './utils'

export interface TablePaginationLabels {
  /** Label for page size selector, e.g. "Show {count}" */
  showCount: (count: number) => string
  /** Aria label for page size selector */
  pageSizeAriaLabel: string
  /** Aria label for pagination nav */
  paginationAriaLabel: string
}

export interface TablePaginationProps {
  /** Current page (1-indexed) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Current page size */
  pageSize: number
  /** Available page size options */
  pageSizeOptions: readonly number[]
  /** Handler for page changes */
  onPageChange: (page: number) => void
  /** Handler for page size changes */
  onPageSizeChange: (size: number) => void
  /** Localized labels */
  labels: TablePaginationLabels
  /** Custom page size selector render prop */
  renderPageSizeSelector?: (props: {
    pageSize: number
    options: readonly number[]
    onChange: (size: number) => void
    ariaLabel: string
    label: string
  }) => React.ReactNode
  /** Container className */
  className?: string
  /** Controls wrapper className */
  controlsClassName?: string
}

const defaultStyles = {
  container: 'flex items-center justify-end mt-4 px-2 sm:px-4 py-3',
  controls: 'flex items-center gap-4',
} as const

/**
 * A complete table pagination component with page size selector and page navigation.
 *
 * @example
 * // With usePagination hook
 * const pagination = usePagination(data, { defaultPageSize: 20 })
 *
 * <TablePagination
 *   currentPage={pagination.currentPage}
 *   totalPages={pagination.totalPages}
 *   pageSize={pagination.pageSize}
 *   pageSizeOptions={[10, 20, 50, 100]}
 *   onPageChange={pagination.goToPage}
 *   onPageSizeChange={pagination.setPageSize}
 *   labels={{
 *     showCount: (count) => `Show ${count}`,
 *     pageSizeAriaLabel: "Rows per page",
 *     paginationAriaLabel: "Pagination",
 *   }}
 *   renderPageSizeSelector={({ pageSize, options, onChange, ariaLabel, label }) => (
 *     <Select value={pageSize} onChange={onChange} aria-label={ariaLabel}>
 *       {options.map(size => <Option key={size} value={size}>{size}</Option>)}
 *     </Select>
 *   )}
 * />
 */
export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  labels,
  renderPageSizeSelector,
  className,
  controlsClassName,
}: TablePaginationProps) {
  const paginationNumbers = generatePaginationNumbers(currentPage, totalPages)

  return (
    <div className={className ?? defaultStyles.container}>
      <div className={controlsClassName ?? defaultStyles.controls}>
        {/* Page size selector - render prop for flexibility */}
        {renderPageSizeSelector?.({
          pageSize,
          options: pageSizeOptions,
          onChange: onPageSizeChange,
          ariaLabel: labels.pageSizeAriaLabel,
          label: labels.showCount(pageSize),
        })}

        {/* Page navigation */}
        <Pagination aria-label={labels.paginationAriaLabel}>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              />
            </Pagination.Item>

            {paginationNumbers.map((page, index) =>
              page === 'ellipsis' ? (
                <Pagination.Item key={`ellipsis-${index}`}>
                  <Pagination.Ellipsis />
                </Pagination.Item>
              ) : (
                <Pagination.Item key={page}>
                  <Pagination.Link
                    isActive={currentPage === page}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Pagination.Link>
                </Pagination.Item>
              ),
            )}

            <Pagination.Item>
              <Pagination.Next
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              />
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </div>
    </div>
  )
}
