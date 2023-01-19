import { useEffect, useRef } from 'react'
import { useAppStore } from '../../store/app'
import { registerSearchWorker } from '../../workers/search'
import { registerServiceWorker } from '../../workers/sw'

export function WorkerController() {
  const register = useAppStore((store) => store.register)
  const setGlyph = useAppStore((store) => store.setGlyph)
  const setInspect = useAppStore((store) => store.setInspect)
  const setReady = useAppStore((store) => store.setReady)
  const setResults = useAppStore((store) => store.setResults)

  const isMounted = useRef(false)
  useEffect(() => {
    if (isMounted.current) return
    isMounted.current = true

    registerServiceWorker()

    const { requestGlyph, requestInspect, requestQuery } = registerSearchWorker({
      onGlyphResponse: setGlyph,
      onInspectResponse: setInspect,
      onQueryResponse: setResults,
      onWorkerReady: setReady,
    })

    register({ requestGlyph, requestInspect, requestQuery })
  }, [register, setGlyph, setInspect, setReady, setResults])

  return null
}
