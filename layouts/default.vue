<template>
  <div class="h-full bg-black flex flex-col">
    <Toast v-if="dataReady" class="w-full" position="topright" />
    <div v-if="dataReady" class="px-2 lg:px-20 xl:px-24">
      <nuxt-link to="/">
        <Logo v-cloak />
      </nuxt-link>
      <div class="flex flex-row justify-between">
        <UserInfo v-cloak class="block lg:hidden" />
        <div
          class="p-4 lg:hidden flex justify-end items-center"
          @click="showMenu"
        >
          <em
            class="pi pi-align-justify text-white"
            style="font-size: 1.9rem;"
          ></em>
        </div>
      </div>
      <div class="flex flex-row justify-between">
        <Menu v-cloak :show="show" class="hidden lg:block" />
        <Sidebar
          :visible.sync="show"
          class="block lg:hidden"
          :base-z-index="1000"
          position="right"
        >
          <Menu v-cloak :show="show" @close="showMenu" />
        </Sidebar>
        <UserInfo class="hidden lg:block self-center" />
      </div>
    </div>
    <div v-if="dataReady" class="px-4 lg:px-20 xl:px-24">
      <Dialog
        :visible.sync="displayModal"
        :style="{ width: '50vw' }"
        :modal="true"
      >
        <p class="p-m-0">
          <!-- eslint-disable-next-line -->
          <span v-html="condiciones"></span>
        </p>
        <template #footer>
          <Button label="Ok" icon="pi pi-check" autofocus @click="closeModal" />
        </template>
      </Dialog>
      <nuxt v-cloak />
    </div>
    <div class="fixed layout__social-media">
      <a :href="facebook" target="_blank" rel="noopener noreferrer">
        <div class="text-white text-base p-2 flex flex-row space-x-1">
          <img src="/facebook.png" alt="Facebook" width="29px" /></div
      ></a>
      <a :href="instagram" target="_blank" rel="noopener noreferrer">
        <div class="text-white text-base p-2 flex flex-row space-x-1">
          <img src="/instagram.png" alt="Instagram" width="29px" /></div
      ></a>
    </div>
    <Footer v-if="dataReady" class="sm:px-0 md:px-4 lg:px-20 xl:px-24" />
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
    ...mapGetters(['loading', 'general', 'displayModal', 'dataReady']),
    condiciones() {
      return this.general ? this.general.condiciones_notificacion : ''
    },
    facebook() {
      return this.general ? this.general.facebook_link : ''
    },
    instagram() {
      return this.general ? this.general.instagram_link : ''
    },
  },
  created() {
    this.initApp()
  },
  methods: {
    ...mapActions(['initApp', 'showModal', 'closeModal']),
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
.p-sidebar-right {
  background-color: black;
}
.layout {
  &__social-media {
    top: 85%;
    left: 95%;
  }
}
</style>
