'use client'

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
} from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { DrawerStyles as S, SIDE_POSITIONS } from './styles'
import { DURATION, ARIA, SLIDE } from '../../config'
import {
  useControlledState,
  useBodyScrollLock,
  useEscapeKey,
  SPRING_CONFIG,
} from '../../hooks'
import { ScrollArea } from '../display/scroll-area'
import { Button } from '../form/button'
import type {
  DrawerContextValue,
  DrawerRootProps,
  DrawerPortalProps,
  DrawerBackdropProps,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerTitleProps,
  DrawerCloseProps,
  DrawerSide,
} from './types'

// Context
const DrawerContext = createContext<DrawerContextValue | undefined>(undefined)

const useDrawerContext = () => {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error('Drawer components must be used within a Drawer.Root')
  }
  return context
}

// Sub-components
function DrawerRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  side = 'right',
  children,
}: DrawerRootProps) {
  const [isOpen, setIsOpen] = useControlledState(open, defaultOpen, onOpenChange)

  const handleSetOpen = useCallback(
    (newOpen: boolean) => {
      setIsOpen(newOpen)
    },
    [setIsOpen],
  )

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ open: isOpen, setOpen: handleSetOpen, side }),
    [isOpen, handleSetOpen, side],
  )

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  )
}

function DrawerPortal({ children }: DrawerPortalProps) {
  const { open } = useDrawerContext()

  // Use body scroll lock from shared hooks
  useBodyScrollLock(open)

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && <div className={S.portal}>{children}</div>}
    </AnimatePresence>,
    document.body,
  )
}

function DrawerBackdrop({ className, onClick: _onClick, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: DrawerBackdropProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  const { setOpen } = useDrawerContext()

  const handleClick = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.normal }}
      className={cn(S.backdrop, className)}
      onClick={handleClick}
      aria-hidden="true"
      {...props}
    />
  )
}

function DrawerContent({ className, children, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: DrawerContentProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  const { setOpen, side } = useDrawerContext()

  // Handle escape key using shared hook
  useEscapeKey(() => setOpen(false))

  const variants = SLIDE[side]

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={SPRING_CONFIG.default}
      className={cn(S.content.base, SIDE_POSITIONS[side], className)}
      {...props}
    >
      <ScrollArea className={S.scrollArea}>{children}</ScrollArea>
    </motion.div>
  )
}

function DrawerHeader({ className, children, ref, ...props }: DrawerHeaderProps) {
  return (
    <div
      ref={ref}
      className={cn(S.header, className)}
      {...props}
    >
      {children}
    </div>
  )
}

function DrawerTitle({ className, children, ref, ...props }: DrawerTitleProps) {
  return (
    <h2
      ref={ref}
      id="drawer-title"
      className={cn(S.title, className)}
      {...props}
    >
      {children}
    </h2>
  )
}

function DrawerClose({ asChild, children, onClick, className, ref, ...props }: DrawerCloseProps) {
  const { setOpen } = useDrawerContext()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onClick?.(e as React.MouseEvent<HTMLButtonElement>)
      setOpen(false)
    },
    [onClick, setOpen],
  )

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{
        onClick?: (e: React.MouseEvent) => void
        ref?: React.Ref<HTMLButtonElement>
      }>,
      {
        onClick: handleClick,
        ref,
      },
    )
  }

  // Default close button
  if (!children) {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={cn(S.closeButton, className)}
        aria-label={ARIA.close}
        {...props}
      >
        <X className={S.closeIcon} />
      </Button>
    )
  }

  return (
    <Button ref={ref} variant="ghost" onClick={handleClick} className={className} {...props}>
      {children}
    </Button>
  )
}

// ============================================================================
// Simple Wrapper
// ============================================================================

interface DrawerSimpleProps {
  open?: boolean
  onClose?: () => void
  title?: string
  side?: DrawerSide
  children: React.ReactNode
}

function DrawerSimple({
  open,
  onClose,
  title,
  side = 'right',
  children,
}: DrawerSimpleProps) {
  return (
    <DrawerRoot open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()} side={side}>
      <DrawerPortal>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          <ScrollArea className={S.scrollAreaPadded}>
            {children}
          </ScrollArea>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  )
}

// Namespace export (callable + namespace)
export const Drawer = Object.assign(DrawerSimple, {
  Root: DrawerRoot,
  Portal: DrawerPortal,
  Backdrop: DrawerBackdrop,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Close: DrawerClose,
})

// Also export individual components for flexibility
export {
  DrawerRoot,
  DrawerPortal,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
}
