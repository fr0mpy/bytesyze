# Theming System

Two-tier architecture for consistent styling across all apps.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Base Styles (styles/base.css)                              │
│  Structural tokens: spacing, shadows, motion, z-index       │
│  Shared across all themes                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Theme (bytesyze.css, etc.)                           │
│  Visual tokens: colors, typography                          │
│  Generated from TypeScript → CSS                            │
└─────────────────────────────────────────────────────────────┘
```

## Files

```
styles/
└── base.css               # Structural tokens (spacing, shadows, radii)

theming/
├── themes/
│   ├── index.ts           # Re-exports from input/
│   ├── input/
│   │   ├── index.ts       # Theme registry + BRAND_NAMES + BrandName type
│   │   └── bytesyze.ts  # Theme definition (source of truth)
│   └── output/
│       └── bytesyze.css # Generated CSS
├── index.ts               # Public exports
└── README.md              # This file

utils/
├── theme.types.ts         # BrandTheme interface + color token keys
└── brand-css.generator.ts # Generates CSS from TypeScript definitions
```

## Usage in Apps

```tsx
// layout.tsx
import '@bytesyze-ui/core/styles/base.css'
import '@bytesyze-ui/core/theming/themes/bytesyze.css'
import { ThemeInitScript } from '@bytesyze-ui/core/providers/server'

<head>
  <ThemeInitScript />
</head>
```

## Creating a New Theme

### 1. Create TypeScript definition

```typescript
// theming/themes/input/acme-corp.ts
import type { BrandTheme } from '../../../utils/theme.types'

export const acmeCorp: BrandTheme = {
  light: {
    primary: '#0066CC',
    primaryForeground: '#ffffff',
    // ... all required tokens (TypeScript enforces completeness)
  },
  dark: {
    primary: '#3399FF',
    // ...
  },
  typography: {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
    code: 'Fira Code, monospace',
  },
}
```

### 2. Register the theme

```typescript
// theming/themes/input/index.ts
export { bytesyzeGreen } from './bytesyze'
export { acmeCorp } from './acme-corp'  // Add export

export const BRAND_NAMES = ['bytesyze', 'acme-corp'] as const  // Add to array
export type BrandName = (typeof BRAND_NAMES)[number]
```

### 3. Generate CSS

```bash
# From repo root
pnpm --filter @bytesyze-ui/core build:brand-css

# Or use VSCode task: "build:brand-css"
```

This generates `theming/themes/output/acme-corp.css` from `theming/themes/input/acme-corp.ts`.

### 4. Add package.json export

```json
// packages/ui-library/core/package.json
"./theming/themes/acme-corp.css": "./src/theming/themes/output/acme-corp.css"
```

### 5. Import in app layout

```tsx
// apps/mfe/acme-dashboard/src/app/layout.tsx
import '@bytesyze-ui/core/styles/base.css'
import '@bytesyze-ui/core/theming/themes/acme-corp.css'
```

### 6. Configure MFE environment (optional)

For type-safe theme configuration in MFEs:

```typescript
// .env.example
BRAND_THEME=acme-corp

// next.config.ts
const BRAND_THEME = process.env.BRAND_THEME || 'bytesyze'
env: {
  NEXT_PUBLIC_BRAND_THEME: BRAND_THEME,
},

// src/env.ts
import type { BrandName } from '@bytesyze-ui/core/theming/themes'
export const BRAND_THEME: BrandName =
  (process.env.NEXT_PUBLIC_BRAND_THEME as BrandName) || 'bytesyze'
```

TypeScript will error if `BRAND_THEME` contains an invalid theme name.

## Why TypeScript → CSS?

| Benefit | Description |
|---------|-------------|
| **Type safety** | Missing tokens cause compile errors, not runtime bugs |
| **Autocomplete** | IDE shows all required tokens when creating themes |
| **Single source of truth** | Theme lives in `.ts`, CSS is derived |
| **Validation** | Schema ensures light/dark parity |
| **Separation** | Input (.ts) and output (.css) in separate folders |

## CSS Variable Naming

All color tokens use the `--color-` prefix:

| TypeScript | CSS Variable |
|------------|--------------|
| `primary` | `--color-primary` |
| `primaryForeground` | `--color-primary-foreground` |
| `neuBase` | `--color-neu-base` |

Typography uses `--font-` prefix:
- `--font-heading`
- `--font-body`
- `--font-code`

## Dark Mode

- `:root` contains light mode tokens (default)
- `.dark` class overrides with dark mode tokens
- `ThemeInitScript` sets `.dark` class from cookie before hydration

```css
:root {
  --color-background: #f4f4f4;  /* Light */
}

.dark {
  --color-background: #212121;  /* Dark */
}
```

## Tailwind Integration

CSS variables are mapped to Tailwind utilities via `tailwind.preset.ts`:

```tsx
// Use Tailwind classes
<div className="bg-primary text-primary-foreground" />

// Which reference CSS variables
// bg-primary → background-color: var(--color-primary)
```
