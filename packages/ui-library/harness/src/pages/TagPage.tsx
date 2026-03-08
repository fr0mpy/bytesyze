import { Tag } from '@bytesyze-ui/core/display'
import { Text } from '@bytesyze-ui/core/text'

export default function TagPage() {
  return (
    <div className="space-y-8">
      {/* All variants */}
      <section className="space-y-3">
        <Text variant="h3">Tag Variants</Text>
        <Text variant="body2" color="muted">
          Lightweight tags for categorization and labeling
        </Text>
        <div className="flex flex-wrap gap-2">
          <Tag variant="success">Success</Tag>
          <Tag variant="warning">Warning</Tag>
          <Tag variant="destructive">Destructive</Tag>
          <Tag variant="info">Info</Tag>
          <Tag variant="primary">Primary</Tag>
          <Tag variant="secondary">Secondary</Tag>
          <Tag variant="accent">Accent</Tag>
          <Tag variant="muted">Muted</Tag>
        </div>
      </section>

      {/* HTTP Methods */}
      <section className="space-y-3">
        <Text variant="h3">HTTP Methods</Text>
        <Text variant="body2" color="muted">
          Common use case for displaying API methods
        </Text>
        <div className="flex flex-wrap gap-2">
          <Tag variant="info">GET</Tag>
          <Tag variant="success">POST</Tag>
          <Tag variant="warning">PUT</Tag>
          <Tag variant="destructive">DELETE</Tag>
          <Tag variant="accent">PATCH</Tag>
          <Tag variant="primary">HEAD</Tag>
          <Tag variant="secondary">OPTIONS</Tag>
        </div>
      </section>

      {/* Status Tags */}
      <section className="space-y-3">
        <Text variant="h3">Status Tags</Text>
        <Text variant="body2" color="muted">
          Indicate status or state
        </Text>
        <div className="flex flex-wrap gap-2">
          <Tag variant="success">Active</Tag>
          <Tag variant="warning">Pending</Tag>
          <Tag variant="destructive">Failed</Tag>
          <Tag variant="muted">Disabled</Tag>
          <Tag variant="info">Processing</Tag>
        </div>
      </section>

      {/* Category Tags */}
      <section className="space-y-3">
        <Text variant="h3">Categories</Text>
        <Text variant="body2" color="muted">
          Organize content by category
        </Text>
        <div className="flex flex-wrap gap-2">
          <Tag variant="primary">HRIS</Tag>
          <Tag variant="accent">CRM</Tag>
          <Tag variant="secondary">ATS</Tag>
          <Tag variant="info">Marketing</Tag>
        </div>
      </section>
    </div>
  )
}
