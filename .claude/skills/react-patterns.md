---
description: USE WHEN creating, modifying, or reviewing React components, hooks, state management, or effect patterns. Enforces Rules of Hooks and correct state/effect usage.
---

# React Patterns

Apply when creating, modifying, or reviewing React components.

## Rules of Hooks (CRITICAL)

Hooks must be called in the **same order** every render. Violating this crashes the app.

### Never Do

```tsx
// ❌ Hook in callback/render prop
const demos = [{
  render: () => {
    const [state, setState] = useState()  // CRASHES
    return <Component />
  }
}]

// ❌ Hook after conditional return
if (loading) return <Spinner />
const [data, setData] = useState()  // CRASHES

// ❌ Hook in condition
if (userId) {
  const [user, setUser] = useState()  // CRASHES
}

// ❌ Hook in loop
items.map(item => {
  const [selected, setSelected] = useState()  // CRASHES
})
```

### Always Do

```tsx
// ✅ Extract to separate component
const CheckboxDemo = () => {
  const [checked, setChecked] = useState(false)
  return <Checkbox checked={checked} onChange={setChecked} />
}

// ✅ Hooks before any returns
const [data, setData] = useState()
const [loading, setLoading] = useState(true)
if (loading) return <Spinner />

// ✅ Condition inside hook, not hook inside condition
useEffect(() => {
  if (userId) fetchUser(userId)
}, [userId])
```

## State Updates

```tsx
// ❌ Stale state - only increments once
setCount(count + 1)
setCount(count + 1)

// ✅ Functional update - increments twice
setCount(prev => prev + 1)
setCount(prev => prev + 1)
```

## Dependencies

```tsx
// ❌ Missing dependency - stale closure
useEffect(() => {
  doSomething(value)
}, [])

// ✅ All dependencies listed
useEffect(() => {
  doSomething(value)
}, [value])
```

## Component Galleries

When building component showcases:

| Pattern | Wrong | Right |
|---------|-------|-------|
| Stateful demo | Hook in render prop | Separate `*Demo` component |
| Context consumer | Render alone | Wrap in provider |
| Controlled input | Internal state | Props from wrapper |

```tsx
// ❌ Wrong - hook in render function
const components = [{
  name: "Checkbox",
  render: () => {
    const [checked, setChecked] = useState(false)
    return <Checkbox checked={checked} />
  }
}]

// ✅ Right - separate component
const CheckboxDemo = () => {
  const [checked, setChecked] = useState(false)
  return <Checkbox checked={checked} onChange={setChecked} />
}

const components = [{
  name: "Checkbox",
  render: () => <CheckboxDemo />
}]
```

## Cleanup

```tsx
// ❌ Memory leak
useEffect(() => {
  const id = setInterval(tick, 1000)
}, [])

// ✅ Cleanup on unmount
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}, [])
```

## Ref Handling (React 19 Ready)

React 19 allows ref as a regular prop. Prefer this pattern for forward compatibility:

```tsx
// ✅ React 19 style - ref as prop (PREFERRED)
function Button({ ref, className, ...props }: ButtonProps) {
  return <button ref={ref} className={className} {...props} />
}

interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary'
}

// ⚠️ React 18 style - still works but being phased out
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={className} {...props} />
  }
)
```

**Note:** Project uses React 18.2.0. Both patterns work, but prefer ref-as-prop for new code.

## Framer Motion Type Conflicts

Framer Motion's props conflict with React's HTML event handlers. Destructure these props before spreading:

```tsx
// ❌ WRONG - Type conflict between React and Framer Motion
function Overlay(props: React.ComponentPropsWithRef<'div'>) {
  return <motion.div {...props} />  // Type error!
}

// ✅ CORRECT - Destructure conflicting props
function Overlay({
  onDrag,           // React's drag event (conflicts with Framer)
  onDragStart,      // React's drag event (conflicts with Framer)
  onDragEnd,        // React's drag event (conflicts with Framer)
  onAnimationStart, // React's animation event (conflicts with Framer)
  onAnimationEnd,   // React's animation event (conflicts with Framer)
  ...props
}: React.ComponentPropsWithRef<'div'>) {
  return <motion.div {...props} />  // Works!
}
```

### Conflicting Props Reference

| React HTML Prop | Framer Motion Prop | Resolution |
|-----------------|-------------------|------------|
| `onDrag` | `onDrag` | Destructure out |
| `onDragStart` | `onDragStart` | Destructure out |
| `onDragEnd` | `onDragEnd` | Destructure out |
| `onAnimationStart` | `onAnimationStart` | Destructure out |
| `onAnimationEnd` | `onAnimationEnd` | Destructure out |

## Shared Hooks

Use project hooks from `@/hooks` instead of reimplementing:

### useControlledState
For components that support both controlled and uncontrolled modes:

```tsx
const [value, setValue] = useControlledState({
  value: props.value,
  defaultValue: props.defaultValue,
  onChange: props.onChange,
})
```

### useBodyScrollLock
Lock body scroll when modals/drawers are open:

```tsx
useBodyScrollLock(isOpen)
```

### useEscapeKey
Handle Escape key for dismissible elements:

```tsx
useEscapeKey(() => setOpen(false), { enabled: isOpen })
```

### useClickOutside
Close on click outside:

```tsx
const ref = useRef(null)
useClickOutside(ref, () => setOpen(false))
```

### usePositioning
Position floating elements:

```tsx
const { x, y, placement } = usePositioning({
  anchor: anchorRef,
  placement: 'bottom-start',
})
```

## Config Constants

Import motion and text constants from `@/config`:

```tsx
import { SPRING, DURATION, OPACITY, ARIA, LABEL, SR_ONLY } from '@/config'

// Motion values
<motion.div transition={SPRING.snappy} />
<motion.div transition={{ duration: DURATION.fast }} />
<motion.div animate={{ opacity: OPACITY.visible }} />

// Accessibility text
<button aria-label={ARIA.close} />
<span className="sr-only">{SR_ONLY.loading}</span>
<span>{LABEL.next}</span>
```

## Checklist

Before delivering React code:

- [ ] No hooks in callbacks, loops, conditions, or render props
- [ ] No hooks after conditional returns
- [ ] All `useEffect`/`useCallback`/`useMemo` deps included
- [ ] Functional state updates when depending on previous state
- [ ] Context consumers wrapped in their providers
- [ ] Effects return cleanup functions where needed
- [ ] Ref as prop (React 19 style) for new components
- [ ] Framer Motion conflicts destructured before spreading
- [ ] Using shared hooks from `@/hooks`
- [ ] Motion/text constants from `@/config`
