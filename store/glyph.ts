import type { WritableDraft } from 'immer/dist/types/types-external'
import { throwUnreachable } from '../core/error'
import type { registerSearchWorker } from '../workers/search'
import type { SearchResult } from '../workers/types'
import type { AppStoreSlice } from './app'
import type { Glyph } from './types'

const QUERY_DEBOUNCE_MS = 300

export type GlyphStoreSlice = {
  debouncing: boolean
  glyph: Glyph | null
  loading: boolean
  query: string
  ready: boolean
  results: SearchResult[]

  register: (registration: ReturnType<typeof registerSearchWorker>) => void
  requestGlyph: (char: string) => void
  requestQuery: (query: string) => void
  setGlyph: (glyph: Glyph | null) => void
  setQuery: (query: string) => void
  setReady: () => void
  setResults: (results: SearchResult[]) => void
}

let _postGlyphRequest: (char: string) => void = () => throwUnreachable('Search worker not registered')
let _postQueryRequest: (query: string) => void = () => throwUnreachable('Search worker not registered')
let _requestQueryTimer: ReturnType<typeof setTimeout>

export const createGlyphStoreSlice: AppStoreSlice<GlyphStoreSlice> = (set, get, store) => ({
  debouncing: false,
  glyph: null,
  loading: false,
  query: '',
  ready: true,
  results: [],

  register({ requestGlyph, requestQuery }) {
    set((draft) => {
      draft.ready = false
    })
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
      draft.debouncing = true
    })

    clearTimeout(_requestQueryTimer)
    _requestQueryTimer = setTimeout(() => {
      set((draft) => {
        draft.debouncing = false
      })
      get().requestQuery(query)
    }, QUERY_DEBOUNCE_MS)
  },

  setReady() {
    set((draft) => {
      draft.ready = true
    })
  },

  setResults(results) {
    set((draft) => {
      draft.loading = false
      draft.results = results as WritableDraft<SearchResult>[]
    })
  },
})
