'use client'

import {
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
  useMemo,
  useEffect,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/utils/cn'
import { DropdownMenuStyles as S } from './styles'
import { SPRING } from '../../config'
import { useClickOutside, useEscapeKey } from '../../hooks'
import type {
  MenuAlign,
  MenuItemProps,
  MenuSeparatorProps,
  MenuLabelProps,
} from './types'

// ============================================================================
// Types
// ============================================================================

type TriggerMode = 'click' | 'hover'

interface DropdownMenuRootProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  /** How to trigger the dropdown - click (default) or hover */
  triggerMode?: TriggerMode
  /** Delay before showing on hover (ms) */
  openDelay?: number
  /** Delay before hiding on hover (ms) */
  closeDelay?: number
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  className?: string
}

interface DropdownMenuPortalProps {
  children: React.ReactNode
}

interface DropdownMenuPositionerProps {
  children: React.ReactNode
  className?: string
  align?: MenuAlign
}

interface DropdownMenuPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

// ============================================================================
// Context
// ============================================================================

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLDivElement | null>
  triggerMode: TriggerMode
  openDelay: number
  closeDelay: number
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenuContext() {
  const context = useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu.Root')
  }
  return context
}

// ============================================================================
// Components
// ============================================================================

function DropdownMenuRoot({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  triggerMode = 'click',
  openDelay = 200,
  closeDelay = 300,
}: DropdownMenuRootProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const triggerRef = useRef<HTMLDivElement>(null)
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (newOpen: boolean) => {
      // Clear any pending timers
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current)
        openTimerRef.current = undefined
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = undefined
      }

      // For hover mode, use delays
      if (triggerMode === 'hover') {
        const delay = newOpen ? openDelay : closeDelay
        if (delay > 0) {
          const timerRef = newOpen ? openTimerRef : closeTimerRef
          timerRef.current = setTimeout(() => {
            if (!isControlled) {
              setInternalOpen(newOpen)
            }
            onOpenChange?.(newOpen)
          }, delay)
          return
        }
      }

      // Immediate open/close for click mode or zero delay
      if (!isControlled) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange, triggerMode, openDelay, closeDelay],
  )

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
      triggerRef,
      triggerMode,
      openDelay,
      closeDelay,
    }),
    [open, setOpen, triggerMode, openDelay, closeDelay],
  )

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({ children, className }: DropdownMenuTriggerProps) {
  const { open, setOpen, triggerRef, triggerMode } = useDropdownMenuContext()

  const handleClick = useCallback(() => {
    if (triggerMode === 'click') {
      setOpen(!open)
    }
  }, [open, setOpen, triggerMode])

  const handleMouseEnter = useCallback(() => {
    if (triggerMode === 'hover') {
      setOpen(true)
    }
  }, [setOpen, triggerMode])

  const handleMouseLeave = useCallback(() => {
    if (triggerMode === 'hover') {
      setOpen(false)
    }
  }, [setOpen, triggerMode])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setOpen(!open)
      }
      if (event.key === 'ArrowDown' && !open) {
        event.preventDefault()
        setOpen(true)
      }
    },
    [open, setOpen],
  )

  return (
    <div
      ref={triggerRef}
      role="button"
      tabIndex={0}
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      className={cn(S.trigger, className)}
    >
      {children}
    </div>
  )
}

function DropdownMenuPortal({ children }: DropdownMenuPortalProps) {
  const { open } = useDropdownMenuContext()

  return <AnimatePresence>{open && children}</AnimatePresence>
}

function DropdownMenuPositioner({
  children,
  className,
  align = 'start',
}: DropdownMenuPositionerProps) {
  const { setOpen, triggerMode } = useDropdownMenuContext()
  const positionerRef = useRef<HTMLDivElement>(null)

  useClickOutside(positionerRef, () => setOpen(false), true)
  useEscapeKey(() => setOpen(false))

  // Keep menu open when hovering over it (hover mode)
  const handleMouseEnter = useCallback(() => {
    if (triggerMode === 'hover') {
      setOpen(true)
    }
  }, [setOpen, triggerMode])

  const handleMouseLeave = useCallback(() => {
    if (triggerMode === 'hover') {
      setOpen(false)
    }
  }, [setOpen, triggerMode])

  return (
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- mouse events needed for hover trigger mode */
    <div
      ref={positionerRef}
      className={cn(S.positioner, S.alignment[align], className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

function DropdownMenuPopup({
  className,
  children,
  ref,
  onDrag: _onDrag,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onAnimationStart: _onAnimationStart,
  onAnimationEnd: _onAnimationEnd,
  ...props
}: DropdownMenuPopupProps & {
  onDrag?: unknown
  onDragStart?: unknown
  onDragEnd?: unknown
  onAnimationStart?: unknown
  onAnimationEnd?: unknown
}) {
  const { triggerMode } = useDropdownMenuContext()
  const menuRef = useRef<HTMLDivElement>(null)

  // Focus first item on open (only for click mode)
  useEffect(() => {
    if (triggerMode === 'click') {
      const firstItem = menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')
      firstItem?.focus()
    }
  }, [triggerMode])

  return (
    <motion.div
      ref={ref ?? menuRef}
      role="menu"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={SPRING.tooltip}
      className={cn(S.popup, className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function DropdownMenuItem({
  className,
  children,
  onClick,
  ref,
  onDrag: _onDrag,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onAnimationStart: _onAnimationStart,
  onAnimationEnd: _onAnimationEnd,
  ...props
}: MenuItemProps & {
  onDrag?: unknown
  onDragStart?: unknown
  onDragEnd?: unknown
  onAnimationStart?: unknown
  onAnimationEnd?: unknown
}) {
  const { setOpen } = useDropdownMenuContext()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      setOpen(false)
    },
    [onClick, setOpen],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const currentTarget = event.currentTarget
      const parent = currentTarget.closest('[role="menu"]')
      const items = parent?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')

      if (!items) return

      const currentIndex = Array.from(items).indexOf(currentTarget)

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const nextIndex = (currentIndex + 1) % items.length
        items[nextIndex]?.focus()
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        const prevIndex = (currentIndex - 1 + items.length) % items.length
        items[prevIndex]?.focus()
      }
    },
    [],
  )

  return (
    <motion.button
      ref={ref}
      role="menuitem"
      whileHover={{ backgroundColor: 'var(--muted)' }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING.snappy}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(S.item, className)}
      {...props}
    >
      {children}
    </motion.button>
  )
}

function DropdownMenuSeparator({ className, ref, ...props }: MenuSeparatorProps) {
  return (
    <div
      ref={ref}
      role="separator"
      className={cn(S.separator, className)}
      {...props}
    />
  )
}

function DropdownMenuLabel({ className, children, ref, ...props }: MenuLabelProps) {
  return (
    <div
      ref={ref}
      className={cn(S.label, className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Simple Wrapper
// ============================================================================

interface DropdownMenuSimpleProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: MenuAlign
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** How to trigger the dropdown - click (default) or hover */
  triggerMode?: TriggerMode
  /** Delay before showing on hover (ms) */
  openDelay?: number
  /** Delay before hiding on hover (ms) */
  closeDelay?: number
}

function DropdownMenuSimple({
  trigger,
  children,
  align = 'start',
  open,
  onOpenChange,
  triggerMode = 'click',
  openDelay,
  closeDelay,
}: DropdownMenuSimpleProps) {
  return (
    <DropdownMenuRoot
      open={open}
      onOpenChange={onOpenChange}
      triggerMode={triggerMode}
      openDelay={openDelay}
      closeDelay={closeDelay}
    >
      <div className={S.wrapper}>
        <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner align={align}>
            <DropdownMenuPopup>{children}</DropdownMenuPopup>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </div>
    </DropdownMenuRoot>
  )
}

// ============================================================================
// Namespace Export (callable + namespace)
// ============================================================================

export const DropdownMenu = Object.assign(DropdownMenuSimple, {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Portal: DropdownMenuPortal,
  Positioner: DropdownMenuPositioner,
  Popup: DropdownMenuPopup,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
})

// Individual exports for backward compatibility
export { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel }
