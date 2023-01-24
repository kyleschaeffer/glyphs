const dotenv = require('dotenv')
const fs = require('fs')
const https = require('https')
const { decimalToString, decimalToUtf16, decimalToUtf32, hexToDecimal, stringToUtf16 } = require('../core/convert.js')

/**
 * @typedef Glyph
 * @prop {string}   c   Glyph character
 * @prop {number[]} d   UTF-32 decimal values
 * @prop {string[]} u   UTF-32 hexadecimal encodings
 * @prop {string[]} h   UTF-16 hexadecimal encodings
 * @prop {string}   n   Glyph name
 * @prop {string}   [g] Glyph category name
 * @prop {string[]} [k] Keyword phrases
 * @prop {string[]} [e] HTML entity names
 * @prop {string}   [v] Unicode version
 */

dotenv.config()

const UNICODE_VERSION = process.env.UNICODE_VERSION ?? ''
if (!UNICODE_VERSION) throw new Error('Unicode version not defined')

// CSV; 14 columns; [0]=hex32; [1]=name; [10]?=keywords
const UNICODE_DATA_URL = `https://www.unicode.org/Public/${UNICODE_VERSION}.0/ucd/UnicodeData.txt`

// [1]=entity; [2]=hex32A; [3]=hex32B
const HTML_ENTITY_DATA_URL = 'https://html.spec.whatwg.org/multipage/named-characters.html'
const HTML_ENTITY_DATA_SEARCH = /<code>(\w+);?<\/code>(?:.*?)<td> U\+([\d\w]+)(?: U\+([\d\w]+))?/gi

// [1]=hex32; [2]=character; [3]=name; [4]?=keywords
const EMOJI_DATA_URL = `https://www.unicode.org/emoji/charts-${UNICODE_VERSION}/emoji-list.html`
const EMOJI_DATA_SEARCH =
  /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='andr'><a.*?><img alt='(.*?)'.*?<\/td>\n?<td class='name'>(.*?)<\/td>\n?<td class='name'>(.*?)<\/td>/gi

// [1]=hex32; [2]=character; [3]=name
// TODO: categories and groups
const EMOJI_TONE_DATA_URL = `https://www.unicode.org/emoji/charts-${UNICODE_VERSION}/full-emoji-modifiers.html`
const EMOJI_TONE_DATA_SEARCH =
  /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='chars'>(.*?)<\/td>\n?.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n<td class='name'>(.*?)<\/td>/gi

// CSV; 2 columns; [0]=hex32Start; [1]=hex32End; [2]=block
const UNICODE_BLOCK_DATA_URL = `https://www.unicode.org/Public/${UNICODE_VERSION}.0/ucd/Blocks.txt`
const UNICODE_BLOCK_DATA_SEARCH = /(.*?)(?:\.\.(.*))?;\s(.*?)\n/gim

// CSV; 2 columns; [0]=hex32Start; [1]?=hex32End; [2]=version; [3]?=count; [4]=description
const UNICODE_VERSION_DATA_URL = `https://www.unicode.org/Public/${UNICODE_VERSION}.0/ucd/DerivedAge.txt`
const UNICODE_VERSION_DATA_SEARCH = /(.*?)(?:\.\.(.*))?\s+;\s([\d.]+)\s#\s+(?:\[(\d+)\])?(.*?)\n/gim

const EXCLUDED_GROUPS = ['High Private Use Surrogates', 'High Surrogates', 'Low Surrogates']

/**
 * Perform a GET request to the given URL and return the response as text
 *
 * @param   {string}          url Fetch URL
 * @returns {Promise<string>}
 */
async function fetch(url) {
  return new Promise((resolve, reject) => {
    const { hostname, pathname } = new URL(url)
    const req = https.request(
      {
        method: 'GET',
        hostname,
        path: pathname,
        port: 443,
      },
      (res) => {
        let data = ''
        res.on('data', (d) => (data += d.toString()))
        res.on('end', () => resolve(data))
      }
    )
    req.on('error', reject)
    req.end()
  })
}

/**
 * Capitalize the first letter in a string
 *
 * @param   {string} str String to modify
 * @returns {string}
 */
function sentenceCase(str) {
  return str.length ? `${str[0].toUpperCase()}${str.toLowerCase().slice(1)}` : str
}

/**
 * Transform a string to title case
 *
 * @param   {string} str String to modify
 * @returns {string}
 */
function titleCase(str) {
  return str
    .split(/[\s-]/)
    .filter((w) => w.length)
    .map((_word) => _word.split('.').map(sentenceCase).join('.'))
    .join(' ')
}

/**
 * Sanitize a word string
 *
 * @param   {string} word Word string
 * @returns {string}
 */
function sanitizeWord(word) {
  return word.replace(/&amp;/gi, '&').replace(/⊛/gi, '').replace(/^</, '').replace(/>$/, '').trim().toLowerCase()
}

/**
 * Get deduped glyph name and keywords
 *
 * @param   {string}   name     Glyph name; additional names will be merged into keywords
 * @param   {string[]} keywords Keywords, comma-, semicolon-, or pipe-separated
 * @returns {[name: string, keywords: string[] | undefined]}
 */
function glyphWords(name, keywords) {
  const [glyphName, ...additionalNames] = name
    .replace('&amp;', '&')
    .split(/[,;|]/)
    .map(sanitizeWord)
    .filter((w) => w.length)
  const glyphKeywords = new Set([...additionalNames, ...keywords].map(sanitizeWord).filter((w) => w.length))
  glyphKeywords.delete(glyphName)
  return [titleCase(glyphName), glyphKeywords.size ? [...glyphKeywords] : undefined]
}

async function scrape() {
  /** @type {Map<string, Glyph>} */
  const glyphs = new Map()

  /** @type {Map<number, string[]>} */
  const entities = new Map()

  /** @type {Map<number, string>} */
  const blocks = new Map()

  /** @type {Map<number, string>} */
  const versions = new Map()

  /**
   * Add or merge new glyph data
   * @param {Glyph} glyph Glyph
   */
  function addGlyph(glyph) {
    if (EXCLUDED_GROUPS.includes(glyph.g)) return

    const existingGlyph = glyphs.get(glyph.c)
    if (!existingGlyph) {
      glyphs.set(glyph.c, glyph)
      return
    }

    const [, glyphKeywords] = glyphWords(existingGlyph.n, [glyph.n, ...(existingGlyph.k ?? []), ...(glyph.k ?? [])])
    const glyphEntities = [...new Set([...(existingGlyph.e ?? []), ...(glyph.e ?? [])])]
    glyphs.set(glyph.c, {
      ...existingGlyph,
      k: glyphKeywords,
      e: glyphEntities.length ? glyphEntities : undefined,
    })
  }

  // Get Unicode data
  console.log(`GET ${UNICODE_DATA_URL}`)
  const unicodeData = await fetch(UNICODE_DATA_URL)

  // Get HTML entity data
  console.log(`GET ${HTML_ENTITY_DATA_URL}`)
  const entityData = await fetch(HTML_ENTITY_DATA_URL)

  // Get Emoji list
  console.log(`GET ${EMOJI_DATA_URL}`)
  const emojiData = await fetch(EMOJI_DATA_URL)

  // Get Emoji tones
  console.log(`GET ${EMOJI_TONE_DATA_URL}`)
  const emojiToneData = await fetch(EMOJI_TONE_DATA_URL)

  // Get Unicode block data
  console.log(`GET ${UNICODE_BLOCK_DATA_URL}`)
  const unicodeBlockData = await fetch(UNICODE_BLOCK_DATA_URL)

  // Get Unicode version data
  console.log(`GET ${UNICODE_VERSION_DATA_URL}`)
  const unicodeVersionData = await fetch(UNICODE_VERSION_DATA_URL)

  // Save HTML entities
  let entityMatch = HTML_ENTITY_DATA_SEARCH.exec(entityData)
  while (entityMatch) {
    const [, entityName, hex32A, hex32B] = entityMatch
    const hexes = [hex32A, hex32B].filter((hex) => hex !== undefined)
    hexes.forEach((hex) => {
      const decimal = hexToDecimal(hex)
      const decimalEntities = entities.get(decimal) ?? []
      if (!decimalEntities.includes(entityName)) entities.set(decimal, [...decimalEntities, entityName])
    })
    entityMatch = HTML_ENTITY_DATA_SEARCH.exec(entityData)
  }

  // Save Unicode blocks
  let blockMatch = UNICODE_BLOCK_DATA_SEARCH.exec(unicodeBlockData)
  while (blockMatch) {
    const [, hex32Start, hex32End, block] = blockMatch
    const startDecimal = hexToDecimal(hex32Start)
    const endDecimal = hexToDecimal(hex32End)
    for (let decimal = startDecimal; decimal <= endDecimal; decimal++) {
      blocks.set(decimal, block)
    }
    blockMatch = UNICODE_BLOCK_DATA_SEARCH.exec(unicodeBlockData)
  }

  // Save Unicode versions
  let versionMatch = UNICODE_VERSION_DATA_SEARCH.exec(unicodeVersionData)
  while (versionMatch) {
    const [, hex32Start, hex32End, version] = versionMatch
    const startDecimal = hexToDecimal(hex32Start)
    const endDecimal = hex32End ? hexToDecimal(hex32End) : startDecimal
    for (let decimal = startDecimal; decimal <= endDecimal; decimal++) {
      versions.set(decimal, version)
    }
    versionMatch = UNICODE_VERSION_DATA_SEARCH.exec(unicodeVersionData)
  }

  // Create unicode glyphs
  const rows = unicodeData.split('\n')
  for (const row of rows) {
    const cols = row.split(';')
    if (cols.length < 14 || cols[1] === '<control>') continue
    const [hex32, name, , , , , , , , , keywords] = cols
    const decimal = hexToDecimal(hex32)
    const char = decimalToString(decimal)
    const [glyphName, glyphKeywords] = glyphWords(name, keywords?.replace('&amp;', '&').split(/[,;|]/) ?? [])
    addGlyph({
      c: char,
      d: [decimal],
      u: [decimalToUtf32(decimal)],
      h: decimalToUtf16(decimal),
      n: glyphName,
      g: blocks.get(decimal),
      k: glyphKeywords,
      e: entities.get(decimal)?.sort(),
      v: versions.get(decimal),
    })
  }

  // Create Emoji glyphs
  let emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
  while (emojiMatch) {
    const [, hex32, char, name, keywords] = emojiMatch
    const decimals = hex32.split(' ').map((h) => hexToDecimal(h.replace(/^U\+/, '')))
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
      d: decimals,
      u: decimals.map(decimalToUtf32),
      h: stringToUtf16(char),
      n: glyphName,
      g: blocks.get(decimals[0]),
      k: glyphKeywords,
      v: decimals.map((d) => versions.get(d)).sort((a, b) => parseFloat(b) - parseFloat(a))[0],
    })
    emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
  }

  // Create Emoji tone glyphs
  let emojiToneMatch = EMOJI_TONE_DATA_SEARCH.exec(emojiToneData)
  while (emojiToneMatch) {
    const [, hex32, char, name] = emojiToneMatch
    const decimals = hex32.split(' ').map((h) => hexToDecimal(h.replace(/^U\+/, '')))
    const [glyphName, glyphKeywords] = glyphWords(name, [])
    addGlyph({
      c: char,
      d: decimals,
      u: decimals.map(decimalToUtf32),
      h: stringToUtf16(char),
      n: glyphName,
      g: blocks.get(decimals[0]),
      k: glyphKeywords,
      v: decimals.map((d) => versions.get(d)).sort((a, b) => parseFloat(b) - parseFloat(a))[0],
    })
    emojiToneMatch = EMOJI_TONE_DATA_SEARCH.exec(emojiToneData)
  }

  // Write to file
  console.log(`Writing ${glyphs.size} glyphs to file...`)
  fs.writeFileSync(`public/glyphs/${UNICODE_VERSION}.json`, JSON.stringify([...glyphs.values()]), { flag: 'w' })
}

scrape()
