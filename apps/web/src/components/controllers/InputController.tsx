import { useEffect } from 'react'
import { useToggleFont, useToggleTheme } from '../hooks/useTheme'

export function InputController() {
  const toggleFont = useToggleFont()
  const toggleTheme = useToggleTheme()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (document.activeElement?.matches('input,select,textarea')) return

      if (e.key === 'F') toggleFont()
      if (e.key === 'T') toggleTheme()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleFont, toggleTheme])

  return null
}
