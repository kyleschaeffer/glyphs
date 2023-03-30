import { createResolver, Resolver } from '../core/async'
import { registerSearchWorker } from '../workers/search'
import { registerServiceWorker } from '../workers/sw'
import {
  BlockResponseMessage,
  ClientRequestMessage,
  GlyphResponseMessage,
  QueryResponseMessage,
  ScriptResponseMessage,
} from '../workers/types'
import { AppStoreSlice } from './app'

export type WorkerStoreSlice = {
  workerReady: boolean

  getBlock: (slug: string) => Promise<BlockResponseMessage['payload']>
  getGlyph: (char: string) => Promise<GlyphResponseMessage['payload']>
  getScript: (slug: string) => Promise<ScriptResponseMessage['payload']>
  search: (query: string) => Promise<QueryResponseMessage['payload']>
  startWorkers: () => void
}

export const createWorkerStoreSlice: AppStoreSlice<WorkerStoreSlice> = (set, get, store) => ({
  workerReady: false,

  async getBlock(slug) {
    getBlockResolver?.reject('Canceled')
    getBlockResolver = createResolver()
    postMessage({ type: 'BLOCK_REQUEST', payload: { slug } })
    return getBlockResolver.promise
  },

  async getGlyph(char) {
    getGlyphResolver?.reject('Canceled')
    getGlyphResolver = createResolver()
    postMessage({ type: 'GLYPH_REQUEST', payload: { char } })
    return getGlyphResolver.promise
  },

  async getScript(slug) {
    getScriptResolver?.reject('Canceled')
    getScriptResolver = createResolver()
    postMessage({ type: 'SCRIPT_REQUEST', payload: { slug } })
    return getScriptResolver.promise
  },

  async search(query) {
    searchResolver?.reject('Canceled')
    if (!query) return { results: [] }
    searchResolver = createResolver()
    postMessage({ type: 'QUERY_REQUEST', payload: { query } })
    return searchResolver.promise
  },

  startWorkers() {
    void registerServiceWorker()

    postMessage = registerSearchWorker((message) => {
      switch (message.type) {
        case 'WORKER_READY':
          set((draft) => {
            draft.workerReady = true
            draft.glyphCount = message.payload.count
          })
          break
        case 'BLOCK_RESPONSE':
          getBlockResolver?.resolve(message.payload)
          getBlockResolver = null
          break
        case 'GLYPH_RESPONSE':
          getGlyphResolver?.resolve(message.payload)
          getGlyphResolver = null
          break
        case 'QUERY_RESPONSE':
          searchResolver?.resolve(message.payload)
          searchResolver = null
          break
        case 'SCRIPT_RESPONSE':
          getScriptResolver?.resolve(message.payload)
          getScriptResolver = null
          break
      }
    })
  },
})

let postMessage: (message: ClientRequestMessage) => void = (message) => console.warn('Worker not ready', { message })
let getBlockResolver: Resolver<BlockResponseMessage['payload']> | null = null
let getGlyphResolver: Resolver<GlyphResponseMessage['payload']> | null = null
let getScriptResolver: Resolver<ScriptResponseMessage['payload']> | null = null
let searchResolver: Resolver<QueryResponseMessage['payload']> | null = null
