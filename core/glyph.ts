import type { Glyph } from '../store/types'
import { decimalToHtml, entityToHtml, escapeSingleQuotes, utf32ToCss, utf32ToHtml } from './convert'

const HTML_SPECIAL_CHARS = new Set(['"', "'", '&', '<', '>'])

export function htmlEntities(glyph: Glyph): string[] {
  const entities = []

  if (!HTML_SPECIAL_CHARS.has(glyph.c)) entities.push(glyph.c)
  if (glyph.e) glyph.e.forEach((e) => entities.push(entityToHtml(e)))
  if (glyph.h.length <= 2) {
    entities.push(utf32ToHtml(glyph.u))
    entities.push(decimalToHtml(glyph.d))
  }

  return entities
}

export function cssEntities(glyph: Glyph): string[] {
  const entities = [escapeSingleQuotes(glyph.c)]

  if (glyph.h.length <= 2) entities.push(utf32ToCss(glyph.u))

  return entities
}
