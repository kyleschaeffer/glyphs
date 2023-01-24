import { useEffect, useState } from 'react'
import { bindStyles } from '../core/browser'
import { useAppStore } from '../store/app'
import { useToggleTheme } from './hooks/useToggleTheme'
import styles from './ThemeButton.module.scss'

const cx = bindStyles(styles)

export function ThemeButton() {
  const theme = useAppStore((store) => store.theme)
  const toggleTheme = useToggleTheme()

  const [themeIcon, setThemeIcon] = useState<string | null>(null)
  useEffect(() => {
    setThemeIcon(theme === 'dark' ? '☾' : '☀')
  }, [theme])

  return (
    <button className={cx('theme-btn')} onClick={toggleTheme} title="Toggle theme (⇧T)">
      {themeIcon || '◌'}
    </button>
  )
}
