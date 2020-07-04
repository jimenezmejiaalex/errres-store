<template>
  <div class="h-full bg-black flex flex-col">
    <Toast class="w-full" position="topright" />
    <div class="px-2 lg:px-20 xl:px-24">
      <Logo />
      <div class="flex flex-row justify-between">
        <UserInfo class="block lg:hidden" />
        <div
          class="p-4 lg:hidden flex justify-end items-center"
          @click="showMenu"
        >
          <em class="pi pi-align-justify text-white" style="font-size: 1.9rem;">
          </em>
        </div>
      </div>
      <div class="flex flex-row justify-between">
        <Menu :show="show" />
        <UserInfo class="hidden lg:block self-center" />
      </div>
    </div>
    <div class="px-4 lg:px-20 xl:px-24">
      <nuxt />
    </div>
    <Footer class="sm:px-0 md:px-4 lg:px-20 xl:px-24" />
    <ProgressSpinner
      v-if="loading"
      style="position: fixed; top: 50%; left: 50%;"
    />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Menu from '~/components/menu-component'
import Footer from '~/components/footer-component'
import Logo from '~/components/Logo'
import UserInfo from '~/components/user-info-component'
export default {
  components: {
    Menu,
    Footer,
    Logo,
    UserInfo,
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapGetters(['loading']),
  },
  created() {
    this.initApp()
  },
  methods: {
    ...mapActions(['initApp']),
    showMenu() {
      this.show = !this.show
    },
  },
}
</script>
<style lang="scss">
html {
  background-color: black;
}
</style>
