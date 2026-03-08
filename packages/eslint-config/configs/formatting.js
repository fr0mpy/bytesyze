import stylistic from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config} */
export default {
  name: 'bytesyze/formatting',
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    // Indentation
    '@stylistic/indent': ['warn', 2, { SwitchCase: 1 }],
    '@stylistic/jsx-indent': ['warn', 2],
    '@stylistic/jsx-indent-props': ['warn', 2],

    // Line length
    '@stylistic/max-len': [
      'warn',
      {
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true,
      },
    ],

    // JSX formatting - props on separate lines
    '@stylistic/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'multiline' }],
    '@stylistic/jsx-first-prop-new-line': ['warn', 'multiline'],
    '@stylistic/jsx-closing-bracket-location': ['warn', 'line-aligned'],
    '@stylistic/jsx-closing-tag-location': 'warn',
    '@stylistic/jsx-wrap-multilines': [
      'warn',
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      },
    ],

    // Spacing
    '@stylistic/object-curly-spacing': ['warn', 'always'],
    '@stylistic/array-bracket-spacing': ['warn', 'never'],
    '@stylistic/comma-spacing': ['warn', { before: false, after: true }],
    '@stylistic/key-spacing': ['warn', { beforeColon: false, afterColon: true }],
    '@stylistic/keyword-spacing': ['warn', { before: true, after: true }],
    '@stylistic/space-before-blocks': 'warn',
    '@stylistic/space-before-function-paren': [
      'warn',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    '@stylistic/space-in-parens': ['warn', 'never'],
    '@stylistic/space-infix-ops': 'warn',
    '@stylistic/arrow-spacing': ['warn', { before: true, after: true }],

    // JSX spacing
    '@stylistic/jsx-tag-spacing': [
      'warn',
      {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never',
      },
    ],
    '@stylistic/jsx-curly-spacing': ['warn', { when: 'never', children: true }],
    '@stylistic/jsx-equals-spacing': ['warn', 'never'],
    '@stylistic/jsx-props-no-multi-spaces': 'warn',

    // Quotes
    '@stylistic/quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    '@stylistic/jsx-quotes': ['warn', 'prefer-double'],

    // Semicolons and commas
    '@stylistic/semi': ['warn', 'never'],
    '@stylistic/comma-dangle': ['warn', 'always-multiline'],
    '@stylistic/comma-style': ['warn', 'last'],

    // Braces and parens
    '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    '@stylistic/no-extra-parens': [
      'warn',
      'all',
      {
        ignoreJSX: 'multi-line',
        nestedBinaryExpressions: false,
        enforceForArrowConditionals: false,
      },
    ],

    // Line breaks
    '@stylistic/eol-last': ['warn', 'always'],
    '@stylistic/no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0, maxBOF: 0 }],
    '@stylistic/no-trailing-spaces': 'warn',
    '@stylistic/padded-blocks': ['warn', 'never'],

    // Operators
    '@stylistic/operator-linebreak': ['warn', 'before', { overrides: { '=': 'after' } }],
    '@stylistic/dot-location': ['warn', 'property'],

    // Member expressions
    '@stylistic/member-delimiter-style': [
      'warn',
      {
        multiline: { delimiter: 'none' },
        singleline: { delimiter: 'semi', requireLast: false },
      },
    ],

    // Type annotations
    '@stylistic/type-annotation-spacing': 'warn',
  },
}
