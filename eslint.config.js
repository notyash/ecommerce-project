import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tanstackQuery from '@tanstack/eslint-plugin-query'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@tanstack/query': tanstackQuery,
    },
    rules: {
      // React hooks rules — catches missing useEffect dependencies
      ...reactHooks.configs.recommended.rules,

      // React refresh — Vite specific, keeps fast refresh working correctly
      'react-refresh/only-export-components': 'off',

      // TanStack Query — catches missing query key dependencies
      '@tanstack/query/exhaustive-deps': 'error',

      // TanStack Query — catches when you forget to use query results properly  
      '@tanstack/query/no-rest-destructuring': 'warn',
    },
  },
)