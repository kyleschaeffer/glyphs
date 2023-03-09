import dotenv from 'dotenv'
import fs from 'fs'
import { decimalToString, hexToDecimal } from '../core/convert'
import { mergeKeywords } from '../core/lang'
import { BlockData, GlyphData, GlyphsFile } from '../store/types'
import {
  EMOJI_DATA_SEARCH,
  EMOJI_MODIFIER_DATA_SEARCH,
  EXCLUDED_BLOCKS,
  HTML_ENTITY_DATA_SEARCH,
  HTML_ENTITY_DATA_URL,
  UNICODE_BLOCK_DATA_SEARCH,
  UNICODE_VERSION_DATA_SEARCH,
  UNICODE_VERSION_DATA_URL,
  UNICODE_VERSIONS,
  UNICODE_SCRIPT_DATA_SEARCH,
} from './config'

dotenv.config()

async function run() {
  const htmlEntities = new Map<number, string[]>()
  const versions = new Set<string>()
  const versionMap = new Map<number, number>()
  const appearedVersions = new Map<string, number>()

  for (const version of UNICODE_VERSIONS) {
    const EMOJI_DATA_URL = `https://www.unicode.org/emoji/charts-${version}/emoji-list.html`
    const EMOJI_MODIFIER_DATA_URL = `https://www.unicode.org/emoji/charts-${version}/full-emoji-modifiers.html`
    const UNICODE_BLOCK_DATA_URL = `https://www.unicode.org/Public/${version}.0/ucd/Blocks.txt`
    const UNICODE_SCRIPT_DATA_URL = `https://www.unicode.org/Public/${version}.0/ucd/Scripts.txt`

    // CSV; 14 columns; [0]=utf32; [1]=name; [10]?=keywords
    const UNICODE_DATA_URL = `https://www.unicode.org/Public/${version}.0/ucd/UnicodeData.txt`

    const glyphs = new Map<string, GlyphData>()
    const ligatures = new Map<string, string[]>()
    const blocks = new Map<string, BlockData>()
    const scripts = new Set<string>()
    const scriptMap = new Map<number, number>()

    if (!htmlEntities.size) {
      // Get HTML entity data
      console.log('🌐 Creating HTML entity map…')
      const htmlEntityData = await (await fetch(HTML_ENTITY_DATA_URL)).text()

      let entityMatch = HTML_ENTITY_DATA_SEARCH.exec(htmlEntityData)
      while (entityMatch) {
        const [, entityName, code] = entityMatch
        const decimal = parseInt(code)
        if (isNaN(decimal)) continue
        const decimalEntities = htmlEntities.get(decimal) ?? []
        if (!decimalEntities.includes(entityName)) htmlEntities.set(decimal, [...decimalEntities, entityName])
        entityMatch = HTML_ENTITY_DATA_SEARCH.exec(htmlEntityData)
      }
    }

    if (!versions.size) {
      // Get Unicode version data
      console.log('⏩ Creating Unicode version map…')
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

    const addGlyph = (glyph: GlyphData): void => {
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

    // Fetch Unicode data
    console.log(`\n✨ Downloading Unicode version ${version} data…`)
    const unicodeData = await (await fetch(UNICODE_DATA_URL)).text()
    const emojiData = await (await fetch(EMOJI_DATA_URL)).text()
    const emojiModifierData = await (await fetch(EMOJI_MODIFIER_DATA_URL)).text()
    const unicodeBlockData = await (await fetch(UNICODE_BLOCK_DATA_URL)).text()
    const unicodeScriptData = await (await fetch(UNICODE_SCRIPT_DATA_URL)).text()

    // Save Unicode blocks
    console.log('🗿 Creating block map…')
    let blockMatch = UNICODE_BLOCK_DATA_SEARCH.exec(unicodeBlockData)
    while (blockMatch) {
      const [, utf32Start, utf32End, block] = blockMatch
      const startDecimal = hexToDecimal(utf32Start)
      const endDecimal = hexToDecimal(utf32End)
      if (!EXCLUDED_BLOCKS.includes(block)) {
        blocks.set(block, { n: block, r: [startDecimal, endDecimal] })
      }
      blockMatch = UNICODE_BLOCK_DATA_SEARCH.exec(unicodeBlockData)
    }

    // Save Unicode scripts
    console.log('📝 Creating script map…')
    let scriptMatch = UNICODE_SCRIPT_DATA_SEARCH.exec(unicodeScriptData)
    while (scriptMatch) {
      const [, utf32Start, utf32End, script] = scriptMatch
      const startDecimal = hexToDecimal(utf32Start)
      const endDecimal = utf32End ? hexToDecimal(utf32End) : startDecimal
      scripts.add(script.replace(/_/g, ' '))
      const index = Array.from(scripts).indexOf(script.replace(/_/g, ' '))
      for (let decimal = startDecimal; decimal <= endDecimal; decimal++) {
        scriptMap.set(decimal, index)
      }
      scriptMatch = UNICODE_SCRIPT_DATA_SEARCH.exec(unicodeScriptData)
    }

    // Create Unicode glyphs
    console.log('🧙🏻‍♀️ Adding Unicode glyphs…')
    const rows = unicodeData.split('\n')
    for (const row of rows) {
      const cols = row.split(';')
      if (cols.length < 14 || cols[1] === '<control>') continue
      const [utf32, name, , , , , , , , , keywords] = cols
      const decimal = hexToDecimal(utf32)
      const block = Array.from(blocks.values()).find(({ r: [start, end] }) => decimal >= start && decimal <= end)
      if (!block) continue // Ignore excluded blocks
      const char = decimalToString(decimal)
      const [glyphName, glyphKeywords] = mergeKeywords(name, keywords?.replace('&amp;', '&').split(/[,;|]/) ?? [])
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
    console.log('🪁 Adding emoji glyphs…')
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

    // Create Emoji modifier glyphs
    console.log('👏🏽 Adding emoji modifier glyphs…')
    let emojiToneMatch = EMOJI_MODIFIER_DATA_SEARCH.exec(emojiModifierData)
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
      emojiToneMatch = EMOJI_MODIFIER_DATA_SEARCH.exec(emojiModifierData)
    }

    console.log('⚡️ Adding ligature data…')
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
    console.log(`💾 Writing ${glyphs.size.toLocaleString()} glyphs to file…`)

    const glyphsFile: GlyphsFile = {
      glyphs: Array.from(glyphs.values()),
      blocks: Array.from(blocks.values()),
      scripts: Array.from(scripts),
      versions: Array.from(versions),
    }

    const filePath = `public/glyphs/${version}.json`
    fs.writeFileSync(filePath, JSON.stringify(glyphsFile), { flag: 'w' })

    const sizeMb = fs.statSync(filePath).size / (1024 * 1024)
    console.log(`✅ ${version}.json (${sizeMb.toFixed(2)}MB)`)
  }
}

run()
