'use client'

import {
  createContext,
  useContext,
  useId,
  useCallback,
  useMemo,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/utils/cn'
import { RadioStyles as S } from './styles'
import { SPRING } from '../../config'
import { useControlledState } from '../../hooks/useControlledState'
import type {
  RadioContextValue,
  RadioItemContextValue,
  RadioRootProps,
  RadioGroupProps,
  RadioItemProps,
  RadioIndicatorProps,
} from './types'

// Smooth spring for instant but organic feedback
const FILL_SPRING = SPRING.snappy

// Context for the radio group state
const RadioContext = createContext<RadioContextValue | undefined>(undefined)

const useRadioContext = () => {
  const context = useContext(RadioContext)
  if (!context) {
    throw new Error('Radio components must be used within a Radio.Root')
  }
  return context
}

// Context for individual radio item state
const RadioItemContext = createContext<RadioItemContextValue | undefined>(undefined)

const useRadioItemContext = () => {
  const context = useContext(RadioItemContext)
  if (!context) {
    throw new Error('Radio.Indicator must be used within a Radio.Item')
  }
  return context
}

// Radio.Root - Context provider for the radio group
function RadioRoot({
  children,
  value,
  defaultValue = '',
  onValueChange,
  disabled = false,
  name,
}: RadioRootProps) {
  const [currentValue, setValue] = useControlledState(value, defaultValue, onValueChange)
  const generatedId = useId()
  const groupName = name || `radio-group-${generatedId}`

  const contextValue = useMemo<RadioContextValue>(
    () => ({
      value: currentValue,
      setValue,
      name: groupName,
      disabled,
    }),
    [currentValue, setValue, groupName, disabled],
  )

  return <RadioContext.Provider value={contextValue}>{children}</RadioContext.Provider>
}

// Radio.Group - Visual wrapper for radio options
function RadioGroup({ children, orientation = 'vertical', className, ref, ...props }: RadioGroupProps) {
  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-orientation={orientation}
      className={cn(
        S.group.base,
        orientation === 'vertical' ? S.group.vertical : S.group.horizontal,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Radio.Indicator - The visual indicator (the filled circle)
// Defined before RadioItem since RadioItem uses it internally
function RadioIndicator({ className }: RadioIndicatorProps) {
  const { isSelected } = useRadioItemContext()

  return (
    <AnimatePresence>
      {isSelected && (
        <motion.span
          className={cn(S.indicator, className)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={FILL_SPRING}
        />
      )}
    </AnimatePresence>
  )
}

// Radio.Item - Individual radio option
function RadioItem({ value: itemValue, children, className, id, disabled: itemDisabled, ref, ...props }: RadioItemProps) {
  const { value: groupValue, setValue, name, disabled: groupDisabled } = useRadioContext()
  const isSelected = groupValue === itemValue
  const disabled = itemDisabled || groupDisabled
  const generatedId = useId()
  const radioId = id || `${name}-${itemValue}-${generatedId}`

  const handleChange = useCallback(() => {
    if (!disabled) {
      setValue(itemValue)
    }
  }, [disabled, setValue, itemValue])

  const itemContextValue = useMemo<RadioItemContextValue>(
    () => ({
      isSelected,
      disabled: disabled || false,
      radioId,
    }),
    [isSelected, disabled, radioId],
  )

  return (
    <RadioItemContext.Provider value={itemContextValue}>
      <div className={cn(S.item.wrapper, className)}>
        <div className={S.item.inputWrapper}>
          <input
            type="radio"
            ref={ref}
            id={radioId}
            name={name}
            value={itemValue}
            checked={isSelected}
            disabled={disabled}
            onChange={handleChange}
            className={S.item.input}
            {...props}
          />
          <label
            htmlFor={radioId}
            className={cn(
              S.item.label.base,
              disabled && S.item.label.disabled,
            )}
          >
            <RadioIndicator />
          </label>
        </div>
        {children && (
          <label
            htmlFor={radioId}
            className={cn(
              S.item.textLabel.base,
              disabled && S.item.textLabel.disabled,
            )}
          >
            {children}
          </label>
        )}
      </div>
    </RadioItemContext.Provider>
  )
}

// Namespace export
export const Radio = {
  Root: RadioRoot,
  Group: RadioGroup,
  Item: RadioItem,
  Indicator: RadioIndicator,
}

// Re-export context hooks for advanced use cases
export { useRadioContext, useRadioItemContext }
