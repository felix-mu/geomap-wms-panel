// force timezone to UTC to allow tests to work regardless of local timezone
// generally used by snapshots, but can affect specific tests
process.env.TZ = 'UTC';

const path = require('path');


const { grafanaESModules, nodeModulesToTransform } = require('./.config/jest/utils');

module.exports = {
  // Jest configuration provided by @grafana/create-plugin
  ...require('./.config/jest.config'),
  // Inform Jest to only transform specific node_module packages.
  transformIgnorePatterns: [nodeModulesToTransform([...grafanaESModules, 'geotiff', 'quick-lru', 'marked', 'react-calendar', 'get-user-locale', 'memoize', 'mimic-function', 'rbush', 'quickselect', 'earcut', 'ol-ext']),
],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    'react-inlinesvg': path.resolve(__dirname, '.config', 'jest', 'mocks', 'react-inlinesvg.tsx'),
    // '^ol-ext/style/(.*)$': '<rootDir>/src/__mocks__/ol-ext.js',
    // '^ol-ext/(.*)$': '<rootDir>/src/__mocks__/ol-ext.js',
    '^styles/bootstrap/bootstrapIcons(.*)$': '<rootDir>/src/__mocks__/bootstrapIcons.ts',
    '^styles/fontmaki/fontmaki(.*)$': '<rootDir>/src/__mocks__/fontmaki.ts',
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        sourceMaps: 'inline',
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: false,
            dynamicImport: true,
          },
        },
      },
    ],
    '^.+\\.js$': '@swc/jest',
  },
};
