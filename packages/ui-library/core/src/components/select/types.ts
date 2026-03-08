import type { ReactNode, Ref } from 'react'

/**
 * Utilities provided to custom option onSelect handlers
 */
export interface SelectOptionUtils {
  /** Close the dropdown popup */
  closePopup: () => void
  /** Set the Select's value (default behavior) */
  setValue: (value: string) => void
  /** Set a custom display value without changing the actual value */
  setDisplayValue: (display: string | null) => void
  /** Reference to trigger element for positioning */
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

export interface SelectOption {
  value: string
  label: string
  /**
   * Custom action when option is selected.
   * Return `true` to prevent default setValue behavior.
   */
  onSelect?: (utils: SelectOptionUtils) => boolean | void
  /**
   * Custom display value override (e.g., "Mar 1 - Mar 15" for custom range).
   * When set, this displays instead of the option label.
   */
  displayValue?: string
  /** Disable this option */
  disabled?: boolean
}

export type SelectTriggerMode = 'click' | 'hover'
export type SelectWidth = 'full' | 'auto'
export type SelectPlacement = 'bottom' | 'top'
export type SelectVariant = 'default' | 'ghost'

export interface SelectRootProps {
  children: ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  searchable?: boolean
  triggerMode?: SelectTriggerMode
  width?: SelectWidth
  placement?: SelectPlacement
  /** Visual variant - 'ghost' removes background/shadow for inline use */
  variant?: SelectVariant
  /** When true, uses higher z-index for use inside modals/dialogs */
  inModal?: boolean
  /** Override dropdown minimum width (e.g., "6.5rem"). Defaults to trigger width. */
  dropdownMinWidth?: string
}

export interface SelectTriggerProps {
  children?: ReactNode
  className?: string
  placeholder?: string
  ref?: Ref<HTMLButtonElement>
}

export interface SelectValueProps {
  placeholder?: string
}

export interface SelectIconProps {
  className?: string
}

export interface SelectPortalProps {
  children: ReactNode
}

export interface SelectPositionerProps {
  children: ReactNode
}

export interface SelectPopupProps {
  children: ReactNode
  className?: string
  ref?: Ref<HTMLDivElement>
}

export interface SelectOptionProps {
  value: string
  children: ReactNode
  className?: string
  ref?: Ref<HTMLButtonElement>
  /** Internal: option config for custom onSelect handling */
  _optionConfig?: SelectOption
}

export interface SelectSearchProps {
  placeholder?: string
  className?: string
}

export interface SelectContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  value: string
  setValue: (value: string) => void
  /** Custom display value override (for options with displayValue) */
  displayValue: string | null
  setDisplayValue: (display: string | null) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  dropdownRef: React.RefObject<HTMLDivElement | null>
  dropdownPosition: { top: number; left: number; minWidth: number }
  lockedPositionRef: React.RefObject<{ top: number; left: number; minWidth: number } | null>
  disabled?: boolean
  searchable?: boolean
  triggerMode: SelectTriggerMode
  width: SelectWidth
  placement: SelectPlacement
  variant: SelectVariant
  inModal: boolean
}
