import { Glyph } from '../types/glyphs'

const IGNORED_KEYWORDS = ['an', 'and', 'as', 'at', 'in', 'is', 'it', 'of', 'to']

const transformKeyword = (keyword: string) =>
  keyword
    .replace(/[-:.]/, ' ')
    .replace(/\s{2,}/, ' ')
    .replace(/[^\w\s]/, '')
    .trim()
    .toLowerCase()

const searchIndex = new Map<string, Set<string>>()

export const buildIndex = (glyphs: Map<string, Glyph>): void => {
  for (const [char, glyph] of glyphs.entries()) {
    searchIndex.set(char, new Set([char]))

    const keywords = new Set(
      [
        ...glyph.u.split(' '),
        ...glyph.h.split(' '),
        glyph.n,
        ...(glyph.k?.split(',') ?? []),
        ...(glyph.e ? [glyph.e] : []),
        ...(glyph.e?.split(' ') ?? []),
      ].map(transformKeyword)
    )

    Array.from(keywords)
      .filter((k) => k.indexOf(' ') !== -1)
      .forEach((phrase) =>
        phrase
          .split(' ')
          .filter((k) => k.length)
          .forEach((k) => keywords.add(k))
      )

    for (const keyword of keywords) {
      if (!keyword || keyword.length <= 1 || IGNORED_KEYWORDS.includes(keyword)) continue

      const indexedKeywords = searchIndex.get(keyword) ?? new Set()
      indexedKeywords.add(char)
      searchIndex.set(keyword, indexedKeywords)
    }
  }
}

export const search = (query: string): string[] => {
  if (!query.length) return []

  const results: Set<string> = new Set()

  const keywords = [query, ...transformKeyword(query).split(' ')]
  for (const keyword of keywords) {
    const matchingGlyphs = searchIndex.get(keyword)
    if (!matchingGlyphs) continue

    for (const matchingGlyph of matchingGlyphs) {
      results.add(matchingGlyph)
    }
  }

  return Array.from(results)
}
