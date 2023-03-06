import type Fuse from 'fuse.js'
import type { Glyph } from '../store/types'

type Message<T extends string = string, P = {}> = {
  type: T
  payload: P
}

export type SearchResult = Fuse.FuseResult<Glyph>

export type RequestBlockMessage = Message<'REQUEST_BLOCK', { block: string }>
export type RequestGlyphMessage = Message<'REQUEST_GLYPH', { char: string }>
export type RequestQueryMessage = Message<'REQUEST_QUERY', { query: string }>
export type RequestScriptMessage = Message<'REQUEST_SCRIPT', { script: string }>
export type ClientMessage = RequestBlockMessage | RequestGlyphMessage | RequestQueryMessage | RequestScriptMessage

export type BlockResponseMessage = Message<'BLOCK_RESPONSE', { block: string | null; glyphs: Glyph[] }>
export type GlyphResponseMessage = Message<'GLYPH_RESPONSE', { glyph: Glyph | null; related: (Glyph | null)[] }>
export type QueryResponseMessage = Message<'QUERY_RESPONSE', { results: SearchResult[] }>
export type ScriptResponseMessage = Message<'SCRIPT_RESPONSE', { script: string | null; glyphs: Glyph[] }>
export type WorkerReadyMessage = Message<'WORKER_READY', { count: number }>
export type WorkerMessage =
  | BlockResponseMessage
  | GlyphResponseMessage
  | QueryResponseMessage
  | ScriptResponseMessage
  | WorkerReadyMessage
