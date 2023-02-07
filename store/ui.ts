import { getColorSchemePreference } from '../core/browser'
import { AppStoreSlice } from './app'

export type Font = 'sans' | 'serif'
export type Theme = 'dark' | 'light'

export type UIStoreSlice = {
  font: Font
  theme: Theme

  setFont: (font: Font) => void
  setTheme: (theme: Theme) => void
}

export const createUIStoreSlice: AppStoreSlice<UIStoreSlice> = (set, get, store) => ({
  font: 'sans',
  theme: getColorSchemePreference(),

  setFont: (font) =>
    set((draft) => {
      draft.font = font
    }),

  setTheme: (theme) =>
    set((draft) => {
      draft.theme = theme
    }),
})
