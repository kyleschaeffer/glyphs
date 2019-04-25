const chalk = require('chalk')
const fetch = require('node-fetch')
const fs = require('fs')
const utility = require('../src/utility')

const scrape = async function() {
  // Init glyphs array
  const glyphs = []

  // Get unicode data (semi-colon separated w/ 14 columns)
  console.log(`${chalk.green('GET')} ${chalk.underline('https://www.unicode.org/Public/11.0.0/ucd/UnicodeData.txt')}`)
  const unicodeData = await fetch('https://www.unicode.org/Public/11.0.0/ucd/UnicodeData.txt').then(r => r.text())

  // Get HTML entity data
  console.log(`${chalk.green('GET')} ${chalk.underline('https://dev.w3.org/html5/html-author/charref')}`)
  const entityData = await fetch('https://dev.w3.org/html5/html-author/charref').then(r => r.text())

  // Get Emoji list
  console.log(`${chalk.green('GET')} ${chalk.underline('https://www.unicode.org/emoji/charts-11.0/emoji-list.html')}`)
  const emojiData = await fetch('https://www.unicode.org/emoji/charts-11.0/emoji-list.html').then(r => r.text())

  // Get Emoji tones
  console.log(`${chalk.green('GET')} ${chalk.underline('https://www.unicode.org/emoji/charts-11.0/full-emoji-modifiers.html')}`)
  const emojiToneData = await fetch('https://www.unicode.org/emoji/charts-11.0/full-emoji-modifiers.html').then(r => r.text())

  // Process entities
  const entities = []
  const entitiesSearch = /<tr title="U\+(.*?) (.*?)".*?<td class="named"><code>(.*?)<\/code>/ig
  let entityMatch = entitiesSearch.exec(entityData)
  while (entityMatch) {
    // Get decimal
    const decimal = parseInt(entityMatch[1], 16)

    // Save entities
    entities[decimal] = entityMatch[3].replace(/&amp;/g, '&').replace(/&/g, '').replace(/;/g, '')

    // Next
    entityMatch = entitiesSearch.exec(entityData)
  }

  // Process unicode
  const rows = unicodeData.split('\n')
  for (let row of rows) {
    // Parse columns
    const cols = row.split(';')
    if (cols.length < 14) continue

    // Disregard <control> characters
    if (cols[1] == '<control>') continue

    // Get hex array
    const hexes = utility.hexStrToHexes(cols[0])

    // Get decimal value
    const d = parseInt(cols[0], 16)

    // Get character
    const c = utility.decimalToStr(d)

    // Create glyph
    const glyph = {
      c,
      u: cols[0],
      h: hexes.join(' '),
      n: `${cols[1] ? cols[1] : cols[10]}`,
    }

    // Add keywords
    if (cols[1] && cols[10] && cols[1] !== cols[10]) {
      glyph.k = cols[10]
    }

    // Add entities
    if (entities[d]) {
      glyph.e = entities[d]
    }

    // Add glyph
    glyphs.push(glyph)
  }

  // Process Emoji
  const emojiSearch = /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='andr'><a.*?><img alt='(.*?)'.*?<\/td>\n?<td class='name'>(.*?)<\/td>\n?<td class='name'>(.*?)<\/td>/ig
  let emojiMatch = emojiSearch.exec(emojiData)
  while (emojiMatch) {
    // Get character
    const c = emojiMatch[2]

    // Get hexes
    const hexes = utility.strToHexes(c)

    // Create glyph
    const glyph = {
      c,
      u: emojiMatch[1].replace(/U\+/g, ''),
      h: hexes.join(' '),
      n: emojiMatch[3],
    }

    // Add keywords
    const keywords = emojiMatch[4].replace(/ \| /g, ',')
    if (glyph.n !== keywords) {
      glyph.k = keywords
    }

    // Add glyph
    glyphs.push(glyph)

    // Next
    emojiMatch = emojiSearch.exec(emojiData)
  }

  // Process Emoji skin tones
  const emojiToneSearch = /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='chars'>(.*?)<\/td>\n?.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n<td class='name'>(.*?)<\/td>/ig
  let emojiToneMatch = emojiToneSearch.exec(emojiToneData)
  while (emojiToneMatch) {
    // Get character
    const c = emojiToneMatch[2]

    // Get hexes
    const hexes = utility.strToHexes(c)

    // Create glyph
    const glyph = {
      c,
      u: emojiToneMatch[1].replace(/U\+/g, ''),
      h: hexes.join(' '),
      n: emojiToneMatch[3],
    }

    // Add glyph
    glyphs.push(glyph)

    // Next
    emojiToneMatch = emojiToneSearch.exec(emojiToneData)
  }

  // Process glyphs
  const knownGlyphs = []
  const duplicateGlyphs = []
  for (let i = 0; i < glyphs.length; i++) {
    // Fix &amp; in names
    if (glyphs[i].n) glyphs[i].n = glyphs[i].n.replace(/&amp;/ig, '&')
    if (glyphs[i].k) glyphs[i].k = glyphs[i].k.replace(/&amp;/ig, '&')

    // Remove asterisk
    if (glyphs[i].n) glyphs[i].n = glyphs[i].n.replace(/⊛ /ig, '')

    // Check for duplicates
    if (knownGlyphs.indexOf(glyphs[i].c) !== -1) duplicateGlyphs.push(i)
    else knownGlyphs.push(glyphs[i].c)
  }

  // Remove duplicates
  for (let i = 0; i < duplicateGlyphs.length; i++) {
    glyphs.splice(duplicateGlyphs[i] - i, 1)
  }

  // Write to file
  console.log(`Writing ${chalk.cyan.bold(glyphs.length)} glyphs to file...`)
  fs.writeFileSync('docs/glyphs/unicode-11.0.0.json', JSON.stringify({glyphs}), { flag: 'w' })
}

scrape()
