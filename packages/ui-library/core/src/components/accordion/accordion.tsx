'use client'

import { createContext, useContext, useCallback, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { SPRING, DURATION } from '@/config'
import { cn } from '@/utils/cn'
import { AccordionStyles as S } from './styles'
import { useControlledState } from '../../hooks/useControlledState'
import type {
  AccordionContextValue,
  AccordionRootProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './types'

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined)

const useAccordionContext = () => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion.Root')
  }
  return context
}

// ============================================================================
// Accordion.Root
// ============================================================================

function AccordionRoot({ type = 'single', defaultValue, value, onValueChange, className, children, ref, ...props }: AccordionRootProps) {
  const normalizeValue = (val: string | string[] | undefined): string[] => {
    if (val === undefined) return []
    return Array.isArray(val) ? val : [val]
  }

  const [openItems, setOpenItems] = useControlledState<string[]>(
    value !== undefined ? normalizeValue(value) : undefined,
    normalizeValue(defaultValue),
    onValueChange,
  )

  const toggleItem = useCallback((itemValue: string) => {
    if (type === 'single') {
      setOpenItems(prev => prev.includes(itemValue) ? [] : [itemValue])
    } else {
      setOpenItems(prev =>
        prev.includes(itemValue)
          ? prev.filter((item) => item !== itemValue)
          : [...prev, itemValue],
      )
    }
  }, [type, setOpenItems])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ openItems, toggleItem, type }),
    [openItems, toggleItem, type],
  )

  return (
    <AccordionContext.Provider value={contextValue}>
      <div ref={ref} className={cn(S.root, className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

// ============================================================================
// Accordion.Item
// ============================================================================

function AccordionItem({ value, className, children, ref, ...props }: AccordionItemProps) {
  return (
    <div
      ref={ref}
      data-value={value}
      className={cn(S.item, className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Accordion.Header
// ============================================================================

function AccordionHeader({ className, children, ref, ...props }: AccordionHeaderProps) {
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

// ============================================================================
// Accordion.Trigger
// ============================================================================

function AccordionTrigger({ value, className, children, ref, ...props }: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordionContext()
  const isOpen = openItems.includes(value)

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => toggleItem(value)}
      aria-expanded={isOpen}
      className={cn(S.trigger, className)}
      {...props}
    >
      {children}
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={SPRING.default}
        className={S.iconWrapper}
      >
        <ChevronDown className={S.icon} />
      </motion.span>
    </button>
  )
}

// ============================================================================
// Accordion.Content
// ============================================================================

function AccordionContent({ value, className, children, ref, ...props }: AccordionContentProps) {
  const { openItems } = useAccordionContext()
  const isOpen = openItems.includes(value)

  // Destructure drag-related props to avoid conflicts with Framer Motion's drag types
  const { onDrag: _onDrag, onDragEnd: _onDragEnd, onDragStart: _onDragStart, ...motionSafeProps } = props as Record<string, unknown>

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
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
export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
})

// Individual exports for backward compatibility
export { AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent }
