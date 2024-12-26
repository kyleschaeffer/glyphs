import { useEffect } from 'react'
import { useAppStore } from '../../store/app'

export function ThemeController() {
  const font = useAppStore((store) => store.font)
  const theme = useAppStore((store) => store.theme)

  useEffect(() => {
    if (font === 'serif') document.body.classList.add('font-serif')
    if (theme === 'light') document.body.classList.add('theme-light')
    return () => document.body.classList.remove('font-serif', 'theme-light')
  }, [font, theme])

  return null
}
