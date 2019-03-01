<template>
  <header class="search" role="search">
    <input ref="searchBox" type="search" :placeholder="loading ? 'Loading glyphs\u2026' : placeholder" :value="value" @input="$emit('input', $event.target.value)" autofocus :disabled="loading">
  </header>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    placeholder: String,
    value: String,
  },
};
</script>
