import type { Config } from 'tailwindcss'
import bytesyzePreset from '../core/tailwind.preset'

const config: Config = {
  presets: [bytesyzePreset as Config],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../core/src/**/*.{js,ts,jsx,tsx}',
  ],
}

export default config
