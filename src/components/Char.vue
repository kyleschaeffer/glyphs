<template>
  <div class="glyph">
    <button class="close" @click.prevent="$emit('glyph-close')">╳</button>
    <h1>{{ glyph.n }}</h1>
    <h2><span>{{ glyph.c }}</span></h2>
    <div class="codes">
      <div class="unicode">
        <h3>Unicode:</h3>
        <pre>{{ glyph.u }}</pre>
      </div>
      <div class="html">
        <h3>HTML:</h3>
        <pre>{{ html(glyph) }}</pre>
      </div>
      <div class="js">
        <h3>JavaScript:</h3>
        <pre>{{ js(glyph.h) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    glyph: Object,
  },

  methods: {
    js(hexes) {
      return hexes.split(' ').map(hex => `\\u${hex}`).join('');
    },

    html(glyph) {
      let html = glyph.h.split(' ').map(hex => `&#${hex};`).join('\n');
      if (glyph.e) html += glyph.e.split(' ').map(entity => `&${entity};`).join('\n');
      return html;
    },
  },
};
</script>
