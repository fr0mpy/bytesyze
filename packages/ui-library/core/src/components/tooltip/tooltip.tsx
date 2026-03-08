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
import { TooltipStyles as S } from './styles'
import { SPRING } from '../../config'
import {
  usePositioning,
  useFloatingPosition,
  type Side,
  type Anchor,
} from '../../hooks'
import type {
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipPortalProps,
  TooltipPositionerProps,
  TooltipPopupProps,
  TooltipArrowProps,
  TooltipContextValue,
} from './types'

// ============================================================================
// Context
// ============================================================================

const TooltipContext = createContext<TooltipContextValue | null>(null)

function useTooltipContext() {
  const context = useContext(TooltipContext)
  if (!context) {
    throw new Error('Tooltip components must be used within Tooltip.Root')
  }
  return context
}

// ============================================================================
// Root
// ============================================================================

function TooltipRoot({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  delayDuration = 0,
  collisionDetection = true,
  collisionPadding = 8,
}: TooltipRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const [side, setSide] = useState<Side>('top')
  const [anchor, setAnchor] = useState<Anchor>('center')
  const triggerRef = useRef<HTMLElement>(null)
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  // Use floating position hook for collision-aware positioning
  const {
    setReference,
    setFloating,
    arrowRef,
    floatingStyles,
    actualSide,
    actualAnchor,
    arrowData,
  } = useFloatingPosition({
    side,
    anchor,
    gap: 8,
    collisionDetection,
    collisionPadding,
    open,
  })

  const setOpen = useCallback(
    (value: boolean) => {
      // Clear any pending delay timer
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current)
        delayTimerRef.current = undefined
      }

      if (value && delayDuration > 0) {
        // Delay opening
        delayTimerRef.current = setTimeout(() => {
          if (!isControlled) {
            setUncontrolledOpen(true)
          }
          onOpenChange?.(true)
        }, delayDuration)
      } else {
        // Immediate open/close
        if (!isControlled) {
          setUncontrolledOpen(value)
        }
        onOpenChange?.(value)
      }
    },
    [isControlled, onOpenChange, delayDuration],
  )

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current)
      }
    }
  }, [])

  return (
    <TooltipContext.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        side,
        setSide,
        anchor,
        setAnchor,
        actualSide,
        actualAnchor,
        arrowRef,
        arrowData,
        setReference,
        setFloating,
        floatingStyles,
      }}
    >
      {children}
    </TooltipContext.Provider>
  )
}

// ============================================================================
// Trigger
// ============================================================================

function TooltipTrigger({ asChild, children, onMouseEnter, onMouseLeave, onFocus, onBlur, ref, ...props }: TooltipTriggerProps) {
  const { setOpen, triggerRef, setReference } = useTooltipContext()

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setOpen(true)
      onMouseEnter?.(e)
    },
    [setOpen, onMouseEnter],
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setOpen(false)
      onMouseLeave?.(e)
    },
    [setOpen, onMouseLeave],
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      setOpen(true)
      onFocus?.(e)
    },
    [setOpen, onFocus],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      setOpen(false)
      onBlur?.(e)
    },
    [setOpen, onBlur],
  )

  // Merge refs - include setReference for floating-ui positioning
  const mergedRef = useCallback(
    (node: HTMLElement | null) => {
      if (typeof ref === 'function') {
        ref(node as HTMLDivElement)
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement
      }
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node
      setReference(node)
    },
    [ref, triggerRef, setReference],
  )

  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ref: mergedRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      ...props,
    })
  }

  return (
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- tooltip trigger uses mouse/focus events for showing tooltip, not interactive behavior */
    <div
      ref={mergedRef as React.Ref<HTMLDivElement>}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={S.trigger}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Portal
// ============================================================================

function TooltipPortal({ children, container }: TooltipPortalProps) {
  const { open } = useTooltipContext()

  // Guard against SSR - document not available on server
  if (typeof document === 'undefined') return null
  if (!open) return null

  return createPortal(children, container ?? document.body)
}

// ============================================================================
// Positioner
// ============================================================================

function TooltipPositioner({
  children,
  side = 'top',
  anchor = 'center',
  className,
}: TooltipPositionerProps) {
  const { setSide, setAnchor, setFloating, floatingStyles } = useTooltipContext()

  // Update preferred side/anchor in context when props change
  useEffect(() => {
    setSide(side)
    setAnchor(anchor)
  }, [side, anchor, setSide, setAnchor])

  return (
    <div
      ref={setFloating}
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

function TooltipPopup({ children, className, ref }: TooltipPopupProps) {
  const { actualSide, open } = useTooltipContext()
  // Use actualSide (post-flip) for animation direction
  const { initialOffset } = usePositioning(actualSide)

  // Bouncy spring config for tooltip
  const bouncySpring = SPRING.tooltip

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="tooltip"
          initial={{ ...initialOffset, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={{ ...initialOffset, opacity: 0 }}
          transition={bouncySpring}
          className={cn(S.popup, className)}
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

function TooltipArrow({ className }: TooltipArrowProps) {
  const { actualSide, arrowRef, arrowData } = useTooltipContext()
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
    [staticSide[actualSide]]: '-4px', // Half arrow size (w-2 = 8px)
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
// Simple Wrapper
// ============================================================================

interface TooltipSimpleProps {
  content: React.ReactNode
  side?: Side
  anchor?: Anchor
  showArrow?: boolean
  children: React.ReactNode
  delayDuration?: number
  /** Enable viewport collision detection (default: true) */
  collisionDetection?: boolean
  /** Padding from viewport edges in pixels (default: 8) */
  collisionPadding?: number
}

function TooltipSimple({
  content,
  side = 'top',
  anchor = 'center',
  showArrow = true,
  children,
  delayDuration,
  collisionDetection,
  collisionPadding,
}: TooltipSimpleProps) {
  return (
    <TooltipRoot
      delayDuration={delayDuration}
      collisionDetection={collisionDetection}
      collisionPadding={collisionPadding}
    >
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipPortal>
        <TooltipPositioner side={side} anchor={anchor}>
          <TooltipPopup>
            {content}
            {showArrow && <TooltipArrow />}
          </TooltipPopup>
        </TooltipPositioner>
      </TooltipPortal>
    </TooltipRoot>
  )
}

// ============================================================================
// Namespace Export (callable + namespace)
// ============================================================================

export const Tooltip = Object.assign(TooltipSimple, {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Positioner: TooltipPositioner,
  Popup: TooltipPopup,
  Arrow: TooltipArrow,
})
