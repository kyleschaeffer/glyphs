import { Block, Glyph, Script } from '@glyphs/core'

type Message<T extends string = string, P = Record<string, unknown>> = { type: T; payload: P }

export type BlockRequestMessage = Message<'BLOCK_REQUEST', { slug: string }>
export type GlyphRequestMessage = Message<'GLYPH_REQUEST', { char: string }>
export type QueryRequestMessage = Message<'QUERY_REQUEST', { query: string }>
export type ScriptRequestMessage = Message<'SCRIPT_REQUEST', { slug: string }>
export type ClientRequestMessage =
  | BlockRequestMessage
  | GlyphRequestMessage
  | QueryRequestMessage
  | ScriptRequestMessage

export type BlockResponseMessage = Message<'BLOCK_RESPONSE', { block: Block | null }>
export type GlyphResponseMessage = Message<
  'GLYPH_RESPONSE',
  { block: Block | null; glyph: Glyph | null; ligature: Glyph[] }
>
export type QueryResponseMessage = Message<'QUERY_RESPONSE', { results: Glyph[] }>
export type ScriptResponseMessage = Message<'SCRIPT_RESPONSE', { script: Script | null }>
export type WorkerReadyMessage = Message<
  'WORKER_READY',
  { blocks: [slug: string, label: string][]; count: number; scripts: [slug: string, label: string][] }
>
export type WorkerResponseMessage =
  | BlockResponseMessage
  | GlyphResponseMessage
  | QueryResponseMessage
  | ScriptResponseMessage
  | WorkerReadyMessage
