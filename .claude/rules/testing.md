# Testing Standards

## Test File Location

**Tests live alongside source files with `.test.ts` or `.spec.ts` suffix.**

```
components/
└── button/
    ├── button.tsx
    ├── button.test.tsx    # Unit tests
    └── button.spec.tsx    # Integration tests (optional)
```

## What to Test

| Layer | Test Type | Tools |
|-------|-----------|-------|
| Components | Unit + Integration | Vitest + Testing Library |
| Hooks | Unit | Vitest + renderHook |
| Utils | Unit | Vitest |
| API Routes | Integration | Vitest + MSW |
| E2E Flows | End-to-End | Playwright |

## Component Testing

```tsx
// ✅ CORRECT - test behavior, not implementation
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })
})
```

## Query Priority

**Use accessible queries in this order:**

| Priority | Query | When to Use |
|----------|-------|-------------|
| 1 | `getByRole` | Interactive elements |
| 2 | `getByLabelText` | Form fields |
| 3 | `getByPlaceholderText` | Inputs (fallback) |
| 4 | `getByText` | Non-interactive text |
| 5 | `getByTestId` | Last resort |

```tsx
// ❌ NEVER - test IDs for accessible elements
screen.getByTestId('submit-button')

// ✅ ALWAYS - accessible queries
screen.getByRole('button', { name: /submit/i })
```

## Hook Testing

```tsx
import { renderHook, act } from '@testing-library/react'

describe('useCounter', () => {
  it('increments count', () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })
})
```

## Mocking

```tsx
// ✅ CORRECT - mock at module boundary
vi.mock('@/lib/api', () => ({
  fetchLogs: vi.fn(),
}))

// ✅ CORRECT - MSW for API mocking
import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/logs', () => {
    return HttpResponse.json([{ id: 1, message: 'Test log' }])
  }),
]
```

## Async Testing

```tsx
// ✅ CORRECT - wait for async updates
it('loads and displays data', async () => {
  render(<UserProfile id="1" />)

  // Wait for loading to finish
  expect(await screen.findByText('John Doe')).toBeInTheDocument()
})

// ✅ CORRECT - waitFor for assertions
await waitFor(() => {
  expect(screen.getByRole('list')).toHaveAttribute('data-loaded', 'true')
})
```

## Snapshot Testing

**Use sparingly - only for stable, visual components.**

```tsx
// ✅ OK - stable icon component
it('renders correctly', () => {
  const { container } = render(<Icon name="check" />)
  expect(container).toMatchSnapshot()
})

// ❌ AVOID - dynamic content
it('renders user', () => {
  render(<UserCard user={mockUser} />)
  expect(screen.getByRole('article')).toMatchSnapshot() // Brittle
})
```

## Test Coverage Targets

| Type | Target |
|------|--------|
| Utils/Helpers | 90%+ |
| Hooks | 80%+ |
| Components | 70%+ |
| API Routes | 80%+ |

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# Single file
pnpm test button.test.tsx
```
