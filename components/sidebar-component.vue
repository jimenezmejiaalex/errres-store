<template>
  <div class="sidebar">
    <h3>Categorias</h3>
    <div class="sidebar__filters-content">
      <SelectButton
        v-model="selectedCategory"
        :options="categories"
        option-label="title"
      >
        <template #option="slotProps">
          <p class="sidebar__options">
            {{ slotProps.option.title | textFormat }}
          </p>
        </template>
      </SelectButton>
      <Button
        class="sidebar__clear-button"
        label="Limpiar"
        @click="clearFilter"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarComponent',
  filters: {
    textFormat(text) {
      return `${text[0].toUpperCase()}${text.slice(1)}`
    },
  },
  data() {
    return {
      selectedCategory: null,
    }
  },
  computed: {
    categories() {
      return this.$store.getters.categories
    },
  },
  watch: {
    selectedCategory(newVal) {
      this.$emit('set-filter', newVal)
    },
  },
  methods: {
    clearFilter() {
      this.selectedCategory = null
    },
  },
}
</script>
<style lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  .p-listbox {
    width: 100%;
  }
  &__options {
    padding: 0 15px;
  }
  &__filters-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .p-button.p-component.p-button-text-only {
      background-color: black;
    }
  }
}
</style>
