import path from 'path'
import withBundleAnalyzer from '@next/bundle-analyzer'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    staleTimes: {
      dynamic: 0,
      static: 180,
    },
  },

  transpilePackages: ['@bytesyze-ui/core'],

  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': [
        path.resolve(__dirname, './src'),
        path.resolve(__dirname, '../../packages/ui-library/core/src'),
      ],
      '@harness': path.resolve(__dirname, '../../packages/ui-library/harness/src'),
    }

    if (!isServer && config.optimization?.splitChunks) {
      const splitChunks = config.optimization.splitChunks as {
        cacheGroups?: Record<string, unknown>
      }
      splitChunks.cacheGroups = {
        ...splitChunks.cacheGroups,
        motion: {
          test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
          name: 'motion',
          chunks: 'all',
          priority: 30,
        },
        lucide: {
          test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
          name: 'lucide',
          chunks: 'all',
          priority: 20,
        },
      }
    }

    return config
  },
}

export default bundleAnalyzer(withNextIntl(nextConfig))
