<template>
  <div class="glyph">
    <button class="close" @click.prevent="$emit('glyph-close')">╳</button>
    <h1>{{ glyph.name }}</h1>
    <h2><span>{{ glyph.char }}</span></h2>
    <div class="codes">
      <div class="unicode">
        <h3>Unicode:</h3>
        <pre>{{ glyph.hex }}</pre>
      </div>
      <div class="html">
        <h3>HTML:</h3>
        <pre>{{ html(glyph) }}</pre>
      </div>
      <div class="js">
        <h3>JavaScript:</h3>
        <pre>\u{{ glyph.hex }}</pre>
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
    html(glyph) {
      const codes = [];
      if (glyph.entity) {
        const entities = glyph.entity.split(' ');
        entities.forEach(entity => codes.push(entity));
      }
      codes.push(glyph.html);
      return codes.join('\n');
    },
  },
}
</script>
