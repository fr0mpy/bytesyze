---
description: USE WHEN generating, modifying, or reviewing UI components, working with Tailwind CSS theming, design tokens, or component recipes. Enforces zero-inline-classnames pattern, token usage, mobile-first patterns, and recipe compliance.
---

# Styling System

Apply this skill when generating, modifying, or reviewing UI components.

## ⚠️ CRITICAL RULE: Use Text Component (No Raw HTML Text Elements)

**NEVER use raw `<p>`, `<span>`, `<h1>`-`<h6>` tags. ALWAYS use the Text component.**

```tsx
// ❌ NEVER — Raw HTML text elements
<p className={styles.description}>Description</p>
<h1 className={styles.title}>Title</h1>
<span className={styles.caption}>Caption</span>

// ✅ ALWAYS — Text component from @bytesyze-ui/core/text
import { Text } from '@bytesyze-ui/core/text'

<Text variant="body2" color="muted">Description</Text>
<Text variant="h1">Title</Text>
<Text variant="caption" color="muted">Caption</Text>
```

**Text component variants:**

| Variant | Renders As | Use For |
|---------|------------|---------|
| `h1`-`h6` | `<h1>`-`<h6>` | Headings |
| `lead` | `<p>` | Large intro text |
| `body1` | `<p>` | Standard body (default) |
| `body2` | `<p>` | Smaller body text |
| `subtitle` | `<p>` | Subtitle text |
| `caption` | `<span>` | Small labels, timestamps |
| `overline` | `<span>` | Category labels |
| `code` | `<code>` | Inline code |
| `kbd` | `<kbd>` | Keyboard shortcuts |

**Props:** `color` (`muted`, `primary`, `destructive`, `success`), `weight`, `align`, `truncate`, `lineClamp`

**Why:** Semantic HTML, consistent typography, responsive scaling, maintainable code.

---

## ⚠️ CRITICAL RULE: Zero Inline Classnames

**Components MUST NOT contain Tailwind className strings inline.**

All styles must be abstracted into:
1. `component-harness/styles/` — Centralized patterns and tokens
2. `component-harness/components/[name]/styles.ts` — Component-specific styles

```tsx
// ❌ NEVER — Inline classnames in components
<button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg">

// ✅ ALWAYS — Import from styles
import { ButtonStyles } from './styles'
<button className={ButtonStyles.base}>
```

## Style Architecture

```
component-harness/styles/
├── index.ts              # Main barrel export
├── motion.ts             # Framer Motion presets
├── responsive.ts         # Responsive utilities
├── tokens/               # Primitive tokens
│   ├── index.ts
│   ├── spacing.ts        # Spacing.p4, Spacing.gap2
│   ├── sizing.ts         # Sizing.w4, Sizing.h10
│   └── typography.ts     # Typography.textSm, Typography.fontMedium
└── patterns/             # Style compositions
    ├── index.ts          # Patterns barrel export
    ├── form/             # Form.Label.base, Form.Input.base
    ├── layout/           # Layout.Flex.center, Layout.Position.absolute
    ├── interactive/      # Interactive.Focus.ring, Interactive.Hover.opacity
    ├── overlay/          # Overlay.Dialog.backdrop, Overlay.Card.container
    ├── control/          # Control.Toggle.base, Control.Slider.track
    └── feedback/         # Feedback.Badge.primary, Feedback.Alert.success
```

## Namespace Pattern

Use dot notation for clean, discoverable style access:

```typescript
// In component-harness/styles/patterns/form/input.ts
export const Input = {
  base: 'w-full rounded-theme-lg border bg-neu-base px-3 py-2',
  focus: 'focus-visible:outline-none focus-visible:shadow-neu-focus',
  error: 'border-destructive',
  success: 'border-success',
} as const

// In component's styles.ts
import { Form, Interactive } from '../../styles'

export const InputStyles = {
  container: [Form.Input.base, Interactive.Focus.ring].join(' '),
  error: Form.Input.error,
} as const
```

## Component Structure

Every component directory must have:

```
components/
└── button/
    ├── index.tsx         # Component (no inline classnames)
    └── styles.ts         # All styles for this component
```

### styles.ts Pattern

```typescript
// components/button/styles.ts
import { Interactive, Layout } from '../../styles'

export const ButtonStyles = {
  base: [
    Layout.Flex.centerInline,
    Interactive.Button.base,
    Interactive.Focus.ring,
    Interactive.Cursor.pointer,
  ].join(' '),

  variants: {
    primary: 'bg-primary text-primary-foreground shadow-neu-raised',
    secondary: 'bg-secondary text-secondary-foreground shadow-neu-raised',
    ghost: 'hover:bg-muted',
  },

  sizes: {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
  },
} as const
```

### Component Usage

```tsx
// components/button/index.tsx
import { cn } from '../../lib/utils'
import { ButtonStyles } from './styles'

export function Button({ variant = 'primary', size = 'md', className, ...props }) {
  return (
    <button
      className={cn(
        ButtonStyles.base,
        ButtonStyles.variants[variant],
        ButtonStyles.sizes[size],
        className
      )}
      {...props}
    />
  )
}
```

## Compound Component Pattern

Multi-part components use namespace exports with Object.assign:

```tsx
// dialog/dialog.tsx
function DialogSimple({ open, onClose, title, children }) {
  return (
    <DialogRoot open={open} onOpenChange={(o) => !o && onClose?.()}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {children}
      </DialogContent>
    </DialogRoot>
  )
}

// Object.assign makes it callable AND has namespace properties
export const Dialog = Object.assign(DialogSimple, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Close: DialogClose,
})

// Individual exports for backward compatibility
export { DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogClose }
```

**Usage:**
```tsx
// Simple usage (calls DialogSimple)
<Dialog open={open} onClose={onClose} title="Title">Content</Dialog>

// Compound usage (namespace pattern)
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>...</Dialog.Content>
</Dialog.Root>
```

## Types File Pattern

Complex components have a separate `types.ts`:

```tsx
// dialog/types.ts
export interface DialogRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export interface DialogContentProps extends React.ComponentPropsWithRef<'div'> {
  // Omit conflicting Framer Motion props if using motion elements
}
```

## Config Constants

Import motion and text constants from `@/config`:

```tsx
import { SPRING, DURATION, OPACITY, ARIA, LABEL, SR_ONLY } from '@/config'

// Motion presets (use in Framer Motion)
<motion.div transition={SPRING.snappy} />
<motion.div transition={{ duration: DURATION.fast }} />

// ARIA labels and screen reader text
<button aria-label={ARIA.close} />
<span className="sr-only">{SR_ONLY.loading}</span>
```

## How the Token System Works

The styling system uses a **CSS Variable → Tailwind → Component** architecture:

```
styling-config.json          tailwind.config.ts           Component
─────────────────────────────────────────────────────────────────────
"primary": "#00FF41"    →    primary: 'var(--color-primary)'    →    bg-primary
"success": "#00FF41"    →    success: 'var(--color-success)'    →    bg-success
```

**Key insight:** Use SEMANTIC CLASS NAMES (like `bg-primary`, `bg-success`) that are already mapped to CSS variables.

**DO NOT:**
- Put Tailwind classnames directly in component JSX
- Try to interpolate `{tokens.*}` placeholders
- Use hex values from config directly
- Use generic Tailwind colors (`bg-green-500`)

**DO:**
- Create styles.ts for every component
- Import from `../../styles` (patterns and tokens)
- Use semantic Tailwind classes via style constants
- Compose styles using array.join(' ') pattern

## ⚠️ MANDATORY ENFORCEMENT

**Before writing ANY UI code, you MUST:**

1. Check if `styles.ts` exists for the component — create it if not
2. Read `.claude/styling-config.json` for design tokens
3. Check `.claude/component-recipes/` for recipe compliance
4. NEVER put className strings directly in JSX

**NEVER:**
- Inline Tailwind classnames in component files
- Use hardcoded hex colors (`#XXXXXX`)
- Use non-semantic Tailwind colors (`bg-blue-500`)
- Use `focus:` for focus states — use `focus-visible:`
- Omit `cursor-pointer` on interactive elements
- Use desktop-first responsive patterns (`max-sm:`, `max-md:`)

## Token Usage Reference

```
PATTERNS (import from '../../styles')
─────────────────────────────────────────────────────────
Form.Label.base           → Label styling
Form.Input.base           → Input base styles
Form.Input.focus          → Focus state
Layout.Flex.center        → flex items-center justify-center
Layout.Flex.between       → flex items-center justify-between
Interactive.Focus.ring    → Focus visible ring
Interactive.Cursor.pointer→ cursor-pointer
Interactive.Disabled.base → opacity-50 cursor-not-allowed
Overlay.Dialog.backdrop   → Modal backdrop
Overlay.Card.container    → Card wrapper
Control.Toggle.base       → Checkbox/Switch base
Feedback.Badge.primary    → Primary badge variant

TOKENS (primitive values)
─────────────────────────────────────────────────────────
SpacingTokens.p4          → p-4
SpacingTokens.gap2        → gap-2
SizingTokens.h10          → h-10
SizingTokens.wFull        → w-full
TypographyTokens.textSm   → text-sm
```

## Interactive Element Rules

All interactive elements MUST have (via style constants):

1. **`cursor-pointer`** — via `Interactive.Cursor.pointer`
2. **`focus-visible:` states** — via `Interactive.Focus.ring`
3. **Minimum 44x44px touch target** — via size constants

## Mobile-First Design (REQUIRED)

All components MUST be built mobile-first:

1. **Default styles target mobile** — Base classes without breakpoint prefixes
2. **Progressive enhancement** — Add `sm:`, `md:`, `lg:` for larger screens
3. **Touch-friendly targets** — Minimum 44x44px

```typescript
// In styles.ts
export const CardStyles = {
  layout: 'flex flex-col gap-2 sm:flex-row sm:gap-4',
  padding: 'p-4 md:p-6 lg:p-8',
}
```

## Auditing Checklist

When reviewing components, verify:

### 🚨 Critical (MUST FIX)
- [ ] No inline Tailwind classnames in JSX
- [ ] styles.ts exists for component
- [ ] Imports from `../../styles`
- [ ] No hardcoded hex colors
- [ ] No non-semantic colors (`bg-blue-500`)
- [ ] Uses `focus-visible:` not `focus:`
- [ ] Has `cursor-pointer` on interactive elements

### ⚠️ Warnings
- [ ] Uses namespace pattern correctly
- [ ] Styles are composed with `.join(' ')`
- [ ] Mobile-first responsive patterns
- [ ] Touch targets ≥ 44px

## Fallback Behavior

If no styling config exists:
- Use sensible defaults from patterns
- Warn about inconsistency risk
- Suggest: "Run `/setup-styling` to define your project's design tokens"
