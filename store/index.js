import axios from 'axios'
export const state = () => ({
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
}
export const getters = {
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