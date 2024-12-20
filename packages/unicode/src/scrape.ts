#!/usr/bin/env bun
import {
  BlockData,
  GlyphData,
  UNICODE_VERSIONS,
  UnicodeData,
  UnicodeVersion,
  decimalToString,
  hexToDecimal,
  log,
  mergeKeywords,
} from '@glyphs/core'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { parseArgs } from 'util'

const versions = parseArgs({
  args: Bun.argv,
  options: {
    versions: {
      type: 'string',
      short: 'v',
    },
  },
  allowPositionals: true,
})
  .values.versions?.split(',')
  .map((v) => `${v}.0` as UnicodeVersion)

const scrapeVersions = versions?.length ? versions : UNICODE_VERSIONS

/** Glyphs from these blocks will not be included in the data set */
const EXCLUDED_BLOCKS = ['Block Name', 'High Private Use Surrogates', 'High Surrogates', 'Low Surrogates', 'No_Block']

/** [1]=entity; [2]=decimal */
const HTML_ENTITY_DATA_URL = 'https://www.w3.org/TR/html4/sgml/entities.html'
const HTML_ENTITY_DATA_SEARCH = /!ENTITY\s+(\w+)\s+CDATA\s+"&amp;#(\d+)/g

/** [1]=utf32; [2]=character; [3]=name; [4]?=keywords */
const EMOJI_DATA_SEARCH =
  /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='andr'><a.*?><img alt='(.*?)'.*?<\/td>\n?<td class='name'>(.*?)<\/td>\n?<td class='name'>(.*?)<\/td>/gi

/** [1]=utf32; [2]=character; [3]=name */
const EMOJI_MODIFIER_DATA_SEARCH =
  /<tr><td class='rchars'>\d+<\/td>\n?<td class='code'><a.*?>(.*?)<\/a><\/td>\n?<td class='chars'>(.*?)<\/td>\n?.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n<td class='name'>(.*?)<\/td>/gi

/** CSV; 2 columns; [0]=utf32Start; [1]=utf32End; [2]=block */
const UNICODE_BLOCK_DATA_SEARCH = /(.*?)(?:\.\.(.*))?;\s(.*?)\n/gm

/** CSV; 3 columns; [0]=utf32Start; [1]?=utf32End; [2]=name */
const UNICODE_SCRIPT_DATA_SEARCH = /^([\w]+)(?:\.\.([\w]+))?\s+;\s+(\w+)/gm

/** CSV; 2 columns; [0]=utf32Start; [1]?=utf32End; [2]=version; [3]?=count; [4]=description */
const UNICODE_VERSION_DATA_URL = `https://www.unicode.org/Public/15.0.0/ucd/DerivedAge.txt`
const UNICODE_VERSION_DATA_SEARCH = /(.*?)(?:\.\.(.*))?\s+;\s([\d.]+)\s#\s+(?:\[(\d+)\])?(.*?)\n/gm

async function main() {
  const htmlEntities = new Map<number, string[]>()
  const versions = new Set<string>()
  const versionMap = new Map<number, number>()
  const appearedVersions = new Map<string, number>()

  log.info(`\nScraping Unicode versions: ${scrapeVersions.map((v) => chalk.green(v)).join(', ')}`)

  for (const version of scrapeVersions) {
    const dataFilePath = path.resolve(import.meta.dir, `../data/${version}.json`)

    const emojiDataUrl = `https://www.unicode.org/emoji/charts-${version}/emoji-list.html`
    const emojiModifierDataUrl = `https://www.unicode.org/emoji/charts-${version}/full-emoji-modifiers.html`
    const unicodeBlockDataUrl = `https://www.unicode.org/Public/${version}.0/ucd/Blocks.txt`
    const unicodeScriptDataUrl = `https://www.unicode.org/Public/${version}.0/ucd/Scripts.txt`

    // CSV; 14 columns; [0]=utf32; [1]=name; [10]?=keywords
    const unicodeDataUrl = `https://www.unicode.org/Public/${version}.0/ucd/UnicodeData.txt`

    const glyphs = new Map<string, GlyphData>()
    const ligatures = new Map<string, string[]>()
    const blocks = new Map<string, BlockData>()
    const scripts = new Set<string>()
    const scriptMap = new Map<number, number>()

    if (!htmlEntities.size) {
      log.info('\n🌐 Creating HTML entity map…')
      log.info(`   ${chalk.gray('HTML entity data:')} ${chalk.blue(HTML_ENTITY_DATA_URL)}`)

      // Get HTML entity data
      const htmlEntityData = await (await fetch(HTML_ENTITY_DATA_URL)).text()

      let entityMatch = HTML_ENTITY_DATA_SEARCH.exec(htmlEntityData)
      while (entityMatch) {
        const [, entityName, code] = entityMatch
        const decimal = parseInt(code!)
        if (isNaN(decimal)) continue
        const decimalEntities = htmlEntities.get(decimal) ?? []
        if (entityName && !decimalEntities.includes(entityName)) {
          htmlEntities.set(decimal, [...decimalEntities, entityName])
        }

        entityMatch = HTML_ENTITY_DATA_SEARCH.exec(htmlEntityData)
      }
    }

    if (!versions.size) {
      log.info('\n⏩ Creating Unicode version map…')
      log.info(`   ${chalk.gray('Unicode version data:')} ${chalk.blue(UNICODE_VERSION_DATA_URL)}`)

      // Get Unicode version data
      const unicodeVersionData = await (await fetch(UNICODE_VERSION_DATA_URL)).text()

      // Save Unicode versions
      let versionMatch = UNICODE_VERSION_DATA_SEARCH.exec(unicodeVersionData)
      while (versionMatch) {
        const [, utf32Start, utf32End, v] = versionMatch
        const startDecimal = hexToDecimal(utf32Start!)
        const endDecimal = utf32End ? hexToDecimal(utf32End) : startDecimal
        versions.add(v!)
        const id = Array.from(versions).indexOf(v!)
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
        let appearedVersion = version === '5.0' ? versionMap.get(glyph.d[0]!) : appearedVersions.get(glyph.c)

        // Glyph appeared this version
        if (appearedVersion === undefined) {
          appearedVersion = Array.from(versions).indexOf(version)
          appearedVersions.set(glyph.c, appearedVersion)
        }

        glyph.v = appearedVersion
      }

      if (glyph.d.length > 1) {
        glyph.d.forEach((decimal) => {
          const char = decimalToString(decimal)
          const decimalLigatures = ligatures.get(char) ?? []
          if (!decimalLigatures.includes(glyph.c)) ligatures.set(char, [...decimalLigatures, glyph.c])
        })
      }

      if (!existingGlyph) {
        glyphs.set(glyph.c, glyph)
        return
      }

      const [, glyphKeywords] = mergeKeywords(existingGlyph.n, [
        glyph.n,
        ...(existingGlyph.k ?? []),
        ...(glyph.k ?? []),
      ])
      const glyphEntities = Array.from(new Set([...(existingGlyph.e ?? []), ...(glyph.e ?? [])]))

      glyphs.set(glyph.c, {
        ...existingGlyph,
        k: glyphKeywords,
        e: glyphEntities.length ? glyphEntities : undefined,
      })
    }

    log.info(`\n✨ Downloading Unicode version ${chalk.green(version)} data…`)
    log.info(`   ${chalk.gray('Unicode data:')}        ${chalk.blue(unicodeDataUrl)}`)
    log.info(`   ${chalk.gray('Emoji data:')}          ${chalk.blue(emojiDataUrl)}`)
    log.info(`   ${chalk.gray('Emoji modifier data:')} ${chalk.blue(emojiModifierDataUrl)}`)
    log.info(`   ${chalk.gray('Block data:')}          ${chalk.blue(unicodeBlockDataUrl)}`)
    log.info(`   ${chalk.gray('Script data:')}         ${chalk.blue(unicodeScriptDataUrl)}`)
    log.info(`   ${chalk.gray('Output:')}              ${chalk.blue(dataFilePath)}`)

    // Fetch Unicode data
    const [unicodeData, emojiData, emojiModifierData, unicodeBlockData, unicodeScriptData] = await Promise.all([
      (await fetch(unicodeDataUrl)).text(),
      (await fetch(emojiDataUrl)).text(),
      (await fetch(emojiModifierDataUrl)).text(),
      (await fetch(unicodeBlockDataUrl)).text(),
      (await fetch(unicodeScriptDataUrl)).text(),
    ])

    log.info(chalk.gray('   💎 Processing glyph data…'))

    // Save Unicode blocks
    let blockMatch = UNICODE_BLOCK_DATA_SEARCH.exec(unicodeBlockData)
    while (blockMatch) {
      const [, utf32Start, utf32End, block] = blockMatch
      const startDecimal = hexToDecimal(utf32Start!)
      const endDecimal = hexToDecimal(utf32End!)
      if (!EXCLUDED_BLOCKS.includes(block!)) {
        blocks.set(block!, { n: block!, r: [startDecimal, endDecimal] })
      }

      blockMatch = UNICODE_BLOCK_DATA_SEARCH.exec(unicodeBlockData)
    }

    // Save Unicode scripts
    let scriptMatch = UNICODE_SCRIPT_DATA_SEARCH.exec(unicodeScriptData)
    while (scriptMatch) {
      const [, utf32Start, utf32End, script] = scriptMatch
      const startDecimal = hexToDecimal(utf32Start!)
      const endDecimal = utf32End ? hexToDecimal(utf32End) : startDecimal
      scripts.add(script!.replace(/_/g, ' '))
      const index = Array.from(scripts).indexOf(script!.replace(/_/g, ' '))
      for (let decimal = startDecimal; decimal <= endDecimal; decimal++) {
        scriptMap.set(decimal, index)
      }

      scriptMatch = UNICODE_SCRIPT_DATA_SEARCH.exec(unicodeScriptData)
    }

    // Create Unicode glyphs
    const rows = unicodeData.split('\n')
    for (const row of rows) {
      const cols = row.split(';')
      if (cols.length < 14 || cols[1] === '<control>') continue
      const [utf32, name, , , , , , , , , keywords] = cols
      const decimal = hexToDecimal(utf32!)
      const block = Array.from(blocks.values()).find(({ r: [start, end] }) => decimal >= start && decimal <= end)
      if (!block) continue // Ignore excluded blocks
      const char = decimalToString(decimal)
      const [glyphName, glyphKeywords] = mergeKeywords(name!, keywords?.replace('&amp;', '&').split(/[,;|]/) ?? [])
      addGlyph({
        c: char,
        n: glyphName,
        k: glyphKeywords,
        e: htmlEntities.get(decimal)?.sort(),
        d: [decimal],
        s: scriptMap.get(decimal),
        v: versionMap.get(decimal),
      })
    }

    // Create Emoji glyphs
    let emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
    while (emojiMatch) {
      const [, utf32, char, name, keywords] = emojiMatch
      const decimals = utf32!.split(' ').map((u) => hexToDecimal(u.replace(/^U\+/, '')))
      const [glyphName, glyphKeywords] = mergeKeywords(
        name!,
        keywords!
          .replace(/<span class='keye'>/gi, '')
          .replace(/<\/span>/gi, '')
          .replace('&amp;', '&')
          .split(/[,;|]/)
      )
      addGlyph({
        c: char!,
        n: glyphName,
        k: glyphKeywords,
        d: decimals,
      })

      emojiMatch = EMOJI_DATA_SEARCH.exec(emojiData)
    }

    // Create Emoji modifier glyphs
    let emojiToneMatch = EMOJI_MODIFIER_DATA_SEARCH.exec(emojiModifierData)
    while (emojiToneMatch) {
      const [, utf32, char, name] = emojiToneMatch
      const decimals = utf32!.split(' ').map((u) => hexToDecimal(u.replace(/^U\+/, '')))
      const [glyphName, glyphKeywords] = mergeKeywords(name!, [])
      addGlyph({
        c: char!,
        n: glyphName,
        k: glyphKeywords,
        d: decimals,
      })

      emojiToneMatch = EMOJI_MODIFIER_DATA_SEARCH.exec(emojiModifierData)
    }

    for (const glyph of Array.from(glyphs.values())) {
      const glyphLigatures = ligatures.get(glyph.c)
      if (glyphLigatures) glyph.l = glyphLigatures

      if (glyph.d.length <= 1) continue
      let keywords = glyph.k
      for (const decimal of glyph.d) {
        const ligatureChar = glyphs.get(decimalToString(decimal))
        if (!ligatureChar) continue
        if (ligatureChar.k) [, keywords] = mergeKeywords(glyph.n, [...(keywords ?? []), ...ligatureChar.k])
      }
      glyph.k = keywords
    }

    // Write to file
    log.info(chalk.gray(`   💾 Writing ${chalk.cyan(glyphs.size.toLocaleString())} glyphs to file…`))

    const glyphsFile: UnicodeData = {
      g: Array.from(glyphs.values()),
      b: Array.from(blocks.values()),
      s: Array.from(scripts),
      v: Array.from(versions) as UnicodeVersion[],
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(glyphsFile), { flag: 'w' })

    const sizeMb = fs.statSync(dataFilePath).size / (1024 * 1024)
    log.info(chalk.gray(`   ✅ ${chalk.blue(`${version}.json`)} (${chalk.yellow(`${sizeMb.toFixed(2)}MB`)})`))
  }
}

await main()
