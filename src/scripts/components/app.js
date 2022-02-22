'use strict'

import { UNICODE_VERSION } from '../config.js'
import { GlyphsComponent } from './component.js'

/**
 * @typedef Glyph
 * @prop {string} u Unicode value
 * @prop {string} h Space-separated hexadecimal values
 * @prop {string} n Glyph name
 * @prop {string} [k] Comma-separated glyph keyword phrases
 * @prop {string} [e] Space-separated HTML entity names
 */

class App extends GlyphsComponent {
  template = `
    <div class="app">
      <h1>Glyphs</h1>
      <div class="loading" -if="loading">Loading&hellip;</div>
      <div class="content" -ifnot="loading">
        <input class="search" type="search" -value="query" />
        <textarea -value="query"></textarea>
        <div><b>Query:</b> <span -bind="query"></span></div>
        <slot name="content"></slot>
      </div>
    </div>
  `

  style = `
    h1 {
      margin-block: 0;
    }
  `

  state = {
    /**
     * Glyph data
     * @type {Map<string, Glyph>}
     */
    glyphs: new Map(),

    /**
     * Glyph loading state
     * @type {boolean}
     */
    loading: false,

    /**
     * Search query text
     * @type {string}
     */
    query: '',

    /**
     * Glyph search result keys
     * @type {string[]}
     */
    results: [],

    /**
     * Selected glyph key
     * @type {?string}
     */
    select: null,
  }

  onMount() {
    this.loadGlyphData()

    this.onHashChange()
    window.addEventListener('hashchange', () => this.onHashChange())
  }

  onUpdate() {
    this.debouncedUpdateHash()
  }

  async loadGlyphData() {
    this.setState('loading', true)
    const data = await fetch(`../glyphs/${UNICODE_VERSION}.json`).then((res) => res.json())
    this.state.glyphs = new Map(data)
    this.setState('loading', false)
    console.log(this.state)
  }

  updateHash() {
    const newHash = this.encodeState()
    if (window.location.hash === newHash) return
    const url = new URL(window.location)
    url.hash = newHash
    window.history.pushState({}, window.title, url)
  }

  debouncedUpdateHash() {
    window.clearTimeout(this.updateHashTimer)
    this.updateHashTimer = window.setTimeout(() => this.updateHash(), 250)
  }

  onHashChange() {
    const hashState = this.decodeState(window.location.hash)
    if (hashState.q !== undefined) this.setState('query', hashState.q)
    // TODO: set `select` prop from `hashState.c`
  }

  encodeState() {
    const hashState = {
      q: this.state.query,
      c: this.state.select || undefined,
    }

    const hash = `#${Object.keys(hashState)
      .filter((key) => hashState[key] !== undefined)
      .map((key) => `${key}=${encodeURIComponent(hashState[key])}`)
      .join('&')}`
    return hash
  }

  decodeState(hash) {
    const hashState = {}
    if (!hash) return hashState

    for (const param of hash.replace('#', '').split('&')) {
      const [key, value] = param
        .split('=')
        .filter((c) => c !== undefined)
        .map((c) => decodeURIComponent(c))
      if (!key || value === undefined || !['q', 'c'].includes(key)) continue

      hashState[key] = value
    }
    return hashState
  }
}

customElements.define('glyphs-app', App)
