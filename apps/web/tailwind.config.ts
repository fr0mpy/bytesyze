import type { Config } from 'tailwindcss'
import bytesyzePreset from '@bytesyze-ui/core/tailwind.preset'

const config: Config = {
  presets: [bytesyzePreset as Config],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-library/core/src/**/*.{js,ts,jsx,tsx}',
  ],
}

export default config
