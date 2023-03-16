import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { BlockStoreSlice, createBlockStoreSlice } from './block'
import { createGlyphStoreSlice, GlyphStoreSlice } from './glyph'
import { createScriptStoreSlice, ScriptStoreSlice } from './script'
import { createSearchStoreSlice, SearchStoreSlice } from './search'
import { createThemeStoreSlice, ThemeStoreSlice } from './theme'
import { createWorkerStoreSlice, WorkerStoreSlice } from './worker'

export type AppStore = BlockStoreSlice &
  GlyphStoreSlice &
  ScriptStoreSlice &
  SearchStoreSlice &
  ThemeStoreSlice &
  WorkerStoreSlice

type AppStoreMutators = [['zustand/persist', unknown], ['zustand/immer', never]]
export type AppStoreSlice<T> = StateCreator<AppStore, AppStoreMutators, [], T>

const PERSISTED_STORE_KEY = 'glyphs'

export const useAppStore = create<AppStore, AppStoreMutators>(
  persist(
    immer((...all) => ({
      ...createBlockStoreSlice(...all),
      ...createGlyphStoreSlice(...all),
      ...createScriptStoreSlice(...all),
      ...createSearchStoreSlice(...all),
      ...createThemeStoreSlice(...all),
      ...createWorkerStoreSlice(...all),
    })),
    {
      name: PERSISTED_STORE_KEY,
      partialize: ({ font, theme }) => ({
        font,
        theme,
      }),
    }
  )
)

/**
 * Clear persisted store state from local storage
 */
export function clearPersistedStore() {
  localStorage.removeItem(PERSISTED_STORE_KEY)
}
