import type { ReactNode, Ref, HTMLAttributes, ButtonHTMLAttributes } from 'react'

// =============================================================================
// Date Types
// =============================================================================

export interface DateRange {
  start: Date | null
  end: Date | null
}

export type DateValue = Date | null
export type DateRangeValue = DateRange | null

export interface PresetRange {
  /** Display label for the preset */
  label: string
  /** Unique identifier */
  value: string
  /** Function that returns the date range for this preset */
  getRange: () => DateRange
}

export type DatePickerMode = 'single' | 'range'
export type DatePickerView = 'days' | 'months' | 'years'
export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6 // Sunday = 0, Monday = 1, etc.

// =============================================================================
// Context Types
// =============================================================================

export interface DatePickerContextValue {
  // Mode
  mode: DatePickerMode

  // Open state
  isOpen: boolean
  setIsOpen: (open: boolean) => void

  // View state (calendar view switching)
  view: DatePickerView
  setView: (view: DatePickerView) => void

  // Single date mode
  selectedDate: DateValue
  setSelectedDate: (date: DateValue) => void

  // Range mode
  selectedRange: DateRangeValue
  setSelectedRange: (range: DateRangeValue) => void
  /** First click in range selection - tracks partial selection */
  rangeSelectionStart: DateValue
  setRangeSelectionStart: (date: DateValue) => void
  /** Date being hovered during range selection */
  hoveredDate: DateValue
  setHoveredDate: (date: DateValue) => void

  // Navigation
  /** Date currently focused for keyboard navigation */
  focusedDate: Date
  setFocusedDate: (date: Date) => void
  /** Month/year being viewed in calendar */
  viewDate: Date
  setViewDate: (date: Date) => void

  // Configuration
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  weekStartDay: WeekStartDay

  // Presets
  presets?: PresetRange[]
  activePreset: string | null
  setActivePreset: (preset: string | null) => void

  // Refs
  triggerRef: React.RefObject<HTMLButtonElement | null>
  popupRef: React.RefObject<HTMLDivElement | null>

  // Formatting
  locale: string

  // Disabled state
  disabled?: boolean

  // Actions
  confirm: () => void
  cancel: () => void
}

// =============================================================================
// Root Props
// =============================================================================

export interface DatePickerRootProps {
  children: ReactNode
  /** Selection mode: single date or date range */
  mode?: DatePickerMode
  /** Controlled open state */
  open?: boolean
  /** Default open state */
  defaultOpen?: boolean
  /** Callback when open changes */
  onOpenChange?: (open: boolean) => void
  /** Single date value (controlled) */
  value?: DateValue
  /** Default single date value */
  defaultValue?: DateValue
  /** Callback for single date change */
  onValueChange?: (value: DateValue) => void
  /** Range value (controlled) */
  rangeValue?: DateRangeValue
  /** Default range value */
  defaultRangeValue?: DateRangeValue
  /** Callback for range change */
  onRangeChange?: (range: DateRangeValue) => void
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Dates that cannot be selected */
  disabledDates?: Date[]
  /** Day to start week (0=Sunday, 1=Monday) */
  weekStartDay?: WeekStartDay
  /** Preset ranges to show */
  presets?: PresetRange[]
  /** Locale for formatting (BCP 47 tag) */
  locale?: string
  /** Whether the picker is disabled */
  disabled?: boolean
}

// =============================================================================
// Sub-component Props
// =============================================================================

export interface DatePickerTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as child element instead of button */
  asChild?: boolean
  ref?: Ref<HTMLButtonElement>
}

export interface DatePickerValueProps {
  /** Placeholder when no date selected */
  placeholder?: string
  /** Custom format function for range display */
  formatRange?: (range: DateRange) => string
  /** Custom format function for single date display */
  formatDate?: (date: Date) => string
}

export interface DatePickerPortalProps {
  children: ReactNode
  /** Container element for portal (default: document.body) */
  container?: Element | null
}

export interface DatePickerPopupProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface DatePickerContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Show preset sidebar */
  showPresets?: boolean
  ref?: Ref<HTMLDivElement>
}

export interface DatePickerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface DatePickerFooterProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface DatePickerCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
}

export interface DatePickerApplyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
}

export interface DatePickerCancelProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
}

// =============================================================================
// Calendar Props
// =============================================================================

export interface CalendarProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface CalendarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface CalendarNavProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface CalendarGridProps extends HTMLAttributes<HTMLTableElement> {
  ref?: Ref<HTMLTableElement>
}

export interface CalendarDayProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The date this cell represents */
  date: Date
  ref?: Ref<HTMLButtonElement>
}

export interface CalendarMonthCellProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Month index (0-11) */
  month: number
  ref?: Ref<HTMLButtonElement>
}

export interface CalendarYearCellProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Year number */
  year: number
  ref?: Ref<HTMLButtonElement>
}

// =============================================================================
// Preset Props
// =============================================================================

export interface PresetsListProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

export interface PresetItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The preset configuration */
  preset: PresetRange
  ref?: Ref<HTMLButtonElement>
}

// =============================================================================
// Input Props
// =============================================================================

export interface DateInputProps extends HTMLAttributes<HTMLDivElement> {
  /** Placeholder for start date input */
  startPlaceholder?: string
  /** Placeholder for end date input (range mode) */
  endPlaceholder?: string
  /** Placeholder for single date input */
  placeholder?: string
  ref?: Ref<HTMLDivElement>
}
