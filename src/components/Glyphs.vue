<template>
  <div class="glyphs">
    <button
      v-for="(result, i) in results"
      :key="i"
      :title="result.item.n"
      @click.prevent="$emit('glyph-select', result.item.c)"
    ><span class="label">{{ result.item.n }}</span><span class="glyph-char">{{ result.item.c }}</span></button>

    <div v-if="searching" class="searching">Searching&hellip;</div>

    <div v-if="!searching && !results.length">
      <div class="empty">No glyphs found: <strong>{{ query }}</strong></div>
      <tabs
        class="query-info"
        :tabs="[
          { name: 'HTML', id: 'h' },
          { name: 'CSS', id: 'c' },
          { name: 'JavaScript', id: 'j' },
          { name: 'Unicode', id: 'u' },
        ]"
        :selected="tab"
        @select-tab="$emit('select-tab', $event)"
      >
        <div id="h" class="tab-panel">
          <div class="codes">
            <h3>Values:</h3>
            <div v-for="(entity, i) in html(query)" :key="i" class="code">
              <pre :id="`html-code-${i}`">{{ entity }}</pre>
              <button class="copy" title="Copy to clipboard" :data-clipboard-target="`#html-code-${i}`"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
            </div>
          </div>
          <div class="examples">
            <h3>Examples:</h3>
            <div v-for="(entity, i) in html(query)" :key="i" class="example">
              <pre :id="`html-example-${i}`" class="html">&lt;i&gt;<span>{{ entity }}</span>&lt;/i&gt;</pre>
              <button class="copy" title="Copy to clipboard" :data-clipboard-target="`#html-example-${i}`"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
            </div>
          </div>
        </div>
        <div id="c" class="tab-panel">
          <div class="codes">
            <h3>Values:</h3>
            <div v-for="(code, i) in css(query)" :key="i" class="code">
              <pre :id="`css-code-${i}`">{{ code }}</pre>
              <button class="copy" title="Copy to clipboard" :data-clipboard-target="`#css-code-${i}`"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
            </div>
          </div>
          <div class="examples">
            <h3>Examples:</h3>
            <div v-for="(code, i) in css(query)" :key="i" class="example">
              <pre :id="`css-example-${i}`" class="css">content: '<span>{{ code.replace(/'/g, '\\\'') }}</span>';</pre>
              <button class="copy" title="Copy to clipboard" :data-clipboard-target="`#css-example-${i}`"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
            </div>
          </div>
        </div>
        <div id="j" class="tab-panel">
          <div class="codes">
            <h3>Values:</h3>
            <div class="code">
              <pre id="js-code-0">{{ escapedJs(query) }}</pre>
              <button class="copy" title="Copy to clipboard" data-clipboard-target="#js-code-0"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
            </div>
            <div class="code">
              <pre id="js-code-1">{{ js(query) }}</pre>
              <button class="copy" title="Copy to clipboard" data-clipboard-target="#js-code-1"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
            </div>
          </div>
          <div class="examples">
            <h3>Examples:</h3>
            <div class="example">
              <pre id="js-example-0" class="js">let s = "<span>{{ escapedJs(query) }}</span>";</pre>
              <button class="copy" title="Copy to clipboard" data-clipboard-target="#js-example-0"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
            </div>
            <div class="example">
              <pre id="js-example-1" class="js">let s = "<span>{{ js(query) }}</span>";</pre>
              <button class="copy" title="Copy to clipboard" data-clipboard-target="#js-example-1"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
            </div>
          </div>
        </div>
        <div id="u" class="tab-panel">
          <div class="codes">
            <h3>Hexadecimal:</h3>
            <div class="code">
              <pre id="hex-code">{{ hexes(query).join(' ') }}</pre>
              <button class="copy" title="Copy to clipboard" data-clipboard-target="#hex-code"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
            </div>
          </div>
          <div class="examples">
            <h3>Decimal:</h3>
            <div class="code">
              <pre id="decimal-code">{{ decimals(query).map(d => parseInt(d, 16).toString()).join(' ') }}</pre>
              <button class="copy" title="Copy to clipboard" data-clipboard-target="#decimal-code"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
            </div>
          </div>
        </div>
      </tabs>
    </div>
  </div>
</template>

<script>
import Tabs from './Tabs.vue'
import * as utility from '../utility'

export default {
  components: {
    Tabs,
  },

  props: {
    query: { type: String, required: true },
    results: { type: Array, default: () => [] },
    searching: Boolean,
    tab: { type: String, default: 'h' },
  },

  methods: {
    js (query) {
      return utility.strToJs(query).join('')
    },

    escapedJs (query) {
      const json = JSON.stringify(query)
      return json.substring(1, json.length - 1)
    },

    html (query) {
      const html = []
      const specials = ['"', '\'', '&', '<', '>']
      const entities = ['&quot;', '&apos;', '&amp;', '&lt;', '&gt;']
      let str = ''
      for (let c of query) {
        str += specials.indexOf(c) === -1 ? c : entities[specials.indexOf(c)]
      }
      html.push(str)
      const htmlHexes = utility.strToHtml(query)
      if (htmlHexes.length === 1) html.push(`&#x${htmlHexes[0]};`)
      return html
    },

    css (query) {
      const css = [query]
      css.push(utility.strToCss(query).join(''))
      return css
    },

    decimals (query) {
      const decimals = []
      for (let c of query) {
        decimals.push(utility.charToDecimal(c))
      }
      return decimals
    },

    hexes (query) {
      const hexes = []
      for (let c of query) {
        hexes.push(utility.charToHex(c))
      }
      return hexes
    },
  },
}
</script>
