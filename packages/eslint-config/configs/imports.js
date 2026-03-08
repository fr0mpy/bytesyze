import importX from 'eslint-plugin-import-x'

/** @type {import('eslint').Linter.Config} */
export default {
  name: 'bytesyze/imports',
  plugins: {
    'import-x': importX,
  },
  settings: {
    'import-x/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'import-x/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  },
  rules: {
    // Import ordering
    'import-x/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: 'next/**',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@bytesyze-ui/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@bytesyze/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'next'],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // Import hygiene - disabled rules that require TypeScript resolver
    // TODO: Re-enable once eslint-import-resolver-typescript is configured
    // 'import-x/no-duplicates': 'error',
    // 'import-x/no-self-import': 'error',
    // 'import-x/no-cycle': ['warn', { maxDepth: 3 }],
    // 'import-x/no-useless-path-segments': 'warn',
  },
}
