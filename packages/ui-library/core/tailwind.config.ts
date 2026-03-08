/**
 * Tailwind configuration for the core package.
 * Uses the shared preset for consistency.
 */

import type { Config } from 'tailwindcss'
import bytesyzePreset from './tailwind.preset'

export default {
  presets: [bytesyzePreset as Config],
  content: [
    './index.html',
    './**/*.{js,ts,jsx,tsx}',
  ],
} satisfies Config
