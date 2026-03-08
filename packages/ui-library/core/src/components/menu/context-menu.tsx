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
import { ContextMenuStyles as S } from './styles'
import { useClickOutside, SPRING_CONFIG } from '../../hooks'
import type {
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuPortalProps,
  ContextMenuPositionerProps,
  ContextMenuPopupProps,
  MenuItemProps,
  MenuSeparatorProps,
} from './types'

// ============================================================================
// Context
// ============================================================================

interface ContextMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  position: { x: number; y: number }
  setPosition: (position: { x: number; y: number }) => void
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null)

function useContextMenuContext() {
  const context = useContext(ContextMenuContext)
  if (!context) {
    throw new Error('ContextMenu components must be used within ContextMenu.Root')
  }
  return context
}

// ============================================================================
// Components
// ============================================================================

function ContextMenuRoot({
  children,
  open: controlledOpen,
  onOpenChange,
}: ContextMenuRootProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

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
      position,
      setPosition,
    }),
    [open, setOpen, position],
  )

  return (
    <ContextMenuContext.Provider value={contextValue}>{children}</ContextMenuContext.Provider>
  )
}

function ContextMenuTrigger({ children, className }: ContextMenuTriggerProps) {
  const { setOpen, setPosition } = useContextMenuContext()

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      setPosition({ x: event.clientX, y: event.clientY })
      setOpen(true)
    },
    [setOpen, setPosition],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Shift+F10 or Context Menu key opens context menu
      if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
        event.preventDefault()
        const target = event.currentTarget as HTMLElement
        const rect = target.getBoundingClientRect()
        setPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        setOpen(true)
      }
    },
    [setOpen, setPosition],
  )

  return (
    <div
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      className={className}
      role="button"
      tabIndex={0}
      aria-haspopup="menu"
    >
      {children}
    </div>
  )
}

function ContextMenuPortal({ children }: ContextMenuPortalProps) {
  const { open } = useContextMenuContext()

  return <AnimatePresence>{open && children}</AnimatePresence>
}

function ContextMenuPositioner({ children, className }: ContextMenuPositionerProps) {
  const { setOpen, position } = useContextMenuContext()
  const positionerRef = useRef<HTMLDivElement>(null)

  useClickOutside(positionerRef, () => setOpen(false), true)

  return (
    <div
      ref={positionerRef}
      className={cn(S.positioner, className)}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {children}
    </div>
  )
}

function ContextMenuPopup({ className, children, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: ContextMenuPopupProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  return (
    <motion.div
      ref={ref}
      role="menu"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={SPRING_CONFIG.default}
      className={cn(S.popup, className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function ContextMenuItem({ className, children, onClick, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: MenuItemProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  const { setOpen } = useContextMenuContext()

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

function ContextMenuSeparator({ className, ref, ...props }: MenuSeparatorProps) {
  return (
    <div
      ref={ref}
      role="separator"
      className={cn(S.separator, className)}
      {...props}
    />
  )
}

// ============================================================================
// Simple Wrapper
// ============================================================================

interface ContextMenuSimpleProps {
  trigger: React.ReactNode
  children: React.ReactNode
}

function ContextMenuSimple({ trigger, children }: ContextMenuSimpleProps) {
  return (
    <ContextMenuRoot>
      <ContextMenuTrigger>{trigger}</ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuPositioner>
          <ContextMenuPopup>{children}</ContextMenuPopup>
        </ContextMenuPositioner>
      </ContextMenuPortal>
    </ContextMenuRoot>
  )
}

// ============================================================================
// Namespace Export (callable + namespace)
// ============================================================================

export const ContextMenu = Object.assign(ContextMenuSimple, {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Portal: ContextMenuPortal,
  Positioner: ContextMenuPositioner,
  Popup: ContextMenuPopup,
  Item: ContextMenuItem,
  Separator: ContextMenuSeparator,
})

// Individual exports for backward compatibility
export { ContextMenuItem, ContextMenuSeparator }
