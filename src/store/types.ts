export type Glyph = {
  /**
   * Glyph character
   */
  c: string

  /**
   * Space-separated Unicode values
   */
  u: string

  /**
   * Space-separated hexadecimal values
   */
  h: string

  /**
   * Comma-separated glyph names
   */
  n: string

  /**
   * Comma-separated keyword phrases
   */
  k?: string

  /**
   * Space-separated HTML entity names
   */
  e?: string
}
