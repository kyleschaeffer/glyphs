import dotenv from 'dotenv'
import fs from 'fs'
import { decimalToString, hexToDecimal } from '../core/convert'
import { mergeKeywords, sanitizeWord, titleCase } from '../core/lang'
import { GlyphData, GlyphsFile } from '../store/types'
import {
  EMOJI_DATA_SEARCH,
  EMOJI_TONE_DATA_SEARCH,
  EXCLUDED_BLOCKS,
  HTML_ENTITY_DATA_SEARCH,
  HTML_ENTITY_DATA_URL,
  UNICODE_BLOCK_DATA_SEARCH,
  UNICODE_VERSION_DATA_SEARCH,
  UNICODE_VERSION_DATA_URL,
  UNICODE_VERSIONS,
} from './config'

dotenv.config()

const htmlEntities = new Map<number, string[]>()
const versions = new Set<string>()
const versionMap = new Map<number, number>()
const appearedVersions = new Map<string, number>()

async function scrape(version: string): Promise<void> {
  const EMOJI_DATA_URL = `https://www.unicode.org/emoji/charts-${version}/emoji-list.html`
  const EMOJI_TONE_DATA_URL = `https://www.unicode.org/emoji/charts-${version}/full-emoji-modifiers.html`
  const UNICODE_BLOCK_DATA_URL = `https://www.unicode.org/Public/${version}.0/ucd/Blocks.txt`

  // CSV; 14 columns; [0]=utf32; [1]=name; [10]?=keywords
  const UNICODE_DATA_URL = `https://www.unicode.org/Public/${version}.0/ucd/UnicodeData.txt`

  const glyphs = new Map<string, GlyphData>()
  const blocks = new Set<string>()
  const blockMap = new Map<number, number | null>()

  if (!htmlEntities.size) {
    // Get HTML entity data
    console.log(`GET ${HTML_ENTITY_DATA_URL}`)
    const htmlEntityData = await (await fetch(HTML_ENTITY_DATA_URL)).text()

    let entityMatch = HTML_ENTITY_DATA_SEARCH.exec(htmlEntityData)
    while (entityMatch) {
      const [, entityName, code] = entityMatch
      const decimal = parseInt(code)
      if (isNaN(decimal)) {
        console.warn(`Non-decimal HTML entity value: "${code}"`)
        continue
      }
      const decimalEntities = htmlEntities.get(decimal) ?? []
      if (!decimalEntities.includes(entityName)) htmlEntities.set(decimal, [...decimalEntities, entityName])
      entityMatch = HTML_ENTITY_DATA_SEARCH.exec(htmlEntityData)
    }
  }

  if (!versions.size) {
    // Get Unicode version data
    console.log(`GET ${UNICODE_VERSION_DATA_URL}`)
    const unicodeVersionData = await (await fetch(UNICODE_VERSION_DATA_URL)).text()

    // Save Unicode versions
    let versionMatch = UNICODE_VERSION_DATA_SEARCH.exec(unicodeVersionData)
    while (versionMatch) {
      const [, utf32Start, utf32End, version] = versionMatch
      const startDecimal = hexToDecimal(utf32Start)
      const endDecimal = utf32End ? hexToDecimal(utf32End) : startDecimal
      versions.add(version)
      const id = Array.from(versions).indexOf(version)
      for (let decimal = startDecimal; decimal <= endDecimal; decimal++) {
        versionMap.set(decimal, id)
      }
      versionMatch = UNICODE_VERSION_DATA_SEARCH.exec(unicodeVersionData)
    }
  }

  function addGlyph(glyph: GlyphData): void {
    const existingGlyph = glyphs.get(glyph.c)

    if (glyph.v === undefined && existingGlyph?.v === undefined) {
      // Unicode includes some newer data in the 5.0 dataset, so we’ll use version data from the first character if
      // available when crawling 5.0 data
      let appearedVersion = version === '5.0' ? versionMap.get(glyph.d[0]) : appearedVersions.get(glyph.c)

      // Glyph appeared this version
      if (appearedVersion === undefined) {
        appearedVersion = Array.from(versions).indexOf(version)
        appearedVersions.set(glyph.c, appearedVersion)
      }

      glyph.v = appearedVersion
    }

    if (!existingGlyph) {
      glyphs.set(glyph.c, glyph)
      return
    }

    const [, glyphKeywords] = mergeKeywords(existingGlyph.n, [glyph.n, ...(existingGlyph.k ?? []), ...(glyph.k ?? [])])
    const glyphEntities = Array.from(new Set([...(existingGlyph.e ?? []), ...(glyph.e ?? [])]))

    glyphs.set(glyph.c, {
      ...existingGlyph,
      k: glyphKeywords,
      e: glyphEntities.length ? glyphEntities : undefined,
    })
  }

  // Get Unicode data
  console.log(`GET ${UNICODE_DATA_URL}`)
  const unicodeData = await (await fetch(UNICODE_DATA_URL)).text()

  // Get Emoji list
  console.log(`GET ${EMOJI_DATA_URL}`)
  const emojiData = await (await fetch(EMOJI_DATA_URL)).text()

  // Get Emoji tones
  console.log(`GET ${EMOJI_TONE_DATA_URL}`)
  const emojiToneData = await (await fetch(EMOJI_TONE_DATA_URL)).text()

  // Get Unicode block data
  console.log(`GET ${UNICODE_BLOCK_DATA_URL}`)
  const unicodeBlockData = await (await fetch(UNICODE_BLOCK_DATA_URL)).text()

  // Save Unicode blocks
  let blockMatch = UNICODE_BLOCK_DATA_SEARCH.exec(unicodeBlockData)
  while (blockMatch) {
    const [, utf32Start, utf32End, block] = blockMatch
    const startDecimal = hexToDecimal(utf32Start)
    const endDecimal = hexToDecimal(utf32End)
    const excluded = EXCLUDED_BLOCKS.includes(block)
    if (!excluded) blocks.add(block)
    const id = excluded ? null : Array.from(blocks).indexOf(block)
    for (let decimal = startDecimal; decimal <= endDecimal; decimal++) {
      blockMap.set(decimal, id)
    }
    blockMatch = UNICODE_BLOCK_DATA_SEARCH.exec(unicodeBlockData)
  }

  // Create unicode glyphs
  const rows = unicodeData.split('\n')
  for (const row of rows) {
    const cols = row.split(';')
    if (cols.length < 14 || cols[1] === '<control>') continue
    const [utf32, name, , , , , , , , , keywords] = cols
    const decimal = hexToDecimal(utf32)
    const block = blockMap.get(decimal)
    if (block === null) continue
    const char = decimalToString(decimal)
    const [glyphName, glyphKeywords] = mergeKeywords(name, keywords?.replace('&amp;', '&').split(/[,;|]/) ?? [])
    addGlyph({
      c: char,
      n: glyphName,
      k: glyphKeywords,
      e: htmlEntities.get(decimal)?.sort(),
      d: [decimal],
      b: block,
      v: versionMap.get(decimal),
    })
  }

  // Create Emoji glyphs
  let emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
  while (emojiMatch) {
    const [, utf32, char, name, keywords] = emojiMatch
    const decimals = utf32.split(' ').map((u) => hexToDecimal(u.replace(/^U\+/, '')))
    const [glyphName, glyphKeywords] = mergeKeywords(
      name,
      keywords
        .replace(/<span class='keye'>/gi, '')
        .replace(/<\/span>/gi, '')
        .replace('&amp;', '&')
        .split(/[,;|]/)
    )
    addGlyph({
      c: char,
      n: glyphName,
      k: glyphKeywords,
      d: decimals,
    })
    emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
  }

  // Create Emoji tone glyphs
  let emojiToneMatch = EMOJI_TONE_DATA_SEARCH.exec(emojiToneData)
  while (emojiToneMatch) {
    const [, utf32, char, name] = emojiToneMatch
    const decimals = utf32.split(' ').map((u) => hexToDecimal(u.replace(/^U\+/, '')))
    const [glyphName, glyphKeywords] = mergeKeywords(name, [])
    addGlyph({
      c: char,
      n: glyphName,
      k: glyphKeywords,
      d: decimals,
    })
    emojiToneMatch = EMOJI_TONE_DATA_SEARCH.exec(emojiToneData)
  }

  // Write to file
  console.log(`Writing ${glyphs.size} glyphs to ${version}.json...`)

  const glyphsFile: GlyphsFile = {
    glyphs: Array.from(glyphs.values()),
    blocks: Array.from(blocks),
    versions: Array.from(versions),
  }

  fs.writeFileSync(`public/glyphs/${version}.json`, JSON.stringify(glyphsFile), { flag: 'w' })
}

;(async () => {
  for (const version of UNICODE_VERSIONS) {
    await scrape(version)
  }
})()
