import { Script } from '../workers/types'
import { AppStoreSlice, useAppStore } from './app'

export type ScriptStoreSlice = {
  script: Script | null
  scriptRoute: string | null
  loadingScript: boolean

  initScript: () => void
  setScriptRoute: (route: string | null) => void
}

export const createScriptStoreSlice: AppStoreSlice<ScriptStoreSlice> = (set, get, store) => ({
  script: null,
  scriptRoute: null,
  loadingScript: false,

  initScript() {
    get().subscribe((message) => {
      if (message.type !== 'SCRIPT_RESPONSE') return
      useAppStore.setState((draft) => {
        draft.script = message.payload.script
        draft.loadingScript = false
      })
    })
  },

  setScriptRoute(route) {
    set((draft) => {
      draft.scriptRoute = route
      if (!route) draft.script = null
      else draft.loadingScript = true
    })
    if (!route) return
    get().post({ type: 'SCRIPT_REQUEST', payload: { slug: route } })
  },
})
