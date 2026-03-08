# Bundle Optimization

## Granular Imports

**ALWAYS use granular imports from @bytesyze-ui/core:**

```tsx
// ❌ NEVER import from barrel (pulls ALL 24+ components into bundle)
import { Card, Badge, Spinner } from '@bytesyze-ui/core'

// ✅ ALWAYS use granular paths (tree-shakeable)
import { Card, CardHeader } from '@bytesyze-ui/core/card'
import { Badge } from '@bytesyze-ui/core/badge'
import { Spinner } from '@bytesyze-ui/core/spinner'
import { ARIA } from '@bytesyze-ui/core/config'
```

## Available Granular Exports

| Export | Server-safe | Notes |
|--------|-------------|-------|
| `@bytesyze-ui/core/card` | ✅ Yes | Static display component |
| `@bytesyze-ui/core/text` | ✅ Yes | **Use instead of raw `<p>`, `<h1>`-`<h6>`, `<span>`** |
| `@bytesyze-ui/core/badge` | ✅ Yes | Static display component |
| `@bytesyze-ui/core/spinner` | ✅ Yes | CSS animation only |
| `@bytesyze-ui/core/button` | ❌ No | Has loading state with motion |
| `@bytesyze-ui/core/config` | ✅ Yes | ARIA, LABEL constants |
| `@bytesyze-ui/core/styles` | ✅ Yes | Style patterns |
| `@bytesyze-ui/core/providers` | ❌ No | ThemeProvider uses hooks |
| `@bytesyze-ui/core/hooks` | ❌ No | All hooks are client |

## Text Component Rule

Never use raw `<p>`, `<span>`, `<h1>`-`<h6>` tags. Always use `<Text>` component.

See `.claude/skills/styling.md` for variants and usage.

## Server vs Client

- `@bytesyze-ui/core` barrel has `'use client'` - never import from it in server components
- Check individual component files for `'use client'` directive

**Interactive components are client-only:**
- Select, Slider, Dialog, Drawer, Accordion, Menu, Tabs, Toast, Tooltip

## Performance Targets

- Lighthouse Performance: 90+
- Total Blocking Time: <200ms
- Unused JavaScript: <500KB
