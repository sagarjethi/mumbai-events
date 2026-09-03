import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // scripts/events-block.js is a paste-ready fragment, not a module.
  globalIgnores(['dist', 'scripts/events-block.js']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Capitalised names are React components (often destructured as
      // `icon: Icon`) and are used in JSX, which this config does not track.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Serverless function + build scripts run under Node.
    files: ['api/**/*.js', 'scripts/**/*.{js,mjs}', 'vite.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
])
