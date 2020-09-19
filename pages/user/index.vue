<template>
  <div v-if="user" class="py-4">
    <client-only placeholder="Loading...">
      <div v-if="cart.length > 0" class="w-full">
        <div class="w-full lg:w-3/4 flex flex-row justify-between p-4">
          <h3 class="text-white text-xl font-bold py-4">
            Productos en el carrito
          </h3>
          <div class="flex flex-row justify-between py-4 space-x-4">
            <div class="text-blue-600">
              <span v-if="!checked">Todos</span>
              <span v-else>Ninguno</span>
            </div>
            <Checkbox id="binary" v-model="checked" :binary="true" />
          </div>
        </div>
        <div class="w-full flex flex-col lg:flex-row lg:space-x-4">
          <div class="w-full lg:w-4/5 flex flex-col">
            <div class="w-full flex flex-col space-y-2">
              <div
                v-for="product in cart"
                :key="product.id"
                class="flex flex-row space-x-2 border border-gray-800 rounded-sm"
              >
                <div
                  class="w-1/6 p-2 flex flex-row justify-center items-center"
                >
                  <Checkbox
                    :id="product.id"
                    v-model="productsSelected"
                    name="product"
                    :value="product"
                  />
                </div>
                <nuxt-link
                  :to="`product/${product.id}`"
                  class="flex flex-row w-4/5"
                >
                  <div class="w-1/4 p-2">
                    <img
                      class="w-full rounded-sm"
                      :src="imageURL(product)"
                      :alt="product.title"
                    />
                  </div>
                  <div class="flex flex-col w-3/4 p-2 justify-between">
                    <div class="w-full text-white font-bold p-2 text-base">
                      <span>{{ product.title }}</span>
                    </div>
                    <div class="w-full text-white font-semibold p-2 text-base">
                      <span>
                        {{
                          (product.price || product.accessory_price)
                            | mappingPrice
                            | priceFormat
                        }}
                      </span>
                    </div>
                  </div>
                </nuxt-link>
                <div
                  class="w-1/5 p-2 flex flex-row justify-center items-center"
                >
                  <button
                    class="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    @click="removeFromCart(product.id)"
                  >
                    <em class="pi pi-trash"></em>
                    <span class="hidden md:block">Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="w-full flex flex-col py-4 space-y-4">
              <div class="text-lg text-white font-bold">
                * Seleccione la localización del envio
              </div>
              <div
                class="flex flex-col md:flex-row md:flex-wrap space-x-0 md:space-x-4"
              >
                <div>
                  <RadioButton
                    id="GAM"
                    v-model="gam"
                    name="GAM"
                    :value="gamPrice"
                  />
                  <label for="GAM" class="text-lg text-white"
                    >Dentro de la GAM ( {{ gamPrice | priceFormat }} )</label
                  >
                </div>
                <div>
                  <RadioButton
                    id="noGAM"
                    v-model="gam"
                    name="noGAM"
                    :value="noGamPrice"
                  />
                  <label for="noGAM" class="text-lg text-white"
                    >Fuera de la GAM ( {{ noGamPrice | priceFormat }} )</label
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="w-full lg:w-1/5 py-4 lg:py-0 space-y-2">
            <div
              class="w-full border border-gray-800 rounded p-2 flex flex-col"
            >
              <div class="text-xl font-bold text-white">Total:</div>
              <div class="text-white">{{ total | priceFormat }}</div>
            </div>
            <PayPal
              v-if="gam && productsSelected.length"
              class="p-sm-12 p-md-12 p-lg-3 p-xl-3"
              :amount="paypalTotal"
              :currency="currency"
              :client="paypal"
              env="sandbox"
              :items="items"
              :button-style="paypalButtonStyle"
              @payment-authorized="paymentAuthorized"
              @payment-completed="paymentCompleted"
              @payment-cancelled="paymentCancelled"
            ></PayPal>
          </div>
        </div>
      </div>
      <div v-else>
        <h3 class="text-white text-xl font-bold py-20">
          No tiene productos en el carrito
        </h3>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'User',
  middleware: 'auth',
  filters: {
    mappingPrice(textPrice) {
      if (!textPrice) return ''
      textPrice = textPrice.toString()
      return textPrice.replace(/,/g, '')
    },
  },
  data() {
    return {
      editMode: false,
      userInfo: {
        user: this.user,
      },
      gam: null,
      selectedProducts: null,
      currency: 'USD',
      paypal: {
        sandbox:
          'AUKYlT4QRUWYFoM0C_3l8kfIWttiTJ-QeHQ2usD-V9Io36D0yCB6lU-M3-tQXEmSJuTWBGuk7fJtqHDL',
        production:
          'EL2dy2rhjRDNXtpkdFgFAt1wn1xgF7_u-RpbfobTnAGE7ypZUe-P9zCf9Fhb3roPk8QMIcGcCEffiWc6',
      },
      paypalButtonStyle: {
        size: 'responsive', // small | medium | large | responsive
        shape: 'pill', // pill | rect
        color: 'blue', // gold | blue | silver | black
      },
      productsSelected: [],
      checked: false,
    }
  },
  computed: {
    gamPrice() {
      return this.general ? this.general.costo_envio[0] : 0
    },
    noGamPrice() {
      return this.general ? this.general.costo_envio[1] : 0
    },
    ...mapGetters({
      cart: 'user/cart',
      general: 'general',
      exchangePrice: 'exchangePrice',
    }),
    total() {
      return (
        (this.productsSelected
          ? this.productsSelected.reduce(
              (c, e) =>
                c + e.price
                  ? parseFloat(e.price?.replace(/,/g, ''))
                  : e.accessory_price,
              0
            )
          : 0) + parseFloat(this.gam ? this.gam : 0)
      ).toString()
    },
    paypalTotal() {
      return (this.productsSelected
        ? (
            parseFloat(
              this.priceFormated(
                this.productsSelected.reduce(
                  (acc, e) => acc + parseFloat(e.price ?? e.accessory_price),
                  0
                )
              )
            ) + parseFloat(this.priceFormated(this.gam))
          ).toFixed(2)
        : 0
      ).toString()
    },
    items() {
      return [
        ...this.cart.map((item) => ({
          name: item.title,
          description: item.title,
          quantity: '1',
          price: this.priceFormated(item.price ?? item.accessory_price),
          currency: this.currency,
        })),
        {
          name: 'Envio',
          description: 'Costo del envio',
          quantity: '1',
          price: this.priceFormated(this.gam),
          currency: this.currency,
        },
      ]
    },
  },
  watch: {
    checked(newValue) {
      if (newValue) {
        this.productsSelected = this.cart
      } else {
        this.productsSelected = []
      }
    },
  },
  methods: {
    imageURL(product) {
      // eslint-disable-next-line camelcase
      return product.intro_image
        ? product.intro_image.media_image
        : product.accessory_intro_image
        ? product.accessory_intro_image.media_image
        : ''
    },
    priceFormated(price) {
      return this.exchangePrice(parseFloat(price)).toFixed(2)
    },
    selectAll() {
      this.productsSelected = this.cart
    },
    ...mapActions({
      user: 'user/deleteItemCart',
      removeFromCart: 'user/deleteItemCart',
      setPaypalResponse: 'setPaypalResponse',
      setAsSold: 'user/setProductAsSold',
      postPurchase: 'user/postPurchase',
    }),
    changeToEditMode() {
      this.editMode = true
    },
    saveChanges() {},
    changeToReadMode() {
      this.editMode = false
    },
    paymentAuthorized(data) {},
    async paymentCompleted(data) {
      this.setPaypalResponse({ paypal: data, products: this.productsSelected })
      await this.postPurchase({ paypal: data, products: this.productsSelected })
      this.productsSelected.forEach(
        async ({ id }) => await this.finishPurchase(id)
      )
      this.$router.push(`/shipping-info`)
    },
    paymentCancelled(data) {},
    async finishPurchase(id) {
      await this.setAsSold(id)
      await this.removeFromCart(id)
    },
  },
  head() {
    return {
      title: 'Errres User page',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Errres user page',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.center-content {
  text-align: center;
}
.list-cart {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  &__details {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  &__buttons {
    display: flex;
    align-self: center;
  }
}
</style>
