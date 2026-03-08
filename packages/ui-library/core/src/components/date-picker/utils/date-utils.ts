/**
 * Date utility functions for DatePicker component.
 * Uses native Date and Intl.DateTimeFormat for localization support.
 */

import type { DateRange, WeekStartDay } from '../types'

/**
 * Check if two dates represent the same day
 */
export function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false
  return (
    date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
  )
}

/**
 * Check if two dates are in the same month
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
  )
}

/**
 * Check if a date falls within a range (inclusive, date-only comparison)
 */
export function isDateInRange(date: Date, range: DateRange | null): boolean {
  if (!range?.start || !range?.end) return false
  // Compare using startOfDay to ignore time differences
  const dateTime = startOfDay(date).getTime()
  const startTime = startOfDay(range.start).getTime()
  const endTime = startOfDay(range.end).getTime()
  return dateTime >= startTime && dateTime <= endTime
}

/**
 * Check if a date is disabled based on min/max and disabled dates
 */
export function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[],
): boolean {
  if (minDate && date < startOfDay(minDate)) return true
  if (maxDate && date > endOfDay(maxDate)) return true
  if (disabledDates?.some((d) => isSameDay(d, date))) return true
  return false
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * Add years to a date
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

/**
 * Get the start of a day (midnight)
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get the end of a day (23:59:59.999)
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Get the first day of a month
 */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Get the last day of a month
 */
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/**
 * Get the start of a week based on week start day
 */
export function startOfWeek(date: Date, weekStartDay: WeekStartDay = 0): Date {
  const result = new Date(date)
  const day = result.getDay()
  const diff = (day < weekStartDay ? 7 : 0) + day - weekStartDay
  result.setDate(result.getDate() - diff)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get the end of a week based on week start day
 */
export function endOfWeek(date: Date, weekStartDay: WeekStartDay = 0): Date {
  const start = startOfWeek(date, weekStartDay)
  return endOfDay(addDays(start, 6))
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

/**
 * Format a date using Intl.DateTimeFormat
 */
export function formatDate(
  date: Date,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions,
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return new Intl.DateTimeFormat(locale, options ?? defaultOptions).format(date)
}

/**
 * Format a date range as "MMM d - MMM d, yyyy"
 */
export function formatDateRange(
  range: DateRange,
  locale: string = 'en-US',
): string {
  if (!range.start || !range.end) return ''

  const sameYear = range.start.getFullYear() === range.end.getFullYear()
  const sameMonth = sameYear && range.start.getMonth() === range.end.getMonth()

  if (isSameDay(range.start, range.end)) {
    return formatDate(range.start, locale)
  }

  if (sameMonth) {
    // "Mar 1 - 15, 2024"
    const startStr = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(range.start)
    const endStr = new Intl.DateTimeFormat(locale, { day: 'numeric', year: 'numeric' }).format(range.end)
    return `${startStr} - ${endStr}`
  }

  if (sameYear) {
    // "Mar 1 - Apr 15, 2024"
    const startStr = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(range.start)
    const endStr = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(range.end)
    return `${startStr} - ${endStr}`
  }

  // "Dec 15, 2023 - Jan 15, 2024"
  const startStr = formatDate(range.start, locale)
  const endStr = formatDate(range.end, locale)
  return `${startStr} - ${endStr}`
}

/**
 * Parse a date string (basic implementation)
 * Supports ISO format and common formats
 */
export function parseDate(input: string): Date | null {
  if (!input?.trim()) return null

  // Try ISO format first
  const isoDate = new Date(input)
  if (!isNaN(isoDate.getTime())) return isoDate

  // Try common formats (MM/DD/YYYY, DD/MM/YYYY, etc.)
  const cleaned = input.trim()

  // Try MM/DD/YYYY or DD/MM/YYYY
  const slashParts = cleaned.split(/[/\-.]/)
  if (slashParts.length === 3) {
    const [p1, p2, p3] = slashParts.map(Number)

    // Assume MM/DD/YYYY if year is last and > 12
    if (p3 > 31 && p1 <= 12 && p2 <= 31) {
      const date = new Date(p3, p1 - 1, p2)
      if (!isNaN(date.getTime())) return date
    }

    // Try DD/MM/YYYY
    if (p3 > 31 && p2 <= 12 && p1 <= 31) {
      const date = new Date(p3, p2 - 1, p1)
      if (!isNaN(date.getTime())) return date
    }
  }

  return null
}

/**
 * Get today's date at start of day
 */
export function today(): Date {
  return startOfDay(new Date())
}

/**
 * Get yesterday's date at start of day
 */
export function yesterday(): Date {
  return startOfDay(addDays(new Date(), -1))
}

/**
 * Clamp a date to min/max bounds
 */
export function clampDate(date: Date, minDate?: Date, maxDate?: Date): Date {
  let result = date
  if (minDate && result < minDate) result = minDate
  if (maxDate && result > maxDate) result = maxDate
  return result
}
