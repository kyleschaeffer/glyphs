import dotenv from 'dotenv'
import fs from 'fs'
import https from 'https'
import { decimalToStr, hexStrToHexes, strToHexes } from '../core/convert.js'

/**
 * @typedef Glyph
 * @prop {string} c Glyph character
 * @prop {string} u Space-separated Unicode values
 * @prop {string} h Space-separated hexadecimal values
 * @prop {string} n Comma-separated glyph names
 * @prop {string} [k] Comma-separated glyph keyword phrases
 * @prop {string} [e] Space-separated HTML entity names
 */

dotenv.config()

const UNICODE_VERSION = process.env.UNICODE_VERSION ?? ''
const UNICODE_VERSION_SHORT = process.env.UNICODE_VERSION_SHORT ?? ''
if (!UNICODE_VERSION || !UNICODE_VERSION_SHORT) throw new Error('Unicode version not defined')

// CSV; 14 columns; [0]=hex; [1]=name; [10]?=keywords
const UNICODE_DATA_URL = `https://www.unicode.org/Public/${UNICODE_VERSION}/ucd/UnicodeData.txt`

// [1]=hex; [2]=name; [3]=entities
const HTML_ENTITY_DATA_URL = 'https://dev.w3.org/html5/html-author/charref'
const HTML_ENTITY_DATA_SEARCH = /<tr title="U\+(.*?) (.*?)".*?<td class="named"><code>(.*?)<\/code>/gi

// [1]=unicode; [2]=character; [3]=name; [4]?=keywords
const EMOJI_DATA_URL = `https://www.unicode.org/emoji/charts-${UNICODE_VERSION_SHORT}/emoji-list.html`
const EMOJI_DATA_SEARCH =
  /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='andr'><a.*?><img alt='(.*?)'.*?<\/td>\n?<td class='name'>(.*?)<\/td>\n?<td class='name'>(.*?)<\/td>/gi

// [1]=hex; [2]=character; [3]=name
const EMOJI_TONE_DATA_URL = `https://www.unicode.org/emoji/charts-${UNICODE_VERSION_SHORT}/full-emoji-modifiers.html`
const EMOJI_TONE_DATA_SEARCH =
  /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='chars'>(.*?)<\/td>\n?.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n<td class='name'>(.*?)<\/td>/gi

/**
 * Perform a GET request to the given URL and return the response as text
 *
 * @param   {string}          url Fetch URL
 * @returns {Promise<string>}
 */
const getUrl = async (url) => {
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

  /**
   * Add or merge new glyph data
   * @param {string} c Glyph character
   * @param {string} u Space-separated Unicode values
   * @param {string} h Space-separated hexadecimal values
   * @param {string} n Comma-separated glyph names
   * @param {string} [k] Comma-separated glyph keyword phrases
   * @param {string} [e] Space-separated HTML entity names
   */
  const addGlyph = (c, u, h, n, k, e) => {
    const existingGlyph = glyphs.get(c)
    if (!existingGlyph) {
      glyphs.set(c, { c, u, h, n, k, e })
    } else {
      const keywords = [...new Set([...(existingGlyph.k?.split(',') ?? []), ...(k?.split(',') ?? [])])].join(',')
      const entities = [...new Set([...(existingGlyph.e?.split(' ') ?? []), ...(e?.split(' ') ?? [])])].join(' ')
      glyphs.set(c, {
        c,
        u: existingGlyph.u,
        h: existingGlyph.h,
        n: [...new Set([...existingGlyph.n.split(','), n])].join(','),
        k: keywords.length ? keywords : undefined,
        e: entities.length ? entities : undefined,
      })
      if (existingGlyph.u !== u) console.warn(`Unicode diff for character "${c}": "${existingGlyph.u}" vs. "${u}"`)
      if (existingGlyph.h !== h) console.warn(`Hexadecimal diff for character "${c}": "${existingGlyph.h}" vs. "${h}"`)
    }
  }

  // Get unicode data (semi-colon separated w/ 14 columns)
  console.log(`GET ${UNICODE_DATA_URL}`)
  const unicodeData = await getUrl(UNICODE_DATA_URL)

  // Get HTML entity data
  console.log(`GET ${HTML_ENTITY_DATA_URL}`)
  const entityData = await getUrl(HTML_ENTITY_DATA_URL)

  // Get Emoji list
  console.log(`GET ${EMOJI_DATA_URL}`)
  const emojiData = await getUrl(EMOJI_DATA_URL)

  // Get Emoji tones
  console.log(`GET ${EMOJI_TONE_DATA_URL}`)
  const emojiToneData = await getUrl(EMOJI_TONE_DATA_URL)

  // Save HTML entities
  let entityMatch = HTML_ENTITY_DATA_SEARCH.exec(entityData)
  while (entityMatch) {
    entities.set(
      parseInt(entityMatch[1], 16),
      entityMatch[3].replace(/&amp;/g, '&').replace(/&/g, '').replace(/;/g, '')
    )
    entityMatch = HTML_ENTITY_DATA_SEARCH.exec(entityData)
  }

  // Create unicode glyphs
  const rows = unicodeData.split('\n')
  for (const row of rows) {
    const cols = row.split(';')
    if (cols.length < 14 || cols[1] === '<control>') continue

    const [unicode, name, , , , , , , , , keywords] = cols
    const decimal = parseInt(unicode, 16)
    const char = decimalToStr(decimal)

    addGlyph(
      char,
      unicode,
      hexStrToHexes(unicode).join(' '),
      (name || keywords).replace(/&amp;/gi, '&').replace(/⊛ /gi, '').toLowerCase(),
      name && keywords && name !== keywords ? keywords.replace(/&amp;/gi, '&').toLowerCase() : undefined,
      entities.get(decimal)
    )
  }

  // Create Emoji glyphs
  let emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
  while (emojiMatch) {
    const [, unicode, char, name, keywords] = emojiMatch
    const hexes = strToHexes(char).join(' ')

    addGlyph(
      char,
      unicode.replace(/U\+/g, ''),
      hexes,
      name.replace(/&amp;/gi, '&').replace(/⊛ /gi, '').toLowerCase(),
      name !== keywords.replace(/ \| /g, ',')
        ? keywords.replace(/ \| /g, ',').replace(/&amp;/gi, '&').toLowerCase()
        : undefined
    )

    emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
  }

  // Create Emoji tone glyphs
  let emojiToneMatch = EMOJI_TONE_DATA_SEARCH.exec(emojiToneData)
  while (emojiToneMatch) {
    const [, unicode, char, name] = emojiToneMatch
    const hexes = strToHexes(char).join(' ')

    // Create glyph
    addGlyph(char, unicode.replace(/U\+/g, ''), hexes, name.replace(/&amp;/gi, '&').replace(/⊛ /gi, '').toLowerCase())

    emojiToneMatch = EMOJI_TONE_DATA_SEARCH.exec(emojiToneData)
  }

  // Write to file
  console.log(`Writing ${glyphs.size} glyphs to file...`)
  fs.writeFileSync(`public/glyphs/${UNICODE_VERSION}.json`, JSON.stringify([...glyphs.values()]), { flag: 'w' })
}

scrape()
