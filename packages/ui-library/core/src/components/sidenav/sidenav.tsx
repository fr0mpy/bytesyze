'use client'

import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { SideNavStyles as S, SIDENAV_DIMENSIONS } from './styles'
import { SPRING } from '../../config/motion'
import { cn } from '../../utils/cn'
import type {
  SideNavContextValue,
  SideNavRootProps,
  SideNavHeaderProps,
  SideNavTitleProps,
  SideNavSubtitleProps,
  SideNavNavProps,
  SideNavItemProps,
  SideNavFooterProps,
} from './types'

// =============================================================================
// Context
// =============================================================================

const SideNavContext = createContext<SideNavContextValue | undefined>(undefined)

const useSideNavContext = () => {
  const context = useContext(SideNavContext)
  if (!context) {
    throw new Error('SideNav components must be used within SideNav.Root')
  }
  return context
}

// =============================================================================
// Root Component
// =============================================================================

function SideNavRoot({
  defaultExpanded = false,
  collapsedWidth = SIDENAV_DIMENSIONS.collapsed,
  expandedWidth = SIDENAV_DIMENSIONS.expanded,
  disableHoverExpand = false,
  children,
  className,
  ref,
  // Destructure Framer Motion conflicting props
  onDrag: _onDrag,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onAnimationStart: _onAnimationStart,
  onAnimationEnd: _onAnimationEnd,
  ...props
}: SideNavRootProps & {
  onDrag?: unknown
  onDragStart?: unknown
  onDragEnd?: unknown
  onAnimationStart?: unknown
  onAnimationEnd?: unknown
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const handleMouseEnter = useCallback(() => {
    if (!disableHoverExpand) setIsExpanded(true)
  }, [disableHoverExpand])

  const handleMouseLeave = useCallback(() => {
    if (!disableHoverExpand) setIsExpanded(false)
  }, [disableHoverExpand])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ isExpanded, collapsedWidth, expandedWidth }),
    [isExpanded, collapsedWidth, expandedWidth],
  )

  return (
    <SideNavContext.Provider value={contextValue}>
      <motion.aside
        ref={ref}
        animate={{ width: isExpanded ? expandedWidth : collapsedWidth }}
        transition={SPRING.snappy}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(S.root.base, className)}
        role="navigation"
        aria-label="Main navigation"
        {...props}
      >
        {children}
      </motion.aside>
    </SideNavContext.Provider>
  )
}

// =============================================================================
// Header Components
// =============================================================================

function SideNavHeader({ className, ref, children, ...props }: SideNavHeaderProps) {
  return (
    <div ref={ref} className={cn(S.header.base, className)} {...props}>
      {children}
    </div>
  )
}

function SideNavTitle({
  className,
  ref,
  children,
  // Destructure Framer Motion conflicting props
  onDrag: _onDrag,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onAnimationStart: _onAnimationStart,
  onAnimationEnd: _onAnimationEnd,
  ...props
}: SideNavTitleProps & {
  onDrag?: unknown
  onDragStart?: unknown
  onDragEnd?: unknown
  onAnimationStart?: unknown
  onAnimationEnd?: unknown
}) {
  const { isExpanded } = useSideNavContext()

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.h1
          ref={ref}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={SPRING.snappy}
          className={cn(S.header.title, className)}
          {...props}
        >
          {children}
        </motion.h1>
      )}
    </AnimatePresence>
  )
}

function SideNavSubtitle({
  className,
  ref,
  children,
  // Destructure Framer Motion conflicting props
  onDrag: _onDrag,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onAnimationStart: _onAnimationStart,
  onAnimationEnd: _onAnimationEnd,
  ...props
}: SideNavSubtitleProps & {
  onDrag?: unknown
  onDragStart?: unknown
  onDragEnd?: unknown
  onAnimationStart?: unknown
  onAnimationEnd?: unknown
}) {
  const { isExpanded } = useSideNavContext()

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.p
          ref={ref}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={SPRING.snappy}
          className={cn(S.header.subtitle, className)}
          {...props}
        >
          {children}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

// =============================================================================
// Nav Components
// =============================================================================

function SideNavNav({ className, ref, children, ...props }: SideNavNavProps) {
  return (
    <nav ref={ref} className={cn(S.nav.base, className)} {...props}>
      {children}
    </nav>
  )
}

function SideNavItem({
  icon: Icon,
  href,
  onClick,
  isActive,
  'aria-label': ariaLabel,
  children,
  className,
  ref,
}: SideNavItemProps) {
  const { isExpanded } = useSideNavContext()

  const content = (
    <>
      <Icon className={S.item.icon} aria-hidden="true" />
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={SPRING.snappy}
            className={S.item.label}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  )

  const itemClass = cn(
    S.item.base,
    isActive ? S.item.active : S.item.inactive,
    className,
  )

  if (href) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={itemClass}
        aria-label={ariaLabel}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      className={itemClass}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )
}

// =============================================================================
// Footer Component
// =============================================================================

function SideNavFooter({ className, ref, children, ...props }: SideNavFooterProps) {
  return (
    <div ref={ref} className={cn(S.footer.base, className)} {...props}>
      {children}
    </div>
  )
}

// =============================================================================
// Export with Namespace Pattern
// =============================================================================

export const SideNav = Object.assign(SideNavRoot, {
  Root: SideNavRoot,
  Header: SideNavHeader,
  Title: SideNavTitle,
  Subtitle: SideNavSubtitle,
  Nav: SideNavNav,
  Item: SideNavItem,
  Footer: SideNavFooter,
})

export {
  SideNavRoot,
  SideNavHeader,
  SideNavTitle,
  SideNavSubtitle,
  SideNavNav,
  SideNavItem,
  SideNavFooter,
}

// Re-export context hook for custom components
export { useSideNavContext }
