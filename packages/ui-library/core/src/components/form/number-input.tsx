'use client'

import { useState, useCallback } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/utils/cn'
import { NumberInputStyles as S } from './styles'
import { ARIA } from '../../config'

// Stepper button styles
const STEPPER_BASE = 'flex items-center justify-center h-10 w-10 cursor-pointer bg-neu-base shadow-neu-raised text-foreground transition-shadow duration-200 hover:shadow-neu-raised-lg active:shadow-neu-pressed-sm focus-visible:outline-none focus-visible:shadow-[var(--shadow-raised),var(--shadow-focus)] disabled:pointer-events-none disabled:opacity-50'
const STEPPER_LEFT = 'rounded-l-theme-lg'
const STEPPER_RIGHT = 'rounded-r-theme-lg'

// Number input field styles
const NUMBER_FIELD = 'flex h-10 w-full px-3 py-2 bg-neu-base shadow-neu-pressed-sm text-sm text-foreground text-center placeholder:text-muted-foreground transition-[border-color] duration-200 ease-neu border-y border-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
const NUMBER_INTERACTIVE = 'hover:shadow-neu-pressed hover:border-primary focus:shadow-neu-pressed focus:border-primary'
const NUMBER_ERROR = 'border-destructive hover:shadow-neu-pressed focus:shadow-neu-pressed'
const NUMBER_SUCCESS = 'border-success hover:shadow-neu-pressed focus:shadow-neu-pressed'

// Label styles
const LABEL_TRACKING = 'block font-body text-sm font-medium tracking-wide text-foreground mb-1.5'

// Helper styles
const HELPER_BASE = 'mt-1.5 text-xs'
const HELPER_DEFAULT = 'text-muted-foreground'
const HELPER_ERROR = 'text-destructive'
const HELPER_SUCCESS = 'text-success'

function getHelperStyles(options: { hasError?: boolean; hasSuccess?: boolean }): string {
  const { hasError, hasSuccess } = options
  return `${HELPER_BASE} ${hasError ? HELPER_ERROR : hasSuccess ? HELPER_SUCCESS : HELPER_DEFAULT}`
}

// Icon size
const ICON_SM = 'h-4 w-4'

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  error?: boolean
  success?: boolean
  helperText?: string
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  ref?: React.Ref<HTMLInputElement>
}

function NumberInput({
  className,
  label,
  error,
  success,
  helperText,
  min,
  max,
  step = 1,
  value: controlledValue,
  defaultValue = 0,
  onChange,
  disabled,
  id,
  ref,
  ...props
}: NumberInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const inputId = id || (label ? `number-input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

  const clampValue = useCallback((val: number): number => {
    let clamped = val
    if (min !== undefined && clamped < min) clamped = min
    if (max !== undefined && clamped > max) clamped = max
    return clamped
  }, [min, max])

  const updateValue = useCallback((newValue: number) => {
    const clamped = clampValue(newValue)
    if (!isControlled) {
      setInternalValue(clamped)
    }
    onChange?.(clamped)
  }, [clampValue, isControlled, onChange])

  const handleIncrement = () => !disabled && updateValue(currentValue + step)
  const handleDecrement = () => !disabled && updateValue(currentValue - step)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value)
    if (!isNaN(parsed)) {
      updateValue(parsed)
    } else if (e.target.value === '' || e.target.value === '-') {
      if (!isControlled) setInternalValue(0)
    }
  }

  const handleBlur = () => updateValue(currentValue)

  const canDecrement = min === undefined || currentValue > min
  const canIncrement = max === undefined || currentValue < max

  return (
    <div className={S.container}>
      {label && (
        <label htmlFor={inputId} className={LABEL_TRACKING}>
          {label}
        </label>
      )}
      <div className={S.wrapper}>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || !canDecrement}
          className={cn(STEPPER_BASE, STEPPER_LEFT)}
          aria-label={ARIA.decreaseValue}
        >
          <Minus className={ICON_SM} />
        </button>
        <input
          id={inputId}
          ref={ref}
          type="number"
          value={currentValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={cn(
            NUMBER_FIELD,
            !error && !success && NUMBER_INTERACTIVE,
            error && NUMBER_ERROR,
            success && NUMBER_SUCCESS,
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || !canIncrement}
          className={cn(STEPPER_BASE, STEPPER_RIGHT)}
          aria-label={ARIA.increaseValue}
        >
          <Plus className={ICON_SM} />
        </button>
      </div>
      {helperText && (
        <p className={getHelperStyles({ hasError: error, hasSuccess: success })}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export { NumberInput }
export type { NumberInputProps }
