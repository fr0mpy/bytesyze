'use client'

import { useCallback } from 'react'
import { cn } from '@/utils/cn'
import { useDatePickerContext } from './date-picker'
import { DatePickerStyles as S } from './styles'
import {
  yesterday,
  addDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
} from './utils/date-utils'
import type { PresetsListProps, PresetItemProps, PresetRange } from './types'

// =============================================================================
// Default Presets
// =============================================================================

export const DEFAULT_PRESETS: PresetRange[] = [
  {
    label: 'Today',
    value: 'today',
    getRange: () => ({
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
    }),
  },
  {
    label: 'Yesterday',
    value: 'yesterday',
    getRange: () => ({
      start: startOfDay(yesterday()),
      end: endOfDay(yesterday()),
    }),
  },
  {
    label: 'Last 7 days',
    value: 'last7Days',
    getRange: () => ({
      start: startOfDay(addDays(new Date(), -6)),
      end: endOfDay(new Date()),
    }),
  },
  {
    label: 'Last 30 days',
    value: 'last30Days',
    getRange: () => ({
      start: startOfDay(addDays(new Date(), -29)),
      end: endOfDay(new Date()),
    }),
  },
  {
    label: 'This month',
    value: 'thisMonth',
    getRange: () => ({
      start: startOfMonth(new Date()),
      end: endOfDay(new Date()),
    }),
  },
  {
    label: 'Last month',
    value: 'lastMonth',
    getRange: () => {
      const lastMonth = addMonths(new Date(), -1)
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      }
    },
  },
]

// =============================================================================
// Presets.List
// =============================================================================

function PresetsList({ children, className, ref, ...props }: PresetsListProps) {
  const { presets } = useDatePickerContext()

  if (!presets?.length) return null

  return (
    <div ref={ref} className={cn(S.presets.container, className)} {...props}>
      {presets.map((preset) =>
        <PresetItem key={preset.value} preset={preset} />,
      )}
      {children}
    </div>
  )
}

// =============================================================================
// Presets.Item
// =============================================================================

function PresetItem({ preset, className, ref, ...props }: PresetItemProps) {
  const {
    activePreset,
    setActivePreset,
    setSelectedRange,
    setViewDate,
    setRangeSelectionStart,
  } = useDatePickerContext()

  const isActive = activePreset === preset.value

  const handleClick = useCallback(() => {
    const range = preset.getRange()
    setSelectedRange(range)
    setActivePreset(preset.value)
    setRangeSelectionStart(null) // Clear any partial selection

    // Update view to show start of range
    if (range.start) {
      setViewDate(range.start)
    }
  }, [preset, setSelectedRange, setActivePreset, setViewDate, setRangeSelectionStart])

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={cn(
        S.presets.item.base,
        isActive && S.presets.item.active,
        className,
      )}
      {...props}
    >
      {preset.label}
    </button>
  )
}

// =============================================================================
// Namespace Export
// =============================================================================

export const Presets = {
  List: PresetsList,
  Item: PresetItem,
}

// Re-export individual components
export { PresetsList, PresetItem }
