# Data Fetching

## Server vs Client Fetching

**Prefer Server Components for data fetching. Use client fetching only for real-time/interactive data.**

| Use Case | Method | Location |
|----------|--------|----------|
| Initial page data | `fetch()` in RSC | Server Component |
| Static/cached data | `fetch()` with cache | Server Component |
| Real-time updates | SWR/React Query | Client Component |
| User interactions | Server Actions | Client Component |
| Mutations | Server Actions | Client Component |

## Server Component Fetching

```tsx
// ✅ CORRECT - fetch in Server Component
async function LogsPage() {
  const logs = await fetchLogs()
  return <LogsTable data={logs} />
}

// ❌ NEVER - useEffect for initial data
'use client'
function LogsPage() {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    fetchLogs().then(setLogs)
  }, [])
  return <LogsTable data={logs} />
}
```

## Caching Strategies

```tsx
// No cache - always fresh (default in App Router)
const data = await fetch('/api/data')

// Cache indefinitely - static data
const data = await fetch('/api/data', { cache: 'force-cache' })

// Revalidate periodically
const data = await fetch('/api/data', { next: { revalidate: 60 } })

// Revalidate on demand via tags
const data = await fetch('/api/data', { next: { tags: ['logs'] } })

// Then in Server Action:
import { revalidateTag } from 'next/cache'
revalidateTag('logs')
```

## Parallel vs Sequential

```tsx
// ❌ SLOW - sequential fetching (waterfall)
const user = await fetchUser(id)
const posts = await fetchPosts(id)
const comments = await fetchComments(id)

// ✅ FAST - parallel fetching
const [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id),
])
```

## Streaming with Suspense

```tsx
// ✅ CORRECT - stream non-critical data
async function Dashboard() {
  // Critical: block render
  const user = await fetchUser()

  return (
    <div>
      <UserHeader user={user} />

      {/* Non-critical: stream in */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>

      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  )
}
```

## Server Actions for Mutations

```tsx
// ✅ CORRECT - Server Action for mutations
'use server'

export async function updateLog(id: string, data: LogData) {
  await db.log.update({ where: { id }, data })
  revalidatePath('/logs')
}

// Usage in Client Component
'use client'
import { updateLog } from './actions'

function LogEditor({ log }: { log: Log }) {
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      await updateLog(log.id, formData)
    })
  }

  return <button onClick={handleSave} disabled={isPending}>Save</button>
}
```

## SWR for Real-Time Data

```tsx
// ✅ CORRECT - SWR for polling/real-time
'use client'

function LiveLogs() {
  const { data, error, isLoading } = useSWR(
    '/api/logs/live',
    fetcher,
    { refreshInterval: 5000 } // Poll every 5s
  )

  if (error) return <ErrorState />
  if (isLoading) return <Skeleton />
  return <LogsTable data={data} />
}
```

## Error Handling in Fetches

```tsx
// ✅ CORRECT - check response status
async function fetchLogs() {
  const res = await fetch('/api/logs')

  if (!res.ok) {
    throw new Error(`Failed to fetch logs: ${res.status}`)
  }

  return res.json()
}
```

## API Route Handlers

```tsx
// app/api/logs/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const level = searchParams.get('level')

  const logs = await db.log.findMany({
    where: level ? { level } : undefined,
  })

  return NextResponse.json(logs)
}
```
