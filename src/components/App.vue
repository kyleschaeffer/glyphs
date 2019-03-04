<template>
  <div class="app">
    <search ref="search" v-if="!select" v-model="query" :loading="loading" placeholder="Search glyphs"></search>
    <main class="main" role="main">
      <glyphs v-if="query.length && !select" :results="results" :searching="searching" @glyph-select="selectGlyph"></glyphs>
      <char v-if="select" :glyph="select" :tab="tab" @glyph-close="unselectGlyph" @select-tab="selectTab"></char>
      <splash v-if="!select && !query && !results.length" :count="fuse && fuse.fuse && fuse.fuse.list ? fuse.fuse.list.length : 0"></splash>
    </main>
    <colophon></colophon>
  </div>
</template>

<script>
import { clearTimeout, setTimeout } from 'timers';
import axios from 'axios';
import Char from './Char.vue';
import ClipboardJS from 'clipboard';
import Colophon from './Colophon.vue';
import Fuse from '../fuse';
import Glyphs from './Glyphs.vue';
import queryString from 'query-string';
import Search from './Search.vue';
import Splash from './Splash.vue';

export default {
  components: {
    Char,
    Colophon,
    Glyphs,
    Search,
    Splash,
  },

  data() {
    return {
      fuse: null,
      query: '',
      lastQuery: null,
      results: [],
      select: null,
      tab: 'h',
      loading: true,
      searchTimer: null,
      searchDelay: 500,
      searching: false,
    };
  },

  computed: {
    stateHash() {
      return `#q=${encodeURIComponent(this.query)}${this.select ? `&c=${encodeURIComponent(this.select.c)}` : ''}${this.tab != 'h' ? `&t=${this.tab}` : ''}`;
    },
  },

  watch: {
    query() {
      clearTimeout(this.searchTimer);
      this.searching = true;
      this.searchTimer = setTimeout(this.search, 500);
    },
  },

  async mounted() {
    // Get glyph data
    try {
      const glyphs = await axios.get('glyphs/unicode-11.0.0.json');
      this.fuse = Fuse.init(glyphs.data.glyphs);
    } catch (e) {
      console.error(e);
    }

    // Load state
    this.hashChange();

    // Handle hash changes
    window.addEventListener('hashchange', this.hashChange);

    // Close on escape
    window.addEventListener('keyup', e => {
      if (e.keyCode === 27) this.unselectGlyph();
    });

    // Copy to clipboard
    const clipboard = new ClipboardJS('.copy');
    clipboard.on('success', function(e) {
      e.trigger.classList.add('copied');
      setTimeout(() => {
        e.trigger.classList.remove('copied');
      }, 3000);
      e.clearSelection();
    });

    // Done loading
    this.loading = false;

    // Focus on search box
    this.$refs.search.$el.querySelector('input').focus();
  },

  methods: {
    search() {
      // Query unchanged
      if (this.query === this.lastQuery) return;

      // Empty query
      if (!this.query) {
        this.results = [];
      }

      // Execute query
      else {
        this.results = this.fuse.search(this.query);
      }

      // Update last query
      this.lastQuery = this.query;

      // Update state hash
      this.updateHash();

      // Scroll top
      this.scrollTop();

      // Not searching
      this.searching = false;
    },

    selectGlyph(char) {
      this.scrollTop();
      this.select = this.fuse.find(char);
      this.updateHash();
    },

    unselectGlyph() {
      this.select = null;
      this.updateHash();
    },

    selectTab(id) {
      this.tab = id;
      this.updateHash();
    },

    hashChange() {
      // Get hash
      const { q, c, t } = queryString.parse(location.hash);

      // Update state
      this.query = q ? decodeURIComponent(q) : '';
      this.select = c ? this.fuse.find(decodeURIComponent(c)) : null;
      this.tab = t ? t : 'h';
    },

    updateHash() {
      const newStateHash = this.stateHash;
      if (location.hash != newStateHash) location.hash = newStateHash;
    },

    scrollTop() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
  },
};
</script>
