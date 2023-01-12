import Fuse from 'fuse.js'
import type { Glyph } from '../store/types'
import type { RequestMessage, RespondMessage } from './types'
import z from 'zod'

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
        keys: ['c', 'd', 'u', 'h', 'n', 'g', 'k', 'e'],
      })

      this.glyphs = new Map()
      for (const glyph of glyphs) {
        this.glyphs.set(glyph.c, glyph)
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  get(char: string): Glyph | null {
    return this.glyphs?.get(char) ?? null
  }

  search(query: string): Fuse.FuseResult<Glyph>[] {
    return this.fuse?.search(query) ?? []
  }
}

const Search = new SearchController()

const post = (message: RespondMessage) => self.postMessage(message)
const respondGlyph = (glyph: Glyph | null) => post({ type: 'RESPOND_GLYPH', payload: { glyph } })
const respondQuery = (results: Fuse.FuseResult<Glyph>[]) => post({ type: 'RESPOND_QUERY', payload: { results } })

self.onmessage = (event: MessageEvent<RequestMessage>) => {
  switch (event?.data?.type) {
    case 'REQUEST_GLYPH':
      respondGlyph(Search.get(event.data.payload.char))
      break
    case 'REQUEST_QUERY':
      respondQuery(Search.search(event.data.payload.query))
      break
    default:
      console.warn('Unknown request message event:', event)
  }
}
