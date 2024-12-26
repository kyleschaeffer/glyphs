import { Glyph, LRUCache } from '@glyphs/core'
import { AppStoreSlice } from './app'

const DEBOUNCE_QUERY_MS = 500
let queryDebounceTimer: ReturnType<typeof setTimeout>

const queryCache = new LRUCache<Glyph[]>()

export type SearchStoreSlice = {
  debouncingQuery: boolean
  glyphCount: number
  loadingResults: boolean
  query: string
  results: Glyph[]

  setQuery: (query: string, noDebounce?: boolean) => void
}

export const createSearchStoreSlice: AppStoreSlice<SearchStoreSlice> = (set, get) => ({
  debouncingQuery: false,
  glyphCount: 0,
  loadingResults: false,
  query: '',
  results: [],

  setQuery(query, noDebounce) {
    set((draft) => {
      draft.query = query
      draft.results = queryCache.get(query) ?? []
      draft.debouncingQuery = true
      return { ...draft }
    })

    async function getResults() {
      set((draft) => {
        draft.debouncingQuery = false
        draft.loadingResults = true
        return { ...draft }
      })

      const { results } = await get().search(query)
      set((draft) => {
        draft.results = results
        draft.loadingResults = false
        queryCache.set(query, results)
        return { ...draft }
      })
    }

    clearTimeout(queryDebounceTimer)
    if (noDebounce) void getResults()
    else queryDebounceTimer = setTimeout(getResults, DEBOUNCE_QUERY_MS)
  },
})
