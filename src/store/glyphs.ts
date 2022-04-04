import { createStore } from 'solid-js/store'
import { UNICODE_VERSION } from '../config'
import { search } from '../store'
import type { Glyph } from './types'

export type GlyphsState = {
  count: string
  error: string | null
  loading: boolean
}

const [state, setState] = createStore<GlyphsState>({
  count: '0',
  error: null,
  loading: true,
})
export { state }

export const setCount = (count: number) => setState({ count: count.toLocaleString(), error: null })

export const setError = (error: string) => setState({ count: '0', error })

export const setLoading = (loading: boolean) => setState({ loading })

export const loadGlyphs = async () => {
  setLoading(true)
  try {
    const response = await fetch(`/glyphs/${UNICODE_VERSION}.json`)
    if (!response.ok) throw new Error(response.statusText)
    const glyphs: Glyph[] = await response.json()
    setCount(glyphs.length)
    search.indexGlyphs(glyphs)
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Something went wrong')
  } finally {
    setLoading(false)
  }
}
