'use strict'

import { UNICODE_VERSION } from '../config.js'
import { Search } from '../search.js'
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
        <div>Enter a character or keywords to search</div>
        <div>Searching <b -bind="glyphsCount"></b> glyphs in <a -bind-attr="href" -bind-attr-value="unicodeLinkUrl" target="_blank" rel="nofollow">Unicode <span -bind="unicodeVersion"></span></a></div>
      </div>
    </div>
  `

  style = `
    .app {
      text-align: center;
    }

    .search {
      border: 1px solid rgb(0 0 0 / 10%);
      border-radius: 1.75em;
      font-size: 18px;
      height: 3.5em;
      padding: 0 1.5em;
      width: 60vw;
    }

    .search:focus {
      border-color: var(--color-primary);
      outline: 0;
    }

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
     * Glyph count
     */
    glyphsCount: '',

    /**
     * Glyph loading state
     */
    loading: false,

    /**
     * Search query text
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

    /**
     * Unicode link URL
     */
    unicodeLinkUrl: `https://www.unicode.org/versions/Unicode${UNICODE_VERSION}/`,

    /**
     * Unicode version
     */
    unicodeVersion: UNICODE_VERSION,
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
    this.setState('glyphs', new Map(data))
    this.setState('glyphsCount', this.state.glyphs.size.toLocaleString())
    this.setState('loading', false)
    this.search = new Search()
    this.state.glyphs.forEach((glyph, key) =>
      this.search.add(key, ...[glyph.u, glyph.n, glyph.e, glyph.k].filter((s) => s))
    )
    console.log(this.search, this.state.glyphs.get(this.search.search('quot')[0]))
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
    this.updateHashTimer = window.setTimeout(() => this.updateHash(), 500)
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
