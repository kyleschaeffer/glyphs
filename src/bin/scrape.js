const dotenv = require('dotenv')
const fs = require('fs')
const https = require('https')
const { decimalToHex, decimalToString, decimalToUtf16, hexToDecimal, stringToUtf16 } = require('../core/convert.js')

/**
 * @typedef Glyph
 * @prop {string} c   Glyph character
 * @prop {string} d   UTF-32 decimal value
 * @prop {string} u   UTF-32 hexadecimal encoding
 * @prop {string} h   UTF-16 hexadecimal encoding(s); space-separated
 * @prop {string} n   Glyph name(s); comma-separated
 * @prop {string} [g] Glyph category name(s); comma-separated
 * @prop {string} [k] Keyword phrases; comma-separated
 * @prop {string} [e] HTML entity names; space-separated
 * @prop {string} [v] Unicode version
 */

dotenv.config()

const UNICODE_VERSION = process.env.UNICODE_VERSION ?? ''
if (!UNICODE_VERSION) throw new Error('Unicode version not defined')

// CSV; 14 columns; [0]=hex32; [1]=name; [10]?=keywords
const UNICODE_DATA_URL = `https://www.unicode.org/Public/${UNICODE_VERSION}.0/ucd/UnicodeData.txt`

// [1]=hex32; [2]=name; [3]=entities
const HTML_ENTITY_DATA_URL = 'https://dev.w3.org/html5/html-author/charref'
const HTML_ENTITY_DATA_SEARCH = /<tr title="U\+(.*?) (.*?)".*?<td class="named"><code>(.*?)<\/code>/gi

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

/**
 * Perform a GET request to the given URL and return the response as text
 *
 * @param   {string}          url Fetch URL
 * @returns {Promise<string>}
 */
const fetch = async (url) => {
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

const scrape = async () => {
  /** @type {Map<string, Glyph>} */
  const glyphs = new Map()

  /** @type {Map<number, string>} */
  const entities = new Map()

  /** @type {Map<number, string>} */
  const blocks = new Map()

  /** @type {Map<number, string>} */
  const versions = new Map()

  /**
   * Add or merge new glyph data
   * @param {Glyph} glyph Glyph
   */
  const addGlyph = (glyph) => {
    const existingGlyph = glyphs.get(glyph.c)
    if (!existingGlyph) {
      const glyphNames = [...new Set([...glyph.n.split(',')])].join(',')
      const glyphGroups = [...new Set([...(glyph.g?.split(',') ?? [])])].join(',')
      const glyphKeywords = [...new Set([...(glyph.k?.split(',') ?? [])])]
        .filter((k) => !glyphNames.split(',').includes(k))
        .join(',')
      const glyphEntities = [...new Set([...(glyph.e?.split(' ') ?? [])])].join(' ')
      glyphs.set(glyph.c, {
        ...glyph,
        n: glyphNames,
        g: glyphGroups.length ? glyphGroups : undefined,
        k: glyphKeywords.length ? glyphKeywords : undefined,
        e: glyphEntities.length ? glyphEntities : undefined,
      })
    } else {
      if (existingGlyph.u !== glyph.u)
        console.warn(`Unicode diff for character "${glyph.c}": "${existingGlyph.u}" vs. "${glyph.u}"`)
      if (existingGlyph.h !== glyph.h)
        console.warn(`Hexadecimal diff for character "${glyph.c}": "${existingGlyph.h}" vs. "${glyph.h}"`)
      if (existingGlyph.v !== glyph.v)
        console.warn(`Version diff for character "${glyph.c}": "${existingGlyph.v}" vs. "${glyph.v}"`)
      const glyphNames = [...new Set([...existingGlyph.n.split(','), ...glyph.n.split(',')])].join(',')
      const glyphGroups = [...new Set([...(existingGlyph.g?.split(',') ?? []), ...(glyph.g?.split(',') ?? [])])].join(
        ','
      )
      const glyphKeywords = [...new Set([...(existingGlyph.k?.split(',') ?? []), ...(glyph.k?.split(',') ?? [])])]
        .filter((k) => !glyphNames.split(',').includes(k))
        .join(',')
      const glyphEntities = [...new Set([...(existingGlyph.e?.split(' ') ?? []), ...(glyph.e?.split(' ') ?? [])])].join(
        ' '
      )
      glyphs.set(glyph.c, {
        ...existingGlyph,
        n: glyphNames,
        g: glyphGroups.length ? glyphGroups : undefined,
        k: glyphKeywords.length ? glyphKeywords : undefined,
        e: glyphEntities.length ? glyphEntities : undefined,
      })
    }
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
    const [, hex32, , entityNames] = entityMatch
    const decimal = hexToDecimal(hex32)
    entities.set(decimal, entityNames.replace(/&amp;/g, '&').replace(/&/g, '').replace(/;/g, ''))
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
    addGlyph({
      c: char,
      d: decimal.toString(),
      u: decimalToHex(decimal),
      h: decimalToUtf16(decimal).join(' '),
      n: (name || keywords)
        .replace(/&amp;/gi, '&')
        .replace(/⊛ /gi, '')
        .replace(/^</, '')
        .replace(/>$/, '')
        .toLowerCase(),
      g: blocks.get(decimal),
      k: name && keywords && name !== keywords ? keywords.replace(/&amp;/gi, '&').toLowerCase() : undefined,
      e: entities.get(decimal),
      v: versions.get(decimal),
    })
  }

  // Create Emoji glyphs
  let emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
  while (emojiMatch) {
    const [, hex32, char, name, keywords] = emojiMatch
    const decimal = hexToDecimal(hex32.replace(/U\+/g, ''))
    addGlyph({
      c: char,
      d: decimal.toString(),
      u: decimalToHex(decimal),
      h: stringToUtf16(char).join(' '),
      n: name.replace(/&amp;/gi, '&').replace(/⊛ /gi, '').toLowerCase(),
      g: blocks.get(decimal),
      k:
        name !== keywords.replace(/ \| /g, ',')
          ? keywords
              .replace(/ \| /g, ',')
              .replace(/&amp;/gi, '&')
              .replace(/<span class='keye'>/gi, '')
              .replace(/<\/span>/gi, '')
              .toLowerCase()
          : undefined,
      v: versions.get(decimal),
    })
    emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
  }

  // Create Emoji tone glyphs
  let emojiToneMatch = EMOJI_TONE_DATA_SEARCH.exec(emojiToneData)
  while (emojiToneMatch) {
    const [, hex32, char, name] = emojiToneMatch
    const decimal = hexToDecimal(hex32.replace(/U\+/g, ''))
    addGlyph({
      c: char,
      d: decimal.toString(),
      u: decimalToHex(decimal),
      h: stringToUtf16(char).join(' '),
      n: name.replace(/&amp;/gi, '&').replace(/⊛ /gi, '').toLowerCase(),
      g: blocks.get(decimal),
      v: versions.get(decimal),
    })
    emojiToneMatch = EMOJI_TONE_DATA_SEARCH.exec(emojiToneData)
  }

  // Write to file
  console.log(`Writing ${glyphs.size} glyphs to file...`)
  fs.writeFileSync(`public/glyphs/${UNICODE_VERSION}.json`, JSON.stringify([...glyphs.values()]), { flag: 'w' })
}

scrape()
