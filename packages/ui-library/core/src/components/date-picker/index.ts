'use client'

// Main DatePicker components
export { DatePicker, useDatePickerContext } from './date-picker'
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
} from './date-picker'

// Calendar components
export { Calendar } from './calendar'
export {
  CalendarRoot,
  CalendarHeader,
  CalendarNav,
  CalendarGrid,
  CalendarDay,
  CalendarMonthGrid,
  CalendarYearGrid,
} from './calendar'

// Preset components
export { Presets, PresetsList, PresetItem, DEFAULT_PRESETS } from './presets'

// Date input component
export { DateInput } from './date-input'

// Utility functions
export {
  formatDate,
  formatDateRange,
  parseDate,
  isSameDay,
  isDateInRange,
  isDateDisabled,
  addDays,
  addMonths,
  addYears,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  today,
  yesterday,
} from './utils/date-utils'

export {
  generateCalendarMonth,
  generateMonthOptions,
  generateYearRange,
  getMonthName,
  getMonthYearLabel,
} from './utils/calendar-utils'

// Types
export type {
  // Date types
  DateRange,
  DateValue,
  DateRangeValue,
  PresetRange,
  DatePickerMode,
  DatePickerView,
  WeekStartDay,

  // Context
  DatePickerContextValue,

  // Root props
  DatePickerRootProps,

  // Sub-component props
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

  // Calendar props
  CalendarProps,
  CalendarHeaderProps,
  CalendarNavProps,
  CalendarGridProps,
  CalendarDayProps,
  CalendarMonthCellProps,
  CalendarYearCellProps,

  // Preset props
  PresetsListProps,
  PresetItemProps,

  // Input props
  DateInputProps,
} from './types'

// Styles
export { DatePickerStyles } from './styles'
