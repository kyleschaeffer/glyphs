'use strict'

import { UNICODE_VERSION } from '../config.js'
import { GlyphsComponent } from './component.js'

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
  class extends GlyphsComponent {
    constructor() {
      super({
        glyphs: new Map(),
        loading: false,
      })
    }

    template() {
      return `
        <div class="app">
          <h1>Glyphs</h1>
          <div class="loading" -if="loading">Loading&hellip;</div>
          <div class="content" -ifnot="loading">
            <slot name="content"></slot>
          </div>
        </div>
      `
    }

    style() {
      return `
        h1 {
          margin-block: 0;
        }
      `
    }

    onMount() {
      this.loadGlyphData()
    }

    async loadGlyphData() {
      this.setState('loading', true)
      const data = await fetch(`../glyphs/${UNICODE_VERSION}.json`).then((res) => res.json())
      this.state.glyphs = new Map(data)
      this.setState('loading', false)
      console.log(this.state)
    }
  }
)
