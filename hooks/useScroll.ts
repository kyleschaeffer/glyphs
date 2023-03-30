import { useContext, useLayoutEffect } from 'react'
import { ScrollContext } from '../controllers/ScrollController'

export function useScroll() {
  return useContext(ScrollContext)
}

export function useScrollAfterLoading(loading: boolean) {
  const { onContentLoaded } = useScroll()

  useLayoutEffect(() => {
    if (loading) return
    onContentLoaded()
  }, [loading, onContentLoaded])
}
