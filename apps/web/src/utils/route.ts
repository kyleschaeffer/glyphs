import { log } from '@glyphs/core'

export function glyphRoute(char: string): string {
  try {
    const route = `/${encodeURIComponent(char).replace('.', 'period')}`
    return route
  } catch (e) {
    log.warn(e instanceof Error ? e.message : 'Failed to encode glyph route')
    return '/error'
  }
}
