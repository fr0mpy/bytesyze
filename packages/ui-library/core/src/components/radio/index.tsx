export { Radio, useRadioContext, useRadioItemContext } from './radio'
export type {
  RadioRootProps,
  RadioGroupProps,
  RadioItemProps,
  RadioIndicatorProps,
  RadioContextValue,
  RadioItemContextValue,
} from './types'

// =============================================================================
// Backward compatibility exports (convenience wrappers)
// =============================================================================
import type { ReactNode, Ref } from 'react'
import { Radio } from './radio'

export interface RadioGroupWrapperProps {
  children: ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  name?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
  ref?: Ref<HTMLDivElement>
}

export interface RadioGroupItemProps {
  value: string
  label?: ReactNode
  disabled?: boolean
  className?: string
  ref?: Ref<HTMLInputElement>
}

/**
 * Convenience wrapper that combines Radio.Root and Radio.Group
 */
export function RadioGroup({ children, value, defaultValue, onValueChange, disabled, name, orientation, className, ref }: RadioGroupWrapperProps) {
  return (
    <Radio.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
    >
      <Radio.Group ref={ref} orientation={orientation} className={className}>
        {children}
      </Radio.Group>
    </Radio.Root>
  )
}

/**
 * Convenience wrapper that combines Radio.Item with label prop
 */
export function RadioGroupItem({ value, label, disabled, className, ref }: RadioGroupItemProps) {
  return (
    <Radio.Item ref={ref} value={value} disabled={disabled} className={className}>
      {label}
    </Radio.Item>
  )
}
