<template v-if="general">
  <div class="w-full flex flex-col lg:flex-row">
    <img class="max-w-xs" :src="logoImageSrc" alt="Errres" />
    <div
      class="w-full text-green-600 flex flex-col space-y-1 justify-center p-4"
    >
      <!-- eslint-disable-next-line -->
      <span v-html="lema"></span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Logo',
  computed: {
    ...mapGetters(['general']),
    logoImageSrc() {
      return this.general
        ? this.general.logo
          ? this.general.logo.media_image
          : ''
        : ''
    },
    lema() {
      return this.general ? this.general.lema : ''
    },
  },
}
</script>
