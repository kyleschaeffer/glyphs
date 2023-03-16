import { getColorSchemePreference } from '../core/browser'
import { AppStoreSlice, useAppStore } from './app'

export type Font = 'sans' | 'serif'
export type Theme = 'dark' | 'light'

export type ThemeStoreSlice = {
  font: Font
  theme: Theme

  initTheme: () => void
  setFont: (font: Font) => void
  setTheme: (theme: Theme) => void
}

export const createThemeStoreSlice: AppStoreSlice<ThemeStoreSlice> = (set, get, store) => ({
  font: 'sans',
  theme: getColorSchemePreference(),

  initTheme() {
    const { font, theme, setFont, setTheme } = get()
    setFont(font)
    setTheme(theme)
  },

  setFont: (font) => {
    set((draft) => {
      draft.font = font
    })
    if (font === 'serif') document.body.classList.add('font-serif')
    else document.body.classList.remove('font-serif')
  },

  setTheme: (theme) => {
    set((draft) => {
      draft.theme = theme
    })
    if (theme === 'light') document.body.classList.add('theme-light')
    else document.body.classList.remove('theme-light')
  },
})
