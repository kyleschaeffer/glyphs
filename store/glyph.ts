import type { WritableDraft } from 'immer/dist/types/types-external'
import { throwUnreachable } from '../core/error'
import type { registerSearchWorker } from '../workers/search'
import type { SearchResult } from '../workers/types'
import type { AppStoreSlice } from './app'
import type { Glyph } from './types'

const DEBOUNCE_REQUEST_MS = 500

export type GlyphStoreSlice = {
  char: string | null
  count: number
  debouncingChar: boolean
  debouncingQuery: boolean
  glyph: Glyph | null
  loadingGlyph: boolean
  loadingResults: boolean
  query: string
  ready: boolean
  results: SearchResult[]

  register: (registration: ReturnType<typeof registerSearchWorker>) => void
  requestGlyph: (char: string) => void
  requestQuery: (query: string) => void
  setChar: (char: string | null, debounce?: boolean) => void
  setGlyph: (glyph: Glyph | null) => void
  setQuery: (query: string) => void
  setReady: (count: number) => void
  setResults: (results: SearchResult[]) => void
}

let _postGlyphRequest: (char: string) => void = () => throwUnreachable('Search worker not registered')
let _postQueryRequest: (query: string) => void = () => throwUnreachable('Search worker not registered')
let _requestGlyphTimer: ReturnType<typeof setTimeout>
let _requestQueryTimer: ReturnType<typeof setTimeout>

export const createGlyphStoreSlice: AppStoreSlice<GlyphStoreSlice> = (set, get, store) => ({
  char: null,
  count: 0,
  debouncingChar: false,
  debouncingQuery: false,
  glyph: null,
  loadingGlyph: false,
  loadingResults: false,
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
    const { loadingGlyph, ready } = get()
    if (loadingGlyph || !ready) return

    set((draft) => {
      draft.loadingGlyph = true
    })
    _postGlyphRequest(char)
  },

  requestQuery(query) {
    const { loadingResults, ready } = get()
    if (loadingResults || !ready) return

    set((draft) => {
      draft.loadingResults = true
    })
    _postQueryRequest(query)
  },

  setChar(char, debounce) {
    set((draft) => {
      draft.char = char
      draft.debouncingChar = true
    })

    clearTimeout(_requestGlyphTimer)
    _requestGlyphTimer = setTimeout(
      () => {
        set((draft) => {
          draft.debouncingChar = false
        })
        if (char) get().requestGlyph(char)
        else get().setGlyph(null)
      },
      debounce ? DEBOUNCE_REQUEST_MS : 0
    )
  },

  setGlyph(glyph) {
    set((draft) => {
      draft.loadingGlyph = false
      draft.glyph = glyph
    })
  },

  setQuery(query) {
    set((draft) => {
      draft.query = query
      draft.debouncingQuery = true
    })

    clearTimeout(_requestQueryTimer)
    _requestQueryTimer = setTimeout(() => {
      set((draft) => {
        draft.debouncingQuery = false
      })
      get().requestQuery(query)
    }, DEBOUNCE_REQUEST_MS)
  },

  setReady(count) {
    set((draft) => {
      draft.count = count
      draft.ready = true
    })
  },

  setResults(results) {
    set((draft) => {
      draft.loadingResults = false
      draft.results = results as WritableDraft<SearchResult>[]
    })
  },
})
