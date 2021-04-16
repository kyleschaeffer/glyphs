import fs from 'fs'
import https from 'https'

import * as config from '../scripts/config.js'
import * as convert from '../scripts/convert.js'

// CSV; 14 columns; [0]=hex; [1]=name; [10]?=keywords
const UNICODE_DATA_URL = `https://www.unicode.org/Public/${config.UNICODE_VERSION}/ucd/UnicodeData.txt`

// [1]=hex; [2]=name; [3]=entities
const HTML_ENTITY_DATA_URL = 'https://dev.w3.org/html5/html-author/charref'
const HTML_ENTITY_DATA_SEARCH = /<tr title="U\+(.*?) (.*?)".*?<td class="named"><code>(.*?)<\/code>/gi

// [1]=unicode; [2]=character; [3]=name; [4]?=keywords
const EMOJI_DATA_URL = `https://www.unicode.org/emoji/charts-${config.UNICODE_VERSION_SHORT}/emoji-list.html`
const EMOJI_DATA_SEARCH = /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='andr'><a.*?><img alt='(.*?)'.*?<\/td>\n?<td class='name'>(.*?)<\/td>\n?<td class='name'>(.*?)<\/td>/gi

// [1]=hex; [2]=character; [3]=name
const EMOJI_TONE_DATA_URL = `https://www.unicode.org/emoji/charts-${config.UNICODE_VERSION_SHORT}/full-emoji-modifiers.html`
const EMOJI_TONE_DATA_SEARCH = /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='chars'>(.*?)<\/td>\n?.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n<td class='name'>(.*?)<\/td>/gi

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
  /** @type {[char: string, glyph: Glyph][]} */
  const glyphs = []

  /** @type {Map<number, string>} */
  const entities = new Map()

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
    const char = convert.decimalToStr(decimal)

    glyphs.push([
      char,
      {
        u: unicode,
        h: convert.hexStrToHexes(unicode).join(' '),
        n: (name || keywords).replace(/&amp;/gi, '&').replace(/⊛ /gi, ''),
        k: name && keywords && name !== keywords ? keywords.replace(/&amp;/gi, '&') : undefined,
        e: entities.get(decimal),
      },
    ])
  }

  // Create Emoji glyphs
  let emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
  while (emojiMatch) {
    const [, unicode, char, name, keywords] = emojiMatch
    const hexes = convert.strToHexes(char).join(' ')

    glyphs.push([
      char,
      {
        u: unicode.replace(/U\+/g, ''),
        h: hexes,
        n: name.replace(/&amp;/gi, '&').replace(/⊛ /gi, ''),
        k: name !== keywords.replace(/ \| /g, ',') ? keywords.replace(/ \| /g, ',').replace(/&amp;/gi, '&') : undefined,
      },
    ])

    emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
  }

  // Create Emoji tone glyphs
  let emojiToneMatch = EMOJI_TONE_DATA_SEARCH.exec(emojiToneData)
  while (emojiToneMatch) {
    const [, unicode, char, name] = emojiToneMatch
    const hexes = convert.strToHexes(char).join(' ')

    // Create glyph
    glyphs.push([
      char,
      {
        u: unicode.replace(/U\+/g, ''),
        h: hexes,
        n: name.replace(/&amp;/gi, '&').replace(/⊛ /gi, ''),
      },
    ])

    emojiToneMatch = EMOJI_TONE_DATA_SEARCH.exec(emojiToneData)
  }

  // Write to file
  console.log(`Writing ${Object.keys(glyphs).length} glyphs to file...`)
  fs.writeFileSync(`src/glyphs/${config.UNICODE_VERSION}.json`, JSON.stringify(glyphs), { flag: 'w' })
}

scrape()
