/**
 * Calendar grid generation utilities for DatePicker component.
 */

import { startOfMonth, startOfWeek, addDays, isSameDay } from './date-utils'
import type { WeekStartDay } from '../types'

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
}

export interface CalendarMonth {
  weeks: CalendarDay[][]
  weekDays: string[]
}

/**
 * Generate calendar grid for a given month
 * Returns 6 weeks (42 days) for consistent height
 */
export function generateCalendarMonth(
  date: Date,
  weekStartDay: WeekStartDay = 0,
  locale: string = 'en-US',
): CalendarMonth {
  const firstDayOfMonth = startOfMonth(date)
  const startDate = startOfWeek(firstDayOfMonth, weekStartDay)
  const today = new Date()

  const weeks: CalendarDay[][] = []
  let currentDate = new Date(startDate)

  // Generate 6 weeks for consistent calendar height
  for (let week = 0; week < 6; week++) {
    const weekDays: CalendarDay[] = []
    for (let day = 0; day < 7; day++) {
      weekDays.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === date.getMonth(),
        isToday: isSameDay(currentDate, today),
      })
      currentDate = addDays(currentDate, 1)
    }
    weeks.push(weekDays)
  }

  // Generate weekday headers
  const weekDays = generateWeekdayHeaders(startDate, locale)

  return { weeks, weekDays }
}

/**
 * Generate weekday header labels (Sun, Mon, etc.)
 */
export function generateWeekdayHeaders(
  startDate: Date,
  locale: string = 'en-US',
): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const dayDate = addDays(startDate, i)
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(dayDate)
  })
}

/**
 * Generate month options for month picker
 */
export function generateMonthOptions(locale: string = 'en-US'): { value: number; label: string }[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'long' })
  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: formatter.format(new Date(2024, i, 1)),
  }))
}

/**
 * Generate year range for year picker
 * Default: 10 years before and after current year
 */
export function generateYearRange(
  centerYear: number = new Date().getFullYear(),
  range: number = 10,
): number[] {
  const start = centerYear - range
  const end = centerYear + range
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/**
 * Get month name for a date
 */
export function getMonthName(date: Date, locale: string = 'en-US', format: 'long' | 'short' = 'long'): string {
  return new Intl.DateTimeFormat(locale, { month: format }).format(date)
}

/**
 * Get formatted month and year string
 */
export function getMonthYearLabel(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)
}
