import axios from 'axios'
export const state = () => ({
  news: [],
  cyaPromoted: [],
  products: [],
  pages: [],
  productsFilter: null,
  checkboxesSelected: [],
  pricesValues: [0, 0],
  loading: false,
})
export const mutations = {
  setLoading(state, value) {
    state.loading = value
  },
  getPages(state, pages) {
    state.pages = pages
  },
  getcyaPromoted(state, cyaPromoted) {
    state.cyaPromoted = cyaPromoted
  },
  getNews(state, cyaPromoted) {
    state.news = cyaPromoted
  },
  getAllProducts(state, products) {
    state.products = products
  },
  setcheckboxesSelected(state, data) {
    state.checkboxesSelected = data
  },
  setpricesValues(state, data) {
    state.pricesValues = data
  },
}
export const actions = {
  async getcyaPromoted({ commit }) {
    const { data } = await axios.get(this.$config.API_PROMOTED)
    commit('getcyaPromoted', data)
  },
  async getNews({ commit }) {
    try {
      const { data } = await axios.get(this.$config.API_NEWS)
      commit('getNews', data)
    } catch (error) {}
  },
  async getAllProducts({ commit }) {
    const { data } = await axios.get(this.$config.API_PRODUCTS)
    commit('getAllProducts', data)
  },
  async getPages({ commit }) {
    const { data } = await axios.get(`${this.$config.API_PAGE}/all`)
    commit('getPages', data)
  },
  setpricesValues({ commit }, data) {
    commit('setpricesValues', data)
  },
  async nuxtServerInit({ dispatch, getters }) {
    await dispatch('getPages')
    await dispatch('getcyaPromoted')
    await dispatch('getAllProducts')
    await dispatch('setpricesValues', [getters.minPrice, getters.maxPrice])
  },
  async initApp({ dispatch, getters, commit }) {
    await dispatch('getPages')
    await dispatch('getNews')
    await dispatch('getcyaPromoted')
    await dispatch('getAllProducts')
    await dispatch('setpricesValues', [getters.minPrice, getters.maxPrice])
    const user = this.$auth.$storage.getLocalStorage('user')
    if (user) {
      this.$auth.setUser(user)
      commit('user/setCart', user.products)
    }
  },
}
export const getters = {
  news: ({ news }) => news,
  cyaPromoted: ({ cyaPromoted }) => cyaPromoted,
  cyaPromotedById: ({ cyaPromoted }) => (id) =>
    cyaPromoted.find(({ PId }) => PId === id),
  allProducts: ({ products }) => products,
  productsById: ({ products }) => (id) =>
    products.find(({ PId }) => PId === id),
  homePage: ({ pages }) => pages.find(({ id }) => id === '103'),
  blogPage: ({ pages }) => pages.find(({ id }) => id === '105'),
  informationPage: ({ pages }) => pages.find(({ id }) => id === '296'),
  historyPage: ({ pages }) => pages.find(({ id }) => id === '104'),
  pages: ({ pages }) => pages,
  filter: ({ filter }) => filter,
  minPrice: ({ products }) =>
    Math.min(...products.map(({ price }) => parseFloat(price))),
  maxPrice: ({ products }) =>
    Math.max(...products.map(({ price }) => parseFloat(price))),
  loading: ({ loading }) => loading,
}
