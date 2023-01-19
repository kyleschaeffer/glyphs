import type Fuse from 'fuse.js'
import type { Glyph } from '../store/types'

type Message<T extends string = string, P = {}> = {
  type: T
  payload: P
}

export type SearchResult = Fuse.FuseResult<Glyph>

export type RequestGlyphMessage = Message<'REQUEST_GLYPH', { char: string }>
export type RequestQueryMessage = Message<'REQUEST_QUERY', { query: string }>
export type ClientMessage = RequestGlyphMessage | RequestQueryMessage

export type GlyphResponseMessage = Message<'GLYPH_RESPONSE', { glyph: Glyph | null }>
export type QueryResponseMessage = Message<'QUERY_RESPONSE', { results: SearchResult[] }>
export type WorkerReadyMessage = Message<'WORKER_READY', { count: number }>
export type WorkerMessage = GlyphResponseMessage | QueryResponseMessage | WorkerReadyMessage
