import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/utils/cn'
import { PaginationStyles as S } from './styles'
import { ARIA, SR_ONLY, LABEL } from '../../config'
import type {
  PaginationRootProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationEllipsisProps,
} from './types'

function PaginationRoot({ className, ref, ...props }: PaginationRootProps) {
  return (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      className={cn(S.root, className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ref, ...props }: PaginationContentProps) {
  return (
    <ul
      ref={ref}
      className={cn(S.content, className)}
      {...props}
    />
  )
}

function PaginationItem({ className, ref, ...props }: PaginationItemProps) {
  return (
    <li ref={ref} className={cn(S.item, className)} {...props} />
  )
}

function PaginationLink({ isActive, className, ref, ...props }: PaginationLinkProps) {
  return (
    <button
      ref={ref}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        S.link.base,
        isActive ? S.link.active : S.link.inactive,
        className,
      )}
      {...props}
    />
  )
}

function PaginationPrevious({ className, ref, ...props }: PaginationPreviousProps) {
  return (
    <button
      ref={ref}
      aria-label={ARIA.previousPage}
      className={cn(S.navButton, className)}
      {...props}
    >
      <ChevronLeft className={S.ellipsisIcon} />
      <span>{LABEL.previous}</span>
    </button>
  )
}

function PaginationNext({ className, ref, ...props }: PaginationNextProps) {
  return (
    <button
      ref={ref}
      aria-label={ARIA.nextPage}
      className={cn(S.navButton, className)}
      {...props}
    >
      <span>{LABEL.next}</span>
      <ChevronRight className={S.ellipsisIcon} />
    </button>
  )
}

function PaginationEllipsis({ className, ref, ...props }: PaginationEllipsisProps) {
  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(S.ellipsis, className)}
      {...props}
    >
      <MoreHorizontal className={S.ellipsisIcon} />
      <span className={S.srOnly}>{SR_ONLY.morePages}</span>
    </span>
  )
}

export const Pagination = Object.assign(PaginationRoot, {
  Content: PaginationContent,
  Item: PaginationItem,
  Link: PaginationLink,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
})

// Individual exports for backward compatibility
export {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
