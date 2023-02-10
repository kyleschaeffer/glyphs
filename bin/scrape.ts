import dotenv from 'dotenv'
import fs from 'fs'
import { IncomingMessage } from 'http'
import https from 'https'
import { decimalToString, hexToDecimal } from '../core/convert'
import { GlyphData, GlyphsFile } from '../store/types'

dotenv.config()

const UNICODE_VERSIONS = ['5.0', '6.0', '7.0', '8.0', '9.0', '10.0', '11.0', '12.0', '13.0', '14.0', '15.0']

// [1]=entity; [2]=decimal
const HTML_ENTITY_DATA_URL = 'https://www.w3.org/TR/html4/sgml/entities.html'
const HTML_ENTITY_DATA_SEARCH = /!ENTITY\s+(\w+)\s+CDATA\s+"&amp;#(\d+)/g

// [1]=utf32; [2]=character; [3]=name; [4]?=keywords
const EMOJI_DATA_SEARCH =
  /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='andr'><a.*?><img alt='(.*?)'.*?<\/td>\n?<td class='name'>(.*?)<\/td>\n?<td class='name'>(.*?)<\/td>/gi

// [1]=utf32; [2]=character; [3]=name
// TODO: categories and groups
const EMOJI_TONE_DATA_SEARCH =
  /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='chars'>(.*?)<\/td>\n?.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n<td class='name'>(.*?)<\/td>/gi

// CSV; 2 columns; [0]=utf32Start; [1]=utf32End; [2]=block
const UNICODE_BLOCK_DATA_SEARCH = /(.*?)(?:\.\.(.*))?;\s(.*?)\n/gim

// CSV; 2 columns; [0]=utf32Start; [1]?=utf32End; [2]=version; [3]?=count; [4]=description
const UNICODE_VERSION_DATA_SEARCH = /(.*?)(?:\.\.(.*))?\s+;\s([\d.]+)\s#\s+(?:\[(\d+)\])?(.*?)\n/gim

const EXCLUDED_GROUPS = ['High Private Use Surrogates', 'High Surrogates', 'Low Surrogates']

const htmlEntities = new Map<number, string[]>()

async function scrape(version: string): Promise<void> {
  const EMOJI_DATA_URL = `https://www.unicode.org/emoji/charts-${version}/emoji-list.html`
  const EMOJI_TONE_DATA_URL = `https://www.unicode.org/emoji/charts-${version}/full-emoji-modifiers.html`
  const UNICODE_BLOCK_DATA_URL = `https://www.unicode.org/Public/${version}.0/ucd/Blocks.txt`
  const UNICODE_VERSION_DATA_URL = `https://www.unicode.org/Public/${version}.0/ucd/DerivedAge.txt`

  // CSV; 14 columns; [0]=utf32; [1]=name; [10]?=keywords
  const UNICODE_DATA_URL = `https://www.unicode.org/Public/${version}.0/ucd/UnicodeData.txt`

  const glyphs = new Map<string, GlyphData>()
  const blocks = new Set<string>()
  const blockMap = new Map<number, number>()
  const versions = new Set<string>()
  const versionMap = new Map<number, number>()

  if (!htmlEntities.size) {
    // Get HTML entity data
    console.log(`GET ${HTML_ENTITY_DATA_URL}`)
    const htmlEntityData = await fetch<string>(HTML_ENTITY_DATA_URL)

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

  function addGlyph(glyph: GlyphData): void {
    const existingGlyph = glyphs.get(glyph.c)
    if (!existingGlyph) {
      glyphs.set(glyph.c, glyph)
      return
    }

    const [, glyphKeywords] = glyphWords(existingGlyph.n, [glyph.n, ...(existingGlyph.k ?? []), ...(glyph.k ?? [])])
    const glyphEntities = Array.from(new Set([...(existingGlyph.e ?? []), ...(glyph.e ?? [])]))

    glyphs.set(glyph.c, {
      ...existingGlyph,
      k: glyphKeywords,
      e: glyphEntities.length ? glyphEntities : undefined,
    })
  }

  // Get Unicode data
  console.log(`GET ${UNICODE_DATA_URL}`)
  const unicodeData = await fetch<string>(UNICODE_DATA_URL)

  // Get Emoji list
  console.log(`GET ${EMOJI_DATA_URL}`)
  const emojiData = await fetch<string>(EMOJI_DATA_URL)

  // Get Emoji tones
  console.log(`GET ${EMOJI_TONE_DATA_URL}`)
  const emojiToneData = await fetch<string>(EMOJI_TONE_DATA_URL)

  // Get Unicode block data
  console.log(`GET ${UNICODE_BLOCK_DATA_URL}`)
  const unicodeBlockData = await fetch<string>(UNICODE_BLOCK_DATA_URL)

  // Get Unicode version data
  console.log(`GET ${UNICODE_VERSION_DATA_URL}`)
  const unicodeVersionData = await fetch<string>(UNICODE_VERSION_DATA_URL)

  // Save Unicode blocks
  let blockMatch = UNICODE_BLOCK_DATA_SEARCH.exec(unicodeBlockData)
  while (blockMatch) {
    const [, utf32Start, utf32End, block] = blockMatch
    const startDecimal = hexToDecimal(utf32Start)
    const endDecimal = hexToDecimal(utf32End)
    blocks.add(block)
    const id = Array.from(blocks).indexOf(block)
    for (let decimal = startDecimal; decimal <= endDecimal; decimal++) {
      blockMap.set(decimal, id)
    }
    blockMatch = UNICODE_BLOCK_DATA_SEARCH.exec(unicodeBlockData)
  }

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

  // Create unicode glyphs
  const rows = unicodeData.split('\n')
  for (const row of rows) {
    const cols = row.split(';')
    if (cols.length < 14 || cols[1] === '<control>') continue
    const [utf32, name, , , , , , , , , keywords] = cols
    const decimal = hexToDecimal(utf32)
    const char = decimalToString(decimal)
    const [glyphName, glyphKeywords] = glyphWords(name, keywords?.replace('&amp;', '&').split(/[,;|]/) ?? [])
    addGlyph({
      c: char,
      n: glyphName,
      k: glyphKeywords,
      e: htmlEntities.get(decimal)?.sort(),
      d: [decimal],
      b: blockMap.get(decimal),
      v: versionMap.get(decimal),
    })
  }

  // Create Emoji glyphs
  let emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
  while (emojiMatch) {
    const [, utf32, char, name, keywords] = emojiMatch
    const decimals = utf32.split(' ').map((u) => hexToDecimal(u.replace(/^U\+/, '')))
    const [glyphName, glyphKeywords] = glyphWords(
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
    const [glyphName, glyphKeywords] = glyphWords(name, [])
    addGlyph({
      c: char,
      n: glyphName,
      k: glyphKeywords,
      d: decimals,
    })
    emojiToneMatch = EMOJI_TONE_DATA_SEARCH.exec(emojiToneData)
  }

  // Write to file
  console.log(`Writing ${glyphs.size} glyphs to file...`)

  const glyphsFile: GlyphsFile = {
    glyphs: Array.from(glyphs.values()),
    blocks: Array.from(blocks),
    versions: Array.from(versions),
  }

  fs.writeFileSync(`public/glyphs/${version}.json`, JSON.stringify(glyphsFile), { flag: 'w' })
}

/**
 * Perform a GET request to the given URL and return the response as text
 *
 * @param url Fetch URL
 */
async function fetch<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const { hostname, pathname } = new URL(url)
    const req = https.request(
      {
        method: 'GET',
        hostname,
        path: pathname,
        port: 443,
      },
      (res: IncomingMessage) => {
        let data = ''
        res.on('data', (d: string) => (data += d.toString()))
        res.on('end', () => resolve(data as T))
      }
    )
    req.on('error', reject)
    req.end()
  })
}

/**
 * Capitalize the first letter in a string
 *
 * @param str String to modify
 */
function sentenceCase(str: string): string {
  return str.length ? `${str[0].toUpperCase()}${str.toLowerCase().slice(1)}` : str
}

/**
 * Transform a string to title case
 *
 * @param str String to modify
 */
function titleCase(str: string): string {
  return str
    .split(/[\s-]/)
    .filter((w) => w.length)
    .map((_word) => _word.split('.').map(sentenceCase).join('.'))
    .join(' ')
}

/**
 * Sanitize a word string
 *
 * @param word Word string
 */
function sanitizeWord(word: string): string {
  return word.replace(/&amp;/gi, '&').replace(/⊛/gi, '').replace(/^</, '').replace(/>$/, '').trim().toLowerCase()
}

/**
 * Get deduped glyph name and keywords
 *
 * @param name     Glyph name; additional names will be merged into keywords
 * @param keywords Keywords, comma-, semicolon-, or pipe-separated
 */
function glyphWords(name: string, keywords: string[]): [name: string, keywords: string[] | undefined] {
  const [glyphName, ...additionalNames] = name
    .replace('&amp;', '&')
    .split(/[,;|]/)
    .map(sanitizeWord)
    .filter((w) => w.length)
  const glyphKeywords = new Set([...additionalNames, ...keywords].map(sanitizeWord).filter((w) => w.length))
  glyphKeywords.delete(glyphName)
  return [titleCase(glyphName), glyphKeywords.size ? Array.from(glyphKeywords) : undefined]
}

;(async () => {
  for (const version of UNICODE_VERSIONS) {
    await scrape(version)
  }
})()
