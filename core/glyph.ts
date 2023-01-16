import type { Glyph } from '../store/types'

const HTML_SPECIAL_CHARS = ['"', "'", '&', '<', '>']

export function htmlEntities(glyph: Glyph): string[] {
  const entities = []

  if (!HTML_SPECIAL_CHARS.includes(glyph.c)) entities.push(glyph.c)

  if (glyph.e) glyph.e.split(' ').forEach((e) => entities.push(`&${e};`))

  const hexes = glyph.h.split(' ')
  if (glyph.u.split(' ').length === 1) entities.push(`&#${parseInt(glyph.u, 16)};`)
  if (hexes.length === 1) entities.push(`&#x${glyph.h};`)

  return entities
}

export function cssEntities(glyph: Glyph): string[] {
  const entities = [glyph.c]

  if (glyph.h.split(' ').length === 1) entities.push(`\\${glyph.h}`)

  return entities
}

export function escapeCssQuotes(str: string): string {
  return str.replace(/'/g, "\\'")
}

export function escapedHex16(glyph: Glyph): string {
  return glyph.h
    .split(' ')
    .map((hex) => `\\u${hex}`)
    .join('')
}

export function escapedHex32(glyph: Glyph): string {
  const json = JSON.stringify(glyph.c)
  return json.substring(1, json.length - 1)
}

export function decimalValues(glyph: Glyph): number[] {
  return glyph.u.split(' ').map((u) => parseInt(u, 16))
}
