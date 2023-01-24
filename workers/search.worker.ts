import Fuse from 'fuse.js'
import z from 'zod'
import { decimalToString, stringToDecimals } from '../core/convert'
import type { Glyph } from '../store/types'
import type { ClientMessage, WorkerMessage, SearchResult } from './types'

const post = (message: WorkerMessage) => self.postMessage(message)
const postGlyphResponse = (glyph: Glyph | null, related: (Glyph | null)[]) =>
  post({ type: 'GLYPH_RESPONSE', payload: { glyph, related } })
const postQueryResponse = (results: SearchResult[]) => post({ type: 'QUERY_RESPONSE', payload: { results } })
const postWorkerReady = (count: number) => post({ type: 'WORKER_READY', payload: { count } })

class SearchController {
  loading = false
  glyphs: Map<string, Glyph> | null = null
  fuse: Fuse<Glyph> | null = null

  constructor() {
    void this._loadGlyphs()
  }

  private async _loadGlyphs() {
    const version = z.string().parse(process.env.NEXT_PUBLIC_UNICODE_VERSION)

    this.loading = true
    try {
      const response = await fetch(`/glyphs/${version}.json`)
      const glyphs = (await response.json()) as Glyph[]

      this.fuse = new Fuse(glyphs, {
        keys: [
          { name: 'c', weight: 1.0 },
          { name: 'd', weight: 0.1 },
          { name: 'u', weight: 0.1 },
          { name: 'h', weight: 0.1 },
          { name: 'n', weight: 0.5 },
          { name: 'g', weight: 0.1 },
          { name: 'k', weight: 0.3 },
          { name: 'e', weight: 0.2 },
        ],
        threshold: 0.4,
      })

      this.glyphs = new Map()
      for (const glyph of glyphs) {
        this.glyphs.set(glyph.c, glyph)
      }

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
    const chars = glyph.d.map((d) => decimalToString(d))
    return chars.map((char) => (char !== glyph.c ? this.get(char) : null))
  }

  search(query: string): SearchResult[] {
    let results = this.fuse?.search(query.slice(0, 128), { limit: 500 }) ?? []

    const resultsChars = new Set([...results.map((r) => r.item.c)])
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
