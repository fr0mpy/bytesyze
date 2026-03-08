# Component Architecture

## Directory Structure

Components use a co-located pattern:

```
components/
└── component-name/
    ├── component-name.tsx   # Component logic
    ├── index.ts             # Barrel exports
    ├── types.ts             # TypeScript interfaces
    └── styles.ts            # Tailwind class objects
```

## Compound Component Pattern

Use namespace exports for multi-part components:

```tsx
// ✅ Correct - namespace pattern
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>...</Dialog.Content>
</Dialog.Root>

// Also support simple usage via Object.assign
<Dialog open={open} onClose={onClose} title="Title">
  Content
</Dialog>
```

**Implementation:**
```tsx
export const Dialog = Object.assign(DialogSimple, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
})

export { DialogRoot, DialogTrigger, DialogContent }
```

## Zero-Inline-Classnames Rule

**Components MUST NOT contain Tailwind className strings inline.**

```tsx
// ❌ NEVER — Inline classnames in components
<button className="flex items-center justify-center px-4 py-2 bg-primary">

// ✅ ALWAYS — Import from styles.ts
import { ButtonStyles } from './styles'
<button className={ButtonStyles.base}>
```

## Style Architecture

```
ui-library/core/src/styles/
├── index.ts              # Main barrel export
├── tokens/               # Primitive tokens (Spacing, Sizing, Typography)
│   ├── sizing.ts         # ComponentHeight, TextHeight, TouchTarget
│   ├── spacing.ts        # SpacingTokens, ResponsiveSpacing
│   └── typography.ts     # TypographyTokens, ResponsiveTypography
└── responsive.ts         # Breakpoint types
```

**Tokens provide WCAG-compliant sizing values:**
- `ComponentHeight.input` = `'h-11'` (44px touch target)
- `TextHeight.sm` = `'leading-5'` (matches text-sm)

## Co-located Styles (Raw Tailwind)

Write Tailwind classes directly in styles.ts for IntelliSense support:

```tsx
// styles.ts — REQUIRED for every component
// Write raw Tailwind classes (no imports from patterns)
export const DialogStyles = {
  overlay: [
    'fixed inset-0 z-modal',
    'bg-foreground/80 backdrop-blur-sm',
    'transition-all duration-200',
  ].join(' '),
  content: [
    'relative z-modal w-full max-w-lg',
    'rounded-theme-xl p-6',
    'bg-neu-base shadow-neu-raised-lg',
  ].join(' '),
  title: 'font-heading text-lg font-semibold text-foreground',
} as const

// component.tsx
import { DialogStyles as S } from './styles'
<div className={cn(S.overlay, className)} />
```

**Why raw Tailwind?**
- Tailwind IntelliSense works (autocomplete, hover preview, linting)
- No runtime indirection
- Easier to understand and debug

## Sizing Tokens (WCAG Compliance)

Import from `@bytesyze-ui/core/styles` for WCAG 2.5.8 compliant sizing:

```tsx
import { ComponentHeight, TextHeight } from '@bytesyze-ui/core/styles'

// Use in skeleton files for pixel-perfect loading states
export const SkeletonHeight = {
  input: ComponentHeight.input,      // h-11 (44px)
  buttonSm: ComponentHeight.buttonSm, // h-8 (32px)
  textSm: TextHeight.sm,             // leading-5 (20px)
}
```

## Ref Handling (React 19 Ready)

```tsx
// ✅ React 19 style - ref as prop
function Button({ ref, className, ...props }: ButtonProps) {
  return <button ref={ref} className={className} {...props} />
}

interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary'
}
```

**Note:** Project currently uses React 18.2.0. When React 19 is adopted, forwardRef can be removed.

## Framer Motion Type Conflicts

```tsx
// ✅ Correct - destructure conflicting props
function AnimatedDiv({
  onDrag,           // React HTML prop
  onDragStart,      // React HTML prop
  onDragEnd,        // React HTML prop
  onAnimationStart, // React HTML prop
  onAnimationEnd,   // React HTML prop
  ...props
}: Props) {
  return (
    <motion.div
      {...props}
    />
  )
}
```

## Shared Hooks

From `@/hooks`:

| Hook | Purpose |
|------|---------|
| `useControlledState` | Controlled/uncontrolled component state |
| `useBodyScrollLock` | Lock body scroll for modals/drawers |
| `useEscapeKey` | Dismiss on Escape key |
| `useClickOutside` | Close on outside click |
| `usePositioning` | Floating element positioning |

## Centralized Config

From `@/config`:

```tsx
import { SPRING, DURATION, OPACITY, ARIA, LABEL, SR_ONLY } from '@/config'

// Motion
<motion.div transition={SPRING.snappy} />
<motion.div animate={{ opacity: OPACITY.visible }} />

// Text/ARIA
<button aria-label={ARIA.close}>
<span className="sr-only">{SR_ONLY.loading}</span>
```
