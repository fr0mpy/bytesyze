'use client'

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { DatePickerStyles as S } from './styles'
import { POPUP, BACKDROP } from '../../config'
import { formatDate, formatDateRange, today } from './utils/date-utils'
import { useClickOutsideMultiple } from '../../hooks/useClickOutside'
import { useControlledState } from '../../hooks/useControlledState'
import { useEscapeKey } from '../../hooks/useEscapeKey'
import type {
  DatePickerContextValue,
  DatePickerRootProps,
  DatePickerTriggerProps,
  DatePickerValueProps,
  DatePickerPortalProps,
  DatePickerPopupProps,
  DatePickerContentProps,
  DatePickerHeaderProps,
  DatePickerFooterProps,
  DatePickerCloseProps,
  DatePickerApplyProps,
  DatePickerCancelProps,
  DateValue,
  DatePickerView,
} from './types'

// =============================================================================
// Context
// =============================================================================

const DatePickerContext = createContext<DatePickerContextValue | undefined>(undefined)

export const useDatePickerContext = () => {
  const context = useContext(DatePickerContext)
  if (!context) {
    throw new Error('DatePicker components must be used within a DatePicker.Root')
  }
  return context
}

// =============================================================================
// DatePicker.Root
// =============================================================================

function DatePickerRoot({
  children,
  mode = 'single',
  open,
  defaultOpen = false,
  onOpenChange,
  value,
  defaultValue = null,
  onValueChange,
  rangeValue,
  defaultRangeValue = null,
  onRangeChange,
  minDate,
  maxDate,
  disabledDates,
  weekStartDay = 1, // Monday default
  presets,
  locale = 'en-US',
  disabled = false,
}: DatePickerRootProps) {
  // Open state
  const [isOpen, setIsOpen] = useControlledState(open, defaultOpen, onOpenChange)

  // View state (days/months/years)
  const [view, setView] = useState<DatePickerView>('days')

  // Single date selection
  const [selectedDate, setSelectedDate] = useControlledState(value, defaultValue, onValueChange)

  // Range selection
  const [selectedRange, setSelectedRange] = useControlledState(rangeValue, defaultRangeValue, onRangeChange)
  const [rangeSelectionStart, setRangeSelectionStart] = useState<DateValue>(null)
  const [hoveredDate, setHoveredDate] = useState<DateValue>(null)

  // Navigation
  const initialDate = useMemo(() => {
    if (mode === 'single' && selectedDate) return selectedDate
    if (mode === 'range' && selectedRange?.start) return selectedRange.start
    return today()
  }, [mode, selectedDate, selectedRange])

  const [focusedDate, setFocusedDate] = useState(initialDate)
  const [viewDate, setViewDate] = useState(initialDate)

  // Preset tracking
  const [activePreset, setActivePreset] = useState<string | null>(null)

  // Refs
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // Reset view when closing
  useEffect(() => {
    if (!isOpen) {
      setView('days')
      setRangeSelectionStart(null)
      setHoveredDate(null)
    }
  }, [isOpen])

  // Sync viewDate with selection when opening
  useEffect(() => {
    if (isOpen) {
      const dateToView = mode === 'single' && selectedDate
        ? selectedDate
        : mode === 'range' && selectedRange?.start
          ? selectedRange.start
          : today()
      setViewDate(dateToView)
      setFocusedDate(dateToView)
    }
  }, [isOpen, mode, selectedDate, selectedRange])

  // Confirm action
  const confirm = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  // Cancel action
  const cancel = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const contextValue = useMemo<DatePickerContextValue>(
    () => ({
      mode,
      isOpen,
      setIsOpen,
      view,
      setView,
      selectedDate,
      setSelectedDate,
      selectedRange,
      setSelectedRange,
      rangeSelectionStart,
      setRangeSelectionStart,
      hoveredDate,
      setHoveredDate,
      focusedDate,
      setFocusedDate,
      viewDate,
      setViewDate,
      minDate,
      maxDate,
      disabledDates,
      weekStartDay,
      presets,
      activePreset,
      setActivePreset,
      triggerRef,
      popupRef,
      locale,
      disabled,
      confirm,
      cancel,
    }),
    [
      mode,
      isOpen,
      setIsOpen,
      view,
      selectedDate,
      setSelectedDate,
      selectedRange,
      setSelectedRange,
      rangeSelectionStart,
      hoveredDate,
      focusedDate,
      viewDate,
      minDate,
      maxDate,
      disabledDates,
      weekStartDay,
      presets,
      activePreset,
      locale,
      disabled,
      confirm,
      cancel,
    ],
  )

  return (
    <DatePickerContext.Provider value={contextValue}>
      {children}
    </DatePickerContext.Provider>
  )
}

// =============================================================================
// DatePicker.Trigger
// =============================================================================

function DatePickerTrigger({
  children,
  className,
  ref,
  // Destructure conflicting props to avoid motion type errors
  onDrag: _onDrag,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onAnimationStart: _onAnimationStart,
  onAnimationEnd: _onAnimationEnd,
  ...props
}: DatePickerTriggerProps) {
  const { isOpen, setIsOpen, triggerRef, disabled } = useDatePickerContext()

  const handleClick = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }, [disabled, setIsOpen, isOpen])

  // Combine refs
  const combinedRef = (node: HTMLButtonElement | null) => {
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    }
    ;(triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
  }

  return (
    <motion.button
      ref={combinedRef}
      type="button"
      disabled={disabled}
      onClick={handleClick}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      className={cn(
        S.trigger.base,
        S.trigger.width.auto,
        isOpen && S.trigger.open,
        className,
      )}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// =============================================================================
// DatePicker.Value
// =============================================================================

function DatePickerValue({
  placeholder = 'Select date',
  formatRange: customFormatRange,
  formatDate: customFormatDate,
}: DatePickerValueProps) {
  const { mode, selectedDate, selectedRange, locale } = useDatePickerContext()

  const displayValue = useMemo(() => {
    if (mode === 'single') {
      if (!selectedDate) return null
      return customFormatDate
        ? customFormatDate(selectedDate)
        : formatDate(selectedDate, locale)
    }

    if (mode === 'range') {
      if (!selectedRange?.start && !selectedRange?.end) return null
      if (selectedRange.start && selectedRange.end) {
        return customFormatRange
          ? customFormatRange(selectedRange)
          : formatDateRange(selectedRange, locale)
      }
      if (selectedRange.start) {
        return `${formatDate(selectedRange.start, locale)  } - ...`
      }
    }

    return null
  }, [mode, selectedDate, selectedRange, locale, customFormatRange, customFormatDate])

  return (
    <>
      <CalendarIcon className={S.value.icon} />
      <span className={cn(S.value.base, !displayValue && S.value.placeholder)}>
        {displayValue || placeholder}
      </span>
    </>
  )
}

// =============================================================================
// DatePicker.Portal
// =============================================================================

function DatePickerPortal({ children, container }: DatePickerPortalProps) {
  const { isOpen } = useDatePickerContext()

  // Guard against SSR
  if (typeof document === 'undefined') return null

  const portalContainer = container ?? document.body

  return createPortal(
    <AnimatePresence>{isOpen && children}</AnimatePresence>,
    portalContainer,
  )
}

// =============================================================================
// DatePicker.Popup
// =============================================================================

function DatePickerPopup({
  children,
  className,
  ref,
  // Destructure conflicting props to avoid motion type errors
  onDrag: _onDrag,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onAnimationStart: _onAnimationStart,
  onAnimationEnd: _onAnimationEnd,
  ...props
}: DatePickerPopupProps) {
  const { setIsOpen, popupRef, triggerRef } = useDatePickerContext()

  // Close on click outside (using multiple refs to exclude both popup and trigger)
  useClickOutsideMultiple(
    [popupRef as React.RefObject<HTMLElement>, triggerRef as React.RefObject<HTMLElement>],
    () => setIsOpen(false),
  )

  // Close on escape
  useEscapeKey(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  })

  // Combine refs
  const combinedRef = (node: HTMLDivElement | null) => {
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    }
    ;(popupRef as React.MutableRefObject<HTMLDivElement | null>).current = node
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className={S.backdrop}
        variants={BACKDROP}
        initial="initial"
        animate="animate"
        exit="exit"
        aria-hidden="true"
      />

      {/* Popup */}
      <motion.div
        ref={combinedRef}
        role="dialog"
        aria-modal="true"
        aria-label="Date picker"
        variants={POPUP}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(S.popup.base, S.popup.positioning, className)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  )
}

// =============================================================================
// DatePicker.Content
// =============================================================================

function DatePickerContent({
  children,
  showPresets = false,
  className,
  ref,
  ...props
}: DatePickerContentProps) {
  return (
    <div
      ref={ref}
      className={cn(S.content.base, showPresets && S.content.withPresets, className)}
      {...props}
    >
      {children}
    </div>
  )
}

// =============================================================================
// DatePicker.Header
// =============================================================================

function DatePickerHeader({ children, className, ref, ...props }: DatePickerHeaderProps) {
  return (
    <div ref={ref} className={cn(S.header.base, className)} {...props}>
      {children}
    </div>
  )
}

// =============================================================================
// DatePicker.Footer
// =============================================================================

function DatePickerFooter({ children, className, ref, ...props }: DatePickerFooterProps) {
  return (
    <div ref={ref} className={cn(S.footer.container, className)} {...props}>
      {children}
    </div>
  )
}

// =============================================================================
// DatePicker.Close
// =============================================================================

function DatePickerClose({ children, className, ref, ...props }: DatePickerCloseProps) {
  const { setIsOpen, triggerRef } = useDatePickerContext()

  const handleClick = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [setIsOpen, triggerRef])

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={cn(S.header.closeButton, className)}
      aria-label="Close"
      {...props}
    >
      {children ?? <X className={S.header.closeIcon} />}
    </button>
  )
}

// =============================================================================
// DatePicker.Apply
// =============================================================================

function DatePickerApply({ children, className, ref, ...props }: DatePickerApplyProps) {
  const { confirm, mode, selectedDate, selectedRange } = useDatePickerContext()

  const isDisabled = mode === 'single'
    ? !selectedDate
    : !selectedRange?.start || !selectedRange?.end

  return (
    <button
      ref={ref}
      type="button"
      onClick={confirm}
      disabled={isDisabled}
      className={className}
      {...props}
    >
      {children ?? 'Apply'}
    </button>
  )
}

// =============================================================================
// DatePicker.Cancel
// =============================================================================

function DatePickerCancel({ children, className, ref, ...props }: DatePickerCancelProps) {
  const { cancel } = useDatePickerContext()

  return (
    <button
      ref={ref}
      type="button"
      onClick={cancel}
      className={className}
      {...props}
    >
      {children ?? 'Cancel'}
    </button>
  )
}

// =============================================================================
// Namespace Export
// =============================================================================

export const DatePicker = {
  Root: DatePickerRoot,
  Trigger: DatePickerTrigger,
  Value: DatePickerValue,
  Portal: DatePickerPortal,
  Popup: DatePickerPopup,
  Content: DatePickerContent,
  Header: DatePickerHeader,
  Footer: DatePickerFooter,
  Close: DatePickerClose,
  Apply: DatePickerApply,
  Cancel: DatePickerCancel,
}

// Re-export individual components
export {
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerValue,
  DatePickerPortal,
  DatePickerPopup,
  DatePickerContent,
  DatePickerHeader,
  DatePickerFooter,
  DatePickerClose,
  DatePickerApply,
  DatePickerCancel,
}
