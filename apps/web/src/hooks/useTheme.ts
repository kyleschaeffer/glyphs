import { useCallback } from 'react'
import { useAppStore } from '../store/app'

export function useToggleFont() {
  const font = useAppStore((store) => store.font)
  const setFont = useAppStore((store) => store.setFont)
  return useCallback(() => setFont(font === 'sans' ? 'serif' : 'sans'), [font, setFont])
}

export function useToggleTheme() {
  const theme = useAppStore((store) => store.theme)
  const setTheme = useAppStore((store) => store.setTheme)
  return useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme])
}
