import Fuse from 'fuse.js'
import { createStore } from 'solid-js/store'
import { glyphName } from '../core/convert'
import type { Glyph } from './types'

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

export type HistoryState = {
  q?: string
  c?: string
}

const HASH_DEBOUNCE_MS = 500
const SEARCH_DEBOUNCE_MS = 250
const SEARCH_MAX_RESULTS = 200
const SEARCH_THRESHOLD = 0.3
const SEARCH_KEYS = [
  { name: 'c', weight: 2 },
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

export const setLoading = (loading: boolean) => setState({ loading })

export const setResults = (results: Glyph[]) => setState({ results })

export const setSelected = (selected: Glyph | null, updateHash: boolean = true) => {
  setState({ selected })
  if (updateHash) setHash()
}

export const indexGlyphs = (glyphs: Glyph[]) => {
  setState({
    index: new Fuse(glyphs, { keys: SEARCH_KEYS, threshold: SEARCH_THRESHOLD }),
    indicies: new Map(glyphs.map((glyph, i) => [glyph.c, i])),
  })
  hydrateHash(document.location.hash)
}

let currentQuery: string | null = null
export const searchByQuery = (query: string) => {
  if (query === currentQuery) return
  currentQuery = query
  let results: Glyph[] = []
  const exact = state.indicies.get(query)
  if (exact !== undefined) results = [((state.index as any)._docs as Glyph[])[exact]]
  else if (query.length) results = state.index.search(query, { limit: SEARCH_MAX_RESULTS }).map((result) => result.item)
  setState({ loading: false, results })
}

let searchTimer: number
export const setQuery = (query: string, updateHash: boolean = true) => {
  clearTimeout(searchTimer)
  setState({ loading: true, query })
  if (updateHash) setHash()
  searchTimer = setTimeout(() => searchByQuery(query), SEARCH_DEBOUNCE_MS)
}

export const selectRandom = () => {
  const glyphDocs = (state.index as any)._docs as Glyph[]
  setSelected(glyphDocs[Math.floor(Math.random() * glyphDocs.length)])
}

export const getHistoryTitle = (): string => {
  if (state.selected) return `${state.selected.c} ${glyphName(state.selected.n)} — Glyphs`
  else if (state.query.length) return `${state.query} — Glyphs`
  else return 'Glyphs'
}

export const encodeHistoryState = (): string => {
  const states: [key: string, value?: string][] = [
    ['q', state.query.length ? state.query : undefined],
    ['c', state.selected?.c],
  ]
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key!, encodeURIComponent(value!)])
  const hash = states.map(([key, value]) => `${key}=${value}`).join('&')
  return `#${hash}`
}

export const decodeHistoryState = (hash: string): HistoryState => {
  const historyState: HistoryState = {}
  for (const param of hash.replace(/^#/, '').split('&')) {
    const [key, value] = param.split('=').map((c) => decodeURIComponent(c))
    if (
      !key.length ||
      value === undefined ||
      !['q', 'c', 't'].includes(key) ||
      (key === 'c' && state.indicies.get(value) === undefined)
    )
      continue
    historyState[key as 'q'] = value
  }
  return historyState
}

export const hydrateHash = (hash: string) => {
  if (hash === encodeHistoryState()) return
  const historyState = decodeHistoryState(hash)
  setQuery(historyState.q ?? '', false)
  const index = historyState.c ? state.indicies.get(historyState.c) : undefined
  setSelected(index !== undefined ? ((state.index as any)._docs as Glyph[])[index] : null, false)
  document.title = getHistoryTitle()
}

let hashTimer: number
export const setHash = () => {
  clearTimeout(hashTimer)
  hashTimer = setTimeout(() => {
    const newHash = encodeHistoryState()
    if (window.location.hash === newHash || (window.location.hash.length === 0 && newHash.length === 1)) return
    const url = new URL(window.location.href)
    url.hash = newHash.length === 1 ? '' : newHash
    const title = getHistoryTitle()
    window.history.pushState({}, title, url)
    document.title = getHistoryTitle()
  }, HASH_DEBOUNCE_MS)
}
