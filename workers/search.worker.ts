import Fuse from 'fuse.js'
import z from 'zod'
import { decimalToString, decimalToUtf16, decimalToUtf32, stringToDecimals, stringToUtf8 } from '../core/convert'
import { slugify } from '../core/lang'
import type { Block, ClientRequestMessage, Glyph, GlyphsFile, Script, WorkerResponseMessage } from './types'

const post = (message: WorkerResponseMessage) => self.postMessage(message)

class SearchController {
  loading = false
  glyphs: Map<string, Glyph> | null = null
  blocks: Map<string, Block> | null = null
  scripts: Map<string, Script> | null = null
  fuse: Fuse<Glyph> | null = null

  constructor() {
    void this._loadGlyphs()
  }

  private async _loadGlyphs() {
    const version = z.string().parse(process.env.NEXT_PUBLIC_UNICODE_VERSION)

    this.loading = true
    try {
      const response = await fetch(`/glyphs/${version}.json`)
      const glyphsFile = (await response.json()) as GlyphsFile

      this.glyphs = new Map()
      this.blocks = new Map()
      this.scripts = new Map()

      for (const block of glyphsFile.blocks) {
        const slug = slugify(block.n)
        this.blocks.set(slug, { name: block.n, range: block.r, glyphs: [] })
      }

      for (const script of glyphsFile.scripts) {
        const slug = slugify(script)
        this.scripts.set(slug, { name: script, glyphs: [] })
      }

      for (const glyph of glyphsFile.glyphs) {
        const block =
          glyph.d.length === 1
            ? Array.from(this.blocks.entries()).find(
                ([
                  ,
                  {
                    range: [start, end],
                  },
                ]) => glyph.d[0] >= start && glyph.d[0] <= end
              )
            : undefined
        const script = glyph.s !== undefined ? glyphsFile.scripts[glyph.s] : undefined
        const newGlyph: Glyph = {
          char: glyph.c,
          name: glyph.n,
          keywords: glyph.k,
          entities: glyph.e,
          decimals: glyph.d,
          utf32: glyph.d.map(decimalToUtf32),
          utf16: glyph.d.flatMap(decimalToUtf16),
          utf8: stringToUtf8(glyph.c),
          block: block ? block[0] : undefined,
          script,
          version: glyph.v !== undefined ? glyphsFile.versions[glyph.v] : undefined,
          ligatures: glyph.l,
        }
        this.glyphs.set(glyph.c, newGlyph)
        if (block) this.blocks.get(block[0])?.glyphs.push(newGlyph)
        if (script) this.scripts.get(slugify(script))?.glyphs.push(newGlyph)
      }

      this.fuse = new Fuse(Array.from(this.glyphs.values()), {
        keys: [
          { name: 'char', weight: 1.0 },
          { name: 'name', weight: 0.7 },
          { name: 'keywords', weight: 0.5 },
          { name: 'entities', weight: 0.3 },
          { name: 'decimals', weight: 0.1 },
          { name: 'utf32', weight: 0.1 },
          { name: 'utf16', weight: 0.1 },
          { name: 'utf8', weight: 0.05 },
          { name: 'block', weight: 0.2 },
        ],
        threshold: 0.4,
      })

      post({ type: 'WORKER_READY', payload: { count: this.glyphs.size } })
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  getGlyph(char: string): Glyph | null {
    return this.glyphs?.get(char) ?? null
  }

  getLigatureGlyphs(glyph: Glyph): Glyph[] {
    const chars = glyph.decimals.map((d) => decimalToString(d))
    return chars
      .map((char) => (char !== glyph.char ? this.getGlyph(char) : null))
      .filter((glyph): glyph is Glyph => !!glyph)
  }

  getBlock(slug: string): Block | null {
    return this.blocks?.get(slug) ?? null
  }

  getScript(slug: string): Script | null {
    return this.scripts?.get(slug) ?? null
  }

  search(query: string): Glyph[] {
    let results = this.fuse?.search(query.slice(0, 128), { limit: 1000 }).map((r) => r.item) ?? []

    const resultsChars = new Set([...results.map((r) => r.char)])
    const queryChars = new Set([...stringToDecimals(query).map(decimalToString)])
    queryChars.forEach((char) => {
      if (resultsChars.has(char)) return

      const glyph = this.getGlyph(char)
      if (!glyph) return

      results.push(glyph)
      resultsChars.add(char)
    })

    return results
  }
}

const Search = new SearchController()

self.onmessage = (event: MessageEvent<ClientRequestMessage>) => {
  if (!event?.data?.type) return
  switch (event.data.type) {
    case 'BLOCK_REQUEST': {
      const block = Search.getBlock(event.data.payload.slug)
      post({ type: 'BLOCK_RESPONSE', payload: { block } })
      break
    }
    case 'GLYPH_REQUEST': {
      const glyph = Search.getGlyph(event.data.payload.char)
      const ligature = glyph ? Search.getLigatureGlyphs(glyph) : []
      post({ type: 'GLYPH_RESPONSE', payload: { glyph, ligature } })
      break
    }
    case 'QUERY_REQUEST': {
      const results = Search.search(event.data.payload.query)
      post({ type: 'QUERY_RESPONSE', payload: { results } })
      break
    }
    case 'SCRIPT_REQUEST': {
      const script = Search.getScript(event.data.payload.slug)
      post({ type: 'SCRIPT_RESPONSE', payload: { script } })
      break
    }
    default:
      console.warn('Unknown client message event:', event)
  }
}
