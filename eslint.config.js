// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/**', 'node_modules/**', '.git/**', '.expo/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      curly: [2, 'all'],
      complexity: ['error', { max: 12 }],
      'max-depth': ['error', { max: 3 }],
      'max-nested-callbacks': ['error', { max: 2 }],
      'max-params': ['error', { max: 3 }],
      'max-statements': ['error', { max: 12 }],
      'no-nested-ternary': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**'],
    rules: {
      'max-nested-callbacks': 'off',
      'max-statements': 'off',
    },
  },
]);
