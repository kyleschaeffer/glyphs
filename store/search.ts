import { Glyph } from '../workers/types'
import { AppStoreSlice, useAppStore } from './app'

const DEBOUNCE_QUERY_MS = 500
let queryDebounceTimer: ReturnType<typeof setTimeout>

export type SearchStoreSlice = {
  debouncingQuery: boolean
  glyphCount: number
  loadingResults: boolean
  query: string
  results: Glyph[]
  scrollPosition: number | null

  initSearch: () => void
  setQuery: (query: string) => void
  setScrollPosition: (position: number | null) => void
}

export const createSearchStoreSlice: AppStoreSlice<SearchStoreSlice> = (set, get, store) => ({
  debouncingQuery: false,
  glyphCount: 0,
  loadingResults: false,
  query: '',
  results: [],
  scrollPosition: null,

  initSearch() {
    get().subscribe((message) => {
      if (message.type !== 'QUERY_RESPONSE') return
      useAppStore.setState((draft) => {
        draft.results = message.payload.results
        draft.loadingResults = false
      })
    })
  },

  setQuery(query) {
    set((draft) => {
      draft.query = query
      draft.debouncingQuery = true
    })

    clearTimeout(queryDebounceTimer)
    queryDebounceTimer = setTimeout(() => {
      set((draft) => {
        draft.debouncingQuery = false
        draft.loadingResults = true
      })
      get().post({ type: 'QUERY_REQUEST', payload: { query: query } })
    }, DEBOUNCE_QUERY_MS)
  },

  setScrollPosition(position) {
    set((draft) => {
      draft.scrollPosition = position
    })
  },
})
