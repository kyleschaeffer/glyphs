import { registerSearchWorker } from '../workers/search'
import { registerServiceWorker } from '../workers/sw'
import { ClientRequestMessage, WorkerResponseMessage } from '../workers/types'
import { AppStoreSlice } from './app'

export type WorkerListener = (message: WorkerResponseMessage) => void
export type Unsubscribe = () => void

export type WorkerStoreSlice = {
  workerReady: boolean

  post: (message: ClientRequestMessage) => void
  startWorkers: () => void
  subscribe: (listener: WorkerListener) => Unsubscribe
}

export const createWorkerStoreSlice: AppStoreSlice<WorkerStoreSlice> = (set, get, store) => ({
  workerReady: false,

  post(message) {
    if (!get().workerReady) messageQueue.push(message)
    else postMessage(message)
  },

  startWorkers() {
    get().subscribe((message) => {
      if (message.type !== 'WORKER_READY') return
      set((draft) => {
        draft.workerReady = true
        draft.glyphCount = message.payload.count
      })
      const { initBlock, initGlyph, initScript, initSearch } = get()
      initBlock()
      initGlyph()
      initScript()
      initSearch()
    })

    void registerServiceWorker()
    postMessage = registerSearchWorker((message) => listeners.forEach((listener) => listener(message)))
  },

  subscribe(listener) {
    listeners.push(listener)
    return () => (listeners = listeners.filter((l) => l !== listener))
  },
})

let listeners: ((message: WorkerResponseMessage) => void)[] = []
let messageQueue: ClientRequestMessage[] = []
let postMessage: (message: ClientRequestMessage) => void = (message) => messageQueue.push(message)
