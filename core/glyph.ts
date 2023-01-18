import type { Glyph } from '../store/types'

const HTML_SPECIAL_CHARS = new Set(['"', "'", '&', '<', '>'])

export function htmlEntities(glyph: Glyph): string[] {
  const entities = []

  if (!HTML_SPECIAL_CHARS.has(glyph.c)) entities.push(glyph.c)
  if (glyph.e) glyph.e.forEach((e) => entities.push(`&${e};`))
  entities.push(`&#${glyph.d};`)
  if (glyph.h.length === 1) entities.push(`&#x${glyph.h[0]};`)

  return entities
}

export function escapeCssQuotes(str: string): string {
  return str.replace(/'/g, "\\'")
}

export function cssEntities(glyph: Glyph): string[] {
  const entities = [escapeCssQuotes(glyph.c)]

  if (glyph.h.length === 1) entities.push(`\\${glyph.h[0]}`)

  return entities
}

export function unicodeEscapeSequence(glyph: Glyph): string {
  return glyph.h.map((hex) => `\\u${hex}`).join('')
}
