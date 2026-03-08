'use client'

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  cloneElement,
  isValidElement,
  useEffect,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { PopoverStyles as S } from './styles'
import {
  usePositioning,
  useFloatingPosition,
  useClickOutside,
  SPRING_CONFIG,
  type Side,
} from '../../hooks'
import type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverPortalProps,
  PopoverPositionerProps,
  PopoverPopupProps,
  PopoverArrowProps,
  PopoverCloseProps,
  PopoverContextValue,
} from './types'

// ============================================================================
// Context
// ============================================================================

const PopoverContext = createContext<PopoverContextValue | null>(null)

function usePopoverContext() {
  const context = useContext(PopoverContext)
  if (!context) {
    throw new Error('Popover components must be used within Popover.Root')
  }
  return context
}

// ============================================================================
// Root
// ============================================================================

function PopoverRoot({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  collisionDetection = true,
  collisionPadding = 8,
}: PopoverRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const [side, setSide] = useState<Side>('bottom')
  const triggerRef = useRef<HTMLButtonElement>(null)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  // Use floating position hook for collision-aware positioning
  const {
    setReference,
    setFloating,
    arrowRef,
    floatingStyles,
    actualSide,
    arrowData,
  } = useFloatingPosition({
    side,
    anchor: 'center',
    gap: 8,
    collisionDetection,
    collisionPadding,
    open,
  })

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(value)
      }
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange],
  )

  return (
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        side,
        setSide,
        actualSide,
        arrowRef,
        arrowData,
        setReference,
        setFloating,
        floatingStyles,
      }}
    >
      {children}
    </PopoverContext.Provider>
  )
}

// ============================================================================
// Trigger
// ============================================================================

function PopoverTrigger({ asChild, children, onClick, ref, ...props }: PopoverTriggerProps) {
  const { open, setOpen, triggerRef, setReference } = usePopoverContext()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(!open)
      onClick?.(e)
    },
    [open, setOpen, onClick],
  )

  // Merge refs - include setReference for floating-ui positioning
  const mergedRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      }
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      setReference(node)
    },
    [ref, triggerRef, setReference],
  )

  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ref: mergedRef,
      onClick: handleClick,
      'aria-expanded': open,
      'aria-haspopup': 'dialog',
      ...props,
    })
  }

  return (
    <button
      ref={mergedRef}
      type="button"
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup="dialog"
      {...props}
    >
      {children}
    </button>
  )
}

// ============================================================================
// Portal
// ============================================================================

function PopoverPortal({ children, container }: PopoverPortalProps) {
  const { open } = usePopoverContext()

  // Guard against SSR - document not available on server
  if (typeof document === 'undefined') return null
  if (!open) return null

  return createPortal(children, container ?? document.body)
}

// ============================================================================
// Positioner
// ============================================================================

function PopoverPositioner({
  children,
  side = 'bottom',
  className,
}: PopoverPositionerProps) {
  const { setSide, setOpen, setFloating, floatingStyles } = usePopoverContext()
  const positionerRef = useRef<HTMLDivElement>(null)

  // Update preferred side in context when prop changes
  useEffect(() => {
    setSide(side)
  }, [side, setSide])

  // Close on click outside
  useClickOutside(positionerRef, () => setOpen(false), true)

  // Merge setFloating with local ref for click outside detection
  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      (positionerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      setFloating(node)
    },
    [setFloating],
  )

  return (
    <div
      ref={mergedRef}
      className={cn(S.positioner, className)}
      style={floatingStyles}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Popup
// ============================================================================

function PopoverPopup({ children, className, ref }: PopoverPopupProps) {
  const { actualSide, open } = usePopoverContext()
  // Use actualSide (post-flip) for animation direction
  const { originClass, initialOffset } = usePositioning(actualSide)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          initial={{ opacity: 0, scale: 0.95, ...initialOffset }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, ...initialOffset }}
          transition={SPRING_CONFIG.default}
          className={cn(S.popup.base, originClass, className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// Arrow
// ============================================================================

function PopoverArrow({ className }: PopoverArrowProps) {
  const { actualSide, arrowRef, arrowData } = usePopoverContext()
  const { arrowRotation } = usePositioning(actualSide)

  // Calculate arrow position based on floating-ui data
  const staticSide: Record<Side, string> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }

  const arrowStyles: React.CSSProperties = {
    position: 'absolute',
    left: arrowData?.x != null ? `${arrowData.x}px` : '',
    top: arrowData?.y != null ? `${arrowData.y}px` : '',
    [staticSide[actualSide]]: '-6px', // Half arrow size (w-3 = 12px)
    transform: `rotate(${arrowRotation + 45}deg)`, // +45° for diamond shape
  }

  return (
    <span
      ref={arrowRef as React.Ref<HTMLSpanElement>}
      className={cn(S.arrow.base, className)}
      style={arrowStyles}
      aria-hidden="true"
    />
  )
}

// ============================================================================
// Close
// ============================================================================

function PopoverClose({ asChild, children, onClick, ref, ...props }: PopoverCloseProps) {
  const { setOpen } = usePopoverContext()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(false)
      onClick?.(e)
    },
    [setOpen, onClick],
  )

  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ref,
      onClick: handleClick,
      ...props,
    })
  }

  return (
    <button ref={ref} type="button" onClick={handleClick} {...props}>
      {children
        ?? <span className={S.srOnly}>Close</span>
      }
    </button>
  )
}

// ============================================================================
// Simple Wrapper
// ============================================================================

interface PopoverSimpleProps {
  trigger: React.ReactNode
  children: React.ReactNode
  side?: Side
  showArrow?: boolean
  /** Enable viewport collision detection (default: true) */
  collisionDetection?: boolean
  /** Padding from viewport edges in pixels (default: 8) */
  collisionPadding?: number
}

function PopoverSimple({
  trigger,
  children,
  side = 'bottom',
  showArrow = true,
  collisionDetection,
  collisionPadding,
}: PopoverSimpleProps) {
  return (
    <PopoverRoot
      collisionDetection={collisionDetection}
      collisionPadding={collisionPadding}
    >
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner side={side}>
          <PopoverPopup>
            {children}
            {showArrow && <PopoverArrow />}
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </PopoverRoot>
  )
}

// ============================================================================
// Namespace Export (callable + namespace)
// ============================================================================

export const Popover = Object.assign(PopoverSimple, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Positioner: PopoverPositioner,
  Popup: PopoverPopup,
  Arrow: PopoverArrow,
  Close: PopoverClose,
})
