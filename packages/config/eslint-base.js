import js from '@eslint/js'
import globals from 'globals'
import ts from 'typescript-eslint'

export default ts.config(js.configs.recommended, ts.configs.recommended, {
  ignores: ['**/node_modules/', '**/dist/'],
  languageOptions: {
    globals: {
      ...globals.es2020,
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'no-fallthrough': 'off',
    'prefer-rest-params': 'off',
  },
})
