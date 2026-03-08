'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/utils/cn'
import { useDatePickerContext } from './date-picker'
import { DatePickerStyles as S } from './styles'
import { formatDate, parseDate } from './utils/date-utils'
import type { DateInputProps } from './types'

// =============================================================================
// DateInput
// =============================================================================

function DateInput({
  startPlaceholder = 'Start date',
  endPlaceholder = 'End date',
  placeholder = 'Select date',
  className,
  ref,
  ...props
}: DateInputProps) {
  const {
    mode,
    selectedDate,
    setSelectedDate,
    selectedRange,
    setSelectedRange,
    setActivePreset,
    setViewDate,
    locale,
  } = useDatePickerContext()

  // Local input state
  const [startInput, setStartInput] = useState('')
  const [endInput, setEndInput] = useState('')
  const [singleInput, setSingleInput] = useState('')

  // Sync input values with selected dates
  useEffect(() => {
    if (mode === 'single') {
      if (selectedDate) {
        setSingleInput(formatDate(selectedDate, locale))
      } else {
        setSingleInput('')
      }
    } else if (mode === 'range') {
      if (selectedRange?.start) {
        setStartInput(formatDate(selectedRange.start, locale))
      } else {
        setStartInput('')
      }
      if (selectedRange?.end) {
        setEndInput(formatDate(selectedRange.end, locale))
      } else {
        setEndInput('')
      }
    }
  }, [selectedDate, selectedRange, mode, locale])

  // Handle single date input blur
  const handleSingleBlur = useCallback(() => {
    const parsed = parseDate(singleInput)
    if (parsed) {
      setSelectedDate(parsed)
      setViewDate(parsed)
    } else if (!singleInput.trim()) {
      setSelectedDate(null)
    }
  }, [singleInput, setSelectedDate, setViewDate])

  // Handle start date input blur
  const handleStartBlur = useCallback(() => {
    const parsed = parseDate(startInput)
    if (parsed) {
      setSelectedRange({
        start: parsed,
        end: selectedRange?.end ?? null,
      })
      setViewDate(parsed)
      setActivePreset(null)
    } else if (!startInput.trim()) {
      setSelectedRange({
        start: null,
        end: selectedRange?.end ?? null,
      })
    }
  }, [startInput, selectedRange, setSelectedRange, setViewDate, setActivePreset])

  // Handle end date input blur
  const handleEndBlur = useCallback(() => {
    const parsed = parseDate(endInput)
    if (parsed) {
      setSelectedRange({
        start: selectedRange?.start ?? null,
        end: parsed,
      })
      setActivePreset(null)
    } else if (!endInput.trim()) {
      setSelectedRange({
        start: selectedRange?.start ?? null,
        end: null,
      })
    }
  }, [endInput, selectedRange, setSelectedRange, setActivePreset])

  // Handle key down for enter submission
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, handler: () => void) => {
      if (e.key === 'Enter') {
        handler()
      }
    },
    [],
  )

  if (mode === 'single') {
    return (
      <div ref={ref} className={cn(S.input.container, className)} {...props}>
        <div className={S.input.group}>
          <label className={S.input.label}>{placeholder}</label>
          <input
            type="text"
            value={singleInput}
            onChange={(e) => setSingleInput(e.target.value)}
            onBlur={handleSingleBlur}
            onKeyDown={(e) => handleKeyDown(e, handleSingleBlur)}
            placeholder="MMM d, yyyy"
            className={S.input.field}
            aria-describedby="date-format-hint"
          />
        </div>
        <span id="date-format-hint" className={S.srOnly}>
          Format: Month day, year (e.g., Jan 15, 2024)
        </span>
      </div>
    )
  }

  return (
    <div ref={ref} className={cn(S.input.container, className)} {...props}>
      <div className={S.input.group}>
        <label className={S.input.label}>{startPlaceholder}</label>
        <input
          type="text"
          value={startInput}
          onChange={(e) => setStartInput(e.target.value)}
          onBlur={handleStartBlur}
          onKeyDown={(e) => handleKeyDown(e, handleStartBlur)}
          placeholder="MMM d, yyyy"
          className={S.input.field}
          aria-describedby="date-format-hint"
        />
      </div>

      <span className={S.input.separator}>-</span>

      <div className={S.input.group}>
        <label className={S.input.label}>{endPlaceholder}</label>
        <input
          type="text"
          value={endInput}
          onChange={(e) => setEndInput(e.target.value)}
          onBlur={handleEndBlur}
          onKeyDown={(e) => handleKeyDown(e, handleEndBlur)}
          placeholder="MMM d, yyyy"
          className={S.input.field}
        />
      </div>

      <span id="date-format-hint" className={S.srOnly}>
        Format: Month day, year (e.g., Jan 15, 2024)
      </span>
    </div>
  )
}

export { DateInput }
