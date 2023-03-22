import { Glyph } from '../workers/types'
import { AppStoreSlice } from './app'

export type GlyphStoreSlice = {
  glyph: Glyph | null
  glyphLigature: Glyph[]
  glyphRoute: string | null
  loadingGlyph: boolean

  setGlyphRoute: (route: string | null) => Promise<void>
}

export const createGlyphStoreSlice: AppStoreSlice<GlyphStoreSlice> = (set, get, store) => ({
  glyph: null,
  glyphLigature: [],
  glyphRoute: null,
  loadingGlyph: false,

  async setGlyphRoute(route) {
    set((draft) => {
      draft.glyphRoute = route
      if (!route) {
        draft.glyph = null
        draft.glyphLigature = []
      } else draft.loadingGlyph = true
    })
    if (!route) return

    const { glyph, ligature } = await get().getGlyph(route)
    set((draft) => {
      draft.glyph = glyph
      draft.glyphLigature = ligature
      draft.loadingGlyph = false
    })
  },
})
