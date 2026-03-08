import { configs } from '@bytesyze/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...configs.react,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Disable granular import rule for the ui-library itself
    // (it's the source of those exports)
    rules: {
      'bytesyze/granular-imports': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
