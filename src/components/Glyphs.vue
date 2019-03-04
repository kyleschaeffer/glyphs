<template>
  <div class="glyphs">
    <button v-for="(result, i) in results" :key="i" :title="result.n" @click.prevent="$emit('glyph-select', result.c)"><span class="label">{{ result.n }}</span><span class="glyph-char" v-html="result.c"></span></button>
  </div>
</template>

<script>
export default {
  props: {
    results: Array,
  },
};
</script>
