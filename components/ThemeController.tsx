import { ReactNode, useEffect } from 'react'
import { bindStyles } from '../core/browser'
import { useAppStore } from '../store/app'
import { useToggleTheme } from './hooks/useToggleTheme'
import styles from './ThemeController.module.scss'

const cx = bindStyles(styles)

type ThemeControllerProps = {
  children?: ReactNode
}

export function ThemeController(props: ThemeControllerProps) {
  const { children } = props

  const theme = useAppStore((store) => store.theme)
  const toggleTheme = useToggleTheme()

  useEffect(() => {
    const className = cx(theme)
    if (!className) return
    document.body.classList.add(className)
    return () => document.body.classList.remove(className)
  }, [theme])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'T' || document.activeElement?.matches('input,select,textarea')) return

      e.preventDefault()
      toggleTheme()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleTheme])

  return <>{children}</>
}
