import Fuse from 'fuse.js'
import { createStore } from 'solid-js/store'
import { Glyph } from './types'

export enum GlyphTab {
  JAVASCRIPT = 'j',
  HTML = 'h',
  CSS = 'c',
  UNICODE = 'u',
}

export type SearchState = {
  empty: boolean
  idle: boolean
  index: Fuse<Glyph>
  indicies: Map<string, number>
  loading: boolean
  query: string
  results: Glyph[]
  selected: Glyph | null
  tab: GlyphTab
}

export type HistoryState = {
  q?: string
  c?: string
  t?: GlyphTab
}

const HASH_DEBOUNCE_MS = 500
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
  tab: GlyphTab.JAVASCRIPT,
})

export { state }
export const setLoading = (loading: boolean) => setState('loading', loading)
export const setResults = (results: Glyph[]) => setState('results', results)
export const setSelected = (selected: Glyph | null, updateHash: boolean = true) => {
  setState('selected', selected)
  if (updateHash) setHash()
}
export const setTab = (tab: GlyphTab, updateHash: boolean = true) => {
  setState('tab', tab)
  if (updateHash) setHash()
}

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
export const setQuery = (query: string, updateHash: boolean = true) => {
  clearTimeout(searchTimer)
  setLoading(true)
  setState('query', query)
  if (updateHash) setHash()
  searchTimer = setTimeout(() => searchByQuery(query), SEARCH_DEBOUNCE_MS)
}

export const encodeHistoryState = (): string => {
  const states: [key: string, value?: string][] = [
    ['q', state.query.length ? state.query : undefined],
    ['c', state.selected?.c],
    ['t', state.selected !== null && state.tab !== GlyphTab.JAVASCRIPT ? state.tab : undefined],
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
      (key === 'c' && state.indicies.get(value) === undefined) ||
      (key === 't' && !Object.values(GlyphTab).includes(value as GlyphTab))
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
  setSelected(index !== undefined ? getGlyphByIndex(index) : null, false)
  setTab(historyState.t ?? GlyphTab.JAVASCRIPT, false)
}

let hashTimer: number
export const setHash = () => {
  clearTimeout(hashTimer)
  hashTimer = setTimeout(() => {
    const newHash = encodeHistoryState()
    if (window.location.hash === newHash || (window.location.hash.length === 0 && newHash.length === 1)) return
    const url = new URL(window.location.href)
    url.hash = newHash.length === 1 ? '' : newHash
    window.history.pushState({}, document.title, url)
  }, HASH_DEBOUNCE_MS)
}
