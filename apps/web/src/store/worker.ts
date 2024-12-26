import { ResolveablePromise, log, makeResolveablePromise } from '@glyphs/core'
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

let postMessage: (message: ClientRequestMessage) => void = (message) =>
  log.warn('Worker not ready', { tags: { message } })
let getBlockResolver: ResolveablePromise<BlockResponseMessage['payload']> | null = null
let getGlyphResolver: ResolveablePromise<GlyphResponseMessage['payload']> | null = null
let getScriptResolver: ResolveablePromise<ScriptResponseMessage['payload']> | null = null
let searchResolver: ResolveablePromise<QueryResponseMessage['payload']> | null = null

export const createWorkerStoreSlice: AppStoreSlice<WorkerStoreSlice> = (set) => ({
  workerReady: false,

  async getBlock(slug) {
    getBlockResolver?.reject('Canceled')
    getBlockResolver = makeResolveablePromise()
    postMessage({ type: 'BLOCK_REQUEST', payload: { slug } })
    return getBlockResolver.promise
  },

  async getGlyph(char) {
    getGlyphResolver?.reject('Canceled')
    getGlyphResolver = makeResolveablePromise()
    postMessage({ type: 'GLYPH_REQUEST', payload: { char } })
    return getGlyphResolver.promise
  },

  async getScript(slug) {
    getScriptResolver?.reject('Canceled')
    getScriptResolver = makeResolveablePromise()
    postMessage({ type: 'SCRIPT_REQUEST', payload: { slug } })
    return getScriptResolver.promise
  },

  async search(query) {
    searchResolver?.reject('Canceled')
    if (!query) return { results: [] }
    searchResolver = makeResolveablePromise()
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
            draft.blocks = message.payload.blocks
            draft.scripts = message.payload.scripts
            draft.glyphCount = message.payload.count
            return { ...draft }
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
