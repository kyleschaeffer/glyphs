import { Immutable, produce } from 'immer'

import { Glyph } from '../types/glyphs'
import { ActionType, GlyphsAction } from './actions'
import { buildIndex, search } from './search'

export type GlyphsState = Immutable<{
  error: string | null
  glyph: string | null
  glyphs: Map<string, Glyph>
  loading: boolean
  query: string
  results: string[]
}>

export const initialState: GlyphsState = {
  error: null,
  glyph: null,
  glyphs: new Map(),
  loading: true,
  query: '',
  results: [],
}

export const reducer = (state: GlyphsState, action: GlyphsAction): GlyphsState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ActionType.SET_ERROR:
        draft.error = action.payload.error
        break
      case ActionType.SET_GLYPH:
        draft.glyph = action.payload.glyph
        break
      case ActionType.SET_GLYPHS:
        draft.glyphs = action.payload.glyphs
        buildIndex(action.payload.glyphs)
        break
      case ActionType.SET_LOADING:
        draft.loading = action.payload.loading
        break
      case ActionType.SET_QUERY:
        draft.query = action.payload.query
        draft.results = search(action.payload.query)
        break
    }
  })
}
