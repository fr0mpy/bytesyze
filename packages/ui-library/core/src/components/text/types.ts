import type { HTMLAttributes, ElementType, Ref, ReactNode } from 'react'

/**
 * Typography variant types for the Text component.
 */
export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'lead'
  | 'body1'
  | 'body2'
  | 'subtitle'
  | 'caption'
  | 'overline'
  | 'code'
  | 'kbd'

/**
 * Semantic color options for text.
 */
export type TextColor = 'foreground' | 'muted' | 'primary' | 'destructive' | 'success'

/**
 * Font weight options.
 */
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'

/**
 * Text alignment options.
 */
export type TextAlign = 'left' | 'center' | 'right'

/**
 * Line clamp options for multi-line truncation.
 */
export type LineClamp = 1 | 2 | 3 | 4 | 5 | 6

/**
 * Default HTML element mapping for each variant.
 */
export const DEFAULT_ELEMENT_MAP: Record<TextVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  lead: 'p',
  body1: 'p',
  body2: 'p',
  subtitle: 'p',
  caption: 'span',
  overline: 'span',
  code: 'code',
  kbd: 'kbd',
}

/**
 * Props for the Text component.
 */
export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Typography variant determining size, weight, and default element */
  variant?: TextVariant

  /** Override the rendered HTML element */
  as?: ElementType

  /** Semantic text color */
  color?: TextColor

  /** Override font weight */
  weight?: TextWeight

  /** Text alignment */
  align?: TextAlign

  /** Enable single-line truncation with ellipsis */
  truncate?: boolean

  /** Enable multi-line truncation (1-6 lines) */
  lineClamp?: LineClamp

  /** Render text in italic */
  italic?: boolean

  /** Render text with underline */
  underline?: boolean

  /** Component children */
  children?: ReactNode

  /** Ref forwarding (React 19 style) */
  ref?: Ref<HTMLElement>
}
