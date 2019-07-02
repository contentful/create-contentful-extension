'use strict';

module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'prettier',
    'prettier/babel',
    'plugin:you-dont-need-lodash-underscore/all'
  ],
  env: {
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
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
