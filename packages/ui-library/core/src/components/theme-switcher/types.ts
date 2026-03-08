import type { ComponentPropsWithRef } from 'react'

export interface ThemeSwitcherProps extends Omit<ComponentPropsWithRef<'button'>, 'onChange'> {
  /** Whether dark mode is currently active */
  isDark: boolean
  /** Callback when the theme is toggled */
  onToggle: () => void
  /** Hides track indicators when true - knob and icon always visible */
  compact?: boolean
}
