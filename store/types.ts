export type Glyph = {
  /**
   * Glyph character
   */
  c: string

  /**
   * UTF-32 decimal value
   */
  d: number

  /**
   * UTF-32 hexadecimal encoding
   */
  u: string

  /**
   * UTF-16 hexadecimal encodings
   */
  h: string[]

  /**
   * Glyph name
   */
  n: string

  /**
   * Glyph category name
   */
  g?: string

  /**
   * Keyword phrases
   */
  k?: string[]

  /**
   * HTML entity names
   */
  e?: string[]

  /**
   * Unicode version
   */
  v?: string
}
