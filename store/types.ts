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

  /** UTF-8 binary encodings */
  binary: string[]

  /** Unicode block name */
  block?: string

  /** Unicode version */
  version?: string
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

  /** Block index */
  b?: number

  /** Version index */
  v?: number
}

export type GlyphsFile = {
  /** Glyph data */
  glyphs: GlyphData[]

  /** Unicode block names */
  blocks: string[]

  /** Unicode version numbers */
  versions: string[]
}
