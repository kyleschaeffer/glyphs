export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    return
  }
  try {
    await navigator.serviceWorker.register(new URL('./sw.worker.ts', import.meta.url))
  } catch (e) {
    console.error('Failed to register service worker:', e)
  }
}
