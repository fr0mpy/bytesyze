import { JsonView } from '@bytesyze-ui/core/display'
import { Text } from '@bytesyze-ui/core/text'

const sampleData = {
  user: {
    id: 12345,
    name: 'John Doe',
    email: 'john@example.com',
    isActive: true,
    roles: ['admin', 'user', 'editor'],
    metadata: null,
    profile: {
      avatar: 'https://example.com/avatar.jpg',
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en',
      },
    },
  },
  timestamp: '2024-01-15T10:30:00Z',
  count: 42,
}

const arrayData = [
  { id: 1, name: 'Item 1', status: 'active' },
  { id: 2, name: 'Item 2', status: 'pending' },
  { id: 3, name: 'Item 3', status: 'completed' },
]

export default function JsonViewPage() {
  return (
    <div className="space-y-8">
      {/* Basic usage */}
      <section className="space-y-3">
        <Text variant="h3">Nested Object</Text>
        <Text variant="body2" color="muted">
          Collapsible JSON display with syntax highlighting
        </Text>
        <JsonView data={sampleData} defaultExpandDepth={2} />
      </section>

      {/* Array data */}
      <section className="space-y-3">
        <Text variant="h3">Array Data</Text>
        <Text variant="body2" color="muted">
          Arrays are displayed with item count when collapsed
        </Text>
        <JsonView data={arrayData} defaultExpandDepth={1} />
      </section>

      {/* Fully expanded */}
      <section className="space-y-3">
        <Text variant="h3">Fully Expanded</Text>
        <Text variant="body2" color="muted">
          Set defaultExpandDepth to a high number to expand all levels
        </Text>
        <JsonView
          data={{ api: { version: '1.0', endpoints: ['/users', '/posts'] } }}
          defaultExpandDepth={10}
        />
      </section>

      {/* With label */}
      <section className="space-y-3">
        <Text variant="h3">With Label</Text>
        <Text variant="body2" color="muted">
          Optional label above the JSON content
        </Text>
        <JsonView
          data={{ message: 'Hello, World!', code: 200 }}
          label="API Response"
          defaultExpandDepth={10}
        />
      </section>

      {/* String JSON */}
      <section className="space-y-3">
        <Text variant="h3">String JSON</Text>
        <Text variant="body2" color="muted">
          Automatically parses JSON strings
        </Text>
        <JsonView
          data='{"parsed": true, "from": "string"}'
          defaultExpandDepth={10}
        />
      </section>
    </div>
  )
}
