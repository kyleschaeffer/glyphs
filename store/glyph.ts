import { Glyph } from '../workers/types'
import { AppStoreSlice, useAppStore } from './app'

export type GlyphStoreSlice = {
  glyph: Glyph | null
  glyphLigature: Glyph[]
  glyphRoute: string | null
  loadingGlyph: boolean

  initGlyph: () => void
  setGlyphRoute: (route: string | null) => void
}

export const createGlyphStoreSlice: AppStoreSlice<GlyphStoreSlice> = (set, get, store) => ({
  glyph: null,
  glyphLigature: [],
  glyphRoute: null,
  loadingGlyph: false,

  initGlyph() {
    get().subscribe((message) => {
      if (message.type !== 'GLYPH_RESPONSE') return
      useAppStore.setState((draft) => {
        draft.glyph = message.payload.glyph
        draft.glyphLigature = message.payload.ligature
        draft.loadingGlyph = false
      })
    })
  },

  setGlyphRoute(route) {
    set((draft) => {
      draft.glyphRoute = route
      if (!route) {
        draft.glyph = null
        draft.glyphLigature = []
      } else draft.loadingGlyph = true
    })
    if (!route) return
    get().post({ type: 'GLYPH_REQUEST', payload: { char: route } })
  },
})
