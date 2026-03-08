#!/usr/bin/env tsx
/**
 * Font Loader Generator
 *
 * Generates next/font loader from TypeScript theme definitions.
 * Input: theming/input/{bytesyze.ts, ...}
 * Output: theming/output/fonts.generated.ts
 *
 * Run with: pnpm --filter @bytesyze-ui/core build:fonts
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BRAND_NAMES } from '../theming/input'
import * as themes from '../theming/input'
import type { BrandTheme, GoogleFontConfig, FontConfig } from './theme.types'

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_DIR = path.join(__dirname, '..', 'theming', 'output')

// ============================================================================
// Utilities
// ============================================================================

/**
 * Convert font name to valid import name.
 * 'IBM Plex Mono' → 'IBM_Plex_Mono'
 * 'Space Grotesk' → 'Space_Grotesk'
 */
function fontNameToImport(name: string): string {
  return name.replace(/\s+/g, '_')
}

/**
 * Convert font variable key to camelCase variable name.
 * 'sans' → 'fontSans'
 * 'mono' → 'fontMono'
 */
function fontVarName(variable: string): string {
  return `font${variable.charAt(0).toUpperCase()}${variable.slice(1)}`
}

function kebabToCamel(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function isGoogleFont(config: FontConfig): config is GoogleFontConfig {
  return config.type === 'google'
}

// ============================================================================
// Generator
// ============================================================================

function generateFontLoader(theme: BrandTheme): string {
  const timestamp = new Date().toISOString()
  const fonts = [theme.fonts.sans, theme.fonts.mono]

  // Collect Google fonts for import statement
  const googleFonts = fonts.filter(isGoogleFont)

  if (googleFonts.length === 0) {
    throw new Error('No Google fonts found in theme. Local fonts not yet supported.')
  }

  // Generate import statement
  const fontImports = googleFonts.map((f) => fontNameToImport(f.name)).join(', ')
  const importStatement = `import { ${fontImports} } from 'next/font/google'`

  // Generate font instances
  const fontInstances = googleFonts
    .map((font) => {
      const varName = fontVarName(font.variable)
      const importName = fontNameToImport(font.name)
      const subsets = font.subsets ?? ['latin']

      return `
export const ${varName} = ${importName}({
  subsets: ${JSON.stringify(subsets)},
  display: 'swap',
  variable: '--font-${font.variable}',
  weight: ${JSON.stringify(font.weights.map(String))},
  adjustFontFallback: true,
  preload: true,
})`
    })
    .join('\n')

  // Generate exports
  const varNames = googleFonts.map((f) => fontVarName(f.variable))
  const fontVariablesExpr = varNames.map((v) => `\${${v}.variable}`).join(' ')

  return `/**
 * Font Loader (Auto-generated)
 *
 * Auto-generated from: packages/ui-library/core/src/theming/input/bytesyze.ts
 * Generated at: ${timestamp}
 *
 * DO NOT EDIT DIRECTLY — edit the theme fonts section and run:
 * pnpm --filter @bytesyze-ui/core build:fonts
 */

${importStatement}
${fontInstances}

/**
 * Combined CSS variable classes for all fonts.
 * Apply to <html> element to make CSS variables available.
 */
export const fontVariables = \`${fontVariablesExpr}\`

/**
 * Font setup for app layouts.
 * Simplifies font application in layout.tsx files.
 *
 * @example
 * import { FontSetup } from '@bytesyze-ui/core/theming'
 *
 * <html className={FontSetup.htmlClassName}>
 *   <body className={FontSetup.bodyClassName}>
 */
export const FontSetup = {
  /** Apply to <html> className */
  htmlClassName: fontVariables,
  /** Apply to <body> className */
  bodyClassName: fontSans.className,
} as const
`
}

// ============================================================================
// Main
// ============================================================================

function main(): void {
  console.log('🔤 Building font loader...\n')

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Use first brand theme (currently only bytesyze)
  const brandName = BRAND_NAMES[0]
  const camelName = kebabToCamel(brandName)
  const theme = (themes as unknown as Record<string, BrandTheme>)[camelName]

  if (!theme) {
    console.error(`❌ Theme "${brandName}" not found.`)
    process.exit(1)
  }

  if (!theme.fonts) {
    console.error(`❌ Theme "${brandName}" is missing fonts configuration.`)
    process.exit(1)
  }

  const output = generateFontLoader(theme)
  const outputPath = path.join(OUTPUT_DIR, 'fonts.generated.ts')

  fs.writeFileSync(outputPath, output, 'utf-8')
  console.log('✓ Generated: theming/output/fonts.generated.ts')

  console.log('\n✅ Font loader generated successfully')
}

main()
