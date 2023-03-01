import Fuse from 'fuse.js'
import z from 'zod'
import { decimalToString, decimalToUtf16, decimalToUtf32, stringToDecimals, stringToUtf8 } from '../core/convert'
import { assertNonNullable } from '../core/error'
import { slugify } from '../core/lang'
import type { Glyph, GlyphsFile } from '../store/types'
import type { ClientMessage, WorkerMessage, SearchResult } from './types'

const post = (message: WorkerMessage) => self.postMessage(message)
const postBlockResponse = (block: string | null, glyphs: Glyph[]) =>
  post({ type: 'BLOCK_RESPONSE', payload: { block, glyphs } })
const postGlyphResponse = (glyph: Glyph | null, related: (Glyph | null)[]) =>
  post({ type: 'GLYPH_RESPONSE', payload: { glyph, related } })
const postQueryResponse = (results: SearchResult[]) => post({ type: 'QUERY_RESPONSE', payload: { results } })
const postWorkerReady = (count: number) => post({ type: 'WORKER_READY', payload: { count } })

class SearchController {
  loading = false
  glyphs: Map<string, Glyph> | null = null
  blocks: Map<string, { block: string; glyphs: string[] }> | null = null
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
      for (const glyph of glyphsFile.glyphs) {
        const block = glyph.b !== undefined ? glyphsFile.blocks[glyph.b] : undefined
        this.glyphs.set(glyph.c, {
          char: glyph.c,
          name: glyph.n,
          keywords: glyph.k,
          entities: glyph.e,
          decimals: glyph.d,
          utf32: glyph.d.map(decimalToUtf32),
          utf16: glyph.d.flatMap(decimalToUtf16),
          utf8: stringToUtf8(glyph.c),
          block,
          version: glyph.v !== undefined ? glyphsFile.versions[glyph.v] : undefined,
          ligatures: glyph.l,
        })
        if (block) {
          const slug = slugify(block)
          const blockGlyphs = this.blocks.get(slug)?.glyphs ?? []
          this.blocks.set(slug, { block, glyphs: [...blockGlyphs, glyph.c] })
        }
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

      postWorkerReady(this.glyphs.size)
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  get(char: string): Glyph | null {
    return this.glyphs?.get(char) ?? null
  }

  getRelated(glyph: Glyph): (Glyph | null)[] {
    const chars = glyph.decimals.map((d) => decimalToString(d))
    return chars.map((char) => (char !== glyph.char ? this.get(char) : null))
  }

  getBlock(slug: string): { block: string | null; glyphs: Glyph[] } {
    const block = this.blocks?.get(slug)
    if (!block) return { block: null, glyphs: [] }
    return { block: block.block, glyphs: block.glyphs.map((c) => assertNonNullable(this.get(c))) }
  }

  search(query: string): SearchResult[] {
    let results = this.fuse?.search(query.slice(0, 128), { limit: 1000 }) ?? []

    const resultsChars = new Set([...results.map((r) => r.item.char)])
    const queryChars = new Set([...stringToDecimals(query).map(decimalToString)])
    queryChars.forEach((char) => {
      if (resultsChars.has(char)) return

      const glyph = this.get(char)
      if (!glyph) return

      results.push({ item: glyph, refIndex: -1 })
      resultsChars.add(char)
    })

    return results
  }
}

const Search = new SearchController()

self.onmessage = (event: MessageEvent<ClientMessage>) => {
  switch (event?.data?.type) {
    case 'REQUEST_BLOCK': {
      const { block, glyphs } = Search.getBlock(event.data.payload.block)
      postBlockResponse(block, glyphs)
      break
    }
    case 'REQUEST_GLYPH': {
      const glyph = Search.get(event.data.payload.char)
      const related = glyph ? Search.getRelated(glyph) : []
      postGlyphResponse(glyph, related)
      break
    }
    case 'REQUEST_QUERY':
      postQueryResponse(Search.search(event.data.payload.query))
      break
    default:
      console.warn('Unknown client message event:', event)
  }
}
