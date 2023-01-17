import { useEffect } from 'react'
import { useAppStore } from '../../store/app'

export function HashController() {
  const hashChange = useAppStore((store) => store.hashChange)
  const ready = useAppStore((store) => store.ready)

  useEffect(() => {
    window.addEventListener('hashchange', hashChange)
    return () => {
      window.removeEventListener('hashchange', hashChange)
    }
  }, [hashChange])

  useEffect(() => {
    if (!ready) return
    hashChange()
  }, [hashChange, ready])

  return null
}
