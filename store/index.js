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
  general: null,
  displayModal: false,
  paypalResponse: null,
  tipodeCambio: null,
  dataReady: false,
})
export const mutations = {
  setDataReady(state, value) {
    state.dataReady = value
  },
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
  setGeneralSettings(state, data) {
    state.general = data
  },
  displayModal(state, value) {
    state.displayModal = value
  },
  setPaypalResponse(state, data) {
    state.paypalResponse = data
  },
  setExchange(state, value) {
    state.tipodeCambio = value
  },
}
export const actions = {
  setPaypalResponse({ commit }, data) {
    commit('setPaypalResponse', data)
  },
  showModal({ commit }) {
    commit('displayModal', true)
  },
  closeModal({ commit }) {
    commit('displayModal', false)
  },
  async getcyaPromoted({ commit }) {
    const { data } = await axios.get(
      this.$config.API_PROMOTED,
      this.$config.credentials
    )
    commit('getcyaPromoted', data)
  },
  async getNews({ commit }) {
    try {
      const { data } = await axios.get(
        this.$config.API_NEWS,
        this.$config.credentials
      )
      commit('getNews', data)
    } catch (error) {}
  },
  async getAllProducts({ commit }) {
    const { data } = await axios.get(
      this.$config.API_PRODUCTS,
      this.$config.credentials
    )
    commit('getAllProducts', data)
  },
  async getPages({ commit }) {
    const { data } = await axios.get(
      `${this.$config.API_PAGE}/all`,
      this.$config.credentials
    )
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
  async getGeneralSettings({ commit }) {
    try {
      const { data } = await this.$axios.get(
        this.$config.API_GENERAL,
        this.$config.credentials
      )
      commit('setGeneralSettings', data.pop())
    } catch (error) {}
  },
  async getExchange({ commit }) {
    const URL = 'https://tipodecambio.paginasweb.cr/api'
    const today = new Date()
    const [day, month, year] = [
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear(),
    ]
    const { data } = await axios.get(`${URL}/${day}/${month}/${year}`)
    commit('setExchange', data)
  },
  async initApp({ dispatch, getters, commit }) {
    commit('setDataReady', false)
    commit('setLoading', true)
    await dispatch('getPages')
    await dispatch('getNews')
    await dispatch('getcyaPromoted')
    await dispatch('getAllProducts')
    await dispatch('setpricesValues', [getters.minPrice, getters.maxPrice])
    await dispatch('getGeneralSettings')
    await dispatch('getExchange')
    const user = this.$auth.$storage.getLocalStorage('user')
    if (user) {
      this.$auth.setUser(user)
      commit('user/setCart', user.products)
      await dispatch('user/checkUserDeletableProducts')
    }
    commit('setLoading', false)
    commit('setDataReady', true)
  },
}
export const getters = {
  dataReady: ({ dataReady }) => dataReady,
  news: ({ news }) => news,
  cyaPromoted: ({ cyaPromoted }) => cyaPromoted,
  cyaPromotedById: ({ cyaPromoted }) => (id) =>
    cyaPromoted.find(({ PId }) => PId === id),
  allProducts: ({ products }) => products,
  productsById: ({ products }) => (id) =>
    products.find(({ PId }) => PId === id),
  homePage: ({ pages }) => pages.find(({ id }) => id === '1'),
  blogPage: ({ pages }) => pages.find(({ id }) => id === '3'),
  informationPage: ({ pages }) => pages.find(({ id }) => id === '2'),
  historyPage: ({ pages }) => pages.find(({ id }) => id === '4'),
  pages: ({ pages }) => pages,
  filter: ({ filter }) => filter,
  minPrice: ({ products }) =>
    Math.min(...products.map(({ price }) => parseFloat(price))),
  maxPrice: ({ products }) =>
    Math.max(...products.map(({ price }) => parseFloat(price))),
  loading: ({ loading }) => loading,
  general: ({ general }) => general,
  displayModal: ({ displayModal }) => displayModal,
  paypalResponse: ({ paypalResponse }) => paypalResponse,
  exchangePrice: ({ tipodeCambio }) => (price) => price / tipodeCambio.venta,
}
