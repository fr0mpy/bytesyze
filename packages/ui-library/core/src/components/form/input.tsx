'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { InputStyles as S } from './styles'

// Input base styles
const INPUT_BASE = 'flex w-full rounded-theme-lg px-3 py-2 bg-neu-base shadow-neu-pressed-sm text-sm text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 ease-neu border border-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
const INPUT_HEIGHT = 'h-11'

// Input state styles
const INPUT_INTERACTIVE = 'hover:shadow-neu-pressed hover:border-primary focus:shadow-neu-pressed focus:border-primary'
const INPUT_ERROR = 'border-destructive hover:shadow-neu-pressed focus:shadow-neu-pressed'
const INPUT_SUCCESS = 'border-success hover:shadow-neu-pressed focus:shadow-neu-pressed'

// Icon styles
const ICON_LEFT = 'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-primary group-focus-within:text-primary'
const ICON_RIGHT = 'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-primary group-focus-within:text-primary'
const WITH_ICON_LEFT = 'pl-10'
const WITH_ICON_RIGHT = 'pr-10'

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

const inputVariants = cva(
  [INPUT_BASE, INPUT_HEIGHT].join(' '),
  {
    variants: {
      state: {
        default: INPUT_INTERACTIVE,
        error: INPUT_ERROR,
        success: INPUT_SUCCESS,
      },
      disabled: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { state: 'error', disabled: true, class: S.disabledErrorBorder },
      { state: 'success', disabled: true, class: S.disabledSuccessBorder },
    ],
    defaultVariants: {
      state: 'default',
      disabled: false,
    },
  },
)

export type InputVariants = VariantProps<typeof inputVariants>

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'disabled'> {
  label?: string
  error?: boolean
  success?: boolean
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  disabled?: boolean
  ref?: React.Ref<HTMLInputElement>
}

function Input({ className, type = 'text', label, error, success, helperText, leftIcon, rightIcon, id, disabled, ref, ...props }: InputProps) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)
  const state = error ? 'error' : success ? 'success' : 'default'

  return (
    <div className={S.container}>
      {label && (
        <label htmlFor={inputId} className={LABEL_TRACKING}>
          {label}
        </label>
      )}
      <div className={S.wrapper}>
        {leftIcon && <div className={ICON_LEFT}>{leftIcon}</div>}
        <input
          id={inputId}
          type={type}
          disabled={disabled}
          className={cn(
            inputVariants({ state, disabled }),
            leftIcon && WITH_ICON_LEFT,
            rightIcon && WITH_ICON_RIGHT,
            className,
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && <div className={ICON_RIGHT}>{rightIcon}</div>}
      </div>
      {helperText && (
        <p className={getHelperStyles({ hasError: error, hasSuccess: success })}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export { Input, inputVariants }
