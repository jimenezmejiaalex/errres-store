<template>
  <div class="sidebar">
    <h3 class="text-white py-4 font-semibold text-lg">
      Categorias de los articulos:
    </h3>
    <div class="sidebar__filters-content">
      <div v-for="(category, index) in categories" :key="index" class="p-4">
        <Checkbox
          :id="category.id"
          v-model="categoriesSelected"
          name="product"
          :value="category"
        />
        <label class="text-white" :for="category.id">{{
          category.title
        }}</label>
      </div>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="clearFilter"
      >
        Limpiar
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarComponent',
  filters: {
    textFormat(text) {
      return `${text[0].toUpperCase()}${text.slice(1)}`
    },
  },
  data() {
    return {
      categoriesSelected: [],
    }
  },
  computed: {
    ...mapGetters({
      categories: 'articles/categories',
    }),
  },
  watch: {
    categoriesSelected(newVal) {
      this.$emit(
        'set-filter',
        newVal.map(({ id }) => id)
      )
    },
  },
  created() {
    this.categoriesSelected = this.categories
  },
  methods: {
    clearFilter() {
      this.categoriesSelected = []
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
