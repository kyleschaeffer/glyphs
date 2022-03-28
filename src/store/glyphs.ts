import { Accessor, createMemo } from 'solid-js'
import { createStore } from 'solid-js/store'
import { UNICODE_VERSION } from '../config'
import { Glyph, GlyphsData } from './types'

export type GlyphsState = {
  count: string
  error: string | null
  glyphs: Map<string, Glyph>
  loading: boolean
}

let count: Accessor<string>
const [state, setState] = createStore<GlyphsState>({
  get count() {
    return count()
  },
  error: null,
  glyphs: new Map(),
  loading: true,
})
count = createMemo(() => state.glyphs.size.toLocaleString())

export { state }
export const setError = (error: string) => setState({ error, glyphs: new Map() })
export const setGlyphs = (data: GlyphsData) => setState({ error: null, glyphs: new Map(data) })
export const setLoading = (loading: boolean) => setState('loading', loading)

export const loadGlyphs = async () => {
  setLoading(true)
  try {
    const response = await fetch(`/glyphs/${UNICODE_VERSION}.json`)
    if (!response.ok) throw new Error(response.statusText)
    const data: GlyphsData = await response.json()
    setGlyphs(data)
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Something went wrong')
  } finally {
    setLoading(false)
  }
}
