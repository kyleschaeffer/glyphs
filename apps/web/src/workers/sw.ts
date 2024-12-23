import { log } from '@glyphs/core'

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return
  }
  try {
    await navigator.serviceWorker.register(new URL('./sw.worker', import.meta.url), { type: 'module' })
  } catch (e) {
    log.error('Failed to register service worker', { cause: e as Error })
  }
}
