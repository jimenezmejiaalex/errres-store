<template>
  <div v-cloak>
    <div v-if="!product">
      <ProgressSpinner style="position: fixed; top: 50%; left: 50%;" />
    </div>
    <div v-if="product" class="py-6">
      <div class="w-full flex flex-col lg:flex-row space-x-4">
        <div class="w-full lg:w-1/2">
          <Galleria
            :value="[product.intro_image, ...product.images]"
            :responsive-options="$config.carouselResponsiveOptions"
            :circular="true"
            :show-item-navigators="true"
          >
            <template #item="slotProps">
              <div>
                <img
                  :src="getSrc(slotProps.item)"
                  :alt="slotProps.item.title"
                />
              </div>
            </template>
            <template #thumbnail="slotProps">
              <div class="p-grid p-nogutter p-justify-center px-4">
                <img
                  :src="getSrc(slotProps.item)"
                  :alt="slotProps.item.title"
                />
              </div>
            </template>
          </Galleria>
        </div>
        <div class="w-full lg:w-1/2 rounded overflow-hidden shadow-lg">
          <div class="px-6">
            <div class="font-bold text-3xl pb-2 text-white">
              {{ product.title }}
            </div>
            <span class="text-gray-700 text-base text-white">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p v-html="product.trimmed"></p>
            </span>
            <div class="flex flex-col justify-start space-y-5">
              <div>
                <div class="font-bold text-base text-white py-2">Colores:</div>
                <div class="flex flex-row flex-wrap space-x-2">
                  <div
                    v-for="(color, index) in product.colors"
                    :key="index"
                    class="flex flex-row space-x-2"
                  >
                    <div
                      class="w-8 h-8 rounded-full"
                      :style="`background-color: ${color.title};`"
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <div class="font-bold text-base text-white py-2">Tallas:</div>
                <div class="flex flex-row flex-wrap space-x-2">
                  <div
                    v-for="(size, index) in product.size"
                    :key="index"
                    class="flex flex-row space-x-2"
                  >
                    <div class="text-white text-base underline">
                      {{ size.title }}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div class="font-bold text-base text-white py-2">
                  Tipo de producto:
                </div>
                <div class="flex flex-row flex-wrap space-x-2">
                  <div class="flex flex-row space-x-2">
                    <div
                      class="inline-block bg-green-900 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2"
                    >
                      {{ product.type }}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div class="font-bold text-base text-white py-2">
                  Categorias:
                </div>
                <span
                  v-for="(category, index) in product.category"
                  :key="index"
                  class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                  >#{{ category.title }}</span
                >
                >
              </div>
              <div>
                <div class="font-bold text-base text-white py-2">
                  Precio:
                </div>
                <div class="flex flex-row flex-wrap space-x-2">
                  <div class="flex flex-row space-x-2">
                    <div class="text-xl font-semibold text-white mr-2">
                      {{ product.price | priceFormat }}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button
                  v-if="!added(product.id)"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  @click="addToCart(product)"
                >
                  <em class="pi pi-shopping-cart"></em>
                  Agregar al carrito
                </button>
                <button
                  v-else
                  class="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  @click="removeFromCart(product.id)"
                >
                  <em class="pi pi-trash"></em>
                  Eliminar del carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col text-white">
        <div class="py-6 text-3xl">Más Sobre el producto</div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="space-y-4" v-html="product.description"></span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Product',
  async asyncData({ $axios, params, $config }) {
    const { data } = await axios.get(
      `${$config.API_PRODUCTS}/${params.id}`,
      $config.credentials
    )
    return { product: data.pop() }
  },
  data() {
    return {
      activeImage: null,
      cartCount: 1,
      product: null,
    }
  },
  computed: {
    ...mapGetters({ added: 'user/isInCart' }),
    firstImage() {
      return this.product ? ` ${this.product.intro_image.media_image}` : ''
    },
    productImages() {
      const arrayImages =
        this.product !== undefined && this.product.images !== undefined
          ? this.product.images.map((e) => `${e.media_image}`)
          : ''
      return [`${this.product.intro_image.media_image}`, ...arrayImages]
    },
  },
  methods: {
    setActiveImage(image) {
      this.activeImage = image
    },
    getSrc(image) {
      return ` ${image.media_image}`
    },
    ...mapActions({
      requestAddTocart: 'user/addToUserCart',
      removeFromCart: 'user/deleteItemCart',
    }),
    addToCart(item) {
      if (this.$auth.loggedIn) {
        this.requestAddTocart(item)
      } else {
        this.$router.push('/login')
      }
    },
  },
  scrollToTop: true,
  head() {
    return {
      title: this.product.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.product.description,
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.product {
  display: flex;
  flex-wrap: wrap;
  &__images {
    height: fit-content;
    &-list {
      &-image {
        width: fit-content;
      }
      &-image:hover {
        opacity: 0.7;
      }
    }
    &-view {
      align-items: center;
      justify-content: center;
      &-image {
        padding: 15px;
        max-width: 100%;
        text-align: center;
      }
    }
  }
  &__information {
    &--text-right {
      text-align: right;
    }
    &-colors {
      display: flex;
      flex-direction: column;
      margin: 40px 0 10px 0;
      &-title {
        font-size: 15px;
      }
      &-list {
        display: flex;
        flex-direction: row;
        padding: 10px 0;
        &-item {
          width: 30px;
          height: 30px;
          margin: 0 2%;
          border-radius: 20px;
        }
      }
    }
    &-cart {
      margin: 30px 0 5px 0;
      &-count {
        width: 100%;
      }
      .p-button {
        background-color: black;
        border: 1px solid black;
      }
      &-button.p-button.p-button-text-only {
        background-color: #333;
        width: 100%;
        margin: 20px 0;
        padding: 0;
      }
      .p-button:enabled:hover {
        background-color: #333;
        border-color: #333;
      }
    }
    &-details {
      &-title {
      }
      &-text {
        font-size: 15px;
      }
    }
  }
  &__thumbnail-image {
    display: block;
    width: 100px;
  }
  &__preview-image {
    height: 100%;
    width: 100%;
  }
  &__preview-container {
    min-height: 340px;
  }
  @media screen and (min-width: 770px) {
    &__preview-image {
      max-height: 540px;
      width: fit-content;
    }
    &__preview-container {
      min-height: 540px;
    }
  }
}
h3,
h4,
h6 {
  padding: 0;
  margin: 0;
}
</style>
