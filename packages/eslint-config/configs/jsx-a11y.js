import jsxA11y from 'eslint-plugin-jsx-a11y'

/** @type {import('eslint').Linter.Config} */
export default {
  name: 'bytesyze/jsx-a11y',
  files: ['**/*.tsx', '**/*.jsx'],
  plugins: {
    'jsx-a11y': jsxA11y,
  },
  rules: {
    // Form controls must have labels
    'jsx-a11y/label-has-associated-control': 'error',

    // Critical accessibility errors
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',

    // Heading hierarchy
    'jsx-a11y/heading-has-content': 'error',

    // Interactive elements
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',

    // Focus management
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/tabindex-no-positive': 'error',
  },
}
