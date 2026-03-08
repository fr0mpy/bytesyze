import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { BreadcrumbStyles as S } from './styles'
import { ARIA } from '../../config'
import type {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbSeparatorProps,
  BreadcrumbPageProps,
} from './types'

function BreadcrumbRoot({ className, ref, ...props }: BreadcrumbRootProps) {
  return (
    <nav ref={ref} aria-label={ARIA.breadcrumb} className={cn(S.root, className)} {...props} />
  )
}

function BreadcrumbList({ className, ref, ...props }: BreadcrumbListProps) {
  return (
    <ol
      ref={ref}
      className={cn(S.list, className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ref, ...props }: BreadcrumbItemProps) {
  return (
    <li
      ref={ref}
      className={cn(S.item, className)}
      {...props}
    />
  )
}

function BreadcrumbLink({ className, ref, ...props }: BreadcrumbLinkProps) {
  return (
    <a
      ref={ref}
      className={cn(S.link, className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({ className, children, ref, ...props }: BreadcrumbSeparatorProps) {
  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn(S.separator, className)}
      {...props}
    >
      {children || <ChevronRight className={S.separatorIcon} />}
    </li>
  )
}

function BreadcrumbPage({ className, ref, ...props }: BreadcrumbPageProps) {
  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(S.page, className)}
      {...props}
    />
  )
}

// Namespace Export (callable as Root + namespace)
export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Separator: BreadcrumbSeparator,
  Page: BreadcrumbPage,
})

// Individual exports for backward compatibility
export { BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage }
