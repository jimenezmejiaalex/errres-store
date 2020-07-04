import Vue from 'vue'

Vue.filter('priceFormat', (text) => {
  return `₡ ${parseFloat(text)
    .toFixed(0)
    .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')}`
})
