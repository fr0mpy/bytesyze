import js from '@eslint/js'
import globals from 'globals'

/** @type {import('eslint').Linter.Config} */
export default {
  name: 'bytesyze/base',
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.es2022,
    },
  },
  rules: {
    ...js.configs.recommended.rules,

    // Code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',

    // Error handling
    'no-empty': ['error', { allowEmptyCatch: false }],

    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',

    // Best practices
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-var': 'error',
    'prefer-const': 'warn',
    'prefer-arrow-callback': 'warn',
    'prefer-template': 'warn',
    'object-shorthand': 'warn',
  },
}
