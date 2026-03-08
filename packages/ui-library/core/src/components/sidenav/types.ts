import type { ReactNode, HTMLAttributes, Ref } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface SideNavContextValue {
  isExpanded: boolean
  collapsedWidth: number
  expandedWidth: number
}

export interface SideNavRootProps extends HTMLAttributes<HTMLElement> {
  /** Default expanded state (hover still works) */
  defaultExpanded?: boolean
  /** Width when collapsed in pixels */
  collapsedWidth?: number
  /** Width when expanded in pixels */
  expandedWidth?: number
  /** Disable hover expansion (for pinned mode) */
  disableHoverExpand?: boolean
  children: ReactNode
  ref?: Ref<HTMLElement>
}

export interface SideNavHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface SideNavTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>
}

export interface SideNavSubtitleProps extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>
}

export interface SideNavNavProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
}

export interface SideNavItemProps {
  /** Lucide icon component */
  icon: LucideIcon
  /** Navigation href (renders Link) or undefined (renders button) */
  href?: string
  /** Click handler for button items */
  onClick?: () => void
  /** Active state */
  isActive?: boolean
  /** Accessible label (required for collapsed state) */
  'aria-label': string
  children: ReactNode
  className?: string
  ref?: Ref<HTMLAnchorElement | HTMLButtonElement>
}

export interface SideNavFooterProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}
