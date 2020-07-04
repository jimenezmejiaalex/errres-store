import axios from 'axios'
/* const parseUser = (user) => {
  return {
    uid: [
      {
        value: user.id,
      },
    ],
  }
} */
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
      state.cart.push(data.pop())
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
  },
  actions: {
    deleteItemCart({ commit }, id) {
      commit('setLoading', true, { root: true })
      commit('deleteItemCart', id)
      commit('setLoading', false, { root: true })
    },
    async addToUserCart({ commit }, { id }) {
      commit('setLoading', true, { root: true })
      try {
        const { data } = await axios.get(`${this.$config.API_CART}/${id}`, {
          headers: this.$config.header,
          params: this.$config.params,
        })
        commit('addToCart', data)
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
      await this.$auth.logout()
      commit('setLoading', false, { root: true })
    },
    async loginUser({ commit }, body) {
      commit('setLoading', true, { root: true })
      try {
        const { data } = await this.$auth.loginWith('local', {
          data: body,
        })
        const user = await axios.get(
          `${this.$config.API_GET_USER}/${data.current_user.uid}`,
          {
            ...this.$config.httpHeader,
          }
        )
        this.$auth.setUser(user.data[0])
        commit('setCart', user.data[0].products)
        commit('setError', false)
        commit('setErrorMessage', '')
      } catch (error) {
        commit('setError', true)
        commit('setErrorMessage', error)
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
