import { getColorSchemePreference } from '../core/browser'
import { AppStoreSlice } from './app'

export type Theme = 'dark' | 'light'

export type UIStoreSlice = {
  theme: Theme

  setTheme: (theme: Theme) => void
}

export const createUIStoreSlice: AppStoreSlice<UIStoreSlice> = (set, get, store) => ({
  theme: getColorSchemePreference(),

  setTheme: (theme) =>
    set((draft) => {
      draft.theme = theme
    }),
})
