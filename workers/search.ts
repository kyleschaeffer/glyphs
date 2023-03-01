import type { Glyph } from '../store/types'
import type { ClientMessage, WorkerMessage, SearchResult } from './types'

export type SearchWorkerCallbacks = {
  onBlockResponse?: (block: string | null, glyphs: Glyph[]) => void
  onGlyphResponse?: (glyph: Glyph | null, related: (Glyph | null)[]) => void
  onQueryResponse?: (results: SearchResult[]) => void
  onWorkerReady?: (count: number) => void
}

export const registerSearchWorker = ({
  onBlockResponse,
  onGlyphResponse,
  onQueryResponse,
  onWorkerReady,
}: SearchWorkerCallbacks = {}) => {
  const worker = new Worker(new URL('./search.worker.ts', import.meta.url))

  worker.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
    switch (event?.data?.type) {
      case 'BLOCK_RESPONSE':
        onBlockResponse?.(event.data.payload.block, event.data.payload.glyphs)
        break
      case 'GLYPH_RESPONSE':
        onGlyphResponse?.(event.data.payload.glyph, event.data.payload.related)
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
  const requestBlock = (block: string) => post({ type: 'REQUEST_BLOCK', payload: { block } })
  const requestGlyph = (char: string) => post({ type: 'REQUEST_GLYPH', payload: { char } })
  const requestQuery = (query: string) => post({ type: 'REQUEST_QUERY', payload: { query } })

  return { requestBlock, requestGlyph, requestQuery }
}
