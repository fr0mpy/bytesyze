import { Text } from '@bytesyze-ui/core/text'

export default function TextPage() {
  return (
    <div className="space-y-8">
      {/* Headings */}
      <section className="space-y-4">
        <Text variant="overline">Headings (Responsive)</Text>
        <Text variant="h1">Heading 1</Text>
        <Text variant="h2">Heading 2</Text>
        <Text variant="h3">Heading 3</Text>
        <Text variant="h4">Heading 4</Text>
        <Text variant="h5">Heading 5</Text>
        <Text variant="h6">Heading 6</Text>
      </section>

      {/* Body Text */}
      <section className="space-y-4">
        <Text variant="overline">Body Text</Text>
        <Text variant="lead">
          Lead paragraph - larger intro text for articles or hero sections.
        </Text>
        <Text variant="body1">
          Body 1 - Primary paragraph text at base size. Used for main content and descriptions.
        </Text>
        <Text variant="body2">
          Body 2 - Secondary paragraph text, slightly smaller. Good for supporting content.
        </Text>
      </section>

      {/* Utility Variants */}
      <section className="space-y-4">
        <Text variant="overline">Utility Variants</Text>
        <div className="space-y-2">
          <Text variant="subtitle">Subtitle - medium weight supporting text</Text>
          <Text variant="caption">Caption - fine print and metadata</Text>
          <Text variant="overline">OVERLINE - LABELS AND CATEGORIES</Text>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Text variant="code">inline code</Text>
          <Text variant="kbd">Cmd</Text>
          <Text variant="kbd">+</Text>
          <Text variant="kbd">K</Text>
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-4">
        <Text variant="overline">Colors</Text>
        <div className="space-y-2">
          <Text color="foreground">Foreground (default)</Text>
          <Text color="muted">Muted text</Text>
          <Text color="primary">Primary accent</Text>
          <Text color="destructive">Destructive / Error</Text>
          <Text color="success">Success</Text>
        </div>
      </section>

      {/* Modifiers */}
      <section className="space-y-4">
        <Text variant="overline">Modifiers</Text>
        <div className="space-y-2">
          <Text weight="normal">Weight: normal</Text>
          <Text weight="medium">Weight: medium</Text>
          <Text weight="semibold">Weight: semibold</Text>
          <Text weight="bold">Weight: bold</Text>
        </div>
        <div className="space-y-2">
          <Text align="left">Align: left</Text>
          <Text align="center">Align: center</Text>
          <Text align="right">Align: right</Text>
        </div>
        <div className="space-y-2">
          <Text italic>Italic text</Text>
          <Text underline>Underlined text</Text>
          <div className="w-48">
            <Text truncate>
              Truncated text that is too long to fit in the container
            </Text>
          </div>
        </div>
      </section>

      {/* Semantic Override */}
      <section className="space-y-4">
        <Text variant="overline">Semantic Override (as prop)</Text>
        <Text variant="h1" as="p">
          Styled as h1, rendered as {'<p>'}
        </Text>
        <Text variant="body1" as="span">
          Body text rendered as {'<span>'}
        </Text>
      </section>
    </div>
  )
}
