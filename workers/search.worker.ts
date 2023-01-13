import Fuse from 'fuse.js'
import type { Glyph } from '../store/types'
import type { ClientMessage, WorkerMessage, SearchResult } from './types'
import z from 'zod'

const post = (message: WorkerMessage) => self.postMessage(message)
const postGlyphResponse = (glyph: Glyph | null) => post({ type: 'GLYPH_RESPONSE', payload: { glyph } })
const postQueryResponse = (results: SearchResult[]) => post({ type: 'QUERY_RESPONSE', payload: { results } })
const postWorkerReady = () => post({ type: 'WORKER_READY', payload: {} })

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
          { name: 'c', weight: 1 },
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

      postWorkerReady()
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  get(char: string): Glyph | null {
    return this.glyphs?.get(char) ?? null
  }

  search(query: string): SearchResult[] {
    return this.fuse?.search(query, { limit: 500 }) ?? []
  }
}

const Search = new SearchController()

self.onmessage = (event: MessageEvent<ClientMessage>) => {
  switch (event?.data?.type) {
    case 'REQUEST_GLYPH':
      postGlyphResponse(Search.get(event.data.payload.char))
      break
    case 'REQUEST_QUERY':
      postQueryResponse(Search.search(event.data.payload.query))
      break
    default:
      console.warn('Unknown client message event:', event)
  }
}
