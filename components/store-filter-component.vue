<template>
  <div class="text-white">
    <div
      class="cursor-pointer text-blue-700 hover:text-blue-500 w-full py-4"
      @click="clearFilter"
    >
      Limpiar Filtro
    </div>
    <h3 class="w-full text-black lg:text-white text-xl font-bold">Productos</h3>
    <div class="w-full flex flex-row lg:flex-col flex-wrap">
      <div
        v-for="(item, index) in filterStructure.products"
        :key="index"
        class="p-2"
      >
        <Checkbox
          :id="item.type"
          v-model="checkboxesSelected"
          name="product"
          :value="item"
          @change="filterItems"
        />
        <label class="text-black lg:text-white" :for="item">{{
          item.type
        }}</label>
      </div>
    </div>
    <h3 class="w-full text-black lg:text-white text-xl font-bold">Talla</h3>
    <div class="w-full flex flex-row lg:flex-col flex-wrap">
      <div v-for="item in filterStructure.size" :key="item.key" class="p-2">
        <Checkbox
          :id="item.id"
          v-model="checkboxesSelected"
          name="product"
          :value="item"
          @change="filterItems"
        />
        <label class="text-black lg:text-white" :for="item.id">{{
          item.title
        }}</label>
      </div>
    </div>
    <h3 class="w-full text-black lg:text-white text-xl font-bold">Categoria</h3>
    <div class="w-full flex flex-row lg:flex-col flex-wrap">
      <div v-for="item in filterStructure.category" :key="item.key" class="p-2">
        <Checkbox
          :id="item.id"
          v-model="checkboxesSelected"
          name="product"
          :value="item"
          @change="filterItems"
        />
        <label class="text-black lg:text-white" :for="item.id">{{
          item.title
        }}</label>
      </div>
    </div>
    <h3 class="w-full text-black lg:text-white text-xl font-bold">Precio</h3>
    <div class="w-full py-4">
      <div class="p-2 text-black lg:text-white w-full">
        Mínimo: {{ pricesValues[0] | priceFormat }}
      </div>
      <div class="p-2 text-black lg:text-white w-full">
        Máximo: {{ pricesValues[1] | priceFormat }}
      </div>
      <div class="p-2 w-full self-center">
        <Slider
          v-model="pricesValues"
          :step="1"
          :min="minPrice"
          :max="maxPrice"
          :range="true"
          @slideend="filterItems"
        />
      </div>
    </div>
    <button
      class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold my-4 p-2 rounded block lg:hidden"
      @click="closeModal"
    >
      <em class="pi pi-filter"></em> Filtrar
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'StoreFilter',
  data() {
    return {
      filterTypes: {
        product: 'product',
        size: 'size',
        category: 'category',
      },
    }
  },
  computed: {
    ...mapGetters({
      allProducts: 'allProducts',
      minPrice: 'minPrice',
      maxPrice: 'maxPrice',
    }),
    checkboxesSelected: {
      get() {
        return this.$store.state.checkboxesSelected
      },
      set(value) {
        this.$store.commit('setcheckboxesSelected', value)
      },
    },
    pricesValues: {
      get() {
        return this.$store.state.pricesValues
      },
      set(value) {
        this.$store.commit('setpricesValues', value)
      },
    },
    filterStructure() {
      const obj = {
        products: [],
        size: [],
        category: [],
      }
      const filterStore = this.allProducts
      filterStore.forEach((item) => {
        Object.assign(obj, {
          products: this.getUniqueValues(
            [
              ...obj.products,
              { filterType: this.filterTypes.product, type: item.type },
            ],
            'type'
          ), // [...new Set([...obj.products, item.type])],
          size: this.getUniqueValues([
            ...obj.size,
            ...item.size.map((size) => ({
              filterType: this.filterTypes.size,
              ...size,
            })),
          ]), // [...new Set([...obj.size, ...item.size.map(size => size)])],
          category: this.getUniqueValues([
            ...obj.category,
            ...item.category.map((category) => ({
              filterType: this.filterTypes.category,
              ...category,
            })),
          ]), // [...new Set([..obj.category,..item.category.map(category => category)])
        })
      })
      return obj
    },
    selectedProductsEmpty() {
      return this.checkboxesSelected.length === 0
    },
  },
  methods: {
    closeModal() {
      this.$emit('close-modal')
    },
    clearFilter() {
      this.checkboxesSelected = []
      this.value = [this.minPrice, this.maxPrice]
      this.filterItems()
    },
    getUniqueValues(array, key = 'id') {
      return [...new Map(array.map((item) => [item[key], item])).values()]
    },
    filterItems() {
      let finaldata = this.allProducts
      this.checkboxesSelected.forEach((item) => {
        if (item.filterType === this.filterTypes.product) {
          finaldata = this.filterByProduct(item.type)
        } else if (item.filterType === this.filterTypes.size) {
          finaldata = this.filterBySize(item)
        } else {
          finaldata = this.filterByCategory(item)
        }
      })
      if (
        this.pricesValues[0] !== this.minPrice ||
        this.pricesValues[1] !== this.maxPrice
      ) {
        finaldata = this.filterByPrice(finaldata)
      }
      this.$emit('filtered', finaldata)
    },
    filterByProduct(item) {
      return this.allProducts.filter(
        ({ type }) => type.toLowerCase() === item.toLowerCase()
      )
    },
    filterBySize(item) {
      return this.allProducts.filter((product) =>
        product.size.some((s) => s.id === item.id)
      )
    },
    filterByCategory(item) {
      return this.allProducts.filter(({ category }) =>
        category.some(({ id }) => id === item.id)
      )
    },
    filterByPrice(products) {
      return products.filter(
        ({ price }) =>
          price >= this.pricesValues[0] && price <= this.pricesValues[1]
      )
    },
    ...mapActions({ setproducts: 'setAllProducts' }),
  },
}
</script>

<style lang="scss">
.filter {
  &__header {
    display: flex;
    flex-direction: row;
  }
}
.p-field-checkbox.p-sm-6.p-md-6.p-lg-12.p-xl-12.p-nogutter {
  margin-bottom: 0;
}
</style>
