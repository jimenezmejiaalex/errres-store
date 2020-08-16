import axios from 'axios'

const getCategories = (articles) => {
  const categoriesList = articles.reduce(
    (previous, { categories }, index) => [...previous, ...categories],
    []
  )
  const uniqueCategories = new Set(categoriesList.map(({ id }) => id))
  return [...uniqueCategories].map((id) =>
    categoriesList.find((el) => el.id === id)
  )
}

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
        `${this.$config.API_ARTICLES}/${pageCode}`,
        this.$config.credentials
      )
      commit('getArticles', data)
    },
    async getArticle({ commit }, code) {
      const { data } = await axios.get(
        `${this.$config.API_ARTICLES}/article/${code}`,
        this.$config.credentials
      )
      commit('getArticle', data.pop())
    },
    async getBlogArticles({ dispatch }) {
      await dispatch('getArticles', '3')
    },
    async getHistoryArticles({ dispatch }) {
      await dispatch('getArticles', '4')
    },
  },
  getters: {
    categories: ({ articles }) => getCategories(articles),
    articles: ({ articles }) => articles,
    articlesByCategory: ({ articles }) => (cId) =>
      articles.filter(({ categories }) =>
        categories.includes(({ id }) => id === cId)
      ),
    article: ({ article }) => article,
  },
}
