import type { WritableDraft } from 'immer/dist/types/types-external'
import { throwUnreachable } from '../core/error'
import type { registerSearchWorker } from '../workers/search'
import type { SearchResult } from '../workers/types'
import type { AppStoreSlice } from './app'
import type { Glyph } from './types'

const DEBOUNCE_REQUEST_MS = 500

export type GlyphStoreSlice = {
  block: { block: string | null; glyphs: Glyph[] }
  char: string | null
  count: number
  debouncingChar: boolean
  debouncingQuery: boolean
  glyph: Glyph | null
  loadingBlock: boolean
  loadingGlyph: boolean
  loadingResults: boolean
  query: string
  scrollPosition: number | null
  ready: boolean
  related: (Glyph | null)[]
  results: SearchResult[]

  register: (registration: ReturnType<typeof registerSearchWorker>) => void
  requestBlock: (block: string) => void
  requestGlyph: (char: string) => void
  requestQuery: (query: string) => void
  setBlock: (block: string | null, glyphs: Glyph[]) => void
  setChar: (char: string | null, debounce?: boolean) => void
  setGlyph: (glyph: Glyph | null, related: (Glyph | null)[]) => void
  setQuery: (query: string) => void
  setScrollPosition: (position: number | null) => void
  setReady: (count: number) => void
  setResults: (results: SearchResult[]) => void
}

let _postBlockRequest: (block: string) => void = () => throwUnreachable('Search worker not registered')
let _postGlyphRequest: (char: string) => void = () => throwUnreachable('Search worker not registered')
let _postQueryRequest: (query: string) => void = () => throwUnreachable('Search worker not registered')
let _requestGlyphTimer: ReturnType<typeof setTimeout>
let _requestQueryTimer: ReturnType<typeof setTimeout>

export const createGlyphStoreSlice: AppStoreSlice<GlyphStoreSlice> = (set, get, store) => ({
  block: { block: null, glyphs: [] },
  char: null,
  count: 0,
  debouncingChar: false,
  debouncingQuery: false,
  glyph: null,
  loadingBlock: false,
  loadingGlyph: false,
  loadingResults: false,
  query: '',
  scrollPosition: null,
  ready: true,
  related: [],
  results: [],

  register({ requestBlock, requestGlyph, requestQuery }) {
    set((draft) => {
      draft.ready = false
    })
    _postBlockRequest = requestBlock
    _postGlyphRequest = requestGlyph
    _postQueryRequest = requestQuery
  },

  requestBlock(block) {
    const { loadingBlock, ready } = get()
    if (loadingBlock || !ready) return

    set((draft) => {
      draft.loadingBlock = true
    })

    _postBlockRequest(block)
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

  setBlock(block, glyphs) {
    set((draft) => {
      draft.loadingBlock = false
      draft.block = { block, glyphs }
    })
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
        else get().setGlyph(null, [])
      },
      debounce ? DEBOUNCE_REQUEST_MS : 0
    )
  },

  setGlyph(glyph, related) {
    set((draft) => {
      draft.loadingGlyph = false
      draft.glyph = glyph
      draft.related = related
    })
  },

  setQuery(query) {
    set((draft) => {
      draft.query = query
      draft.debouncingQuery = true
      draft.scrollPosition = null
    })

    clearTimeout(_requestQueryTimer)
    _requestQueryTimer = setTimeout(() => {
      set((draft) => {
        draft.debouncingQuery = false
      })
      get().requestQuery(query)
    }, DEBOUNCE_REQUEST_MS)
  },

  setScrollPosition(position) {
    set((draft) => {
      draft.scrollPosition = position
    })
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
