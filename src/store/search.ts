import Fuse from 'fuse.js'
import { createStore } from 'solid-js/store'
import { Glyph } from './types'

export type SearchState = {
  empty: boolean
  idle: boolean
  index: Fuse<Glyph>
  loading: boolean
  query: string
  results: Glyph[]
  selected: Glyph | null
}

const SEARCH_DEBOUNCE_MS = 250
const SEARCH_MAX_RESULTS = 200
const SEARCH_THRESHOLD = 0.3
const SEARCH_KEYS = [
  { name: 'c', weight: 10 },
  { name: 'u', weight: 0.1 },
  { name: 'h', weight: 0.1 },
  { name: 'n', weight: 1.75 },
  { name: 'k', weight: 1 },
  { name: 'e', weight: 0.5 },
]

const [state, setState] = createStore<SearchState>({
  get empty() {
    return !this.loading && this.query.length && !this.results.length
  },
  get idle() {
    return !this.query.length && !this.loading
  },
  index: new Fuse([]),
  loading: false,
  query: '',
  results: [],
  selected: null,
})

export { state }
export const setLoading = (loading: boolean) => setState('loading', loading)
export const setResults = (results: Glyph[]) => setState('results', results)
export const setSelected = (selected: Glyph | null) => setState('selected', selected)

export const indexGlyphs = (glyphs: Glyph[]) =>
  setState('index', new Fuse(glyphs, { keys: SEARCH_KEYS, threshold: SEARCH_THRESHOLD }))

export const searchByQuery = (query: string) => {
  const results = query.length ? state.index.search(query, { limit: SEARCH_MAX_RESULTS }) : []
  setResults(results.map((result) => result.item))
  setLoading(false)
}

let searchTimer: number
export const setQuery = (query: string) => {
  clearTimeout(searchTimer)
  setLoading(true)
  setState('query', query)
  searchTimer = setTimeout(() => searchByQuery(query), SEARCH_DEBOUNCE_MS)
}
