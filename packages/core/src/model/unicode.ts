import { BlockData } from './block'
import { GlyphData } from './glyph'

export const UNICODE_VERSIONS = [
  '5.0',
  '6.0',
  '7.0',
  '8.0',
  '9.0',
  '10.0',
  '11.0',
  '12.0',
  '13.0',
  '14.0',
  '15.0',
  '16.0',
] as const

export type UnicodeVersion = (typeof UNICODE_VERSIONS)[number]

export type UnicodeData = {
  /** Glyph data */
  g: GlyphData[]

  /** Unicode blocks */
  b: BlockData[]

  /** Unicode script names */
  s: string[]

  /** Unicode version numbers */
  v: UnicodeVersion[]
}
