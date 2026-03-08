'use client'

export { Select as SelectCompound, useSelectContext } from './select'
export type {
  SelectOption,
  SelectOptionUtils,
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectIconProps,
  SelectPortalProps,
  SelectPositionerProps,
  SelectPopupProps,
  SelectOptionProps,
  SelectSearchProps,
  SelectContextValue,
  SelectTriggerMode,
  SelectWidth,
  SelectPlacement,
  SelectVariant,
} from './types'

// =============================================================================
// Convenience wrapper for simple Select usage
// =============================================================================
import { Select as SelectNamespace } from './select'
import { SelectStyles as S } from './styles'
import type { SelectOption, SelectTriggerMode, SelectWidth, SelectVariant } from './types'

export interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
  className?: string
  triggerMode?: SelectTriggerMode
  width?: SelectWidth
  /** Visual variant - 'ghost' removes background/shadow for inline use */
  variant?: SelectVariant
  /** Override dropdown minimum width (e.g., "6.5rem"). Defaults to trigger width. */
  dropdownMinWidth?: string
}

/**
 * Convenience Select component that accepts options array.
 * For advanced usage, use SelectCompound (namespace pattern).
 *
 * Options can include `onSelect` callback and `displayValue` for custom behaviors
 * like opening a date picker when "Custom Range" is selected.
 */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled,
  searchable,
  className,
  triggerMode,
  width,
  variant,
  dropdownMinWidth,
}: SelectProps) {
  // Find the selected option and resolve display value
  const currentValue = value ?? defaultValue
  const selectedOption = options.find((opt) => opt.value === currentValue)

  // Use displayValue override if present, otherwise fall back to label
  const displayLabel = selectedOption?.displayValue ?? selectedOption?.label

  return (
    <SelectNamespace.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      searchable={searchable}
      triggerMode={triggerMode}
      width={width}
      variant={variant}
      dropdownMinWidth={dropdownMinWidth}
    >
      <SelectNamespace.Trigger className={className}>
        <span className={!displayLabel ? S.value.placeholder : undefined}>
          {displayLabel || placeholder}
        </span>
        <SelectNamespace.Icon />
      </SelectNamespace.Trigger>
      <SelectNamespace.Portal>
        <SelectNamespace.Positioner>
          <SelectNamespace.Popup>
            <SelectNamespace.Search />
            <div className={S.optionsWrapper}>
              {options.map((option) => (
                <SelectNamespace.Option
                  key={option.value}
                  value={option.value}
                  _optionConfig={option}
                >
                  {option.label}
                </SelectNamespace.Option>
              ))}
            </div>
          </SelectNamespace.Popup>
        </SelectNamespace.Positioner>
      </SelectNamespace.Portal>
    </SelectNamespace.Root>
  )
}
