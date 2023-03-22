import { Script } from '../workers/types'
import { AppStoreSlice } from './app'

export type ScriptStoreSlice = {
  script: Script | null
  scriptRoute: string | null
  loadingScript: boolean

  setScriptRoute: (route: string | null) => Promise<void>
}

export const createScriptStoreSlice: AppStoreSlice<ScriptStoreSlice> = (set, get, store) => ({
  script: null,
  scriptRoute: null,
  loadingScript: false,

  async setScriptRoute(route) {
    set((draft) => {
      draft.scriptRoute = route
      if (!route) draft.script = null
      else draft.loadingScript = true
    })
    if (!route) return

    const { script } = await get().getScript(route)
    set((draft) => {
      draft.script = script
      draft.loadingScript = false
    })
  },
})
