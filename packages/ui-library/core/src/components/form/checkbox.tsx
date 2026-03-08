import { useId } from 'react'
import { cn } from '@/utils/cn'
import { CheckboxStyles as S } from './styles'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  ref?: React.Ref<HTMLInputElement>
}

function Checkbox({ className, label, id, ref, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id || generatedId

  return (
    <div className={S.container}>
      <input
        type="checkbox"
        id={checkboxId}
        ref={ref}
        className={cn(S.input, className)}
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className={S.label}>
          {label}
        </label>
      )}
    </div>
  )
}

export { Checkbox }
