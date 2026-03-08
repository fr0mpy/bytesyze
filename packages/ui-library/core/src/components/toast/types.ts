import type { ReactNode, HTMLAttributes } from 'react'
import type { TargetAndTransition } from 'motion/react'

export type ToastVariant = 'info' | 'success' | 'warning' | 'destructive' | 'loading'
export type ToastPosition = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'right'

export interface MotionVariant {
  initial: TargetAndTransition
  animate: TargetAndTransition
  exit: TargetAndTransition
}

export interface ToastData {
  id: string
  variant: ToastVariant
  position: ToastPosition
  title?: string
  description?: string
  duration?: number
}

export interface ToastContextValue {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => string
  removeToast: (id: string) => void
}

export interface ToastProviderProps {
  children: ReactNode
}

export interface ToastContainerProps {
  toasts: ToastData[]
  onRemove: (id: string) => void
}

export interface ToastRootProps {
  toast: ToastData
  onClose: () => void
  ref?: React.Ref<HTMLDivElement>
}

export interface ToastIconProps {
  variant: ToastVariant
  className?: string
}

export interface ToastTitleProps extends HTMLAttributes<HTMLDivElement> {}

export interface ToastDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export interface ToastCloseProps {
  onClose: () => void
  className?: string
}
