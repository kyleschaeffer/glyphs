import type { Glyph } from '../store/types'
import type { ClientMessage, WorkerMessage, SearchResult } from './types'

export type SearchWorkerCallbacks = {
  onGlyphResponse?: (glyph: Glyph | null) => void
  onQueryResponse?: (results: SearchResult[]) => void
  onWorkerReady?: () => void
}

export const registerSearchWorker = ({
  onGlyphResponse,
  onQueryResponse,
  onWorkerReady,
}: SearchWorkerCallbacks = {}) => {
  const worker = new Worker(new URL('./search.worker.ts', import.meta.url))

  worker.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
    switch (event?.data?.type) {
      case 'GLYPH_RESPONSE':
        onGlyphResponse?.(event.data.payload.glyph)
        break
      case 'QUERY_RESPONSE':
        onQueryResponse?.(event.data.payload.results)
        break
      case 'WORKER_READY':
        onWorkerReady?.()
        break
      default:
        console.warn('Unknown worker message event:', event)
    }
  })

  const post = (message: ClientMessage) => worker.postMessage(message)
  const requestGlyph = (char: string) => post({ type: 'REQUEST_GLYPH', payload: { char } })
  const requestQuery = (query: string) => post({ type: 'REQUEST_QUERY', payload: { query } })

  return { requestGlyph, requestQuery }
}
