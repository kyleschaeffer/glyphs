import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BlockStoreSlice, createBlockStoreSlice } from './block'
import { GlyphStoreSlice, createGlyphStoreSlice } from './glyph'
import { ScriptStoreSlice, createScriptStoreSlice } from './script'
import { SearchStoreSlice, createSearchStoreSlice } from './search'
import { ThemeStoreSlice, createThemeStoreSlice } from './theme'
import { WorkerStoreSlice, createWorkerStoreSlice } from './worker'

export type AppStore = BlockStoreSlice &
  GlyphStoreSlice &
  ScriptStoreSlice &
  SearchStoreSlice &
  ThemeStoreSlice &
  WorkerStoreSlice

type AppStoreMutators = [['zustand/persist', unknown]]
export type AppStoreSlice<T> = StateCreator<AppStore, AppStoreMutators, [], T>

const PERSISTED_STORE_KEY = 'glyphs'

export const useAppStore = create<AppStore, AppStoreMutators>(
  persist(
    (...all) => ({
      ...createBlockStoreSlice(...all),
      ...createGlyphStoreSlice(...all),
      ...createScriptStoreSlice(...all),
      ...createSearchStoreSlice(...all),
      ...createThemeStoreSlice(...all),
      ...createWorkerStoreSlice(...all),
    }),
    {
      name: PERSISTED_STORE_KEY,
      partialize: ({ font, theme }) => ({
        font,
        theme,
      }),
    }
  )
)
