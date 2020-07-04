const API = 'http://www.xtfoss.com/errres-server/api'
const HOST = 'http://www.xtfoss.com'
export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/logo.png' }],
  },
  /*
   ** Global CSS
   */
  css: [
    { src: 'primevue/resources/primevue.min.css' },
    { src: 'primevue/resources/themes/nova-alt/theme.css' },
    { src: 'primeicons/primeicons.css' },
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/primevue.js', mode: 'client' },
    { src: '~/plugins/global.js', mode: 'client' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},

  auth: {
    strategies: {
      local: {
        redirect: {
          login: '/login',
          logout: '/',
          callback: '/login',
          home: '/',
        },
        endpoints: {
          login: {
            url: `${HOST}/errres-server/user/login?_format=json`,
            method: 'post',
            propertyName: 'csrf_token',
          },
          logout: { url: `${HOST}/errres-server/user/logout`, method: 'get' },
          user: false,
        },
        tokenType: 'X-CSFR-Token',
      },
    },
  },

  env: {
    HOME_PAGE_CODE: '103',
    BLOG_PAGE_CODE: '105',
    HISTORY_PAGE_CODE: '104',
    INFORMATION_PAGE_CODE: '296',
  },

  publicRuntimeConfig: {
    // Global utils variables
    SERVER_PATH: HOST,
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      _format: 'json',
    },
    httpHeader: {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
    // API Variables
    API_PRODUCTS: `${API}/store`,
    API_PROMOTED: `${API}/promoted`,
    API_PAGE: `${API}/pages`,
    API_ARTICLES: `${API}/articles`,
    API_CART: `${API}/cart`,
    API_LOGIN_USER: `${HOST}/user/login`,
    API_GET_USER: `${API}/users`,
    carouselResponsiveOptions: [
      {
        breakpoint: '1024px',
        numVisible: 4,
        numScroll: 3,
      },
      {
        breakpoint: '600px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '480px',
        numVisible: 1,
        numScroll: 1,
      },
    ],
  },
  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
}
