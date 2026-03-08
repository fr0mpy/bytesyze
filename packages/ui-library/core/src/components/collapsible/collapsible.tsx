'use client'

import { createContext, useContext, cloneElement, isValidElement, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { CollapsibleStyles as S } from './styles'
import { SPRING, DURATION } from '../../config'
import { useControlledState } from '../../hooks/useControlledState'
import { cn } from '../../utils/cn'
import type {
  CollapsibleContextValue,
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from './types'

const CollapsibleContext = createContext<CollapsibleContextValue | undefined>(undefined)

const useCollapsibleContext = () => {
  const context = useContext(CollapsibleContext)
  if (!context) {
    throw new Error('Collapsible components must be used within a Collapsible.Root')
  }
  return context
}

// ============================================================================
// Collapsible.Root
// ============================================================================

function CollapsibleRoot({ defaultOpen = false, open, onOpenChange, className, children, ref, ...props }: CollapsibleRootProps) {
  const [isOpen, setIsOpen] = useControlledState<boolean>(
    open,
    defaultOpen,
    onOpenChange,
  )

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ open: isOpen, setOpen: setIsOpen }),
    [isOpen, setIsOpen],
  )

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <div ref={ref} data-state={isOpen ? 'open' : 'closed'} className={cn(S.root, className)} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

// ============================================================================
// Collapsible.Trigger
// ============================================================================

function CollapsibleTrigger({ className, children, asChild, ref, ...props }: CollapsibleTriggerProps) {
  const { open, setOpen } = useCollapsibleContext()

  const handleClick = () => setOpen(!open)

  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: handleClick,
      'aria-expanded': open,
      'data-state': open ? 'open' : 'closed',
    } as Partial<unknown>)
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      aria-expanded={open}
      data-state={open ? 'open' : 'closed'}
      className={cn(S.trigger, className)}
      {...props}
    >
      {/* Animated indicator - shows when expanded */}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={SPRING.default}
            className={S.indicator}
          />
        )}
      </AnimatePresence>
      {/* Trigger content above indicator */}
      <span className={S.triggerContent}>
        {children}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={SPRING.default}
          className={S.iconWrapper}
        >
          <ChevronDown className={S.icon} />
        </motion.span>
      </span>
    </button>
  )
}

// ============================================================================
// Collapsible.Content
// ============================================================================

function CollapsibleContent({ className, children, ref, ...props }: CollapsibleContentProps) {
  const { open } = useCollapsibleContext()

  // Destructure drag-related props to avoid conflicts with Framer Motion's drag types
  const { onDrag: _onDrag, onDragEnd: _onDragEnd, onDragStart: _onDragStart, ...motionSafeProps } = props as Record<string, unknown>

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={ref}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              height: { ...SPRING.default },
              opacity: { duration: DURATION.normal, delay: DURATION.instant },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { ...SPRING.default },
              opacity: { duration: DURATION.fast },
            },
          }}
          data-state={open ? 'open' : 'closed'}
          className={S.contentWrapper}
          {...motionSafeProps}
        >
          <div className={cn(S.content, className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// Namespace Export
// ============================================================================

// Namespace Export (callable as Root + namespace)
export const Collapsible = Object.assign(CollapsibleRoot, {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
})

// Individual exports for backward compatibility
export { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent }
