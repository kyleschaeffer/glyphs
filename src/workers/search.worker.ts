import Fuse from 'fuse.js'
import type { Glyph } from '../store/types'
import type { RequestMessage, RespondMessage } from './types'

const post = (message: RespondMessage) => self.postMessage(message)
const respondGlyph = (glyph: Glyph | null) => post({ type: 'RESPOND_GLYPH', payload: { glyph } })
const respondQuery = (results: Glyph[]) => post({ type: 'RESPOND_QUERY', payload: { results } })

self.onmessage = (event: MessageEvent<RequestMessage>) => {
  switch (event?.data?.type) {
    case 'REQUEST_GLYPH':
      respondGlyph(null)
      break
    case 'REQUEST_QUERY':
      respondQuery([])
      break
    default:
      console.warn('Unknown request message event:', event)
  }
}
