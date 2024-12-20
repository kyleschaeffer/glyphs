import { Glyph } from './glyph'

export type BlockData = {
  /** Block name */
  n: string

  /** Block range */
  r: [number, number]
}

export type Block = {
  /** Block name */
  name: string

  /** Block range */
  range: [number, number]

  /** Glyphs in the block */
  glyphs: Glyph[]
}
