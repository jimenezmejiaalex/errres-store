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
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Correo
          </label>
          <input
            id="email"
            v-model="mail"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="Correo"
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
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password2"
          >
            Confirmar contraseña
          </label>
          <input
            id="password2"
            v-model="pass2"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            :class="{ 'border-red-700': pass !== pass2 }"
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
            :class="{
              'opacity-50 cursor-not-allowed hover:bg-transparent': !isSubmitable,
            }"
            type="button"
            @click="register"
          >
            Registrarse
          </button>
          <nuxt-link
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to="/login"
          >
            Iniciar sesión
          </nuxt-link>
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
      mail: '',
      pass: '',
      pass2: '',
    }
  },
  computed: {
    ...mapGetters({
      error: 'user/error',
      errorMesagge: 'user/errorMessage',
    }),
    fieldsEmpty() {
      return (
        this.name.length === 0 ||
        this.mail.length === 0 ||
        this.pass.length === 0 ||
        this.pass2.length === 0
      )
    },
    isSubmitable() {
      return !this.fieldsEmpty && this.pass === this.pass2
    },
  },
  methods: {
    clearFields() {
      this.mail = ''
      this.name = ''
      this.pass = ''
      this.pass2 = ''
    },
    register() {
      if (this.isSubmitable) {
        try {
          this.requestRegisterUser({
            name: { value: this.name },
            pass: { value: this.pass },
            mail: { value: this.mail },
          })
          this.clearFields()
        } catch (error) {}
      }
    },
    ...mapActions({ requestRegisterUser: 'user/registerUser' }),
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
