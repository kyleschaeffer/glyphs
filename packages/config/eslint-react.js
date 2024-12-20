import reactHooks from 'eslint-plugin-react-hooks'
import web from './eslint-web.js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...web,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useIsomorphicLayoutEffect|useMemoWithRef)',
        },
      ],
    },
  },
]
