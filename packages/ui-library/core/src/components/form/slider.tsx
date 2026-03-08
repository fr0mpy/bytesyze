'use client'

import { useState } from 'react'
import { cn } from '@/utils/cn'
import { SliderStyles as S } from './styles'

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  ref?: React.Ref<HTMLInputElement>
}

function Slider({ min = 0, max = 100, step = 1, value, defaultValue = 50, onValueChange, className, ref, ...props }: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value !== undefined ? value : internalValue
  const [indicatorScale, setIndicatorScale] = useState((currentValue - min) / (max - min))

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    setIndicatorScale((newValue - min) / (max - min))
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <div className={cn(S.container, className)}>
      <div className={S.trackBg}>
        <div
          className={S.fill}
          style={{ transform: `scaleX(${indicatorScale})` }}
        />
      </div>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleInput}
        className={S.input}
        {...props}
      />
    </div>
  )
}

export { Slider }
