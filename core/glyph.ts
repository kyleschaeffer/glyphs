import type { Glyph } from '../store/types'
import { decimalToHtml, entityToHtml, escapeSingleQuotes, utf32ToCss, utf32ToHtml } from './convert'

const HTML_SPECIAL_CHARS = new Set(['"', "'", '&', '<', '>'])

export function glyphRoute(char: string): string {
  try {
    const route = `/${encodeURIComponent(char)}`
    return route
  } catch (e) {
    console.warn(e)
    return '/error'
  }
}

export function htmlEntities(glyph: Glyph): string[] {
  const entities = []

  if (!HTML_SPECIAL_CHARS.has(glyph.c)) entities.push(glyph.c)
  if (glyph.e) glyph.e.forEach((e) => entities.push(entityToHtml(e)))
  entities.push(glyph.u.map(utf32ToHtml).join(''))
  entities.push(glyph.d.map(decimalToHtml).join(''))

  return entities
}

export function cssEntities(glyph: Glyph): string[] {
  return [escapeSingleQuotes(glyph.c), glyph.u.map(utf32ToCss).join('')]
}
