import { Glyph } from '../types/glyphs'
import { ActionType, GlyphsAction } from './actions'

export type GlyphsState = {
  error: string | null
  glyph: string | null
  glyphs: Map<string, Glyph>
  loading: boolean
  query: string
}

export const reducer = (prevState: GlyphsState, action: GlyphsAction): GlyphsState => {
  const state = { ...prevState }

  switch (action.type) {
    case ActionType.SET_ERROR:
      state.error = action.payload.error
      break
    case ActionType.SET_GLYPH:
      state.glyph = action.payload.glyph
      break
    case ActionType.SET_GLYPHS:
      state.glyphs = action.payload.glyphs
      break
    case ActionType.SET_LOADING:
      state.loading = action.payload.loading
      break
    case ActionType.SET_QUERY:
      state.query = action.payload.query
      break
  }

  return state
}
