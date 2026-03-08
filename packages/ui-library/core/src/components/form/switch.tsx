'use client'

import { useState, useId } from 'react'
import { cn } from '@/utils/cn'
import { SwitchStyles as S } from './styles'

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  onCheckedChange?: (checked: boolean) => void
  ref?: React.Ref<HTMLInputElement>
}

function Switch({ className, label, id, checked, defaultChecked, onCheckedChange, onChange, ref, ...props }: SwitchProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked || false)
  const generatedId = useId()
  const switchId = id || generatedId
  const controlledChecked = checked !== undefined ? checked : isChecked

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked
    if (checked === undefined) {
      setIsChecked(newChecked)
    }
    onCheckedChange?.(newChecked)
    onChange?.(e)
  }

  return (
    <div className={S.container}>
      <label
        htmlFor={switchId}
        className={cn(
          S.track.base,
          controlledChecked ? S.checked : S.unchecked,
          !controlledChecked && S.track.uncheckedBorder,
          props.disabled && S.track.disabled,
          className,
        )}
      >
        <input
          type="checkbox"
          id={switchId}
          ref={ref}
          className={S.input}
          checked={controlledChecked}
          onChange={handleChange}
          {...props}
        />
        <span
          className={cn(
            S.thumb.base,
            controlledChecked ? S.thumb.checked : S.thumb.unchecked,
          )}
        />
      </label>
      {label && (
        <label htmlFor={switchId} className={S.label}>
          {label}
        </label>
      )}
    </div>
  )
}

export { Switch }
