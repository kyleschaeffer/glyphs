type Message<T extends string = string, P = {}> = { type: T; payload: P }

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
export type GlyphResponseMessage = Message<'GLYPH_RESPONSE', { glyph: Glyph | null; ligature: Glyph[] }>
export type QueryResponseMessage = Message<'QUERY_RESPONSE', { results: Glyph[] }>
export type ScriptResponseMessage = Message<'SCRIPT_RESPONSE', { script: Script | null }>
export type WorkerReadyMessage = Message<'WORKER_READY', { count: number }>
export type WorkerResponseMessage =
  | BlockResponseMessage
  | GlyphResponseMessage
  | QueryResponseMessage
  | ScriptResponseMessage
  | WorkerReadyMessage

export type Glyph = {
  /** Glyph character */
  char: string

  /** Glyph name */
  name: string

  /** Keyword phrases */
  keywords?: string[]

  /** HTML entity names */
  entities?: string[]

  /** UTF-32 decimal values */
  decimals: number[]

  /** UTF-32 hexadecimal encodings */
  utf32: string[]

  /** UTF-16 hexadecimal encodings */
  utf16: string[]

  /** UTF-8 hexadecimal encodings */
  utf8: string[]

  /** Unicode block slug ID */
  block?: string

  /** Unicode script slug ID */
  script?: string

  /** Unicode version */
  version?: string

  /** Ligature characters this glyph is used in */
  ligatures?: string[]
}

export type Block = {
  /** Block name */
  name: string

  /** Block range */
  range: [number, number]

  /** Glyphs in the block */
  glyphs: Glyph[]
}

export type Script = {
  /** Script name */
  name: string

  /** Glyphs in the script */
  glyphs: Glyph[]
}

export type GlyphData = {
  /** Glyph character */
  c: string

  /** Glyph name */
  n: string

  /** Keyword phrases */
  k?: string[]

  /** HTML entity names */
  e?: string[]

  /** UTF-32 decimal values  */
  d: number[]

  /** Script index */
  s?: number

  /** Version index */
  v?: number

  /** Ligatures */
  l?: string[]
}

export type BlockData = {
  /** Block name */
  n: string

  /** Block range */
  r: [number, number]
}

export type GlyphsFile = {
  /** Glyph data */
  glyphs: GlyphData[]

  /** Unicode blocks */
  blocks: BlockData[]

  /** Unicode script names */
  scripts: string[]

  /** Unicode version numbers */
  versions: string[]
}
