import type { Glyph } from '../store/types'

type WorkerMessage<T extends string = string, P = {}> = {
  type: T
  payload: P
}

export type RequestGlyphMessage = WorkerMessage<'REQUEST_GLYPH', { char: string }>
export type RequestQueryMessage = WorkerMessage<'REQUEST_QUERY', { query: string | null }>
export type RequestMessage = RequestGlyphMessage | RequestQueryMessage

export type RespondGlyphMessage = WorkerMessage<'RESPOND_GLYPH', { glyph: Glyph | null }>
export type RespondQueryMessage = WorkerMessage<'RESPOND_QUERY', { results: Glyph[] }>
export type RespondMessage = RespondGlyphMessage | RespondQueryMessage
