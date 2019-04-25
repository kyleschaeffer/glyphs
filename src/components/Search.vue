<template>
  <header class="search" role="search">
    <div class="input">
      <input
        ref="searchBox"
        autofocus
        class="search-box"
        :disabled="loading"
        :placeholder="loading ? 'Loading glyphs\u2026' : placeholder"
        :value="value"
        @input="$emit('input', $event.target.value)"
      >

      <button v-if="value" class="clear" @click.prevent="clear">╳</button>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    placeholder: { type: String, default: '' },
    value: { type: String, default: '' },
  },

  methods: {
    clear() {
      this.$emit('input', '')
      this.$refs.searchBox.focus()
    },
  },
}
</script>
