<template>
  <header class="search" role="search">
    <div class="input">
      <input class="search-box" ref="searchBox" :placeholder="loading ? 'Loading glyphs\u2026' : placeholder" :value="value" @input="$emit('input', $event.target.value)" autofocus :disabled="loading">
      <button v-if="value" class="clear" @click.prevent="clear">╳</button>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    placeholder: String,
    value: String,
  },

  methods: {
    clear() {
      this.$emit('input', '');
      this.$refs.searchBox.focus();
    },
  },
};
</script>
