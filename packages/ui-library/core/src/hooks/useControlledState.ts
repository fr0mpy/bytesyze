'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook for managing controlled/uncontrolled component state.
 *
 * When `controlled` is provided, the component acts as controlled.
 * When `controlled` is undefined, the component manages its own internal state.
 *
 * @param controlled - The controlled value (undefined for uncontrolled)
 * @param defaultValue - The initial value for uncontrolled mode
 * @param onChange - Callback when value changes
 * @returns [currentValue, setValue] tuple
 */
export function useControlledState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T | ((prev: T) => T)) => void] {
  const isControlled = controlled !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)

  // Track whether this is the first render to avoid calling onChange on mount
  const isFirstRender = useRef(true)

  // Use refs to access current values without creating unstable callback references
  const internalValueRef = useRef(internalValue)
  const controlledRef = useRef(controlled)
  const isControlledRef = useRef(isControlled)
  const onChangeRef = useRef(onChange)

  // Keep refs in sync
  internalValueRef.current = internalValue
  controlledRef.current = controlled
  isControlledRef.current = isControlled
  onChangeRef.current = onChange

  // Sync internal state with controlled value
  useEffect(() => {
    if (isControlled) {
      setInternalValue(controlled)
    }
  }, [isControlled, controlled])

  // Stable setValue that never changes reference
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const currentValue = isControlledRef.current ? controlledRef.current : internalValueRef.current
      const resolvedValue = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(currentValue as T)
        : newValue

      // Only update internal state if uncontrolled
      if (!isControlledRef.current) {
        setInternalValue(resolvedValue)
      }

      // Always call onChange
      onChangeRef.current?.(resolvedValue)
    },
    [], // Empty deps = stable reference
  )

  // Skip onChange on first render
  useEffect(() => {
    isFirstRender.current = false
  }, [])

  return [isControlled ? controlled : internalValue, setValue]
}
