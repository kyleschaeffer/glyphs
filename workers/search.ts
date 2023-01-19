import type { Glyph } from '../store/types'
import type { ClientMessage, WorkerMessage, SearchResult } from './types'

export type SearchWorkerCallbacks = {
  onGlyphResponse?: (glyph: Glyph | null) => void
  onInspectResponse?: (glyphs: (Glyph | null)[]) => void
  onQueryResponse?: (results: SearchResult[]) => void
  onWorkerReady?: (count: number) => void
}

export const registerSearchWorker = ({
  onGlyphResponse,
  onInspectResponse,
  onQueryResponse,
  onWorkerReady,
}: SearchWorkerCallbacks = {}) => {
  const worker = new Worker(new URL('./search.worker.ts', import.meta.url))

  worker.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
    switch (event?.data?.type) {
      case 'GLYPH_RESPONSE':
        onGlyphResponse?.(event.data.payload.glyph)
        break
      case 'INSPECT_RESPONSE':
        onInspectResponse?.(event.data.payload.glyphs)
        break
      case 'QUERY_RESPONSE':
        onQueryResponse?.(event.data.payload.results)
        break
      case 'WORKER_READY':
        onWorkerReady?.(event.data.payload.count)
        break
      default:
        console.warn('Unknown worker message event:', event)
    }
  })

  const post = (message: ClientMessage) => worker.postMessage(message)
  const requestGlyph = (char: string) => post({ type: 'REQUEST_GLYPH', payload: { char } })
  const requestInspect = (query: string) => post({ type: 'REQUEST_INSPECT', payload: { query } })
  const requestQuery = (query: string) => post({ type: 'REQUEST_QUERY', payload: { query } })

  return { requestGlyph, requestInspect, requestQuery }
}
