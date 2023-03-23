import { Block, Glyph } from '../workers/types'
import { AppStoreSlice } from './app'

export type GlyphStoreSlice = {
  glyph: Glyph | null
  glyphBlock: Block | null
  glyphLigature: Glyph[]
  glyphRoute: string | null
  loadingGlyph: boolean

  setGlyphRoute: (route: string | null) => Promise<void>
}

export const createGlyphStoreSlice: AppStoreSlice<GlyphStoreSlice> = (set, get, store) => ({
  glyph: null,
  glyphBlock: null,
  glyphLigature: [],
  glyphRoute: null,
  loadingGlyph: false,

  async setGlyphRoute(route) {
    set((draft) => {
      draft.glyphRoute = route
      draft.glyph = null
      draft.glyphBlock = null
      draft.glyphLigature = []
      if (route) draft.loadingGlyph = true
    })
    if (!route) return

    const { block, glyph, ligature } = await get().getGlyph(route)
    set((draft) => {
      draft.glyph = glyph
      draft.glyphBlock = block
      draft.glyphLigature = ligature
      draft.loadingGlyph = false
    })
  },
})
