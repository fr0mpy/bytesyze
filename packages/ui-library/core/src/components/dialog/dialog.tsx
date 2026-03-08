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
import { DialogStyles as S } from './styles'
import { ARIA, POPUP_SLIDE, BACKDROP } from '../../config'
import {
  useControlledState,
  useBodyScrollLock,
  useEscapeKey,
} from '../../hooks'
import { Button } from '../form/button'
import type {
  DialogContextValue,
  DialogRootProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogBackdropProps,
  DialogPopupProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogCloseProps,
  DialogContentProps,
} from './types'

// Context
const DialogContext = createContext<DialogContextValue | undefined>(undefined)

const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog.Root')
  }
  return context
}

// Sub-components
function DialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  blocking = false,
  children,
}: DialogRootProps) {
  const [isOpen, setIsOpen] = useControlledState(open, defaultOpen, onOpenChange)

  const handleSetOpen = useCallback(
    (newOpen: boolean) => {
      setIsOpen(newOpen)
    },
    [setIsOpen],
  )

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ open: isOpen, setOpen: handleSetOpen, blocking }),
    [isOpen, handleSetOpen, blocking],
  )

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({ asChild, children, onClick, ref, ...props }: DialogTriggerProps) {
  const { setOpen } = useDialogContext()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onClick?.(e as React.MouseEvent<HTMLButtonElement>)
      setOpen(true)
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

  return (
    <Button ref={ref} variant="text" onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}

function DialogPortal({ children }: DialogPortalProps) {
  const { open } = useDialogContext()

  // Use body scroll lock from shared hooks
  useBodyScrollLock(open)

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>{open && children}</AnimatePresence>,
    document.body,
  )
}

function DialogBackdrop({ className, onClick: _onClick, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: DialogBackdropProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  const { setOpen, blocking } = useDialogContext()

  const handleClick = useCallback(() => {
    if (!blocking) {
      setOpen(false)
    }
  }, [blocking, setOpen])

  return (
    <motion.div
      ref={ref}
      variants={BACKDROP}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(S.backdrop, blocking && S.backdropBlocking, className)}
      onClick={handleClick}
      aria-hidden="true"
      {...props}
    />
  )
}

function DialogPopup({ className, children, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: DialogPopupProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  const { setOpen, blocking } = useDialogContext()

  // Handle escape key using shared hook
  useEscapeKey(() => setOpen(false), !blocking)

  return (
    <div className={S.portal}>
      <motion.div
        ref={ref}
        role={blocking ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        variants={POPUP_SLIDE}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(S.content, className)}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  )
}

function DialogHeader({ className, ref, ...props }: DialogHeaderProps) {
  return (
    <div
      ref={ref}
      className={cn(S.header, className)}
      {...props}
    />
  )
}

function DialogTitle({ className, children, ref, ...props }: DialogTitleProps) {
  return (
    <h2
      ref={ref}
      className={cn(S.title, className)}
      {...props}
    >
      {children}
    </h2>
  )
}

function DialogDescription({ className, ref, ...props }: DialogDescriptionProps) {
  return (
    <p
      ref={ref}
      className={cn(S.description, className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ref, ...props }: DialogFooterProps) {
  return (
    <div
      ref={ref}
      className={cn(S.footer, className)}
      {...props}
    />
  )
}

function DialogClose({ asChild, children, onClick, className, ref, ...props }: DialogCloseProps) {
  const { setOpen, blocking } = useDialogContext()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onClick?.(e as React.MouseEvent<HTMLButtonElement>)
      if (!blocking) {
        setOpen(false)
      }
    },
    [onClick, blocking, setOpen],
  )

  // Don't render close button for blocking dialogs unless explicitly provided
  if (blocking && !children) {
    return null
  }

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
        variant="inset"
        size="sm"
        iconOnly
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

/**
 * Composite DialogContent - wraps Portal + Backdrop + Popup for simple usage.
 * Handles portal rendering, backdrop, and escape key automatically.
 */
function DialogContent({ className, children, showClose = true, ref, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogBackdrop key="backdrop" />
      <DialogPopup key="popup" ref={ref} className={className} {...props}>
        {showClose && <DialogClose />}
        {children}
      </DialogPopup>
    </DialogPortal>
  )
}

// Namespace export (callable as Root + namespace)
export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Backdrop: DialogBackdrop,
  Popup: DialogPopup,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Close: DialogClose,
})

// Also export individual components for flexibility
export {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
}
