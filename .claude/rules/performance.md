# Performance Rules

## React Re-render Prevention

**Memoize expensive computations and callbacks.**

```tsx
// ❌ NEVER - recreate on every render
function LogsTable({ logs, onFilter }) {
  const sortedLogs = logs.sort((a, b) => b.timestamp - a.timestamp)
  const handleClick = () => onFilter('error')

  return <Table data={sortedLogs} onClick={handleClick} />
}

// ✅ ALWAYS - memoize derived data and callbacks
function LogsTable({ logs, onFilter }) {
  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => b.timestamp - a.timestamp),
    [logs]
  )

  const handleClick = useCallback(
    () => onFilter('error'),
    [onFilter]
  )

  return <Table data={sortedLogs} onClick={handleClick} />
}
```

## When to Use memo()

```tsx
// ✅ USE memo for:
// - Components receiving object/array props
// - Components with expensive render logic
// - List item components
const LogRow = memo(function LogRow({ log }: { log: Log }) {
  return <tr>...</tr>
})

// ❌ DON'T memo:
// - Components that always re-render anyway
// - Components with primitive props only
// - Leaf components with simple renders
```

## List Virtualization

**Virtualize lists with 100+ items.**

```tsx
// ❌ NEVER - render all items
function LogsList({ logs }: { logs: Log[] }) {
  return (
    <ul>
      {logs.map(log => <LogItem key={log.id} log={log} />)}
    </ul>
  )
}

// ✅ ALWAYS - virtualize large lists
import { useVirtualizer } from '@tanstack/react-virtual'

function LogsList({ logs }: { logs: Log[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <ul style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(item => (
          <LogItem key={logs[item.index].id} log={logs[item.index]} />
        ))}
      </ul>
    </div>
  )
}
```

## Image Optimization

```tsx
// ❌ NEVER - unoptimized images
<img src="/hero.png" />

// ✅ ALWAYS - use next/image
import Image from 'next/image'

<Image
  src="/hero.png"
  alt="Hero"
  width={800}
  height={400}
  priority  // For above-the-fold images
/>

// ✅ CORRECT - lazy load below-fold images
<Image
  src="/feature.png"
  alt="Feature"
  width={400}
  height={300}
  loading="lazy"
/>
```

## Bundle Splitting

```tsx
// ✅ CORRECT - dynamic import for heavy components
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('@/components/Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // If client-only
})

// ✅ CORRECT - lazy load routes
const AdminPanel = lazy(() => import('./AdminPanel'))
```

## Debounce User Input

```tsx
// ❌ NEVER - API call on every keystroke
function Search() {
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch(`/api/search?q=${query}`)
  }, [query])
}

// ✅ ALWAYS - debounce search
import { useDebouncedValue } from '@/hooks'

function Search() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)

  useEffect(() => {
    if (debouncedQuery) {
      fetch(`/api/search?q=${debouncedQuery}`)
    }
  }, [debouncedQuery])
}
```

## Avoid Layout Thrashing

```tsx
// ❌ NEVER - read then write in loop
items.forEach(item => {
  const height = item.offsetHeight  // Read (forces layout)
  item.style.height = height + 10   // Write (invalidates layout)
})

// ✅ ALWAYS - batch reads, then writes
const heights = items.map(item => item.offsetHeight)  // All reads
items.forEach((item, i) => {
  item.style.height = heights[i] + 10  // All writes
})
```

## CSS Performance

```css
/* ❌ NEVER - expensive selectors */
.sidebar * { }
div[class*="log-"] { }
:nth-child(odd) { }

/* ✅ ALWAYS - direct class selectors */
.log-item { }
.log-item-odd { }

/* ❌ NEVER - animate layout properties */
.animated {
  transition: width 0.3s, height 0.3s, top 0.3s;
}

/* ✅ ALWAYS - animate transform/opacity */
.animated {
  transition: transform 0.3s, opacity 0.3s;
  will-change: transform;
}
```

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.8s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.8s |
| Total Blocking Time | < 200ms |
| Cumulative Layout Shift | < 0.1 |

## Profiling

```bash
# React DevTools Profiler
# 1. Record interaction
# 2. Look for yellow/red components
# 3. Check "Why did this render?"

# Lighthouse
npx lighthouse http://localhost:3000 --view

# Bundle analysis
ANALYZE=true pnpm build
```

---

## Lighthouse & Core Web Vitals Optimization

### SSR vs Client-Side Rendering

```tsx
// ❌ NEVER - disable SSR for page content (blocks LCP)
export const PageContent = dynamic(() => import('./PageContent'), {
  ssr: false,  // Server sends empty shell, JS must load before content renders
  loading: () => <Skeleton />,
})

// ✅ ALWAYS - enable SSR with Suspense streaming
import { Suspense } from 'react'

export default async function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <PageContent />
    </Suspense>
  )
}

// ✅ OK - ssr: false ONLY for truly client-only components (maps, canvas)
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,  // Map libraries require DOM - acceptable
  loading: () => <MapSkeleton />,
})
```

**When to use `ssr: false`:**
- Map libraries (Mapbox, Leaflet)
- Canvas-based components
- Components using `window`/`document` in render

**Never use `ssr: false` for:**
- Page content containers
- Text content
- Forms and inputs
- Navigation

### Non-Blocking Theme Provider

```tsx
// ❌ NEVER - block render waiting for theme/fonts
export function ThemeProvider({ children }) {
  const [themeReady, setThemeReady] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    // Network fetch blocks children render
    fetch('/theme.json').then(() => setThemeReady(true))
    document.fonts.ready.then(() => setFontsLoaded(true))
  }, [])

  if (!themeReady || !fontsLoaded) return <Loading />
  return children  // Content blocked until everything loads
}

// ✅ ALWAYS - render immediately, enhance progressively
export function ThemeProvider({ children }) {
  // Initialize synchronously to match inline script
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('theme') ?? 'light'
  })

  // Non-blocking: load brand theme in background
  useEffect(() => {
    fetch('/theme.json').then(/* apply in background */)
  }, [])

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
}
```

### Inline Theme Script (Prevent FOUC)

```tsx
// layout.tsx - Set theme class BEFORE React hydrates
export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Runs immediately, before React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Image Optimization for LCP

```tsx
// ❌ NEVER - oversized images with unoptimized flag
<Image
  src="/logo.png"      // 820x480px source
  width={24}           // Display at 24x24
  height={24}
  unoptimized          // Bypasses all optimization
/>

// ✅ BEST - inline SVG for icons/logos (zero network request)
function Logo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="..." fill="currentColor" />
    </svg>
  )
}

// ✅ GOOD - properly sized images with Next.js optimization
<Image
  src="/logo.png"      // Sized to 48x48 (2x for retina)
  width={24}
  height={24}
  priority             // Above-fold: load immediately
  alt="Logo"
/>
```

### Lazy Loading Heavy Libraries

```tsx
// ❌ NEVER - import heavy libraries directly in page content
import { HeavyComponent } from 'some-heavy-library'  // Large bundle impact

// ✅ ALWAYS - create lazy wrapper with skeleton
// ComponentLazy.tsx
export const Component = dynamic(
  () => import('./Component').then(mod => mod.Component),
  {
    ssr: false,  // Only if component requires DOM
    loading: () => <ComponentSkeleton />,
  }
)

// index.ts - export lazy version as default
export { ComponentLazy as Component } from './ComponentLazy'
export { Component as ComponentEager } from './Component'
```

### Suspense Streaming Pattern

```tsx
// ✅ CORRECT - stream heavy components separately
export default async function Page() {
  // Critical data: fetch before render
  const user = await getUser()

  return (
    <div>
      <Header user={user} />

      {/* Non-critical: stream in parallel */}
      <Suspense fallback={<ChartSkeleton />}>
        <AsyncChart />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <AsyncTable />
      </Suspense>
    </div>
  )
}
```

### Lighthouse Fix Checklist

When Lighthouse score is low, check these in order:

| Issue | Symptom | Fix |
|-------|---------|-----|
| LCP > 2.5s | Content appears late | Remove `ssr: false` from page content |
| LCP > 2.5s | Flash of unstyled content | Add inline theme script |
| LCP > 2.5s | Blocking providers | Make ThemeProvider non-blocking |
| TBT > 200ms | Page feels slow | Lazy load charts, tables, heavy libs |
| TBT > 200ms | Long JS execution | Move client components to leaves |
| Large bundle | High First Load JS | Use granular imports from @bytesyze-ui/core |
| Large images | Slow image load | Convert to SVG or properly size |
| CLS > 0.1 | Layout shift | Match skeleton dimensions to content |

### Common Lighthouse Issues & Fixes

| Problem | Before | After |
|---------|--------|-------|
| Page content SSR disabled | `ssr: false` on wrapper | Remove, use Suspense |
| Theme provider blocking | Wait for fonts/theme | Render immediately |
| Oversized logo | 80KB PNG at 24px | Inline SVG (~1KB) |
| Heavy library import | Large bundle in main JS | Lazy load with skeleton |
| Non-lazy table | Blocks initial render | Use existing *Lazy.tsx |
