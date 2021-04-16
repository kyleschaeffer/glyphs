import './components/app.js'

/**
 * @typedef Glyph
 * @property {string}  u Unicode value
 * @property {string}  h Space-separated hexadecimal values
 * @property {string}  n Glyph name
 * @property {string=} k Comma-separated glyph keyword phrases
 * @property {string=} e Space-separated HTML entity names
 */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('worker.js')
    } catch (e) {
      console.error('Failed to register service worker: ', e)
    }
  })
}
