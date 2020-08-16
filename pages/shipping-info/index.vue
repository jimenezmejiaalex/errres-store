<template>
  <div class="py-8">
    <div class="text-white text-base">
      <div class="text-white text-xl font-bold pb-4">
        Informacion importante
      </div>
      <!-- eslint-disable-next-line -->
      <div class="py-4">
        <span v-html="contactoInfo"></span>
      </div>
      <div>
        <div class="w-full">
          <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="name"
                >Nombre completo</label
              >
              <input
                id="name"
                v-model="formData.name"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Nombre completo"
              />
            </div>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="phone"
                >Teléfono</label
              >
              <input
                id="phone"
                v-model="formData.phone"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="tel"
                placeholder="88888888"
              />
            </div>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="direction"
                >Dirección exacta</label
              >
              <textarea
                id="direction"
                v-model="formData.direction"
                rows="10"
                cols="50"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="200m NE Iglesia central San Jose"
              />
            </div>
            <div class="flex items-center justify-between">
              <button
                :disabled="emptyInfo"
                :class="[
                  {
                    'bg-blue-300': emptyInfo,
                    'bg-blue-500 hover:bg-blue-700': !emptyInfo,
                  },
                  'text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
                ]"
                type="button"
                @click="sendInfo"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Purchase',
  data() {
    return {
      formData: {
        name: '',
        phone: '',
        direction: '',
      },
    }
  },
  computed: {
    emptyInfo() {
      return !(
        this.formData.name.length ||
        this.formData.phone.length ||
        this.formData.name.length
      )
    },
    contactoInfo() {
      return this.general ? this.general.contacto_notificacion : ''
    },
    ...mapGetters(['paypalResponse', 'general']),
  },
  methods: {
    sendInfo() {
      if (this.emptyInfo) {
        this.$toast.add({
          severity: 'error',
          summary: 'Falta información',
          detail: 'Por favor llenar todos los campos.',
          life: 3000,
        })
      } else {
        console.log('Send Info')
      }
    },
  },
  head() {
    return {
      title: 'Errres Compra',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Errres user compra',
        },
      ],
    }
  },
}
</script>

<style></style>
