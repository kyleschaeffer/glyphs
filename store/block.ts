import { Block } from '../workers/types'
import { AppStoreSlice, useAppStore } from './app'

export type BlockStoreSlice = {
  block: Block | null
  blockRoute: string | null
  loadingBlock: boolean

  initBlock: () => void
  setBlockRoute: (route: string | null) => void
}

export const createBlockStoreSlice: AppStoreSlice<BlockStoreSlice> = (set, get, store) => ({
  block: null,
  blockRoute: null,
  loadingBlock: false,

  initBlock() {
    get().subscribe((message) => {
      if (message.type !== 'BLOCK_RESPONSE') return
      useAppStore.setState((draft) => {
        draft.block = message.payload.block
        draft.loadingBlock = false
      })
    })
  },

  setBlockRoute(route) {
    set((draft) => {
      draft.blockRoute = route
      if (!route) draft.block = null
      else draft.loadingBlock = true
    })
    if (!route) return
    get().post({ type: 'BLOCK_REQUEST', payload: { slug: route } })
  },
})
