import axios from 'axios'
const API = 'https://www.errres.org/admin/api'
const HOST = 'https://www.errres.org/admin'

const dynamicRoutes = async () => {
  const products = await axios.get(`${API}/store`, {
    credentials: true,
    auth: {
      username: 'editor',
      password: 'editor',
    },
  })
  const articles = await axios.get(`${API}/articles`, {
    credentials: true,
    auth: {
      username: 'editor',
      password: 'editor',
    },
  })
  const routesProducts = products.data.map(({ id }) => `/product/${id}`)
  const routesArticles = articles.data.map(({ id }) => `/article/${id}`)
  const routes = routesProducts.concat(routesArticles)
  return routes
}

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
    title: 'Errres',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      {
        'http-equiv': 'Content-Security-Policy',
        content: 'upgrade-insecure-requests',
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
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-173261932-1',
      },
    ],
  ],
  googleAnalytics: {
    id: 'UA-173261932-1', // Used as fallback if no runtime config is provided
  },
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
  axios: {
    headers: {
      common: {
        'Content-Type': 'application/json',
      },
    },
  },
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
            url: `${HOST}/user/login?_format=json`,
            method: 'post',
          },
          logout: false,
          user: false,
        },
      },
    },
  },
  env: {
    HOME_PAGE_CODE: '1',
    BLOG_PAGE_CODE: '105',
    HISTORY_PAGE_CODE: '104',
    INFORMATION_PAGE_CODE: '296',
  },
  publicRuntimeConfig: {
    // Global utils variables
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTICS_ID,
    },
    SERVER_PATH: HOST,
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      _format: 'json',
    },
    credentials: {
      credentials: true,
      auth: {
        username: 'editor',
        password: 'editor',
      },
    },
    httpHeader: {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
    // API Variables
    // LOGOUT: `${HOST}/errres-server/user/logout`,
    LOGOUT: `${HOST}/user/logout`,
    API_PRODUCTS: `${API}/store`,
    API_PROMOTED: `${API}/promoted`,
    API_PAGE: `${API}/pages`,
    API_ARTICLES: `${API}/articles`,
    API_CART: `${API}/cart`,
    // API_LOGIN_USER: `${HOST}/user/login`,
    API_LOGIN_USER: `${HOST}/user/login`,
    API_GET_USER: `${API}/users`,
    // API_REGISTER_USER: `${HOST}/errres-server/user/register?_format=json`,
    API_REGISTER_USER: `${HOST}/user/register?_format=json`,
    // API_POST_USER: `${HOST}/errres-server/user`,
    // API_POST_NODE: `${HOST}/errres-server/node`,
    API_POST_USER: `${HOST}/user`,
    API_POST_NODE: `${HOST}/node`,
    API_NEWS: `${API}/news`,
    API_GENERAL: `${API}/general-settings`,
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
    roles: { value: 'authenticated' },
    status: { value: '1' },
    exchangeRates: {
      token: 'M7MIAEZAZ9',
      mail: 'jimenezmejiaalex@gmail.com',
    },
  },
  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  loading: {
    color: 'white',
    height: '5px',
  },
  loadingIndicator: {
    name: 'circle',
    color: '#3B8070',
    background: 'black',
  },
  generate: {
    routes: dynamicRoutes,
  },
}
