import { useState, useEffect } from 'react'
import { Badge } from '@bytesyze-ui/core/badge'
import { Button } from '@bytesyze-ui/core/button'
import { Card, CardContent } from '@bytesyze-ui/core/card'
import { Paper, PaperContent } from '@bytesyze-ui/core/paper'
import { Select } from '@bytesyze-ui/core/select'
import { Slider } from '@bytesyze-ui/core/slider'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@bytesyze-ui/core/tabs'
import { Text } from '@bytesyze-ui/core/text'

interface FontConfig {
  name: string
  family: string
  source: 'google' | 'fontshare' | 'github' | 'bunny'
  weights: number[]
  category: 'distinctive' | 'recommended' | 'popular'
}

const FONTS: FontConfig[] = [
  // Distinctive - fonts with real personality
  { name: 'Clash Grotesk', family: 'Clash Grotesk', source: 'fontshare', weights: [400, 500, 700], category: 'distinctive' },
  { name: 'Cabinet Grotesk', family: 'Cabinet Grotesk', source: 'fontshare', weights: [400, 500, 700], category: 'distinctive' },
  { name: 'Neue Montreal', family: 'Neue Montreal', source: 'fontshare', weights: [400, 500, 700], category: 'distinctive' },
  { name: 'Plus Jakarta Sans', family: 'Plus Jakarta Sans', source: 'google', weights: [400, 500, 700], category: 'distinctive' },
  { name: 'Sora', family: 'Sora', source: 'google', weights: [400, 500, 700], category: 'distinctive' },
  { name: 'Urbanist', family: 'Urbanist', source: 'google', weights: [400, 500, 700], category: 'distinctive' },
  { name: 'Epilogue', family: 'Epilogue', source: 'google', weights: [400, 500, 700], category: 'distinctive' },

  // Clean but with character
  { name: 'Space Grotesk', family: 'Space Grotesk', source: 'google', weights: [400, 500, 700], category: 'recommended' },
  { name: 'Figtree', family: 'Figtree', source: 'google', weights: [400, 500, 700], category: 'recommended' },
  { name: 'General Sans', family: 'General Sans', source: 'fontshare', weights: [400, 500, 700], category: 'recommended' },
  { name: 'Satoshi', family: 'Satoshi', source: 'fontshare', weights: [400, 500, 700], category: 'recommended' },

  // Popular choices (for comparison)
  { name: 'Inter', family: 'Inter', source: 'google', weights: [400, 500, 700], category: 'popular' },
  { name: 'DM Sans', family: 'DM Sans', source: 'google', weights: [400, 500, 700], category: 'popular' },
  { name: 'Geist Sans', family: 'Geist', source: 'bunny', weights: [400, 500, 700], category: 'popular' },
  { name: 'Manrope', family: 'Manrope', source: 'google', weights: [400, 500, 700], category: 'popular' },
]

const SAMPLE_TEXTS = {
  heading: 'The quick brown fox jumps over the lazy dog',
  paragraph: 'Design systems help teams build better products faster by providing a shared language and reusable components.',
  numbers: '0123456789',
  uiWords: ['Dashboard', 'Settings', 'Notifications', 'Profile', 'Logout'],
}

const WEIGHT_OPTIONS = [
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '700', label: 'Bold (700)' },
]

const CATEGORY_BADGE_VARIANT: Record<FontConfig['category'], 'warning' | 'success' | 'primary'> = {
  distinctive: 'warning',
  recommended: 'success',
  popular: 'primary',
}

const SOURCE_LABELS: Record<FontConfig['source'], string> = {
  google: 'Google Fonts',
  fontshare: 'Fontshare',
  github: 'GitHub',
  bunny: 'Bunny Fonts',
}

function getFontUrl(font: FontConfig): string {
  const weights = font.weights.join(';')

  switch (font.source) {
    case 'google':
      return `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}:wght@${weights}&display=swap`
    case 'fontshare':
      return `https://api.fontshare.com/v2/css?f[]=${font.family.toLowerCase().replace(/ /g, '-')}@${weights}&display=swap`
    case 'bunny':
      return `https://fonts.bunny.net/css?family=${font.family.toLowerCase().replace(/ /g, '-')}:${weights}`
    case 'github':
      return 'https://github.githubassets.com/assets/mona-sans-variable.css'
    default:
      return ''
  }
}

function getFontDownloadUrl(font: FontConfig): string {
  switch (font.source) {
    case 'google':
      return `https://fonts.google.com/specimen/${font.family.replace(/ /g, '+')}`
    case 'fontshare':
      return `https://www.fontshare.com/fonts/${font.family.toLowerCase().replace(/ /g, '-')}`
    case 'github':
      return 'https://github.com/github/mona-sans'
    case 'bunny':
      return 'https://fonts.bunny.net'
    default:
      return ''
  }
}

function FontCard({
  font,
  isSelected,
  onSelect,
}: {
  font: FontConfig
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <Card
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Text variant="caption" color="muted">{font.name}</Text>
          <Badge variant={CATEGORY_BADGE_VARIANT[font.category]}>
            {font.category}
          </Badge>
        </div>
        <p
          className="text-2xl leading-tight"
          style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
        >
          Aa Bb Cc 123
        </p>
        <Text variant="caption" color="muted" className="mt-2">
          {SOURCE_LABELS[font.source]}
        </Text>
      </CardContent>
    </Card>
  )
}

function FontGrid({
  fonts,
  selectedFont,
  onSelectFont,
}: {
  fonts: FontConfig[]
  selectedFont: FontConfig
  onSelectFont: (font: FontConfig) => void
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {fonts.map((font) => (
        <FontCard
          key={font.name}
          font={font}
          isSelected={selectedFont.name === font.name}
          onSelect={() => onSelectFont(font)}
        />
      ))}
    </div>
  )
}

export default function FontShowcasePage() {
  const [selectedFont, setSelectedFont] = useState<FontConfig>(FONTS[0])
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set())
  const [previewSize, setPreviewSize] = useState(16)
  const [previewWeight, setPreviewWeight] = useState('400')

  // Load fonts dynamically
  useEffect(() => {
    FONTS.forEach((font) => {
      if (!loadedFonts.has(font.name)) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = getFontUrl(font)
        document.head.appendChild(link)
        setLoadedFonts((prev) => new Set(prev).add(font.name))
      }
    })
  }, [loadedFonts])

  const categories = {
    distinctive: FONTS.filter((f) => f.category === 'distinctive'),
    recommended: FONTS.filter((f) => f.category === 'recommended'),
    popular: FONTS.filter((f) => f.category === 'popular'),
  }

  const fontStyle = {
    fontFamily: `"${selectedFont.family}", system-ui, sans-serif`,
    fontSize: `${previewSize}px`,
    fontWeight: Number(previewWeight),
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <Text variant="h2">Font Showcase</Text>
        <Text variant="body2" color="muted">
          Compare fonts side-by-side. Click a font to see it in the preview panel.
        </Text>
      </section>

      {/* Preview Panel */}
      <Paper className="p-6">
        <PaperContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Text variant="h4">{selectedFont.name}</Text>
              <Text variant="caption" color="muted">
                Source: {SOURCE_LABELS[selectedFont.source]}
              </Text>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Text variant="caption">Size: {previewSize}px</Text>
                <Slider
                  value={previewSize}
                  onValueChange={setPreviewSize}
                  min={12}
                  max={32}
                  className="w-24"
                />
              </div>
              <div className="flex items-center gap-3">
                <Text variant="caption">Weight:</Text>
                <Select
                  options={WEIGHT_OPTIONS}
                  value={previewWeight}
                  onValueChange={(val) => setPreviewWeight(val)}
                  triggerMode="click"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6" style={fontStyle}>
            {/* Heading sample */}
            <div>
              <Text variant="overline">Heading</Text>
              <p className="text-3xl" style={{ fontWeight: 700 }}>
                {SAMPLE_TEXTS.heading}
              </p>
            </div>

            {/* Paragraph sample */}
            <div>
              <Text variant="overline">Paragraph</Text>
              <p>{SAMPLE_TEXTS.paragraph}</p>
            </div>

            {/* Numbers sample */}
            <div>
              <Text variant="overline">Numbers</Text>
              <p className="text-2xl">{SAMPLE_TEXTS.numbers}</p>
            </div>

            {/* UI Elements sample - using real Button components */}
            <div>
              <Text variant="overline">UI Elements</Text>
              <div className="flex flex-wrap gap-3 mt-2">
                {SAMPLE_TEXTS.uiWords.map((word) => (
                  <Button
                    key={word}
                    variant="secondary"
                    size="sm"
                    style={{ fontFamily: `"${selectedFont.family}", system-ui, sans-serif` }}
                  >
                    {word}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Download link */}
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              variant="text"
              size="sm"
              onClick={() => window.open(getFontDownloadUrl(selectedFont), '_blank')}
            >
              Download {selectedFont.name} from {SOURCE_LABELS[selectedFont.source]}
            </Button>
          </div>
        </PaperContent>
      </Paper>

      {/* Font Grid with Tabs */}
      <Tabs defaultValue="distinctive">
        <TabsList>
          <TabsTrigger value="distinctive">
            Distinctive ({categories.distinctive.length})
          </TabsTrigger>
          <TabsTrigger value="recommended">
            Clean ({categories.recommended.length})
          </TabsTrigger>
          <TabsTrigger value="popular">
            Popular ({categories.popular.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="distinctive">
          <Text variant="caption" color="muted" className="mb-3">
            Real personality, stands out
          </Text>
          <FontGrid
            fonts={categories.distinctive}
            selectedFont={selectedFont}
            onSelectFont={setSelectedFont}
          />
        </TabsContent>

        <TabsContent value="recommended">
          <Text variant="caption" color="muted" className="mb-3">
            Subtle but distinct
          </Text>
          <FontGrid
            fonts={categories.recommended}
            selectedFont={selectedFont}
            onSelectFont={setSelectedFont}
          />
        </TabsContent>

        <TabsContent value="popular">
          <Text variant="caption" color="muted" className="mb-3">
            For comparison
          </Text>
          <FontGrid
            fonts={categories.popular}
            selectedFont={selectedFont}
            onSelectFont={setSelectedFont}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
