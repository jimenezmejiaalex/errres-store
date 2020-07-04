import axios from 'axios'

export default {
  state: () => ({
    articles: [],
    article: null,
  }),
  mutations: {
    getArticles(state, articles) {
      state.articles = articles
    },
    getArticle(state, article) {
      state.article = article
    },
  },
  actions: {
    async getArticles({ commit }, pageCode) {
      const { data } = await axios.get(
        `${this.$config.API_ARTICLES}/${pageCode}`
      )
      commit('getArticles', data)
    },
    async getArticle({ commit }, code) {
      const { data } = await axios.get(
        `${this.$config.API_ARTICLES}/article/${code}`
      )
      commit('getArticle', data.pop())
    },
    async getBlogArticles({ dispatch }) {
      await dispatch('getArticles', '105')
    },
    async getHistoryArticles({ dispatch }) {
      await dispatch('getArticles', '104')
    },
  },
  getters: {
    articles: ({ articles }) => articles,
    articlesByCategory: ({ articles }) => (cId) =>
      articles.filter(({ categories }) =>
        categories.includes(({ id }) => id === cId)
      ),
    article: ({ article }) => article,
  },
}
