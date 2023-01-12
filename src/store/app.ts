import { StateCreator } from 'zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createUIStoreSlice, UIStoreSlice } from './ui'
import { createGlyphStoreSlice, GlyphStoreSlice } from './glyph'

export type AppStore = UIStoreSlice & GlyphStoreSlice

type AppStoreMutators = [['zustand/persist', unknown], ['zustand/immer', never]]
export type AppStoreSlice<T> = StateCreator<AppStore, AppStoreMutators, [], T>

const PERSISTED_STORE_KEY = 'glyphs'

export const useAppStore = create<AppStore, AppStoreMutators>(
  persist(
    immer((...all) => ({
      ...createUIStoreSlice(...all),
      ...createGlyphStoreSlice(...all),
    })),
    {
      name: PERSISTED_STORE_KEY,
      partialize: ({ theme }) => ({
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
