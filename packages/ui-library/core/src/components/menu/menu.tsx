'use client'

import {
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/utils/cn'
import { MenuStyles as S } from './styles'
import { useClickOutside, SPRING_CONFIG } from '../../hooks'
import type {
  MenuRootProps,
  MenuTriggerProps,
  MenuPortalProps,
  MenuPositionerProps,
  MenuPopupProps,
  MenuItemProps,
  MenuSeparatorProps,
  MenuLabelProps,
} from './types'

// ============================================================================
// Context
// ============================================================================

interface MenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

function useMenuContext() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('Menu components must be used within Menu.Root')
  }
  return context
}

// ============================================================================
// Components
// ============================================================================

function MenuRoot({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: MenuRootProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange],
  )

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
    }),
    [open, setOpen],
  )

  return <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
}

function MenuTrigger({ children, className }: MenuTriggerProps) {
  const { open, setOpen } = useMenuContext()

  const handleClick = useCallback(() => {
    setOpen(!open)
  }, [open, setOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
    },
    [setOpen],
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(S.trigger, className)}
    >
      {children}
    </div>
  )
}

function MenuPortal({ children }: MenuPortalProps) {
  const { open } = useMenuContext()

  return <AnimatePresence>{open && children}</AnimatePresence>
}

function MenuPositioner({ align = 'start', children, className }: MenuPositionerProps) {
  const { setOpen } = useMenuContext()
  const positionerRef = useRef<HTMLDivElement>(null)

  useClickOutside(
    positionerRef,
    () => setOpen(false),
    true,
  )

  return (
    <div ref={positionerRef} className={cn(S.positioner, S.alignment[align], className)}>
      {children}
    </div>
  )
}

function MenuPopup({ className, children, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: MenuPopupProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  return (
    <motion.div
      ref={ref}
      role="menu"
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={SPRING_CONFIG.default}
      className={cn(S.popup, className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function MenuItem({ className, children, onClick, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: MenuItemProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  const { setOpen } = useMenuContext()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      setOpen(false)
    },
    [onClick, setOpen],
  )

  return (
    <motion.button
      ref={ref}
      role="menuitem"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={cn(S.item, className)}
      {...props}
    >
      {children}
    </motion.button>
  )
}

function MenuSeparator({ className, ref, ...props }: MenuSeparatorProps) {
  return (
    <div
      ref={ref}
      role="separator"
      className={cn(S.separator, className)}
      {...props}
    />
  )
}

function MenuLabel({ className, children, ref, ...props }: MenuLabelProps) {
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
// Namespace Export
// ============================================================================

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Positioner: MenuPositioner,
  Popup: MenuPopup,
  Item: MenuItem,
  Separator: MenuSeparator,
  Label: MenuLabel,
}
