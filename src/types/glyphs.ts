export type Glyph = {
  /**
   * Unicode value
   */
  u: string

  /**
   * Space-separated hexadecimal values
   */
  h: string

  /**
   * Glyph name
   */
  n: string

  /**
   * Comma-separated glyph keyword phrases
   */
  k?: string

  /**
   * Space-separated HTML entity names
   */
  e?: string
}
