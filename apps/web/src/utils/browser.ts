import {
  Glyph,
  assertNonNullable,
  decimalToHtml,
  entityToHtml,
  escapeSingleQuotes,
  utf32ToCss,
  utf32ToHtml,
} from '@glyphs/core'

/**
 * Get system color scheme preference
 */
export function getColorSchemePreference(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export type CSSClassName = string | null | undefined | { [className: string]: boolean | null | undefined }

/**
 * Create a CSS class name utility
 *
 * @param styles Imported style class name obfuscation record
 */
export function bindStyles(styles: { [key: string]: string } = {}) {
  /**
   * Build a CSS class names string
   *
   * @param classNames CSS class names and/or class name conditionals
   */
  return function cx(...classNames: CSSClassName[]): string | undefined {
    const truthyClassNames: string[] = []
    for (const className of classNames) {
      if (!className) continue
      if (typeof className === 'string') {
        truthyClassNames.push(styles[className] ?? className)
        continue
      }
      for (const [classNameKey, classNameValue] of Object.entries(className)) {
        if (!classNameValue) continue
        truthyClassNames.push(styles[classNameKey] ?? classNameKey)
      }
    }
    return truthyClassNames.length ? truthyClassNames.join(' ') : undefined
  }
}

export function decodeHtml(input: string): string {
  const doc = new DOMParser().parseFromString(input, 'text/html')
  return assertNonNullable(doc.documentElement.textContent, 'Failed to decode HTML')
}

const HTML_SPECIAL_CHARS = new Set(['"', "'", '&', '<', '>'])

export function htmlEntities(glyph: Glyph): string[] {
  const entities = []

  if (!HTML_SPECIAL_CHARS.has(glyph.char)) entities.push(decodeHtml(glyph.char))
  if (glyph.entities) glyph.entities.forEach((e) => entities.push(entityToHtml(e)))
  entities.push(glyph.utf32.map(utf32ToHtml).join(''))
  entities.push(glyph.decimals.map(decimalToHtml).join(''))

  return entities
}

export function cssEntities(glyph: Glyph): string[] {
  return [escapeSingleQuotes(decodeHtml(glyph.char)), glyph.utf32.map(utf32ToCss).join('')]
}
