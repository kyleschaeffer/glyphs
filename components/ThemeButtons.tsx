import { useEffect, useState } from 'react'
import { bindStyles } from '../core/browser'
import { useAppStore } from '../store/app'
import { useToggleFont, useToggleTheme } from './hooks/useToggleTheme'
import styles from './ThemeButtons.module.scss'

const cx = bindStyles(styles)

export function ThemeButtons() {
  const theme = useAppStore((store) => store.theme)
  const toggleTheme = useToggleTheme()
  const toggleFont = useToggleFont()

  const [themeIcon, setThemeIcon] = useState<string | null>(null)
  useEffect(() => {
    setThemeIcon(theme === 'dark' ? '☾' : '☀')
  }, [theme])

  return (
    <div className={cx('btns')}>
      <button className={cx('btn', 'font-btn')} onClick={toggleFont} title="Toggle font (⇧F)">
        Aa
      </button>
      <button className={cx('btn')} onClick={toggleTheme} title="Toggle theme (⇧T)">
        {themeIcon || '◌'}
      </button>
    </div>
  )
}
