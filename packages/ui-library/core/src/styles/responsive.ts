/**
 * Responsive type utilities for breakpoint-aware props.
 */

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>
