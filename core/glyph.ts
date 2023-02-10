import type { Glyph } from '../store/types'
import { decimalToHtml, entityToHtml, escapeSingleQuotes, utf32ToCss, utf32ToHtml } from './convert'

const HTML_SPECIAL_CHARS = new Set(['"', "'", '&', '<', '>'])

export function glyphRoute(char: string): string {
  try {
    const route = `/${encodeURIComponent(char).replace('.', 'period')}`
    return route
  } catch (e) {
    console.warn(e)
    return '/error'
  }
}

export function htmlEntities(glyph: Glyph): string[] {
  const entities = []

  if (!HTML_SPECIAL_CHARS.has(glyph.char)) entities.push(glyph.char)
  if (glyph.entities) glyph.entities.forEach((e) => entities.push(entityToHtml(e)))
  entities.push(glyph.utf32.map(utf32ToHtml).join(''))
  entities.push(glyph.decimals.map(decimalToHtml).join(''))

  return entities
}

export function cssEntities(glyph: Glyph): string[] {
  return [escapeSingleQuotes(glyph.char), glyph.utf32.map(utf32ToCss).join('')]
}
