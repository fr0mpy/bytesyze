# Theme Architecture

## Two-Tier Theming

| Tier | Contains | Loaded |
|------|----------|--------|
| **Base Theme** | Spacing, shadows, motion, radii, z-index | Bundled with app |
| **Brand Theme** | Colors, typography | Fetched per MFE |

## CSS Variable Naming Convention

**All theme tokens use category prefixes:**

| Category | Prefix | Examples |
|----------|--------|----------|
| Colors | `--color-*` | `--color-primary`, `--color-neu-base` |
| Shadows | `--shadow-*` | `--shadow-raised`, `--shadow-pressed` |
| Radius | `--radius-*` | `--radius-sm`, `--radius-md` |
| Spacing | `--spacing-*` | `--spacing-1`, `--spacing-4` |
| Typography | `--font-*` | `--font-heading`, `--font-body` |
| Motion | `--motion-*` | `--motion-duration-fast` |
| Z-Index | `--z-*` | `--z-modal`, `--z-tooltip` |

```css
/* ❌ NEVER — unprefixed or inconsistent */
--neu-base: #f0f0f0;
--duration-fast: 150ms;

/* ✅ ALWAYS — category-prefixed */
--color-neu-base: #f0f0f0;
--motion-duration-fast: 150ms;
```

## Theme Files

```
packages/ui-library/core/src/themes/
├── base.json           # Structural tokens (bundled)
├── schema.ts           # Token definitions + fallbacks
├── apply-theme.ts      # JSON → CSS vars
├── validate-theme.ts   # Warns on missing tokens
└── index.ts            # Barrel export

apps/shell/public/themes/
└── bytesyze-green.json # Brand theme (fetched)
```

## Tailwind Preset

Apps extend the shared preset:

```ts
// tailwind.config.ts
import bytesyzePreset from '@bytesyze-ui/core/tailwind.preset'

export default {
  presets: [bytesyzePreset],
  content: ['./src/**/*.{ts,tsx}'],
}
```

## Adding New Tokens

1. Add to `schema.ts` with fallback value
2. Add to `base.json` or brand theme JSON
3. Add to `tailwind.preset.ts` if Tailwind utility needed
4. Use in components via Tailwind classes or CSS vars
