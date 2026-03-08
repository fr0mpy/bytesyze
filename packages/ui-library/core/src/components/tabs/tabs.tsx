'use client'

import { createContext, useContext, useId, useRef, useCallback, useEffect } from 'react'
import { motion, LayoutGroup } from 'motion/react'
import { cn } from '@/utils/cn'
import { TabsStyles as S } from './styles'
import { SPRING } from '../../config'
import { useControlledState } from '../../hooks/useControlledState'
import type {
  TabsContextValue,
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsIndicatorProps,
} from './types'

// Original spring with natural bounce - used at edges
const SPRING_BOUNCE = SPRING.bouncy

// Extra smooth for middle transitions - no bounce
const SPRING_SMOOTH = SPRING.smooth

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs.Root')
  }
  return context
}

// ============================================================================
// Tabs.Root
// ============================================================================

function TabsRoot({ defaultValue, value, onValueChange, className, children, ref, ...props }: TabsRootProps) {
  const layoutId = useId()

  const [activeTab, setActiveTabState] = useControlledState<string>(
    value,
    defaultValue,
    onValueChange,
  )

  // Track registered tabs in DOM order
  const tabsRef = useRef<string[]>([])
  const currentSpringRef = useRef<typeof SPRING_SMOOTH | typeof SPRING_BOUNCE>(SPRING_SMOOTH)

  const registerTab = useCallback((tabValue: string) => {
    if (!tabsRef.current.includes(tabValue)) {
      tabsRef.current.push(tabValue)
    }
  }, [])

  const unregisterTab = useCallback((tabValue: string) => {
    tabsRef.current = tabsRef.current.filter(t => t !== tabValue)
  }, [])

  const computeSpring = useCallback((toValue: string) => {
    const tabs = tabsRef.current
    const toIndex = tabs.indexOf(toValue)
    const isEdge = toIndex === 0 || toIndex === tabs.length - 1
    return isEdge ? SPRING_BOUNCE : SPRING_SMOOTH
  }, [])

  const setActiveTab = useCallback((newValue: string) => {
    currentSpringRef.current = computeSpring(newValue)
    setActiveTabState(newValue)
  }, [computeSpring, setActiveTabState])

  const getSpring = useCallback(() => currentSpringRef.current, [])

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        layoutId,
        registerTab,
        unregisterTab,
        getSpring,
      }}
    >
      <LayoutGroup>
        <div ref={ref} className={cn(S.root, className)} {...props}>
          {children}
        </div>
      </LayoutGroup>
    </TabsContext.Provider>
  )
}

// ============================================================================
// Tabs.List
// ============================================================================

function TabsList({ className, children, ref, ...props }: TabsListProps) {
  return (
    <div
      ref={ref}
      role="tablist"
      className={cn(S.list, className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Tabs.Trigger
// ============================================================================

function TabsTrigger({ value, className, children, ref, ...props }: TabsTriggerProps) {
  const { activeTab, setActiveTab, layoutId, registerTab, unregisterTab, getSpring } = useTabsContext()
  const isActive = activeTab === value

  // Register tab on mount, unregister on unmount
  useEffect(() => {
    registerTab(value)
    return () => unregisterTab(value)
  }, [value, registerTab, unregisterTab])

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        S.trigger.base,
        isActive ? S.trigger.active : S.trigger.inactive,
        className,
      )}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId={`${layoutId}-indicator`}
          className={S.indicator}
          transition={getSpring()}
        />
      )}
      <span className={S.triggerLabel}>{children}</span>
    </button>
  )
}

// ============================================================================
// Tabs.Content
// ============================================================================

function TabsContent({ value, forceMount, className, children, ref, ...props }: TabsContentProps) {
  const { activeTab } = useTabsContext()
  const isActive = activeTab === value

  if (!isActive && !forceMount) return null

  return (
    <div
      ref={ref}
      role="tabpanel"
      tabIndex={isActive ? 0 : -1}
      className={cn(
        S.content.base,
        !isActive && S.content.hidden,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Tabs.Indicator (for custom indicator placement)
// ============================================================================

function TabsIndicator({ className, ref, onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, ...props }: TabsIndicatorProps & { onDrag?: unknown; onDragStart?: unknown; onDragEnd?: unknown; onAnimationStart?: unknown; onAnimationEnd?: unknown }) {
  const { layoutId, getSpring } = useTabsContext()

  return (
    <motion.span
      ref={ref}
      layoutId={`${layoutId}-indicator`}
      className={cn(S.indicator, className)}
      transition={getSpring()}
      {...props}
    />
  )
}

// ============================================================================
// Namespace Export
// ============================================================================

// Namespace Export (callable as Root + namespace)
export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
  Indicator: TabsIndicator,
})

// Individual exports for backward compatibility
export { TabsList, TabsTrigger, TabsContent }
