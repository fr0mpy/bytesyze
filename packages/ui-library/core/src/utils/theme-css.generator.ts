#!/usr/bin/env tsx
/**
 * Theme CSS Generator
 *
 * Generates CSS files from TypeScript theme definitions.
 * Input: theming/input/{base-theme.ts, bytesyze.ts, ...}
 * Output: theming/output/{base.css, bytesyze.css, ...}
 *
 * Run with: pnpm --filter @bytesyze-ui/core build:theme-css
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { type BrandTheme, type BrandColors, tokenToCssVar } from './theme.types'
import { baseTheme, BRAND_NAMES } from '../theming/input'
import * as themes from '../theming/input'

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_DIR = path.join(__dirname, '..', 'theming', 'output')

// ============================================================================
// Base Theme CSS Generation
// ============================================================================

function generateBaseCss(): string {
  const timestamp = new Date().toISOString()

  const spacingVars = Object.entries(baseTheme.spacing)
    .map(([key, value]) => `  --spacing-${key}: ${value};`)
    .join('\n')

  const radiusVars = Object.entries(baseTheme.radius)
    .map(([key, value]) => `  --radius-${key}: ${value};`)
    .join('\n')

  const motionDurationVars = Object.entries(baseTheme.motion.duration)
    .map(([key, value]) => `  --motion-duration-${key}: ${value};`)
    .join('\n')

  const motionSpringVars = Object.entries(baseTheme.motion.spring)
    .map(([key, value]) => `  --motion-spring-${camelToKebab(key)}: ${value};`)
    .join('\n')

  const zIndexVars = Object.entries(baseTheme.zIndex)
    .map(([key, value]) => `  --z-${key}: ${value};`)
    .join('\n')

  const lightShadowVars = Object.entries(baseTheme.shadow.light)
    .map(([key, value]) => `  --shadow-${key}: ${value};`)
    .join('\n')

  const darkShadowVars = Object.entries(baseTheme.shadow.dark)
    .map(([key, value]) => `  --shadow-${key}: ${value};`)
    .join('\n')

  return `/**
 * Base Theme CSS Variables
 *
 * Auto-generated from: packages/ui-library/core/src/theming/input/base-theme.ts
 * Generated at: ${timestamp}
 *
 * DO NOT EDIT DIRECTLY — edit the TypeScript source and run:
 * pnpm --filter @bytesyze-ui/core build:theme-css
 */

:root {
  /* Spacing */
${spacingVars}

  /* Radius */
${radiusVars}

  /* Motion */
${motionDurationVars}
${motionSpringVars}

  /* Z-Index */
${zIndexVars}

  /* Shadows (Light Mode) */
${lightShadowVars}
}

.dark {
  /* Shadows (Dark Mode) */
${darkShadowVars}
}
`
}

// ============================================================================
// Brand Theme CSS Generation
// ============================================================================

function generateColorVars(colors: BrandColors): string {
  return Object.entries(colors)
    .map(([key, value]) => `  ${tokenToCssVar(key as keyof BrandColors)}: ${value};`)
    .join('\n')
}

function generateTypographyVars(typography: BrandTheme['typography']): string {
  return [
    `  --font-heading: ${typography.heading};`,
    `  --font-body: ${typography.body};`,
    `  --font-code: ${typography.code};`,
  ].join('\n')
}

function generateBrandCss(name: string, theme: BrandTheme): string {
  const timestamp = new Date().toISOString()

  return `/**
 * ${kebabToTitle(name)} Theme
 *
 * Auto-generated from: packages/ui-library/core/src/theming/input/${name}.ts
 * Generated at: ${timestamp}
 *
 * DO NOT EDIT DIRECTLY — edit the TypeScript source and run:
 * pnpm --filter @bytesyze-ui/core build:theme-css
 */

:root {
${generateColorVars(theme.light)}

  /* Typography */
${generateTypographyVars(theme.typography)}
}

.dark {
${generateColorVars(theme.dark)}
}
`
}

// ============================================================================
// Utilities
// ============================================================================

function kebabToTitle(kebab: string): string {
  return kebab
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function kebabToCamel(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function camelToKebab(camel: string): string {
  return camel.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// ============================================================================
// Main
// ============================================================================

function main(): void {
  console.log('🎨 Building theme CSS files...\n')

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Generate base.css
  const baseCss = generateBaseCss()
  const baseOutputPath = path.join(OUTPUT_DIR, 'base.css')
  fs.writeFileSync(baseOutputPath, baseCss, 'utf-8')
  console.log('✓ Generated: theming/output/base.css')

  // Generate brand CSS files
  for (const name of BRAND_NAMES) {
    const camelName = kebabToCamel(name)
    const theme = (themes as unknown as Record<string, BrandTheme>)[camelName]

    if (!theme) {
      console.error(`❌ Theme "${name}" not found. Expected export "${camelName}" in theming/input/index.ts`)
      process.exit(1)
    }

    const css = generateBrandCss(name, theme)
    const outputPath = path.join(OUTPUT_DIR, `${name}.css`)

    fs.writeFileSync(outputPath, css, 'utf-8')
    console.log(`✓ Generated: theming/output/${name}.css`)
  }

  console.log(`\n✅ Generated ${BRAND_NAMES.length + 1} CSS file(s)`)
}

main()
