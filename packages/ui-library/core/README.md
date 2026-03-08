# @bytesyze-ui/core

Core UI component library for Bytesyze applications.

## Theme System

Two-tier architecture for theming:

| Tier | File | Content | When Loaded |
|------|------|---------|-------------|
| **Base** | `src/themes/base.css` | Spacing, shadows, radius, z-index | Bundled (static) |
| **Brand** | `public/themes/*.json` | Colors, fonts | Runtime (dynamic) |

### Token Categories

**Base Tokens** (edit `base.css`):
- Spacing: `--spacing-1` through `--spacing-16`
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
- Z-Index: `--z-dropdown`, `--z-modal`, `--z-tooltip`, etc.
- Motion: `--motion-duration-fast`, `--motion-duration-normal`, etc.
- Shadows: `--shadow-raised`, `--shadow-pressed`, `--shadow-flat`, etc.

**Brand Tokens** (edit `schema.ts` + brand JSON):
- Colors: `--color-primary`, `--color-secondary`, `--color-background`, etc.
- Fonts: `--font-heading`, `--font-body`, `--font-code`

## Usage

### Importing Components

```tsx
// Granular imports (recommended - tree-shakeable)
import { Card } from '@bytesyze-ui/core/card'
import { Button } from '@bytesyze-ui/core/button'
import { Text } from '@bytesyze-ui/core/text'

// Config and utilities
import { ARIA, SPRING } from '@bytesyze-ui/core/config'
import { cn } from '@bytesyze-ui/core/utils'
```

### Tailwind Preset

```ts
// tailwind.config.ts
import bytesyzePreset from '@bytesyze-ui/core/tailwind.preset'

export default {
  presets: [bytesyzePreset],
  content: ['./src/**/*.{ts,tsx}'],
}
```

### Theme Provider

```tsx
import { ThemeProvider } from '@bytesyze-ui/core/providers'
import '@bytesyze-ui/core/themes/base.css'

function App() {
  return (
    <ThemeProvider brandThemeUrl="/themes/bytesyze.json">
      {children}
    </ThemeProvider>
  )
}
```
