/**
 * Time Formatting Utilities
 *
 * Shared time/date formatting functions for consistent display across the app.
 * All functions accept ISO 8601 date strings and support localization.
 */

export interface FormatDateOptions {
  /** Label to display for today's date (e.g., "TODAY" or translated equivalent) */
  todayLabel?: string
  /** Label to display for yesterday's date (e.g., "YESTERDAY" or translated equivalent) */
  yesterdayLabel?: string
  /** Intl locale code (defaults to 'en-US') */
  locale?: string
}

/**
 * Format ISO date string to display format.
 * Returns todayLabel/yesterdayLabel if applicable, otherwise "MON DD".
 *
 * @example
 * formatDate('2024-01-15T10:30:00Z') // "JAN 15"
 * formatDate('2024-01-15T10:30:00Z', { todayLabel: 'TODAY' }) // "TODAY" (if today)
 * formatDate('2024-01-15T10:30:00Z', { locale: 'fr-FR' }) // "JANV. 15"
 */
export function formatDate(iso: string, options: FormatDateOptions = {}): string {
  const { todayLabel, yesterdayLabel, locale = 'en-US' } = options

  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const isToday = date.toDateString() === today.toDateString()
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday && todayLabel) return todayLabel
  if (isYesterday && yesterdayLabel) return yesterdayLabel

  const month = date.toLocaleString(locale, { month: 'short' }).toUpperCase()
  const day = date.getDate().toString().padStart(2, '0')
  return `${month} ${day}`
}

/**
 * Format ISO date string to time (24h format).
 * Returns "HH:MM:SS".
 *
 * @example
 * formatTime('2024-01-15T10:30:45Z') // "10:30:45"
 */
export function formatTime(iso: string, locale = 'en-US'): string {
  const date = new Date(iso)
  return date.toLocaleTimeString(locale, { hour12: false })
}

/**
 * Format ISO date string to combined timestamp.
 * Returns "MON DD HH:MM:SS".
 *
 * @example
 * formatTimestamp('2024-01-15T10:30:45Z') // "JAN 15 10:30:45"
 */
export function formatTimestamp(iso: string, locale = 'en-US'): string {
  const dateStr = formatDate(iso, { locale })
  const timeStr = formatTime(iso, locale)
  return `${dateStr} ${timeStr}`
}

/**
 * Extract UTC time slot for chart coordination.
 * Returns "HH:MM" in UTC (not local time).
 *
 * Used for aligning table row hover with chart time buckets.
 *
 * @example
 * getTimeSlot('2024-01-15T10:30:45Z') // "10:30"
 */
export function getTimeSlot(iso: string): string {
  const date = new Date(iso)
  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
