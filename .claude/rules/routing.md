# Routing Rules

## Route Configuration

**Routes MUST come from centralized config — never hardcode route strings.**

| App | Config Location | Import |
|-----|-----------------|--------|
| Web | `apps/web/src/lib/routes.ts` | `import { Routes } from '@/lib/routes'` |

```tsx
// ❌ NEVER — hardcoded route strings
<Link href="/settings">Settings</Link>
<a href="/">Home</a>

// ✅ ALWAYS — import from routes config
import { Routes } from '@/lib/routes'
<Link href={Routes.settings}>Settings</Link>
<Link href={Routes.home}>Home</Link>
```

## Navigation

**Use `<Link>` for all internal navigation:**

```tsx
import Link from 'next/link'
import { Routes } from '@/lib/routes'

<Link href={Routes.home}>Home</Link>
<Link href={Routes.settings}>Settings</Link>
```

## Adding New Routes

1. Add to `apps/web/src/lib/routes.ts`
2. Use `Routes.newRoute` in components
3. Never hardcode route strings
