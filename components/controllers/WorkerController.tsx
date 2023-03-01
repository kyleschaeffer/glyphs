import { useEffect, useRef } from 'react'
import { useAppStore } from '../../store/app'
import { registerSearchWorker } from '../../workers/search'
import { registerServiceWorker } from '../../workers/sw'

export function WorkerController() {
  const register = useAppStore((store) => store.register)
  const setBlock = useAppStore((store) => store.setBlock)
  const setGlyph = useAppStore((store) => store.setGlyph)
  const setReady = useAppStore((store) => store.setReady)
  const setResults = useAppStore((store) => store.setResults)

  const isMounted = useRef(false)
  useEffect(() => {
    if (isMounted.current) return
    isMounted.current = true

    registerServiceWorker()

    const { requestBlock, requestGlyph, requestQuery } = registerSearchWorker({
      onBlockResponse: setBlock,
      onGlyphResponse: setGlyph,
      onQueryResponse: setResults,
      onWorkerReady: setReady,
    })

    register({ requestBlock, requestGlyph, requestQuery })
  }, [register, setBlock, setGlyph, setReady, setResults])

  return null
}
