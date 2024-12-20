import { Glyph } from './glyph'

export type Script = {
  /** Script name */
  name: string

  /** Glyphs in the script */
  glyphs: Glyph[]
}
