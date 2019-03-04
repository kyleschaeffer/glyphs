<template>
  <div class="glyphs">
    <button v-for="(result, i) in results" :key="i" :title="result.n" @click.prevent="$emit('glyph-select', result.c)"><span class="label">{{ result.n }}</span><span class="glyph-char" v-html="result.c"></span></button>
    <div v-if="searching" class="searching">Searching&hellip;</div>
    <div v-if="!searching && !results.length" class="empty">No glyphs found</div>
  </div>
</template>

<script>
export default {
  props: {
    results: Array,
    searching: Boolean,
  },
};
</script>
