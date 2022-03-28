export type Glyph = {
  /**
   * Unicode value
   */
  u: string

  /**
   * Hexadecimal values (separated by spaces)
   */
  h: string

  /**
   * Glyph name
   */
  n: string

  /**
   * Keyword phrases (separated by commas)
   */
  k?: string

  /**
   * HTML entity names (separated by spaces)
   */
  e?: string
}

export type GlyphsData = [char: string, glyph: Glyph][]
