# Security Rules

## Input Validation

**NEVER trust user input. Validate at system boundaries.**

```tsx
// ❌ NEVER - direct use of user input
const userId = params.id
const user = await db.user.findUnique({ where: { id: userId } })

// ✅ ALWAYS - validate and sanitize
import { z } from 'zod'

const ParamsSchema = z.object({
  id: z.string().uuid(),
})

const { id } = ParamsSchema.parse(params)
const user = await db.user.findUnique({ where: { id } })
```

## XSS Prevention

**NEVER use dangerouslySetInnerHTML unless absolutely necessary.**

```tsx
// ❌ NEVER - raw HTML injection
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ ALWAYS - sanitize if HTML is required
import DOMPurify from 'dompurify'

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userContent)
}} />

// ✅ BETTER - use markdown renderer with sanitization
import ReactMarkdown from 'react-markdown'

<ReactMarkdown>{userContent}</ReactMarkdown>
```

## SQL/Query Injection

```tsx
// ❌ NEVER - string interpolation in queries
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE name = '${userName}'
`

// ✅ ALWAYS - parameterized queries
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE name = ${userName}
`

// ✅ ALWAYS - Prisma type-safe queries
const users = await prisma.user.findMany({
  where: { name: userName },
})
```

## Environment Variables

```tsx
// ❌ NEVER - expose secrets to client
// next.config.js
env: {
  DATABASE_URL: process.env.DATABASE_URL, // LEAKED TO CLIENT!
}

// ✅ CORRECT - only NEXT_PUBLIC_ vars are client-safe
env: {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
}

// ❌ NEVER - hardcode secrets
const apiKey = 'sk-1234567890'

// ✅ ALWAYS - use environment variables
const apiKey = process.env.API_SECRET_KEY
```

## Authentication Checks

```tsx
// ❌ NEVER - client-side only auth checks
'use client'
function AdminPanel() {
  const { user } = useAuth()
  if (!user?.isAdmin) return <Redirect to="/login" />
  return <AdminContent />
}

// ✅ ALWAYS - server-side auth verification
// middleware.ts or layout.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }) {
  const session = await auth()

  if (!session?.user?.isAdmin) {
    redirect('/login')
  }

  return children
}
```

## CSRF Protection

**Server Actions have built-in CSRF protection. For custom APIs:**

```tsx
// ✅ CORRECT - verify origin for mutations
export async function POST(request: Request) {
  const origin = request.headers.get('origin')

  if (origin !== process.env.NEXT_PUBLIC_APP_URL) {
    return new Response('Forbidden', { status: 403 })
  }

  // Process request...
}
```

## Sensitive Data in Logs

```tsx
// ❌ NEVER - log sensitive data
console.log('User login:', { email, password })
logger.info('Payment:', { cardNumber, cvv })

// ✅ ALWAYS - redact sensitive fields
console.log('User login:', { email, password: '[REDACTED]' })
logger.info('Payment:', { last4: cardNumber.slice(-4) })
```

## URL Handling

```tsx
// ❌ NEVER - redirect to user-provided URL
redirect(params.returnUrl)

// ✅ ALWAYS - validate redirect URLs
const ALLOWED_REDIRECTS = ['/dashboard', '/profile', '/settings']

const returnUrl = ALLOWED_REDIRECTS.includes(params.returnUrl)
  ? params.returnUrl
  : '/dashboard'

redirect(returnUrl)
```

## File Uploads

```tsx
// ✅ CORRECT - validate file uploads
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  if (file.size > MAX_SIZE) {
    throw new Error('File too large')
  }

  // Process upload...
}
```

## Rate Limiting

```tsx
// ✅ CORRECT - rate limit sensitive endpoints
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }

  // Process request...
}
```
