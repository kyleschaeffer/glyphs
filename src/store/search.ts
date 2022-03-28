import { createStore } from 'solid-js/store'

export type SearchState = {
  loading: boolean
  query: string
  results: string[]
  selected: string | null
}

const [state, setState] = createStore<SearchState>({
  loading: false,
  query: '',
  results: [],
  selected: null,
})

export { state }
export const setLoading = (loading: boolean) => setState('loading', loading)
export const setQuery = (query: string) => setState('query', query)
export const setResults = (results: string[]) => setState('results', results)
export const setSelected = (selected: string | null) => setState('selected', selected)
