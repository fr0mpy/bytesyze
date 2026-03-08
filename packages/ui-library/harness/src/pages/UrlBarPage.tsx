import { UrlBar } from '@bytesyze-ui/core/display'
import { Text } from '@bytesyze-ui/core/text'

export default function UrlBarPage() {
  return (
    <div className="space-y-8">
      {/* Basic usage */}
      <section className="space-y-3">
        <Text variant="h3">Basic URL Bar</Text>
        <Text variant="body2" color="muted">
          Displays a URL with copy-to-clipboard functionality
        </Text>
        <UrlBar url="https://api.example.com/v1/users/12345" />
      </section>

      {/* With custom label */}
      <section className="space-y-3">
        <Text variant="h3">Custom Label</Text>
        <Text variant="body2" color="muted">
          Override the default &quot;URL&quot; label
        </Text>
        <UrlBar
          url="https://api.bytesyze.com/unified/hris/employees"
          label="Endpoint"
        />
      </section>

      {/* With open button */}
      <section className="space-y-3">
        <Text variant="h3">With Open Button</Text>
        <Text variant="body2" color="muted">
          Show an additional button to open the URL in a new tab
        </Text>
        <UrlBar
          url="https://docs.bytesyze.com/api-reference"
          label="Documentation"
          showOpenButton
        />
      </section>

      {/* Long URL */}
      <section className="space-y-3">
        <Text variant="h3">Long URL (Truncated)</Text>
        <Text variant="body2" color="muted">
          Long URLs are truncated with full text available on hover
        </Text>
        <UrlBar
          url="https://api.example.com/v1/organizations/org_abc123/integrations/int_xyz789/sync?include=metadata&expand=relationships&filter[status]=active&filter[type]=employee"
          showOpenButton
        />
      </section>

      {/* Without copy */}
      <section className="space-y-3">
        <Text variant="h3">Copy Disabled</Text>
        <Text variant="body2" color="muted">
          Disable the copy button when needed
        </Text>
        <UrlBar
          url="https://internal.example.com/admin"
          copyable={false}
        />
      </section>
    </div>
  )
}
