# Error Handling

## Error Boundaries

**Every route segment SHOULD have an error boundary.**

```
app/
├── error.tsx           # Root error boundary
├── logs/
│   ├── error.tsx       # Logs error boundary
│   └── [id]/
│       └── error.tsx   # Log detail error boundary
```

```tsx
// ✅ CORRECT - error.tsx pattern
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Component Error States

**Components that fetch data MUST handle error states.**

```tsx
// ❌ NEVER - no error handling
function UserList() {
  const { data } = useSWR('/api/users')
  return <ul>{data.map(...)}</ul>
}

// ✅ ALWAYS - explicit error state
function UserList() {
  const { data, error, isLoading } = useSWR('/api/users')

  if (error) return <ErrorState message="Failed to load users" />
  if (isLoading) return <Skeleton />
  if (!data?.length) return <EmptyState />

  return <ul>{data.map(...)}</ul>
}
```

## Try-Catch Patterns

```tsx
// ❌ NEVER - swallow errors silently
try {
  await saveData(data)
} catch (e) {
  // nothing
}

// ❌ NEVER - log only
try {
  await saveData(data)
} catch (e) {
  console.error(e)
}

// ✅ ALWAYS - handle or re-throw
try {
  await saveData(data)
} catch (e) {
  if (e instanceof ValidationError) {
    setFieldErrors(e.fields)
    return
  }
  throw e // Re-throw unexpected errors
}
```

## Server Action Error Handling

```tsx
// ✅ CORRECT - return typed result
'use server'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function createUser(formData: FormData): Promise<ActionResult<User>> {
  try {
    const user = await db.user.create(...)
    return { success: true, data: user }
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return { success: false, error: 'User already exists' }
    }
    throw e // Let error boundary catch unexpected errors
  }
}
```

## Loading vs Error Priority

| State | Priority | Display |
|-------|----------|---------|
| Error | 1 (highest) | Error message + retry |
| Loading | 2 | Skeleton/spinner |
| Empty | 3 | Empty state |
| Success | 4 | Data |

```tsx
// ✅ CORRECT - check in priority order
if (error) return <ErrorState />
if (isLoading) return <Skeleton />
if (!data?.length) return <EmptyState />
return <DataDisplay data={data} />
```

## Toast vs Inline Errors

| Error Type | Display Method |
|------------|----------------|
| Form validation | Inline field errors |
| Submission failure | Toast notification |
| Network error | Toast + retry button |
| Auth error | Redirect to login |
| 404 | not-found.tsx |
| 500 | error.tsx |
