import { Block } from '@glyphs/core'
import { AppStoreSlice } from './app'

export type BlockStoreSlice = {
  block: Block | null
  blocks: [slug: string, label: string][]
  blockRoute: string | null
  loadingBlock: boolean

  setBlockRoute: (route: string | null) => Promise<void>
}

export const createBlockStoreSlice: AppStoreSlice<BlockStoreSlice> = (set, get) => ({
  block: null,
  blocks: [],
  blockRoute: null,
  loadingBlock: false,

  async setBlockRoute(route) {
    set((draft) => {
      draft.blockRoute = route
      if (!route) draft.block = null
      else draft.loadingBlock = true

      return { ...draft }
    })
    if (!route) return

    const { block } = await get().getBlock(route)
    set((draft) => {
      draft.block = block
      draft.loadingBlock = false
      return { ...draft }
    })
  },
})
