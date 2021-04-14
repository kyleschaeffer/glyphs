import { UNICODE_VERSION } from './config/unicode'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('worker.js')
    } catch (e) {
      console.error('Failed to register service worker: ', e)
    }
  })
}

const app = document.getElementById('app')
if (app) {
  app.innerHTML = `Unicode: <a href="#">${UNICODE_VERSION}</a>`
}
console.log('Hi loaded')

const fetchGlyphs = async () => {
  const glyphs = await import('./glyphs/13.0.0.json')
  console.log(new Map(glyphs))
}
fetchGlyphs()
