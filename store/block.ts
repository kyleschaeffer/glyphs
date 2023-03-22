import { Block } from '../workers/types'
import { AppStoreSlice } from './app'

export type BlockStoreSlice = {
  block: Block | null
  blockRoute: string | null
  loadingBlock: boolean

  setBlockRoute: (route: string | null) => Promise<void>
}

export const createBlockStoreSlice: AppStoreSlice<BlockStoreSlice> = (set, get, store) => ({
  block: null,
  blockRoute: null,
  loadingBlock: false,

  async setBlockRoute(route) {
    set((draft) => {
      draft.blockRoute = route
      if (!route) draft.block = null
      else draft.loadingBlock = true
    })
    if (!route) return

    const { block } = await get().getBlock(route)
    set((draft) => {
      draft.block = block
      draft.loadingBlock = false
    })
  },
})
