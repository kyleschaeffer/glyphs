export type Glyph = {
  /**
   * Glyph character
   */
  c: string

  /**
   * UTF-32 decimal value
   */
  d: string

  /**
   * UTF-32 hexadecimal encoding
   */
  u: string

  /**
   * UTF-16 hexadecimal encoding(s); space-separated
   */
  h: string

  /**
   * Glyph name(s); comma-separated
   */
  n: string

  /**
   * Glyph category name(s); comma-separated
   */
  g?: string

  /**
   * Keyword phrases; comma-separated
   */
  k?: string

  /**
   * HTML entity names; space-separated
   */
  e?: string

  /**
   * Unicode version
   */
  v?: string
}
