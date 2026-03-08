'use client'

import { useState, createContext, useContext, useRef, useCallback, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/utils/cn'
import { NavigationStyles as S } from './styles'
import { SPRING, OFFSET } from '../../config'
import { useIsTouchDevice, useClickOutside } from '../../hooks'
import type {
  NavigationRootProps,
  NavigationListProps,
  NavigationItemProps,
  NavigationTriggerProps,
  NavigationContentProps,
  NavigationLinkProps,
} from './types'

// Context to share open state between NavigationItem and NavigationContent
const NavigationItemContext = createContext<{ isOpen: boolean }>({ isOpen: false })

function NavigationRoot({ className, children, ref, ...props }: NavigationRootProps) {
  return (
    <nav
      ref={ref}
      className={cn(S.root, className)}
      {...props}
    >
      {children}
    </nav>
  )
}

function NavigationList({ className, children, ref, ...props }: NavigationListProps) {
  return (
    <ul
      ref={ref}
      className={cn(S.list, className)}
      {...props}
    >
      {children}
    </ul>
  )
}

function NavigationItem({ hasDropdown, className, children, ref: _ref, ...props }: NavigationItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isTouchDevice = useIsTouchDevice()
  const itemRef = useRef<HTMLLIElement>(null)

  // Close dropdown when clicking outside (for touch devices)
  useClickOutside(itemRef, useCallback(() => {
    if (isTouchDevice && isOpen) {
      setIsOpen(false)
    }
  }, [isTouchDevice, isOpen]))

  // Touch devices: click to toggle
  // Desktop: hover to open/close
  const interactionHandlers = isTouchDevice
    ? {
      onClick: () => hasDropdown && setIsOpen((prev) => !prev),
    }
    : {
      onMouseEnter: () => hasDropdown && setIsOpen(true),
      onMouseLeave: () => hasDropdown && setIsOpen(false),
    }

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ isOpen }), [isOpen])

  return (
    <NavigationItemContext.Provider value={contextValue}>
      <li
        ref={itemRef}
        className={cn(S.item, className)}
        {...interactionHandlers}
        {...props}
      >
        {hasDropdown ? (
          <div className={S.itemDropdownWrapper}>
            {children}
          </div>
        )
          : children
        }
      </li>
    </NavigationItemContext.Provider>
  )
}

function NavigationTrigger({ className, children, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: NavigationTriggerProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  const { isOpen } = useContext(NavigationItemContext)

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(S.trigger, className)}
      {...props}
    >
      {children}
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={SPRING.default}
      >
        <ChevronDown className={S.triggerIcon} />
      </motion.span>
    </motion.button>
  )
}

function NavigationContent({ className, children, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: NavigationContentProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  const { isOpen } = useContext(NavigationItemContext)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: -OFFSET.dropdown }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -OFFSET.dropdown }}
          transition={SPRING.default}
          className={cn(S.content, className)}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function NavigationLink({ className, children, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: NavigationLinkProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  return (
    <motion.a
      ref={ref}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(S.link, className)}
      {...props}
    >
      {children}
    </motion.a>
  )
}

export const Navigation = {
  Root: NavigationRoot,
  List: NavigationList,
  Item: NavigationItem,
  Trigger: NavigationTrigger,
  Content: NavigationContent,
  Link: NavigationLink,
}
