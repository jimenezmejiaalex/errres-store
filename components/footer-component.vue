<template>
  <div class="bg-gray-900 bg-opacity-50">
    <div class="flex flex-col w-full p-4">
      <div
        class="self-center cursor-pointer hover:opacity-25"
        @click="backToTop"
      >
        <em class="text-white pi pi-angle-up" style="font-size: 1.5rem;"></em>
      </div>
      <div
        class="flex flex-col md:flex-row py-4 -mx-4 space-y-3 lg:space-x-6 lg:space-y-0"
      >
        <div class="p-4">
          <img class="w-48" :src="logoImageSrc" alt="Errres" />
        </div>
        <div class="p-4">
          <div class="text-white text-lg font-bold text-left pb-4">Social</div>
          <a
            :href="general.facebook_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="text-white text-base p-2 flex flex-row space-x-1">
              <img
                src="/facebook.png"
                alt="Facebook"
                width="29px"
                height="29px"
              />
              <span class="text-green-400 text-base">@errres.cr</span>
            </div></a
          >
          <a
            :href="general.instagram_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="text-white text-base p-2 flex flex-row space-x-1">
              <img
                src="/instagram.png"
                alt="Instagram"
                width="29px"
                height="29px"
              />
              <span class="text-green-400 text-base">Errres® CR</span>
            </div></a
          >
        </div>
        <div class="p-4">
          <div class="text-white text-lg font-bold text-left pb-4">
            Información
          </div>
          <nuxt-link
            to="/informacion"
            class="text-white text-base hover:underline"
            ><span>Información general</span></nuxt-link
          >
        </div>
        <div class="p-4">
          <div class="text-white text-lg font-bold text-left pb-4">
            Productos
          </div>
          <nuxt-link to="/tienda" class="flex flex-row space-x-2">
            <em
              class="pi pi-shopping-cart text-white"
              style="font-size: 1.2rem;"
            ></em>
            <span class="text-white text-base hover:underline">
              Tienda en linea</span
            >
          </nuxt-link>
        </div>
      </div>
      <hr class="text-thile py-2" />
      <p class="text-gray-500 text-xs text-left">
        &copy;2020 Errres. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FooterComponent',
  filters: {
    menuFormat(text) {
      return `${text[0].toUpperCase()}${text.slice(1)}`
    },
  },
  data() {
    return {
      menuItems: ['inicio', 'blog', 'historia'],
      facebook: 'https://www.facebook.com/errres.cr/',
      instagram: 'https://www.instagram.com/errres.cr/',
    }
  },
  computed: {
    ...mapGetters(['general']),
    logoImageSrc() {
      return this.general
        ? this.general.logo
          ? this.general.logo.media_image
          : ''
        : ''
    },
  },
  methods: {
    backToTop() {
      const scrollToTop = () => {
        if (process.browser) {
          const c =
            document.documentElement.scrollTop || document.body.scrollTop
          if (c > 0) {
            window.requestAnimationFrame(scrollToTop)
            window.scrollTo(0, c - c / 10)
          }
        }
      }
      scrollToTop()
      // window.scrollTo(0, 0)
    },
  },
}
</script>

<style lang="scss">
.footer {
  display: flex;
  flex-direction: row;
  &__logo {
    &-image {
      width: 250px;
    }
    &-and-menu {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      width: 70%;
    }
  }
  &__menu {
    padding-left: 5%;
    padding-bottom: 5%;
  }
  &__social {
    display: flex;
    flex-direction: column-reverse;
    justify-items: flex-end;
    padding-bottom: 5%;
    width: 30%;
    &-links {
      display: flex;
      flex-direction: row;
      justify-items: flex-start;
      align-items: center;
    }
    &-title {
      // padding: 5% 0;
    }
  }
  ul.menu,
  .menu {
    background: black;
    display: flex;
    flex-direction: column;
    margin: 0;
  }
  .menu li {
    display: flex;
    align-items: center;
  }
  .menu li a {
    text-decoration: none;
    float: left;
    padding: 10px;
    color: #fff;
  }

  .menu li a {
    text-decoration: none;
    float: left;
    padding: 10px;
    color: #fff;
  }

  a.middle {
    position: relative;
  }

  a.middle:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #fff;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out;
  }

  a.middle:hover:before {
    visibility: visible;
    transform: scaleX(1);
  }
}
</style>
