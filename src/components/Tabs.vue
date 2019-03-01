<template>
  <div class="tabs">
    <ul class="tabs-nav">
      <li v-for="tab in tabs" :key="tab.id" :class="{selected:tab.id == selected}"><a :href="`#${tab.id}`" @click.prevent="selectTab(tab.id)">{{ tab.name }}</a></li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    tabs: Array,
    selected: String,
  },

  mounted() {
    this.$el.querySelectorAll('.tab-panel').forEach(tabPanel => {
      tabPanel.setAttribute('aria-hidden', tabPanel.getAttribute('id') === this.selected ? 'false' : 'true');
    });
  },

  methods: {
    selectTab (id) {
      this.$el.querySelectorAll('.tab-panel').forEach(tabPanel => {
        tabPanel.setAttribute('aria-hidden', tabPanel.getAttribute('id') === id ? 'false' : 'true');
      });

      this.$emit('select-tab', id);
    },
  },
};
</script>
