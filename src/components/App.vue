<template>
  <div class="app">
    <search
      v-if="!select"
      ref="search"
      v-model="query"
      :loading="loading"
      placeholder="Search glyphs"
    ></search>

    <main class="main" role="main">
      <glyphs
        v-if="query.length && !select"
        :query="query"
        :tab="tab"
        :results="results"
        :searching="searching"
        @glyph-select="selectGlyph"
        @select-tab="selectTab"
      ></glyphs>

      <char
        v-if="select !== null"
        :glyph="select"
        :tab="tab"
        @glyph-close="unselectGlyph"
        @select-tab="selectTab"
      ></char>

      <splash
        v-if="!select && !query && !results.length"
        :count="collection ? collection.items().length : 0"
      ></splash>
    </main>

    <footer class="colophon" role="contentinfo">Glyphs by <a href="https://twitter.com/kyleschaeffer">@kyleschaeffer</a></footer>
  </div>
</template>

<script>
import { clearTimeout, setTimeout } from 'timers'
import { Collection } from '../collection'
import axios from 'axios'
import Char from './Char.vue'
import ClipboardJS from 'clipboard'
import Glyphs from './Glyphs.vue'
import queryString from 'query-string'
import Search from './Search.vue'
import Splash from './Splash.vue'

export default {
  components: {
    Char,
    Glyphs,
    Search,
    Splash,
  },

  data() {
    return {
      collection: null,
      lastQuery: null,
      loading: true,
      query: '',
      results: [],
      searchDelay: 500,
      searching: false,
      searchTimer: null,
      select: null,
      tab: 'h',
    }
  },

  computed: {
    stateHash() {
      return `#q=${encodeURIComponent(this.query)}${this.select ? `&c=${encodeURIComponent(this.select.c)}` : ''}${this.tab != 'h' ? `&t=${this.tab}` : ''}`
    },
  },

  watch: {
    query() {
      clearTimeout(this.searchTimer)
      this.searching = true
      this.searchTimer = setTimeout(this.search, 500)
    },
  },

  async mounted() {
    // Get glyph data
    try {
      const glyphs = await axios.get('glyphs/unicode-11.0.0.json')
      this.collection = Collection.init(glyphs.data.glyphs)
    } catch (e) {
      console.error(e)
    }

    // Load state
    this.hashChange()

    // Handle hash changes
    window.addEventListener('hashchange', this.hashChange)

    // Close on escape
    window.addEventListener('keyup', e => {
      if (e.keyCode === 27) this.unselectGlyph()
    })

    // Copy to clipboard
    const clipboard = new ClipboardJS('.copy')
    clipboard.on('success', function(e) {
      e.trigger.classList.add('copied')
      setTimeout(() => {
        e.trigger.classList.remove('copied')
      }, 3000)
      e.clearSelection()
    })

    // Done loading
    this.loading = false

    // Focus on search box
    this.$refs.search.$el.querySelector('input').focus()
  },

  methods: {
    search() {
      // Query unchanged
      if (this.query === this.lastQuery) return

      // Empty query
      if (!this.query) {
        this.results = []
      }

      // Execute query
      else {
        this.results = this.collection.search(this.query)
      }

      // Update last query
      this.lastQuery = this.query

      // Update state hash
      this.updateHash()

      // Scroll top
      this.scrollTop()

      // Not searching
      this.searching = false
    },

    selectGlyph(char) {
      this.scrollTop()
      this.select = this.collection.find(char)
      this.updateHash()
    },

    unselectGlyph() {
      this.select = null
      this.updateHash()
    },

    selectTab(id) {
      this.tab = id
      this.updateHash()
    },

    hashChange() {
      // Get hash
      const { q, c, t } = queryString.parse(location.hash)

      // Update state
      this.query = q ? decodeURIComponent(q) : ''
      this.select = c ? this.collection.find(decodeURIComponent(c)) : null
      this.tab = t ? t : 'h'

      // Update document title
      if (this.select) document.title = `Glyphs - ${this.select.c} - ${this.select.n}`
      else if (q) document.title = `Glyphs - ${q}`
      else document.title = 'Glyphs'
    },

    updateHash() {
      const newStateHash = this.stateHash
      if (location.hash != newStateHash) location.hash = newStateHash
    },

    scrollTop() {
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
  },
}
</script>
