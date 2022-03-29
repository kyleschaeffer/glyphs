import { Accessor, createMemo } from 'solid-js'
import { createStore } from 'solid-js/store'
import { UNICODE_VERSION } from '../config'
import { Glyph } from './types'

export type GlyphsState = {
  count: string
  error: string | null
  glyphs: Glyph[]
  loading: boolean
}

let count: Accessor<string>
const [state, setState] = createStore<GlyphsState>({
  get count() {
    return count()
  },
  error: null,
  glyphs: [],
  loading: true,
})
count = createMemo(() => state.glyphs.length.toLocaleString())

export { state }
export const setError = (error: string) => setState({ error, glyphs: [] })
export const setGlyphs = (glyphs: Glyph[]) => setState({ error: null, glyphs })
export const setLoading = (loading: boolean) => setState('loading', loading)

export const loadGlyphs = async () => {
  setLoading(true)
  try {
    const response = await fetch(`/glyphs/${UNICODE_VERSION}.json`)
    if (!response.ok) throw new Error(response.statusText)
    const glyphs: Glyph[] = await response.json()
    setGlyphs(glyphs)
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Something went wrong')
  } finally {
    setLoading(false)
  }
}
