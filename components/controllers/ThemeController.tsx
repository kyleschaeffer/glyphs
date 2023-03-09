import { ReactNode, useEffect } from 'react'
import { bindStyles } from '../../core/browser'
import { useAppStore } from '../../store/app'
import { useToggleFont, useToggleTheme } from '../hooks/useToggleTheme'
import styles from './ThemeController.module.scss'

const cx = bindStyles(styles)

type ThemeControllerProps = {
  children?: ReactNode
}

export function ThemeController(props: ThemeControllerProps) {
  const { children } = props

  const font = useAppStore((store) => store.font)
  const theme = useAppStore((store) => store.theme)
  const toggleFont = useToggleFont()
  const toggleTheme = useToggleTheme()

  useEffect(() => {
    const fontClassName = cx(font)
    const themeClassName = cx(theme)
    if (!fontClassName || !themeClassName) return
    document.body.classList.add(themeClassName, fontClassName)
    return () => document.body.classList.remove(themeClassName, fontClassName)
  }, [font, theme])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key !== 'T' && e.key !== 'F') || document.activeElement?.matches('input,select,textarea')) return
      e.preventDefault()

      if (e.key === 'T') toggleTheme()
      if (e.key === 'F') toggleFont()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleFont, toggleTheme])

  return <>{children}</>
}
