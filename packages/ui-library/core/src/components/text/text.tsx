import { cn } from '@/utils/cn'
import { TextStyles as S } from './styles'
import { DEFAULT_ELEMENT_MAP } from './types'
import type { TextProps, LineClamp } from './types'

/**
 * Text component for consistent typography across the application.
 *
 * Features:
 * - 14 semantic variants (h1-h6, body1/2, lead, caption, etc.)
 * - Responsive scaling for h1-h4 headings (auto-enabled)
 * - Semantic colors, weights, and alignment
 * - Truncation and line clamping support
 *
 * @example
 * ```tsx
 * <Text variant="h1">Page Title</Text>
 * <Text variant="body1" color="muted">Description text</Text>
 * <Text variant="h1" as="h2">Styled as h1, rendered as h2</Text>
 * <Text variant="body2" truncate>Long text that truncates...</Text>
 * <Text variant="kbd">Cmd+K</Text>
 * ```
 */
function TextComponent({
  variant = 'body1',
  as,
  color,
  weight,
  align,
  truncate,
  lineClamp,
  italic,
  underline,
  className,
  children,
  ref,
  ...props
}: TextProps) {
  const Component = as ?? DEFAULT_ELEMENT_MAP[variant]

  const classes = cn(
    S.variants[variant],
    color && S.colors[color],
    weight && S.weights[weight],
    align && S.aligns[align],
    truncate && S.modifiers.truncate,
    lineClamp && S.lineClamps[lineClamp as LineClamp],
    italic && S.modifiers.italic,
    underline && S.modifiers.underline,
    className,
  )

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  )
}

// Named export with display name for devtools
TextComponent.displayName = 'Text'

export const Text = TextComponent
