/**
 * Shared Button types
 *
 * Centralized type definitions for Button components to ensure consistency
 * between ButtonStatic and ButtonAnimated.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'ghost' | 'outline' | 'destructive' | 'inset'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Renders as a circular icon-only button */
  iconOnly?: boolean
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

export interface ButtonProps extends ButtonBaseProps {
  loading?: boolean
  loadingText?: string
}
