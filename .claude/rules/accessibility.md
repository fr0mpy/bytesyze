# Accessibility Rules

## Form Controls MUST Have Labels

```tsx
// ❌ NEVER - bare form elements without labels
<input type="search" placeholder="Search..." />
<select><option>All</option></select>

// ✅ ALWAYS - use translated ARIA labels from i18n
import { getTranslations, aria } from '@bytesyze/i18n'
const t = await getTranslations()
<input aria-label={t(aria.search)} placeholder="Search..." />
<select aria-label={t(aria.filterByType)}><option>All</option></select>
```

## Available ARIA Keys

From `@bytesyze/i18n`:

```ts
aria.search            // Search
aria.filterByType      // Filter by type
aria.filterByLevel     // Filter by level
aria.filterByTimeRange // Filter by time range
aria.filterInput       // Filter
aria.selectLanguage    // Select language
aria.close             // Close
aria.loading           // Loading
// See packages/i18n/src/keys.ts for full list
```

## Heading Hierarchy MUST Be Sequential

```tsx
// ❌ NEVER - skip heading levels
<Text variant="h1">Page Title</Text>
<Text variant="h3">Section</Text>  // Skipped h2!

// ✅ ALWAYS - sequential levels
<Text variant="h1">Page Title</Text>
<Text variant="h2">Section</Text>
<Text variant="h3">Subsection</Text>
```

## CSS Animations MUST Use Composited Properties

```css
/* ❌ NEVER - triggers layout, causes jank */
animation: slide { width, height, top, left, margin, padding }

/* ✅ ALWAYS - GPU accelerated */
animation: slide { transform, opacity }
```
