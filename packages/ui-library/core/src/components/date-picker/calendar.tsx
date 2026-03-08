'use client'

import { useCallback, useMemo, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useDatePickerContext } from './date-picker'
import { DatePickerStyles as S } from './styles'
import {
  generateCalendarMonth,
  generateMonthOptions,
  generateYearRange,
  getMonthYearLabel,
} from './utils/calendar-utils'
import {
  isSameDay,
  isDateInRange,
  isDateDisabled,
  addDays,
  addMonths,
  addYears,
  startOfMonth,
  endOfMonth,
} from './utils/date-utils'
import type {
  CalendarProps,
  CalendarHeaderProps,
  CalendarNavProps,
  CalendarGridProps,
  CalendarDayProps,
} from './types'

// =============================================================================
// Calendar.Root
// =============================================================================

function CalendarRoot({ children, className, ref, ...props }: CalendarProps) {
  return (
    <div ref={ref} className={cn(S.calendar.container, className)} {...props}>
      {children}
    </div>
  )
}

// =============================================================================
// Calendar.Header
// =============================================================================

function CalendarHeader({ className, ref, ...props }: CalendarHeaderProps) {
  const { viewDate, view, setView, locale } = useDatePickerContext()

  const label = useMemo(() => {
    if (view === 'days') {
      return getMonthYearLabel(viewDate, locale)
    }
    if (view === 'months') {
      return viewDate.getFullYear().toString()
    }
    // Years view - show decade range
    const year = viewDate.getFullYear()
    const decadeStart = Math.floor(year / 10) * 10
    return `${decadeStart} - ${decadeStart + 9}`
  }, [viewDate, view, locale])

  const handleClick = useCallback(() => {
    if (view === 'days') {
      setView('months')
    } else if (view === 'months') {
      setView('years')
    }
  }, [view, setView])

  return (
    <div ref={ref} className={cn(S.calendar.header, className)} {...props}>
      <button
        type="button"
        onClick={handleClick}
        className={S.calendar.title.base}
        aria-live="polite"
      >
        {label}
      </button>
    </div>
  )
}

// =============================================================================
// Calendar.Nav
// =============================================================================

function CalendarNav({ className, ref, ...props }: CalendarNavProps) {
  const { viewDate, setViewDate, view, minDate, maxDate } = useDatePickerContext()

  const handlePrev = useCallback(() => {
    if (view === 'days') {
      setViewDate(addMonths(viewDate, -1))
    } else if (view === 'months') {
      setViewDate(addYears(viewDate, -1))
    } else {
      setViewDate(addYears(viewDate, -10))
    }
  }, [view, viewDate, setViewDate])

  const handleNext = useCallback(() => {
    if (view === 'days') {
      setViewDate(addMonths(viewDate, 1))
    } else if (view === 'months') {
      setViewDate(addYears(viewDate, 1))
    } else {
      setViewDate(addYears(viewDate, 10))
    }
  }, [view, viewDate, setViewDate])

  // Check if navigation should be disabled based on min/max
  const isPrevDisabled = useMemo(() => {
    if (!minDate) return false
    if (view === 'days') {
      return viewDate <= startOfMonth(minDate)
    }
    return viewDate.getFullYear() <= minDate.getFullYear()
  }, [viewDate, minDate, view])

  const isNextDisabled = useMemo(() => {
    if (!maxDate) return false
    if (view === 'days') {
      return viewDate >= startOfMonth(maxDate)
    }
    return viewDate.getFullYear() >= maxDate.getFullYear()
  }, [viewDate, maxDate, view])

  return (
    <div ref={ref} className={cn(S.calendar.nav.container, className)} {...props}>
      <button
        type="button"
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className={S.calendar.nav.button}
        aria-label="Previous"
      >
        <ChevronLeft className={S.calendar.nav.icon} />
      </button>
      <button
        type="button"
        onClick={handleNext}
        disabled={isNextDisabled}
        className={S.calendar.nav.button}
        aria-label="Next"
      >
        <ChevronRight className={S.calendar.nav.icon} />
      </button>
    </div>
  )
}

// =============================================================================
// Calendar.Grid
// =============================================================================

function CalendarGrid({ className, ref, ...props }: CalendarGridProps) {
  const {
    viewDate,
    weekStartDay,
    locale,
    focusedDate,
    setFocusedDate,
    setViewDate,
    view,
  } = useDatePickerContext()

  const tableRef = useRef<HTMLTableElement>(null)

  // Generate calendar data
  const { weeks, weekDays } = useMemo(
    () => generateCalendarMonth(viewDate, weekStartDay, locale),
    [viewDate, weekStartDay, locale],
  )

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (view !== 'days') return

      let newDate = new Date(focusedDate)

      switch (e.key) {
        case 'ArrowLeft':
          newDate = addDays(focusedDate, -1)
          break
        case 'ArrowRight':
          newDate = addDays(focusedDate, 1)
          break
        case 'ArrowUp':
          newDate = addDays(focusedDate, -7)
          break
        case 'ArrowDown':
          newDate = addDays(focusedDate, 7)
          break
        case 'PageUp':
          if (e.shiftKey) {
            newDate = addYears(focusedDate, -1)
          } else {
            newDate = addMonths(focusedDate, -1)
          }
          break
        case 'PageDown':
          if (e.shiftKey) {
            newDate = addYears(focusedDate, 1)
          } else {
            newDate = addMonths(focusedDate, 1)
          }
          break
        case 'Home':
          newDate = startOfMonth(focusedDate)
          break
        case 'End':
          newDate = endOfMonth(focusedDate)
          break
        default:
          return
      }

      e.preventDefault()
      setFocusedDate(newDate)

      // Update view if navigating to different month
      if (newDate.getMonth() !== viewDate.getMonth() || newDate.getFullYear() !== viewDate.getFullYear()) {
        setViewDate(newDate)
      }
    },
    [focusedDate, setFocusedDate, viewDate, setViewDate, view],
  )

  // Combine refs
  const combinedRef = (node: HTMLTableElement | null) => {
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLTableElement | null>).current = node
    }
    ;(tableRef as React.MutableRefObject<HTMLTableElement | null>).current = node
  }

  return (
    <table
      ref={combinedRef}
      role="grid"
      aria-label="Calendar"
      className={cn(S.grid.table, className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <thead>
        <tr className={S.grid.headerRow}>
          {weekDays.map((day, i) => (
            <th key={i} className={S.grid.headerCell} scope="col" aria-label={day}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, weekIdx) => (
          <tr key={weekIdx} className={S.grid.bodyRow}>
            {week.map((day, dayIdx) =>
              <CalendarCell key={dayIdx} date={day.date} />,
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// =============================================================================
// Calendar.Cell (wrapper for td with range background)
// =============================================================================

function CalendarCell({ date }: { date: Date }) {
  const { mode, selectedRange, rangeSelectionStart, hoveredDate } = useDatePickerContext()

  // Only show range backgrounds when both start AND end are selected
  const hasCompleteRange = mode === 'range' && selectedRange?.start && selectedRange?.end

  // For complete range: middle and end cells get background (not start - it begins the range)
  const needsBackground = (() => {
    if (!hasCompleteRange) return false
    const isStart = isSameDay(date, selectedRange.start!)
    const isInRange = isDateInRange(date, selectedRange)
    // Background on everything EXCEPT the start (middle + end)
    return isInRange && !isStart
  })()

  // Hover preview during selection (before range is complete)
  const isSelectingRange = mode === 'range' && rangeSelectionStart && hoveredDate && !hasCompleteRange
  const needsHoverBackground = (() => {
    if (!isSelectingRange) return false

    const previewStart = rangeSelectionStart! < hoveredDate! ? rangeSelectionStart! : hoveredDate!
    const previewEnd = rangeSelectionStart! < hoveredDate! ? hoveredDate! : rangeSelectionStart!

    const isStart = isSameDay(date, previewStart)
    const dateTime = date.getTime()
    const isInRange = dateTime >= previewStart.getTime() && dateTime <= previewEnd.getTime()
    // Background on everything EXCEPT the start
    return isInRange && !isStart
  })()

  // Cell backgrounds: middle + end cells (start button begins the range visually)
  const cellClass = cn(
    S.grid.bodyCell,
    needsBackground && S.grid.cellRangeMiddle,
    needsHoverBackground && S.grid.cellRangeHover,
  )

  return (
    <td className={cellClass}>
      <CalendarDay date={date} />
    </td>
  )
}

// =============================================================================
// Calendar.Day
// =============================================================================

function CalendarDay({ date, className, ref, ...props }: CalendarDayProps) {
  const {
    mode,
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
    setIsOpen,
    setActivePreset,
  } = useDatePickerContext()

  const buttonRef = useRef<HTMLButtonElement>(null)

  const isToday = isSameDay(date, new Date())
  const isSelected = mode === 'single' && selectedDate && isSameDay(date, selectedDate)
  const isOutsideMonth = date.getMonth() !== viewDate.getMonth()
  const isDisabled = isDateDisabled(date, minDate, maxDate, disabledDates)
  const isFocused = isSameDay(date, focusedDate)

  // Range selection states
  const isRangeStart = mode === 'range' && selectedRange?.start && isSameDay(date, selectedRange.start)
  const isRangeEnd = mode === 'range' && selectedRange?.end && isSameDay(date, selectedRange.end)

  // Check if in selected range
  const isInRange = mode === 'range' && isDateInRange(date, selectedRange)

  // Check if in hover preview range (during selection)
  const isInHoverRange = useMemo(() => {
    if (mode !== 'range' || !rangeSelectionStart || !hoveredDate) return false
    const start = rangeSelectionStart < hoveredDate ? rangeSelectionStart : hoveredDate
    const end = rangeSelectionStart < hoveredDate ? hoveredDate : rangeSelectionStart
    return date > start && date < end
  }, [mode, rangeSelectionStart, hoveredDate, date])

  // Focus button when focused date changes
  useEffect(() => {
    if (isFocused && buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [isFocused])

  const handleClick = useCallback(() => {
    if (isDisabled) return

    setFocusedDate(date)

    // Navigate to month if clicking outside current month
    if (isOutsideMonth) {
      setViewDate(date)
    }

    if (mode === 'single') {
      setSelectedDate(date)
      setIsOpen(false)
    } else {
      // Range selection logic
      if (!rangeSelectionStart) {
        // First click - start range
        setRangeSelectionStart(date)
        setSelectedRange({ start: date, end: null })
      } else {
        // Second click - complete range
        const [start, end] =
          date < rangeSelectionStart
            ? [date, rangeSelectionStart]
            : [rangeSelectionStart, date]
        setSelectedRange({ start, end })
        setRangeSelectionStart(null)
        setActivePreset(null) // Clear preset when custom range selected
      }
    }
  }, [
    date,
    isDisabled,
    isOutsideMonth,
    mode,
    rangeSelectionStart,
    setSelectedDate,
    setSelectedRange,
    setRangeSelectionStart,
    setFocusedDate,
    setViewDate,
    setIsOpen,
    setActivePreset,
  ])

  const handleMouseEnter = useCallback(() => {
    if (mode === 'range' && rangeSelectionStart) {
      setHoveredDate(date)
    }
  }, [mode, rangeSelectionStart, date, setHoveredDate])

  const handleMouseLeave = useCallback(() => {
    if (mode === 'range') {
      setHoveredDate(null)
    }
  }, [mode, setHoveredDate])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    },
    [handleClick],
  )

  // Combine refs
  const combinedRef = (node: HTMLButtonElement | null) => {
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    }
    ;(buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
  }

  return (
    <button
      ref={combinedRef}
      type="button"
      role="gridcell"
      tabIndex={isFocused ? 0 : -1}
      aria-selected={Boolean(isSelected || isRangeStart || isRangeEnd)}
      aria-disabled={isDisabled}
      aria-current={isToday ? 'date' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={isDisabled}
      className={cn(
        S.day.base,
        isToday && S.day.today,
        isSelected && S.day.selected,
        isOutsideMonth && S.day.outsideMonth,
        isDisabled && S.day.disabled,
        isRangeStart && S.day.rangeStart,
        isRangeEnd && S.day.rangeEnd,
        isInRange && !isRangeStart && !isRangeEnd && S.day.rangeMiddle,
        isInHoverRange && S.day.rangeHover,
        className,
      )}
      {...props}
    >
      {date.getDate()}
    </button>
  )
}

// =============================================================================
// Calendar.MonthGrid
// =============================================================================

function CalendarMonthGrid({ className, ref }: { className?: string; ref?: React.Ref<HTMLDivElement> }) {
  const { viewDate, setViewDate, setView, locale, selectedDate, selectedRange, mode } = useDatePickerContext()

  const months = useMemo(() => generateMonthOptions(locale), [locale])
  const currentMonth = viewDate.getMonth()
  const currentYear = viewDate.getFullYear()

  // Determine selected month
  const selectedMonth = useMemo(() => {
    if (mode === 'single' && selectedDate?.getFullYear() === currentYear) {
      return selectedDate.getMonth()
    }
    if (mode === 'range' && selectedRange?.start?.getFullYear() === currentYear) {
      return selectedRange.start.getMonth()
    }
    return null
  }, [mode, selectedDate, selectedRange, currentYear])

  const handleMonthClick = useCallback(
    (month: number) => {
      const newDate = new Date(viewDate)
      newDate.setMonth(month)
      setViewDate(newDate)
      setView('days')
    },
    [viewDate, setViewDate, setView],
  )

  return (
    <div ref={ref} className={cn(S.monthYear.grid, className)}>
      {months.map((month) => (
        <button
          key={month.value}
          type="button"
          onClick={() => handleMonthClick(month.value)}
          className={cn(
            S.monthYear.cell.base,
            month.value === selectedMonth && S.monthYear.cell.selected,
            month.value === currentMonth && month.value !== selectedMonth && S.monthYear.cell.current,
          )}
        >
          {month.label.slice(0, 3)}
        </button>
      ))}
    </div>
  )
}

// =============================================================================
// Calendar.YearGrid
// =============================================================================

function CalendarYearGrid({ className, ref }: { className?: string; ref?: React.Ref<HTMLDivElement> }) {
  const { viewDate, setViewDate, setView, selectedDate, selectedRange, mode } = useDatePickerContext()

  const currentYear = viewDate.getFullYear()
  const years = useMemo(() => generateYearRange(currentYear, 5), [currentYear])

  // Determine selected year
  const selectedYear = useMemo(() => {
    if (mode === 'single' && selectedDate) {
      return selectedDate.getFullYear()
    }
    if (mode === 'range' && selectedRange?.start) {
      return selectedRange.start.getFullYear()
    }
    return null
  }, [mode, selectedDate, selectedRange])

  const handleYearClick = useCallback(
    (year: number) => {
      const newDate = new Date(viewDate)
      newDate.setFullYear(year)
      setViewDate(newDate)
      setView('months')
    },
    [viewDate, setViewDate, setView],
  )

  return (
    <div ref={ref} className={cn(S.monthYear.grid, className)}>
      {years.map((year) => (
        <button
          key={year}
          type="button"
          onClick={() => handleYearClick(year)}
          className={cn(
            S.monthYear.cell.base,
            year === selectedYear && S.monthYear.cell.selected,
            year === currentYear && year !== selectedYear && S.monthYear.cell.current,
          )}
        >
          {year}
        </button>
      ))}
    </div>
  )
}

// =============================================================================
// Namespace Export
// =============================================================================

export const Calendar = {
  Root: CalendarRoot,
  Header: CalendarHeader,
  Nav: CalendarNav,
  Grid: CalendarGrid,
  Day: CalendarDay,
  MonthGrid: CalendarMonthGrid,
  YearGrid: CalendarYearGrid,
}

// Re-export individual components
export {
  CalendarRoot,
  CalendarHeader,
  CalendarNav,
  CalendarGrid,
  CalendarDay,
  CalendarMonthGrid,
  CalendarYearGrid,
}
