/**
 * JsonView Styles
 *
 * Syntax highlighting colors use semantic theme tokens for
 * consistent appearance across light/dark modes.
 */

export const JsonViewStyles = {
  /** Container with background and scroll */
  container: [
    'bg-muted/10 rounded-lg',
    'border border-border/50',
    'overflow-auto',
  ].join(' '),

  /** Optional label above JSON */
  label: 'text-xs text-muted-foreground font-medium px-4 pt-3 pb-1',

  /** Pre/code content area */
  content: [
    'p-4 pt-2',
    'font-mono text-sm leading-relaxed',
    'whitespace-pre',
  ].join(' '),

  /** Line numbers variant */
  withLineNumbers: 'pl-12',

  /** Individual line */
  line: 'relative',

  /** Nested content (indented) */
  nested: 'pl-4 border-l border-border/30',

  /** Collapse button */
  collapseButton: [
    'inline-flex items-center justify-center',
    'w-4 h-4 mr-1',
    'rounded hover:bg-muted/20',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
  ].join(' '),

  /** Chevron icon */
  chevron: 'w-3 h-3 text-muted-foreground transition-transform',

  /** Chevron when expanded */
  chevronExpanded: 'rotate-90',

  /** Collapsed indicator text */
  collapsed: 'text-muted-foreground italic text-xs mx-1',

  /** Bracket characters */
  bracket: 'text-foreground',

  /** Colon after key */
  colon: 'text-foreground mr-1',

  // ============================================================================
  // Syntax Colors - use semantic tokens
  // ============================================================================

  /** Object/Array keys - primary color */
  key: 'text-primary',

  /** String values - success/green */
  string: 'text-success',

  /** Number values - warning/orange */
  number: 'text-warning',

  /** Boolean values - info/blue */
  boolean: 'text-info',

  /** Null values - muted */
  null: 'text-muted-foreground font-medium',

  /** Unknown/fallback */
  unknown: 'text-destructive',
} as const
