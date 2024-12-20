import { UnicodeVersion } from './unicode'

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
  version?: UnicodeVersion

  /** Ligature characters this glyph is used in */
  ligatures?: string[]
}
