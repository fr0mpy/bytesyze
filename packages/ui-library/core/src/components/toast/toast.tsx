'use client'

import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import {
  ToastStyles as S,
  variantStyles,
  iconStyles,
  containerStyles,
} from './styles'
import { TOAST, SPRING, SR_ONLY, SLIDE_FADE, type SlideDirection } from '../../config'
import type {
  ToastVariant,
  ToastPosition,
  ToastData,
  ToastContextValue,
  ToastProviderProps,
  ToastContainerProps,
  ToastRootProps,
  ToastIconProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastCloseProps,
} from './types'

// Module-level constants to avoid recreation on each render
const icons: Record<ToastVariant, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  destructive: AlertCircle,
  loading: Loader2,
}

// Map toast positions to slide directions
const POSITION_TO_SLIDE: Record<ToastPosition, SlideDirection> = {
  top: 'top',
  'top-left': 'left',
  'top-right': 'right',
  bottom: 'bottom',
  'bottom-left': 'left',
  'bottom-right': 'right',
  left: 'left',
  right: 'right',
}

const positions: ToastPosition[] = ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right', 'left', 'right']

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((toast: Omit<ToastData, 'id'>): string => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  // Guard against SSR - document not available on server
  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      {positions.map((position) => {
        const positionToasts = toasts.filter((t) => t.position === position)
        if (positionToasts.length === 0) return null

        return (
          <div
            key={position}
            className={cn(S.container.base, containerStyles[position])}
          >
            <AnimatePresence mode="popLayout">
              {positionToasts.map((toast) =>
                <ToastRoot key={toast.id} toast={toast} onClose={() => onRemove(toast.id)} />,
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </>,
    document.body,
  )
}

function ToastRoot({ toast, onClose, ref }: ToastRootProps) {
  const [isVisible, setIsVisible] = useState(true)
  const duration = toast.duration ?? TOAST.defaultDuration

  const handleClose = useCallback(() => {
    setIsVisible(false)
  }, [])

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  return (
    <AnimatePresence mode="wait" onExitComplete={onClose}>
      {isVisible && (
        <motion.div
          ref={ref}
          layout
          role="alert"
          initial={SLIDE_FADE[POSITION_TO_SLIDE[toast.position]].initial}
          animate={SLIDE_FADE[POSITION_TO_SLIDE[toast.position]].animate}
          exit={SLIDE_FADE[POSITION_TO_SLIDE[toast.position]].exit}
          transition={SPRING.bouncy}
          className={cn(S.root.base, variantStyles[toast.variant])}
        >
          <ToastIcon variant={toast.variant} />
          <div className={S.content}>
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
          <ToastClose onClose={handleClose} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ToastIcon({ variant, className }: ToastIconProps) {
  const Icon = icons[variant]
  return <Icon className={cn(S.icon, iconStyles[variant], className)} />
}

function ToastTitle({ className, children, ...props }: ToastTitleProps) {
  return (
    <div className={cn(S.title, className)} {...props}>
      {children}
    </div>
  )
}

function ToastDescription({ className, children, ...props }: ToastDescriptionProps) {
  return (
    <div className={cn(S.description, className)} {...props}>
      {children}
    </div>
  )
}

function ToastClose({ onClose, className }: ToastCloseProps) {
  return (
    <button
      onClick={onClose}
      className={cn(S.closeButton, className)}
    >
      <X className={S.closeIcon} />
      <span className={S.srOnly}>{SR_ONLY.close}</span>
    </button>
  )
}

export const Toast = {
  Provider: ToastProvider,
  Container: ToastContainer,
  Root: ToastRoot,
  Icon: ToastIcon,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
}

// Direct export for reliable imports (Object.assign pattern can cause issues)
export { ToastProvider }
