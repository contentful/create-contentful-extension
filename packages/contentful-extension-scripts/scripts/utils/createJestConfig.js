const paths = require('./paths');
const path = require('path');
const fs = require('fs');

let jestConfig = {};

if (fs.existsSync(path.resolve('jest.config.js'))) {
  jestConfig = require(path.resolve('jest.config.js'));
}

module.exports = function createJestConfig() {
  const config = {
    verbose: true,
    transform: {
      '.+\\.(js|jsx)?$': require.resolve('babel-jest'),
      '^.+\\.(ts|tsx)?$': require.resolve('ts-jest/dist'),
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
        './jestFileTransform.js'
      )
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|tsx|ts)$'],
    moduleNameMapper: {
      '\\.(css|less|scss)$': require.resolve('identity-obj-proxy')
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
    coverageReporters: ['lcov'],
    testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}'],
    testURL: 'http://localhost',
    rootDir: paths.root,
    coverageDirectory: paths.coverage,
    watchPlugins: [
      require.resolve('jest-watch-typeahead/filename'),
      require.resolve('jest-watch-typeahead/testname')
    ],
    ...jestConfig
  };

  return config;
};
