<template>
  <div v-if="user" class="py-4">
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
        <div class="w-full lg:w-3/4 flex flex-col space-y-2">
          <div
            v-for="product in cart"
            :key="product.id"
            class="flex flex-row space-x-2 border border-gray-800 rounded-sm"
          >
            <nuxt-link
              :to="`product/${product.id}`"
              class="flex flex-row w-3/5"
            >
              <div class="w-1/4 p-2">
                <img
                  class="w-full rounded-sm"
                  :src="product.accessory_intro_image.media_image"
                  :alt="product.title"
                />
              </div>
              <div class="flex flex-col w-3/4 p-2 justify-between">
                <div class="w-full text-white font-bold p-2 text-base">
                  <span>{{ product.title }}</span>
                </div>
                <div class="w-full text-white font-semibold p-2 text-base">
                  <span>{{
                    product.accessory_price | mappingPrice | priceFormat
                  }}</span>
                </div>
              </div>
            </nuxt-link>
            <div class="w-1/5 p-2 flex flex-row justify-center items-center">
              <button
                class="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                @click="removeFromCart(product.id)"
              >
                <em class="pi pi-trash"></em>
                <span class="hidden md:block"> Eliminar </span>
              </button>
            </div>
            <div class="w-1/5 p-2 flex flex-row justify-center items-center">
              <Checkbox
                :id="product.id"
                v-model="productsSelected"
                name="product"
                :value="product"
              />
            </div>
          </div>
        </div>
        <div class="w-full lg:w-1/4 py-4 lg:py-0 space-y-2">
          <div class="w-full border border-gray-800 rounded p-2 flex flex-col">
            <div class="text-xl font-bold text-white">
              Total:
            </div>
            <div class="text-white">
              {{ total | priceFormat }}
            </div>
          </div>
          <PayPal
            class="p-sm-12 p-md-12 p-lg-3 p-xl-3"
            :amount="total"
            :currency="currency"
            :client="paypal"
            env="sandbox"
            :items="items"
            :button-style="paypalButtonStyle"
            @paypal-paymentAuthorized="paymentAuthorized"
            @paypal-paymentCompleted="paymentCompleted"
            @paypal-paymentCancelled="paymentCancelled"
          ></PayPal>
        </div>
      </div>
    </div>
    <div v-else>
      <h3 class="text-white text-xl font-bold py-20">
        No tiene productos en el carrito
      </h3>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PayPal from 'vue-paypal-checkout'
export default {
  name: 'User',
  middleware: 'auth',
  components: {
    PayPal,
  },
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
    ...mapGetters({ cart: 'user/cart' }),
    total() {
      return this.productsSelected
        ? this.productsSelected.reduce(
            (c, e) => c + parseFloat(e.accessory_price.replace(/,/g, '')),
            0
          )
        : 0
    },
    items() {
      return this.cart.map((item) => ({
        name: item.title,
        description: item.title,
        quantity: '1',
        price: parseFloat(item.accessory_price),
        currency: this.currency,
      }))
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
    selectAll() {
      this.productsSelected = this.cart
    },
    ...mapActions({
      user: 'user/deleteItemCart',
      removeFromCart: 'user/deleteItemCart',
    }),
    changeToEditMode() {
      this.editMode = true
    },
    saveChanges() {},
    changeToReadMode() {
      this.editMode = false
    },
    paymentAuthorized(data) {
      // console.log(data)
    },
    paymentCompleted(data) {
      // console.log(data)
      this.saveChanges()
    },
    paymentCancelled(data) {
      // console.log(data)
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
