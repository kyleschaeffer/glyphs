import { useRouter } from 'next/router'
import { createContext, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { throwUnreachable } from '../core/error'

export type ScrollContextState = {
  onContentLoaded(): void
}

export const ScrollContext = createContext<ScrollContextState>({ onContentLoaded: () => throwUnreachable() })

type ScrollControllerProps = {
  children?: ReactNode
}

export function ScrollController(props: ScrollControllerProps) {
  const { children } = props

  const router = useRouter()
  const scrolls = useRef<{ [path: string]: number }>({})
  const popping = useRef(false)

  const restorePathScroll = useRef((path: string) => {
    window.scroll({
      top: scrolls.current[path],
      behavior: 'auto',
    })
    delete scrolls.current[path]
  })

  useEffect(() => {
    router.beforePopState(() => {
      popping.current = true
      return true
    })

    function onRouteChangeStart() {
      scrolls.current[router.pathname] = window.scrollY
    }

    function onRouteChangeComplete(path: string) {
      if (popping.current && scrolls.current[path]) {
        restorePathScroll.current(path)
      }
      popping.current = false
    }

    router.events.on('routeChangeStart', onRouteChangeStart)
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart)
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router])

  const onContentLoaded = useCallback(() => restorePathScroll.current(router.pathname), [router.pathname])

  const value = useMemo<ScrollContextState>(() => ({ onContentLoaded }), [onContentLoaded])

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}
