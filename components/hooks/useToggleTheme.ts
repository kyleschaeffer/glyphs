import { useCallback } from 'react'
import { useAppStore } from '../../store/app'

export function useToggleTheme() {
  const theme = useAppStore((store) => store.theme)
  const setTheme = useAppStore((store) => store.setTheme)

  return useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [setTheme, theme])
}
