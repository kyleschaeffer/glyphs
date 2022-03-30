import Fuse from 'fuse.js'
import { createStore } from 'solid-js/store'
import { Glyph } from './types'

export type SearchState = {
  empty: boolean
  idle: boolean
  index: Fuse<Glyph>
  indicies: Map<string, number>
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
  { name: 'd', weight: 0.1 },
  { name: 'u', weight: 0.1 },
  { name: 'h', weight: 0.1 },
  { name: 'n', weight: 2 },
  { name: 'g', weight: 1.25 },
  { name: 'k', weight: 1.75 },
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
  indicies: new Map(),
  loading: false,
  query: '',
  results: [],
  selected: null,
})

export { state }
export const setLoading = (loading: boolean) => setState('loading', loading)
export const setResults = (results: Glyph[]) => setState('results', results)
export const setSelected = (selected: Glyph | null) => setState('selected', selected)

export const getGlyphByIndex = (index: number) => ((state.index as any)._docs as Glyph[])[index]

export const selectRandom = () => {
  const glyphDocs = (state.index as any)._docs as Glyph[]
  setSelected(glyphDocs[Math.floor(Math.random() * glyphDocs.length)])
}

export const indexGlyphs = (glyphs: Glyph[]) => {
  setState('index', new Fuse(glyphs, { keys: SEARCH_KEYS, threshold: SEARCH_THRESHOLD }))
  setState('indicies', new Map(glyphs.map((glyph, i) => [glyph.c, i])))
}

export const searchByQuery = (query: string) => {
  let results: Glyph[] = []
  const exact = state.indicies.get(query)
  if (exact !== undefined) results = [getGlyphByIndex(exact)]
  else if (query.length) results = state.index.search(query, { limit: SEARCH_MAX_RESULTS }).map((result) => result.item)
  setResults(results)
  setLoading(false)
}

let searchTimer: number
export const setQuery = (query: string) => {
  clearTimeout(searchTimer)
  setLoading(true)
  setState('query', query)
  searchTimer = setTimeout(() => searchByQuery(query), SEARCH_DEBOUNCE_MS)
}
