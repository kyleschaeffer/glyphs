import chalk from 'chalk'
import fs from 'fs'
import fetch from 'node-fetch'

import { UNICODE_VERSION, UNICODE_VERSION_SHORT } from '../config/unicode'
import { Glyph } from '../types/glyphs'
import * as convert from '../utils/convert'

// CSV; 14 columns; [0]=hex; [1]=name; [10]?=keywords
const UNICODE_DATA_URL = `https://www.unicode.org/Public/${UNICODE_VERSION}/ucd/UnicodeData.txt`

// [1]=hex; [2]=name; [3]=entities
const HTML_ENTITY_DATA_URL = 'https://dev.w3.org/html5/html-author/charref'
const HTML_ENTITY_DATA_SEARCH = /<tr title="U\+(.*?) (.*?)".*?<td class="named"><code>(.*?)<\/code>/gi

// [1]=unicode; [2]=character; [3]=name; [4]?=keywords
const EMOJI_DATA_URL = `https://www.unicode.org/emoji/charts-${UNICODE_VERSION_SHORT}/emoji-list.html`
const EMOJI_DATA_SEARCH = /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='andr'><a.*?><img alt='(.*?)'.*?<\/td>\n?<td class='name'>(.*?)<\/td>\n?<td class='name'>(.*?)<\/td>/gi

// [1]=hex; [2]=character; [3]=name
const EMOJI_TONE_DATA_URL = `https://www.unicode.org/emoji/charts-${UNICODE_VERSION_SHORT}/full-emoji-modifiers.html`
const EMOJI_TONE_DATA_SEARCH = /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='chars'>(.*?)<\/td>\n?.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n<td class='name'>(.*?)<\/td>/gi

const scrape = async () => {
  const glyphs: [char: string, glyph: Glyph][] = []

  // Get unicode data (semi-colon separated w/ 14 columns)
  console.log(`${chalk.green('GET')} ${chalk.underline(UNICODE_DATA_URL)}`)
  const unicodeData = await fetch(UNICODE_DATA_URL).then((r) => r.text())

  // Get HTML entity data
  console.log(`${chalk.green('GET')} ${chalk.underline(HTML_ENTITY_DATA_URL)}`)
  const entityData = await fetch(HTML_ENTITY_DATA_URL).then((r) => r.text())

  // Get Emoji list
  console.log(`${chalk.green('GET')} ${chalk.underline(EMOJI_DATA_URL)}`)
  const emojiData = await fetch(EMOJI_DATA_URL).then((r) => r.text())

  // Get Emoji tones
  console.log(`${chalk.green('GET')} ${chalk.underline(EMOJI_TONE_DATA_URL)}`)
  const emojiToneData = await fetch(EMOJI_TONE_DATA_URL).then((r) => r.text())

  // Save HTML entities
  const entities = new Map<number, string>()
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
        n: (name ?? keywords).replace(/&amp;/gi, '&').replace(/⊛ /gi, ''),
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
  console.log(`Writing ${chalk.cyan.bold(Object.keys(glyphs).length)} glyphs to file...`)
  fs.writeFileSync(`src/glyphs/${UNICODE_VERSION}.json`, JSON.stringify(glyphs), { flag: 'w' })
}

scrape()
