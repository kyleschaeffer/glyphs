<template>
  <div class="glyph">
    <button class="close" @click.prevent="$emit('glyph-close')">╳</button>
    <h1>{{ glyph.n }}</h1>
    <div class="glyph-box">
      <h2>
        <code id="glyph">{{ glyph.c }}</code>
        <button class="copy" title="Copy to clipboard" data-clipboard-target="#glyph"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
      </h2>
    </div>
    <tabs :tabs="[
      { name: 'HTML', id: 'h' },
      { name: 'CSS', id: 'c' },
      { name: 'JavaScript', id: 'j' },
      { name: 'Unicode', id: 'u' },
    ]" :selected="tab" @select-tab="$emit('select-tab', $event)">
      <div id="h" class="tab-panel">
        <div class="codes">
          <h3>Values:</h3>
          <div v-for="(entity, i) in html(glyph)" :key="i" class="code">
            <pre :id="`html-code-${i}`">{{ entity }}</pre>
            <button class="copy" title="Copy to clipboard" :data-clipboard-target="`#html-code-${i}`"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
          </div>
        </div>
        <div class="examples">
          <h3>Examples:</h3>
          <div v-for="(entity, i) in html(glyph)" :key="i" class="example">
            <pre :id="`html-example-${i}`" class="html">&lt;i&gt;<span>{{ entity }}</span>&lt;/i&gt;</pre>
            <button class="copy" title="Copy to clipboard" :data-clipboard-target="`#html-example-${i}`"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
          </div>
        </div>
      </div>
      <div id="c" class="tab-panel">
        <div class="codes">
          <h3>Values:</h3>
          <div v-for="(code, i) in css(glyph)" :key="i" class="code">
            <pre :id="`css-code-${i}`">{{ code }}</pre>
            <button class="copy" title="Copy to clipboard" :data-clipboard-target="`#css-code-${i}`"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
          </div>
        </div>
        <div class="examples">
          <h3>Examples:</h3>
          <div v-for="(code, i) in css(glyph)" :key="i" class="example">
            <pre :id="`css-example-${i}`" class="css">content: '<span>{{ code.replace(/'/g, '\\\'') }}</span>';</pre>
            <button class="copy" title="Copy to clipboard" :data-clipboard-target="`#css-example-${i}`"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
          </div>
        </div>
      </div>
      <div id="j" class="tab-panel">
        <div class="codes">
          <h3>Values:</h3>
          <div class="code">
            <pre id="js-code-0">{{ escapedJs(glyph) }}</pre>
            <button class="copy" title="Copy to clipboard" data-clipboard-target="#js-code-0"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
          </div>
          <div class="code">
            <pre id="js-code-1">{{ js(glyph) }}</pre>
            <button class="copy" title="Copy to clipboard" data-clipboard-target="#js-code-1"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
          </div>
        </div>
        <div class="examples">
          <h3>Examples:</h3>
          <div class="example">
            <pre id="js-example-0" class="js">let s = "<span>{{ escapedJs(glyph) }}</span>";</pre>
            <button class="copy" title="Copy to clipboard" data-clipboard-target="#js-example-0"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
          </div>
          <div class="example">
            <pre id="js-example-1" class="js">let s = "<span>{{ js(glyph) }}</span>";</pre>
            <button class="copy" title="Copy to clipboard" data-clipboard-target="#js-example-1"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
          </div>
        </div>
      </div>
      <div id="u" class="tab-panel">
        <div class="codes">
          <h3>Hexadecimal:</h3>
          <div class="code">
            <pre id="hex-code">{{ glyph.u }}</pre>
            <button class="copy" title="Copy to clipboard" data-clipboard-target="#hex-code"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
          </div>
        </div>
        <div class="examples">
          <h3>Decimal:</h3>
          <div class="code">
            <pre id="decimal-code">{{ glyph.u.split(' ').map(u => parseInt(u, 16).toString()).join(' ') }}</pre>
            <button class="copy" title="Copy to clipboard" data-clipboard-target="#decimal-code"><i class="copy-icon"><span class="sr-only">Copy</span></i></button>
          </div>
        </div>
      </div>
    </tabs>
  </div>
</template>

<script>
import Tabs from './Tabs.vue';

export default {
  components: {
    Tabs,
  },

  props: {
    glyph: Object,
    tab: String,
  },

  methods: {
    js(glyph) {
      return glyph.h.split(' ').map(hex => `\\u${hex}`).join('');
    },

    escapedJs(glyph) {
      const json = JSON.stringify(glyph.c);
      return json.substring(1, json.length - 1);
    },

    html(glyph) {
      let html = [];
      if (['"', '\'', '&', '<', '>'].indexOf(glyph.c) === -1) html.push(glyph.c);
      if (glyph.e) glyph.e.split(' ').forEach(e => html.push(`&${e};`));
      const hexes = glyph.h.split(' ');
      if (glyph.u.split(' ').length === 1) html.push(`&#${parseInt(glyph.u, 16)};`);
      if (hexes.length === 1) html.push(`&#x${glyph.h};`);
      return html;
    },

    css(glyph) {
      let css = [glyph.c];
      if (glyph.h.split(' ').length === 1) css.push(`\\${glyph.h}`);
      return css;
    },
  },
};
</script>
