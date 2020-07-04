<template>
  <div class="p-2">
    <div v-if="!$auth.loggedIn">
      <nuxt-link to="/login" class="justify-end text-white hover:text-gray-600">
        <em class="pi pi-sign-in"></em>
        Iniciar sesión
      </nuxt-link>
    </div>
    <div v-else class="flex flex-row items-center">
      <nuxt-link
        to="/user"
        class="bg-black hover:bg-gray-900 text-white border border-gray-800 rounded font-bold py-2 px-4 space-x-2 flex flex-row items-center"
      >
        <em class="pi pi-shopping-cart"></em><span>{{ cartLength }}</span>
      </nuxt-link>
      <div class="w-full flex flex-col">
        <button
          class="text-white text-lg self-end p-4 flex flex-row space-x-1"
          @click="toggle"
        >
          <em class="pi pi-user self-center"></em>
          <span class="self-center">{{ $auth.user.name }}</span>
          <em class="pi pi-angle-down self-center"></em>
        </button>
        <Menu ref="menu" :model="items" :popup="true" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      items: [
        {
          label: 'Cerrar Sesión',
          icon: 'pi pi-sign-out',
          command: this.logout,
        },
      ],
    }
  },
  computed: {
    ...mapGetters({ cartLength: 'user/cartLength' }),
  },
  methods: {
    ...mapActions({ logout: 'user/logoutUser' }),
    logoutSession() {
      this.logout()
      this.$router.push('/')
    },
    toggle(event) {
      this.$refs.menu.toggle(event)
    },
  },
}
</script>

<style></style>
