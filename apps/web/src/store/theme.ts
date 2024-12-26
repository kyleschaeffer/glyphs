import { getColorSchemePreference } from '../utils/browser'
import { AppStoreSlice } from './app'

export type Font = 'sans' | 'serif' | 'mono'
export type Theme = 'dark' | 'light'

export type ThemeStoreSlice = {
  font: Font
  theme: Theme

  setFont: (font: Font) => void
  setTheme: (theme: Theme) => void
}

export const createThemeStoreSlice: AppStoreSlice<ThemeStoreSlice> = (set) => ({
  font: 'sans',
  theme: getColorSchemePreference(),

  setFont(font) {
    set((draft) => {
      draft.font = font
      return { ...draft }
    })
  },

  setTheme(theme) {
    set((draft) => {
      draft.theme = theme
      return { ...draft }
    })
  },
})
