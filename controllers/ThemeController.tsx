import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/app'

export function ThemeController() {
  const initTheme = useAppStore((store) => store.initTheme)

  const isMounted = useRef(false)
  useEffect(() => {
    if (isMounted.current) return
    initTheme()
  }, [initTheme])

  return null
}
