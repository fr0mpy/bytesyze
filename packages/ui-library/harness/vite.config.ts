import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const coreDir = path.resolve(__dirname, '../core/src')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Core package @/ resolution - these paths exist in core
      '@/utils': `${coreDir}/utils`,
      '@/hooks': `${coreDir}/hooks`,
      '@/config': `${coreDir}/config`,
      '@/styles': `${coreDir}/styles`,
      '@/components': `${coreDir}/components`,
      // Resolve bytesyze-ui to source for HMR during development
      'bytesyze-ui/utils': `${coreDir}/utils`,
      'bytesyze-ui/components': `${coreDir}/components`,
      'bytesyze-ui/styles': `${coreDir}/styles`,
      'bytesyze-ui/hooks': `${coreDir}/hooks`,
      'bytesyze-ui/config': `${coreDir}/config`,
      'bytesyze-ui': coreDir,
    },
  },
  server: {
    port: 5173,
  },
})
