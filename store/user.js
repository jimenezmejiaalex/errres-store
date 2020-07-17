import axios from 'axios'
const parseUserProduct = (product) => ({
  target_id: product.id,
  target_type: 'node',
  target_uuid: product.uuid,
  url: `/errres-server/node/${product.id}`,
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
    async deleteItemCart({ commit, dispatch, getters }, id) {
      commit('setLoading', true, { root: true })
      try {
        commit('deleteItemCart', id)
        await dispatch('postToUserCart', getters.cart)
        const { data } = dispatch('getProduct', id)
        const [product] = data
        await dispatch('changeProductDisponibility', product, true)
      } catch (error) {}
      commit('setLoading', false, { root: true })
    },
    async addToUserCart({ commit, dispatch, getters }, { id }) {
      commit('setLoading', true, { root: true })
      try {
        const { data } = await dispatch('getProduct', id)
        const [product] = data
        commit('addToCart', product)
        await dispatch('postToUserCart', getters.cart)
        await dispatch('changeProductDisponibility', [product, false])
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
      return await axios.get(`${this.$config.API_CART}/${id}`, {
        headers: this.$config.header,
        params: this.$config.params,
      })
    },
    async changeProductDisponibility(
      { commit },
      [{ id, type }, disponibility]
    ) {
      try {
        await this.$axios.patch(
          `${this.$config.API_POST_NODE}/${id}?_format=json`,
          {
            type: [{ target_id: type.toLowerCase() }],
            status: [{ value: disponibility }],
          }
        )
      } catch (error) {}
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
      } catch (error) {}
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
        await this.$axios.get(`${this.$config.POST}`)
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
        commit('setErrorMessage', error)
      }
      commit('setLoading', false, { root: true })
    },
    async setProductAsSold({ commit, dispatch, getters }, id) {
      commit('setLoading', true, { root: true })
      try {
        const { data } = await dispatch('getProduct', id)
        const [product] = data
        await dispatch('postToUserCart', getters.cart)
        await dispatch('changeProductDisponibility', [product, false])
      } catch (error) {}
      commit('setLoading', false, { root: true })
      this._vm.$toast.add({
        severity: 'success',
        summary: 'Agregado al carrito',
        detail: 'El producto ha sido agregado al carrito',
        life: 3000,
      })
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
