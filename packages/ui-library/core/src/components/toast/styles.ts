import type { ToastVariant, ToastPosition } from './types'

export const ToastStyles = {
  container: {
    base: 'fixed z-toast flex gap-2 pointer-events-none',
  },
  root: {
    base: 'rounded-theme-lg border p-4 pr-10 shadow-neu-raised pointer-events-auto flex items-start gap-3 text-foreground bg-background relative',
  },
  content: 'flex-1',
  icon: 'h-5 w-5 flex-shrink-0',
  title: 'font-semibold',
  description: 'text-sm opacity-80 mt-1',
  closeButton: [
    'absolute top-2 right-2',
    'flex items-center justify-center h-8 w-8 rounded-full cursor-pointer',
    'text-foreground/60 hover:text-foreground hover:bg-foreground/10',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2',
  ].join(' '),
  closeIcon: 'h-4 w-4',
  srOnly: 'sr-only',
} as const

export const variantStyles: Record<ToastVariant, string> = {
  info: 'border-primary/40',
  success: 'border-success/40',
  warning: 'border-warning/40',
  destructive: 'border-destructive/40',
  loading: 'border-primary/40',
}

export const iconStyles: Record<ToastVariant, string> = {
  info: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  loading: 'text-primary animate-spin',
}

export const containerStyles: Record<ToastPosition, string> = {
  top: 'top-4 left-1/2 -translate-x-1/2 flex-col',
  'top-left': 'top-4 left-4 flex-col',
  'top-right': 'top-4 right-4 flex-col',
  bottom: 'bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse',
  'bottom-left': 'bottom-4 left-4 flex-col-reverse',
  'bottom-right': 'bottom-4 right-4 flex-col-reverse',
  left: 'left-4 top-1/2 -translate-y-1/2 flex-col',
  right: 'right-4 top-1/2 -translate-y-1/2 flex-col',
}
