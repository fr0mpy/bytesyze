import { KeyValueList } from '@bytesyze-ui/core/display'
import { Text } from '@bytesyze-ui/core/text'

const httpHeaders = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
  'X-Request-ID': 'abc123-def456-ghi789',
  'Accept': 'application/json, text/plain, */*',
  'Cache-Control': 'no-cache',
}

const queryParams = {
  page: 1,
  limit: 25,
  sort: 'created_at',
  order: 'desc',
  filter: 'active',
}

const metadata = {
  'Provider': 'Salesforce',
  'Organization': 'Acme Corp',
  'Source': 'API Integration',
  'Created': '2024-01-15T10:30:00Z',
  'Status': 'Active',
}

export default function KeyValueListPage() {
  return (
    <div className="space-y-8">
      {/* HTTP Headers */}
      <section className="space-y-3">
        <Text variant="h3">HTTP Headers</Text>
        <Text variant="body2" color="muted">
          Display HTTP headers with copy functionality
        </Text>
        <div className="border rounded-lg p-4 bg-muted/5">
          <KeyValueList items={httpHeaders} copyable />
        </div>
      </section>

      {/* Query Parameters */}
      <section className="space-y-3">
        <Text variant="h3">Query Parameters</Text>
        <Text variant="body2" color="muted">
          Supports string, number, and boolean values
        </Text>
        <div className="border rounded-lg p-4 bg-muted/5">
          <KeyValueList items={queryParams} copyable />
        </div>
      </section>

      {/* Without copy */}
      <section className="space-y-3">
        <Text variant="h3">Without Copy Button</Text>
        <Text variant="body2" color="muted">
          Set copyable=false to hide copy buttons
        </Text>
        <div className="border rounded-lg p-4 bg-muted/5">
          <KeyValueList items={metadata} copyable={false} />
        </div>
      </section>

      {/* Custom key width */}
      <section className="space-y-3">
        <Text variant="h3">Custom Key Width</Text>
        <Text variant="body2" color="muted">
          Adjust key column width for different content
        </Text>
        <div className="border rounded-lg p-4 bg-muted/5">
          <KeyValueList
            items={{
              'ID': '12345',
              'Name': 'Example Item',
              'Description': 'A longer description that might wrap',
            }}
            keyWidth="80px"
            copyable
          />
        </div>
      </section>
    </div>
  )
}
