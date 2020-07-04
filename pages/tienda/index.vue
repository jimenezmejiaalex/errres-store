<template>
  <div class="w-full">
    <div class="w-full">
      <div class="w-full flex flex-row py-2 hidden">
        <InputText
          v-model="searchValue"
          placeholder="Busqueda"
          class="store__search-input"
        />
        <span class="p-inputgroup-addon">
          <i class="pi pi-search"></i>
        </span>
      </div>
      <div class="block lg:hidden w-full">
        <button
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          label="Filtros"
          @click="displayModal"
        >
          <i class="pi pi-filter"></i> Filtros
        </button>
      </div>
    </div>
    <div class="w-full flex flex-col lg:flex-row">
      <div class="w-full lg:w-1/4">
        <filterStore class="hidden lg:block" @filtered="setAllProducts" />
        <Sidebar
          style="overflow: scroll;"
          position="full"
          :visible.sync="display"
        >
          <h2 class="w-full">Filtro</h2>
          <filterStore
            class="w-full"
            @close-modal="closeModal"
            @filtered="setAllProducts"
          />
        </Sidebar>
      </div>
      <div class="w-full">
        <p class="font-bold text-white">
          {{ 'Cantidad de Productos: ' + productsCount }}
        </p>
        <div class="w-full">
          <Paginator
            :first.sync="offset"
            :rows="12"
            :total-records="productsCount"
          ></Paginator>
        </div>
        <div class="w-full flex flex-row flex-wrap">
          <div
            v-for="(item, index) in products"
            :key="index"
            :class="['w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col', 'p-2']"
          >
            <div
              class="border-solid border border-gray-800 flex flex-col rounded p-2"
            >
              <nuxt-link :to="`product/${item.id}`">
                <img
                  :alt="item.name"
                  :src="imageSrc(item.intro_image)"
                  class="w-full rounded-sm"
                />
              </nuxt-link>
              <div class="w-full flex flex-col justify-between">
                <nuxt-link :to="`product/${item.id}`">
                  <div class="font-bold text-2xl w-full text-white">
                    {{ item.title }}
                  </div>
                  <div class="text-white">
                    <span>{{ item.price | priceFormat }}</span>
                    <span v-if="item.offerPrice">{{
                      item.price | offerPrice
                    }}</span>
                  </div>
                </nuxt-link>
                <button
                  v-if="true"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                  @click="addToCart(item)"
                >
                  <i class="pi pi-shopping-cart"></i>
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full">
          <Paginator
            :first.sync="offset"
            :rows="12"
            :total-records="productsCount"
          ></Paginator>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import filterStore from '~/components/store-filter-component'
export default {
  name: 'Store',
  components: {
    filterStore,
  },
  data() {
    return {
      dataList: [],
      itemHovered: {},
      hover: false,
      imagesChaging: null,
      offset: 0,
      searchValue: '',
      display: false,
      rendered: false,
      filteredProducts: null,
    }
  },
  computed: {
    ...mapGetters({
      allProducts: 'allProducts',
      user: 'user/user',
      cart: 'user/cart',
    }),
    productsCount() {
      return this.productsUnique.length
    },
    products() {
      return [...this.productsUnique].slice(this.offset, this.offset + 12)
    },
    productsUnique() {
      const list = this.filteredProducts
        ? this.filteredProducts
        : this.allProducts
      if (this.$auth.loggedIn) {
        return list.filter(
          ({ id }) => !this.cart.some((product) => product.id === id)
        )
      } else {
        return list
      }
    },
  },
  watch: {
    loadingProductToCart(newValue, oldValue) {
      if (!newValue && oldValue) {
        this.$toast.add({
          severity: 'success',
          summary: 'Agregado al carrito',
          detail: 'El producto ha sido agregado al carrito',
          life: 3000,
        })
      }
    },
  },
  mounted() {
    this.rendered = true
  },
  methods: {
    closeModal() {
      this.display = false
    },
    ...mapActions({
      getAllProducts: 'getAllProducts',
      requestAddTocart: 'user/addToUserCart',
    }),
    addToCart(item) {
      if (this.$auth.loggedIn) {
        this.requestAddTocart(item)
      } else {
        this.$router.push('login')
      }
    },
    displayModal() {
      this.display = true
    },
    imageSrc(item) {
      return `${item.media_image}`
    },
    setAllProducts(newProducts) {
      this.filteredProducts = newProducts
    },
    selected(value) {
      this.selectedValues = value
    },
    prices(value) {
      this.pricesSelected = value
    },
  },
  head() {
    return {
      title: 'Errres Store',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Errres Store online',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
div.p-paginator.p-component {
  background-color: black;
  border: none;
  padding: 10px;
}
.store {
  .no-link-style {
    text-decoration: none;
    color: white;
  }
  &__results {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  &__card {
    padding: 1%;
    height: 400px;
    width: 100%;
    overflow: hidden;
    .p-card-body {
      padding: 5px 0 0 0;
      text-align: left;
    }
    .p-card-content {
      display: flex;
      flex-direction: row;
      padding: 5px;
      .left {
        display: flex;
        flex-direction: column;
        width: 50%;
        p {
          margin: 0;
          padding: 5px 0 0 0;
        }
      }
      .right {
        display: flex;
        flex-direction: column-reverse;
        width: 40%;
        text-align: right;
      }
    }
    &-header {
      width: inherit;
    }
    // &-image:hover {
    //   opacity: 0;
    // }
    &-image {
      &-effect {
        animation: fade 1s;
      }
    }
    @keyframes fade {
      0% {
        opacity: 1;
      }
      33.333% {
        opacity: 0;
      }
      66.666% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
  &__content {
    border-radius: 15px;
  }
  .p-card-header {
    height: 75%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
    a img {
      height: 100%;
    }
  }
  &__filters {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  &__search {
    width: 100%;
    padding: 1% 0;
    &-input {
      width: 100%;
    }
  }
  &__type {
    width: 100%;
    &-select {
      width: 100%;
    }
  }
  @media screen and (min-width: 769px) {
    &__card {
      width: 250px;
    }
  }
}
.p-card.p-component.store__content {
  background-color: black;
  color: white;
  height: 100%;
  border: 1px solid #212121;
  width: 280px;
}
.p-paginator.p-component.p-unselectable-text {
  border: none;
  background-color: black;
  color: white;
}
body .p-multiselect {
  width: 100%;
}
.p-colum-direction {
  display: flex;
  flex-direction: column;
}
.p-row-direction {
  display: flex;
  flex-direction: row;
}
</style>
