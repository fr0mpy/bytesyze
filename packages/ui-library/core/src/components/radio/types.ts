import type { ReactNode, Ref } from 'react'

export interface RadioRootProps {
  children: ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  name?: string
}

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
  ref?: Ref<HTMLDivElement>
}

export interface RadioItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
  value: string
  children?: ReactNode
  ref?: Ref<HTMLInputElement>
}

export interface RadioIndicatorProps {
  className?: string
}

export interface RadioContextValue {
  value: string
  setValue: (value: string) => void
  name: string
  disabled?: boolean
}

export interface RadioItemContextValue {
  isSelected: boolean
  disabled: boolean
  radioId: string
}
