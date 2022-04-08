import type { Glyph } from '../store/types'
import type { RequestMessage, RespondMessage } from './types'

export type SearchWorkerCallbacks = {
  onGlyphResponse?: (glyph: Glyph | null) => void
  onQueryResponse?: (results: Glyph[]) => void
}

export const registerSearchWorker = ({ onGlyphResponse, onQueryResponse }: SearchWorkerCallbacks = {}) => {
  const worker = new Worker(new URL('../workers/search.worker.ts', import.meta.url))

  worker.addEventListener('message', (event: MessageEvent<RespondMessage>) => {
    switch (event?.data?.type) {
      case 'RESPOND_GLYPH':
        onGlyphResponse?.(event.data.payload.glyph)
        break
      case 'RESPOND_QUERY':
        onQueryResponse?.(event.data.payload.results)
        break
      default:
        console.warn('Unknown respond message event:', event)
    }
  })

  const post = (message: RequestMessage) => worker.postMessage(message)
  const requestGlyph = (char: string) => post({ type: 'REQUEST_GLYPH', payload: { char } })
  const requestQuery = (query: string | null) => post({ type: 'REQUEST_QUERY', payload: { query } })

  return { requestGlyph, requestQuery }
}
