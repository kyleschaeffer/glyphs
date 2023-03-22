import { Glyph } from '../workers/types'
import { AppStoreSlice } from './app'

const DEBOUNCE_QUERY_MS = 500
let queryDebounceTimer: ReturnType<typeof setTimeout>

export type SearchStoreSlice = {
  debouncingQuery: boolean
  glyphCount: number
  loadingResults: boolean
  query: string
  results: Glyph[]
  scrollPosition: number | null

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

  setQuery(query) {
    set((draft) => {
      draft.query = query
      draft.debouncingQuery = true
    })

    clearTimeout(queryDebounceTimer)
    queryDebounceTimer = setTimeout(async () => {
      set((draft) => {
        draft.debouncingQuery = false
        draft.loadingResults = true
      })

      const { results } = await get().search(query)
      set((draft) => {
        draft.results = results
        draft.loadingResults = false
      })
    }, DEBOUNCE_QUERY_MS)
  },

  setScrollPosition(position) {
    set((draft) => {
      draft.scrollPosition = position
    })
  },
})
