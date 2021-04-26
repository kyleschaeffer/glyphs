import { Glyph } from '../types/glyphs'

export type Action<T extends string, P, M> = {
  type: T
  payload: P
  meta: M
}

const createAction = <T extends string, P, M>(type: T, payload: P, meta: M): Action<T, P, M> => ({
  type,
  payload,
  meta,
})

export type GlyphsAction = ReturnType<
  typeof setError | typeof setGlyph | typeof setGlyphs | typeof setLoading | typeof setQuery
>

export enum ActionType {
  SET_ERROR = 'glyphs/SET_ERROR',
  SET_GLYPH = 'glyphs/SET_GLYPH',
  SET_GLYPHS = 'glyphs/SET_GLYPHS',
  SET_LOADING = 'glyphs/SET_LOADING',
  SET_QUERY = 'glyphs/SET_QUERY',
}

export const setError = (error: string | null) => createAction(ActionType.SET_ERROR, { error }, {})
export const setGlyph = (glyph: string | null) => createAction(ActionType.SET_GLYPH, { glyph }, {})
export const setGlyphs = (glyphs: Map<string, Glyph>) => createAction(ActionType.SET_GLYPHS, { glyphs }, {})
export const setLoading = (loading: boolean) => createAction(ActionType.SET_LOADING, { loading }, {})
export const setQuery = (query: string) => createAction(ActionType.SET_QUERY, { query }, {})
