'use client'

import { createContext, useContext } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { AlertStyles as S } from './styles'
import type { AlertIconProps, AlertTitleProps, AlertDescriptionProps } from './types'

const alertVariants = cva(S.base, {
  variants: {
    variant: {
      info: S.variants.info,
      success: S.variants.success,
      warning: S.variants.warning,
      destructive: S.variants.destructive,
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

export type AlertVariant = VariantProps<typeof alertVariants>['variant']

// Context to pass variant down to children
const AlertContext = createContext<NonNullable<AlertVariant>>('info')

const icons: Record<NonNullable<AlertVariant>, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  destructive: AlertCircle,
}

interface AlertRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof alertVariants> {
  ref?: React.Ref<HTMLDivElement>
}

function AlertRoot({ variant = 'info', className, children, ref, ...props }: AlertRootProps) {
  // variant is guaranteed to be non-null due to default value
  const safeVariant: AlertVariant = variant ?? 'info'
  return (
    <AlertContext.Provider value={safeVariant}>
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    </AlertContext.Provider>
  )
}

function AlertIcon({ variant: variantProp, className }: AlertIconProps) {
  const contextVariant = useContext(AlertContext)
  const variant = variantProp ?? contextVariant
  const Icon = icons[variant]
  return <Icon className={cn(S.icon, className)} />
}

function AlertTitle({ className, children, ref, ...props }: AlertTitleProps) {
  return (
    <h5
      ref={ref}
      className={cn(S.title, className)}
      {...props}
    >
      {children}
    </h5>
  )
}

function AlertDescription({ className, ref, ...props }: AlertDescriptionProps) {
  return (
    <p
      ref={ref}
      className={cn(S.description, className)}
      {...props}
    />
  )
}

// Namespace Export (callable as Root + namespace)
export const Alert = Object.assign(AlertRoot, {
  Root: AlertRoot,
  Icon: AlertIcon,
  Title: AlertTitle,
  Description: AlertDescription,
})

// Export context for advanced use cases
export { AlertContext, alertVariants }

// Individual exports for backward compatibility
export { AlertIcon, AlertTitle, AlertDescription }
