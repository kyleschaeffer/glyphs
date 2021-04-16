import * as config from '../scripts/config.js'

/**
 * @typedef Glyph
 * @property {string}  u Unicode value
 * @property {string}  h Space-separated hexadecimal values
 * @property {string}  n Glyph name
 * @property {string=} k Comma-separated glyph keyword phrases
 * @property {string=} e Space-separated HTML entity names
 */

customElements.define(
  'glyphs-app',
  class extends HTMLElement {
    constructor() {
      super()

      const templateId = `${this.tagName.toLowerCase()}-template`
      const template = document.getElementById(templateId)
      if (!template) {
        throw new Error(`Template not found: #${templateId}`)
      }

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.init()
    }

    init() {
      this.state = {
        /**
         * @type {Map<string, Glyph>} Unicode character data
         */
        glyphs: new Map(),

        /**
         * @type {boolean} Loading state
         */
        loading: false,
      }

      this.loadGlyphData()
    }

    async loadGlyphData() {
      this.state.loading = true
      const data = await fetch(`../glyphs/${config.UNICODE_VERSION}.json`).then((res) => res.json())
      this.state.glyphs = new Map(data)
      this.state.loading = false
      console.log(this.state)
    }
  }
)
