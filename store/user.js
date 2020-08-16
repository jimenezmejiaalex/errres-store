import axios from 'axios'
const mapType = {
  accesorios: 'accessories',
  prendas: 'collections',
}
const parseUserProduct = (product) => ({
  target_id: product.id,
  target_type: 'node',
  target_uuid: product.uuid,
  url: `/admin/node/${product.id}`,
})
const getPurchaseObject = (purchase, user) => ({
  type: [{ target_id: 'purchase' }],
  title: [{ value: purchase.paypal.id }],
  field_cart_: [{ value: purchase.paypal.cart }],
  field_paypal_id: [{ value: purchase.paypal.id }],
  field_client: [
    {
      target_id: user.id,
      target_type: 'user',
      target_uuid: user.uuid,
      url: `/admin/user/${user.id}`,
    },
  ],
  field_product_list: purchase.products.map((product) =>
    parseUserProduct(product)
  ),
})
const parseUserBody = (products) => ({
  field_product: products.map((product) => parseUserProduct(product)),
})
export default {
  state: () => ({
    user: null,
    userSession: null,
    loadingProductToCart: false,
    loadingUser: false,
    cart: [],
    error: false,
    errorMessage: '',
  }),
  mutations: {
    logoutUser(state) {
      state.user = null
      state.userSession = null
    },
    addToCart(state, data) {
      state.cart.push(data)
      this.$auth.user.products = state.cart
      this.$auth.$storage.setLocalStorage(
        'user',
        JSON.stringify(this.$auth.user),
        true
      )
    },
    deleteItemCart(state, id) {
      state.cart = state.cart.filter((item) => item.id !== id)
      this.$auth.user.products = state.cart
      this.$auth.$storage.setLocalStorage(
        'user',
        JSON.stringify(this.$auth.user),
        true
      )
    },
    setCart(state, cart) {
      state.cart = cart
    },
    setError(state, error) {
      state.error = error
    },
    setErrorMessage(state, message) {
      state.errorMessage = message
    },
    setUser(state, user) {
      this.$auth.$storage.setUniversal(
        'user',
        JSON.stringify(user.data[0]),
        true
      )
      this.$auth.setUser(user.data[0])
    },
  },
  actions: {
    async checkUserDeletableProducts({ commit, getters, dispatch }) {
      const deletableProducts = this.$auth.user.products.filter(
        ({ time }) => new Date() - new Date(time) >= 86400000
      )
      await deletableProducts.forEach(async ({ id }) => {
        await dispatch('deleteItemCart', id)
      })
    },
    async deleteItemCart({ commit, dispatch, getters }, id) {
      commit('setLoading', true, { root: true })
      try {
        const { data } = await dispatch('getProduct', id)
        console.log(data)
        const [product] = data
        console.log(product)
        await dispatch('changeProductDisponibility', {
          ...product,
          reserved: false,
        })
        commit('deleteItemCart', id)
        await dispatch('postToUserCart', getters.cart)
        await dispatch('getAllProducts', null, { root: true })
      } catch (error) {
        console.log(error)
      }
      commit('setLoading', false, { root: true })
    },
    async addToUserCart({ commit, dispatch, getters }, { id }) {
      commit('displayModal', true, { root: true })
      commit('setLoading', true, { root: true })
      try {
        const { data } = await dispatch('getProduct', id)
        const [product] = data
        commit('addToCart', { ...product, time: new Date() })
        await dispatch('postToUserCart', getters.cart)
        await dispatch('changeProductDisponibility', {
          ...product,
          reserved: true,
        })
      } catch (error) {}
      commit('setLoading', false, { root: true })
      this._vm.$toast.add({
        severity: 'success',
        summary: 'Agregado al carrito',
        detail: 'El producto ha sido agregado al carrito',
        life: 3000,
      })
    },
    async getProduct({ commit }, id) {
      return await axios.get(`${this.$config.API_CART}/${id}`)
    },
    async changeProductDisponibility({ commit }, { id, type, reserved }) {
      try {
        const data = await this.$axios.patch(
          `${this.$config.API_POST_NODE}/${id}?_format=json`,
          {
            type: [{ target_id: mapType[type.toLowerCase()] }],
            field_reserved: [{ value: reserved }],
          },
          this.$config.credentials
        )
        console.log(data)
      } catch (error) {
        console.error(error)
      }
    },
    async changeProductDisponibilitySold({ commit }, { id, type, status }) {
      try {
        const data = await this.$axios.patch(
          `${this.$config.API_POST_NODE}/${id}?_format=json`,
          {
            type: [{ target_id: mapType[type.toLowerCase()] }],
            field_accessory_sold: [{ value: !status }],
            status: [{ value: status }],
          },
          this.$config.credentials
        )
        console.log(data)
      } catch (error) {
        console.error(error)
      }
    },
    async postToUserCart({ commit, dispatch }, cart) {
      commit('setLoading', true, { root: true })
      try {
        const { data } = await this.$axios.patch(
          `${this.$config.API_POST_USER}/${this.$auth.user.id}?_format=json`,
          parseUserBody(cart)
        )
        await dispatch('updateUser', {
          current_User: { uid: data.uid[0].value },
        })
      } catch (error) {
        console.error(error)
      }
      commit('setLoading', false, { root: true })
    },
    checkUser({ commit }) {
      const userData = localStorage.getItem('user')
      if (userData) {
        commit('loginUser', JSON.parse(userData))
      }
    },
    async logoutUser({ commit }) {
      commit('setLoading', true, { root: true })
      try {
        await this.$axios.get(`${this.$config.POST}`, this.$config.credentials)
        await this.$auth.logout()
        this.$auth.$storage.removeUniversal('user')
      } catch (error) {}
      commit('setLoading', false, { root: true })
    },
    async loginUser({ commit, dispatch }, body) {
      commit('setLoading', true, { root: true })
      try {
        const { data } = await this.$auth.loginWith('local', {
          data: body,
        })
        await dispatch('updateUser', data)
        commit('setError', false)
        commit('setErrorMessage', '')
      } catch (error) {
        commit('setError', true)
        commit('setErrorMessage', error)
      }
      commit('setLoading', false, { root: true })
    },
    async updateUser({ commit }, data) {
      try {
        const user = await axios.get(
          `${this.$config.API_GET_USER}/${data.current_user.uid}`,
          {
            ...this.$config.httpHeader,
            ...this.$config.credentials,
          }
        )
        commit('setUser', user)
        commit('setCart', user.data[0].products)
      } catch (error) {}
    },
    async registerUser({ commit, dispatch }, body) {
      commit('setLoading', true, { root: true })
      try {
        await this.$axios.post(`${this.$config.API_REGISTER_USER}`, {
          ...body,
          roles: this.$config.roles,
          status: this.$config.status,
        })
        commit('setError', false)
        commit('setErrorMessage', '')
        this._vm.$toast.add({
          severity: 'success',
          summary: 'Registro con exito',
          detail: 'El registro ha resultado exitoso, por favor inicar sesión',
          life: null,
        })
      } catch (error) {
        commit('setError', true)
        commit('setErrorMessage', 'El usuario o correo ya existe ')
      }
      commit('setLoading', false, { root: true })
    },
    async setProductAsSold({ commit, dispatch, getters }, id) {
      commit('setLoading', true, { root: true })
      try {
        const { data } = await dispatch('getProduct', id)
        const [product] = data
        await dispatch('changeProductDisponibilitySold', {
          ...product,
          status: false,
        })
      } catch (error) {
        console.error(error)
      }
      commit('setLoading', false, { root: true })
    },
    async postPurchase({ commit }, purchase) {
      commit('setLoading', true, { root: true })
      try {
        const purchaseObject = getPurchaseObject(purchase, this.$auth.user)
        const response = await this.$axios.post(
          `${this.$config.API_POST_NODE}/?_format=json`,
          purchaseObject,
          this.$config.credentials
        )
        console.log(response)
      } catch (error) {
        console.log(error)
      }
      commit('setLoading', false, { root: true })
    },
  },
  getters: {
    user: ({ user }) => user,
    cart: ({ cart }) => cart,
    error: ({ error }) => error,
    errorMessage: ({ errorMessage }) => errorMessage,
    isInCart: ({ cart }) => (itemId) => cart.some(({ id }) => id === itemId),
    cartLength: ({ cart }) => cart.length,
  },
}
