<template>
  <div
    v-if="!$auth.loggedIn"
    class="px-4 sm:px-4 md:px-8 lg:px-48 xl:px-64 flex flex-col items-center"
  >
    <div class="w-full max-w-xs">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
          >
            Usuario
          </label>
          <input
            id="username"
            v-model="name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Usuario"
          />
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Contraseña
          </label>
          <input
            id="password"
            v-model="pass"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="********"
          />
        </div>
        <Message v-if="error" severity="error" :closable="false"
          >Ocurrio un error al iniciar sesión: {{ errorMesagge }}</Message
        >
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click="login"
          >
            Iniciar sesión
          </button>
          <a
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Registrarse
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      name: '',
      pass: '',
    }
  },
  computed: {
    ...mapGetters({
      error: 'user/error',
      errorMesagge: 'user/errorMessage',
    }),
  },
  watch: {
    user(newValue) {
      if (newValue) {
        this.$router.push('/')
      }
    },
  },
  methods: {
    register() {},
    login() {
      this.loginUser({ name: this.name, pass: this.pass })
    },
    ...mapActions({ loginUser: 'user/loginUser' }),
  },
  head() {
    return {
      title: 'Errres Login Page',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Errres Login page',
        },
      ],
    }
  },
}
</script>
<style lang="scss">
.login {
  $icontext: 'icon';
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5% 0;
  &__field {
    &-user {
      width: 250px;
    }
    &-password {
      width: 250px;
    }
  }
  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    &-logo {
      width: 250px;
    }
  }
  .pi.pi-user.login__icon {
    font-size: 150px;
  }
  &__buttons-container {
    padding: 20px 0;
  }
  &__login-button {
    width: 100%;
    height: 50px;
  }
}
</style>
