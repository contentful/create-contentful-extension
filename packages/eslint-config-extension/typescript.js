'use strict';

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:you-dont-need-lodash-underscore/all'
  ],
  env: {
    browser: true
  },
  parserOptions: {
    ecmaVersion: 6,
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/camelcase': ['warn', { properties: 'never' }],
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/unified-signatures': 'warn',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          'underscore',
          'bluebird',
          {
            name: 'moment',
            message: 'Use date-fns or Luxon instead!'
          },
          {
            name: 'lodash',
            message: 'Use lodash-es instead!'
          }
        ]
      }
    ]
  }
};
