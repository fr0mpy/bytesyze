'use client'

import { createContext, useContext, useMemo } from 'react'
import { cn } from '@/utils/cn'
import { ToolbarStyles as S } from './styles'
import type {
  ToolbarOrientation,
  ToolbarRootProps,
  ToolbarButtonProps,
  ToolbarSeparatorProps,
  ToolbarGroupProps,
  ToolbarLinkProps,
} from './types'

interface ToolbarContextValue {
  orientation: ToolbarOrientation
}

const ToolbarContext = createContext<ToolbarContextValue>({ orientation: 'horizontal' })

const useToolbarContext = () => useContext(ToolbarContext)

function ToolbarRoot({ orientation = 'horizontal', className, children, ref, ...props }: ToolbarRootProps) {
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ orientation }), [orientation])

  return (
    <ToolbarContext.Provider value={contextValue}>
      <div
        ref={ref}
        role="toolbar"
        aria-orientation={orientation}
        className={cn(
          S.root.base,
          orientation === 'vertical' && S.root.vertical,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ToolbarContext.Provider>
  )
}

function ToolbarButton({ active, className, children, ref, ...props }: ToolbarButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      data-state={active ? 'on' : 'off'}
      className={cn(
        S.button.base,
        active ? S.button.active : S.button.inactive,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function ToolbarSeparator({ className, ref, ...props }: ToolbarSeparatorProps) {
  const { orientation } = useToolbarContext()

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      className={cn(
        S.separator.base,
        orientation === 'horizontal' ? S.separator.horizontal : S.separator.vertical,
        className,
      )}
      {...props}
    />
  )
}

function ToolbarGroup({ className, children, ref, ...props }: ToolbarGroupProps) {
  const { orientation } = useToolbarContext()

  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        S.group.base,
        orientation === 'vertical' && S.group.vertical,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function ToolbarLink({ className, children, ref, ...props }: ToolbarLinkProps) {
  return (
    <a
      ref={ref}
      className={cn(S.link, className)}
      {...props}
    >
      {children}
    </a>
  )
}

export const Toolbar = Object.assign(ToolbarRoot, {
  Button: ToolbarButton,
  Separator: ToolbarSeparator,
  Group: ToolbarGroup,
  Link: ToolbarLink,
})

// Individual exports for backward compatibility
export { ToolbarButton, ToolbarSeparator, ToolbarGroup, ToolbarLink }
