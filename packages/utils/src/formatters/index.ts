/**
 * Formatters
 *
 * Shared formatting utilities for consistent display across the app.
 *
 * @example
 * import { formatDate, formatTime, getTimeSlot } from '@bytesyze/utils/formatters'
 *
 * formatDate(timestamp, { todayLabel: t(logs.dates.today) })
 * formatTime(timestamp)
 * getTimeSlot(timestamp)
 */

export {
  formatDate,
  formatTime,
  formatTimestamp,
  getTimeSlot,
  type FormatDateOptions,
} from './time'
