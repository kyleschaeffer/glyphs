<template>
  <main class="main" role="main">
    <div class="glyphs">
      <button v-for="(result, i) in results" :key="i" :title="result.name" @click.prevent="$emit('glyph-select', result.char)"><span class="hex">{{ result.hex }}</span><span class="glyph-char" v-html="result.char"></span></button>
    </div>
  </main>
</template>

<script>
export default {
  props: {
    results: Array,
  },
}
</script>
