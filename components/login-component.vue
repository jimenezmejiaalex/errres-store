<template>
  <div>
    <div v-if="!user">
      <router-link to="login" class="p-grid p-justify-end">
        <Button
          icon="pi pi-sign-in"
          label="Iniciar sesión"
          class="p-button-lg p-button p-button-secondary p-sm-12 p-md-6 p-lg-6 p-xl-6"
        />
      </router-link>
    </div>
    <div v-else>
      <div class="p-grid p-justify-end">
        <router-link to="user" class="p-grid p-sm-3 p-md-4 p-lg-4 p-xl-4">
          <div class="p-col p-col-align-center">
            <Button
              icon="pi pi-shopping-cart"
              :label="userCartSize"
              class="p-button-lg p-button-rounded p-button-secondary"
            />
          </div>
          <ProgressSpinner
            v-if="loadingProductToCart"
            style="width: 40px; height: 40px;"
            stroke-width="8"
            animation-duration=".5s"
          />
        </router-link>
        <div class="p-grid p-sm-4 p-md-7 p-lg-8 p-xl-8" @click="toggle">
          <i class="pi pi-user p-col-2"></i>
          <span class="p-col">{{ userName }}</span>
          <i class="pi pi-angle-down p-col-2"></i>
        </div>
        <Menu ref="menu" :model="items" :popup="true" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'LoginComponent',
  components: {},
  data() {
    return {
      name: '',
      pass: '',
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
    ...mapGetters(['user/user', 'user/loadingProductToCart']),
    userCartSize() {
      return this.user.products ? `${this.user.products.length}` : ''
    },
    userName() {
      return this.user ? this.user.name : ''
    },
  },
  methods: {
    ...mapActions('user/logoutUser'),
    logoutSession() {
      this.logout()
      this.$router.push('inicio')
    },
    isEmpty(array) {
      return array.length === 0
    },
    toggle(event) {
      this.$refs.menu.toggle(event)
    },
  },
}
</script>

<style lang="scss">
div.login.p-col-12 > * {
  padding: 7px 0;
  margin: 1px;
}
.login {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  &__inputs {
    display: flex;
    flex-direction: column;
    &_user {
      padding: 5% 0;
    }
    &-pass {
      padding: 5% 0;
    }
  }
  &__title {
    display: flex;
    flex-direction: column;
  }
  &__buttons {
    display: flex;
    flex-direction: column;
    padding: 5% 0;
  }
  .no_style {
    text-decoration: inherit;
    color: white;
  }
}
</style>
