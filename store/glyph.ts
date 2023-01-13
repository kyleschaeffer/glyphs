import type { WritableDraft } from 'immer/dist/types/types-external'
import { throwUnreachable } from '../core/error'
import type { registerSearchWorker } from '../workers/search'
import type { SearchResult } from '../workers/types'
import type { AppStoreSlice } from './app'
import { Glyph } from './types'

export type GlyphStoreSlice = {
  glyph: Glyph | null
  loading: boolean
  query: string
  ready: boolean
  results: SearchResult[] | null

  register: (registration: ReturnType<typeof registerSearchWorker>) => void
  requestGlyph: (char: string) => void
  requestQuery: (query: string) => void
  setGlyph: (glyph: Glyph | null) => void
  setQuery: (query: string) => void
  setReady: () => void
  setResults: (results: SearchResult[] | null) => void
}

let _postGlyphRequest: (char: string) => void = () => throwUnreachable('Search worker not registered')
let _postQueryRequest: (query: string) => void = () => throwUnreachable('Search worker not registered')

export const createGlyphStoreSlice: AppStoreSlice<GlyphStoreSlice> = (set, get, store) => ({
  glyph: null,
  loading: false,
  query: '',
  ready: false,
  results: null,

  register({ requestGlyph, requestQuery }) {
    _postGlyphRequest = requestGlyph
    _postQueryRequest = requestQuery
  },

  requestGlyph(char) {
    const { loading, ready } = get()
    if (loading || !ready) return

    set((draft) => {
      draft.loading = true
    })
    _postGlyphRequest(char)
  },

  requestQuery(query) {
    const { loading, ready } = get()
    if (loading || !ready) return

    set((draft) => {
      draft.loading = true
    })
    _postQueryRequest(query)
  },

  setGlyph(glyph) {
    set((draft) => {
      draft.loading = false
      draft.glyph = glyph
    })
  },

  setQuery(query) {
    set((draft) => {
      draft.query = query
    })
  },

  setReady() {
    set((draft) => {
      draft.ready = true
    })
  },

  setResults(results) {
    console.log('results', results)
    set((draft) => {
      draft.loading = false
      draft.results = results as WritableDraft<SearchResult>[]
    })
  },
})
