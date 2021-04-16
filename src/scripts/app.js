import * as config from './config.js'

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

const app = document.getElementById('app')
if (app) {
  app.innerHTML = `Unicode: <a href="#">${config.UNICODE_VERSION}</a>`
}
console.log('Hi loaded')

const fetchGlyphs = async () => {
  const glyphs = await fetch(`../glyphs/${config.UNICODE_VERSION}.json`).then((res) => res.json())
  console.log(new Map(glyphs))
}
fetchGlyphs()
