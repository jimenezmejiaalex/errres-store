<template>
  <div class="flex flex-col w-10/12 lg:w-1/2">
    <nav
      :class="{
        block: show,
        hidden: !show,
        'md:block': show,
        'md:hidden': !show,
      }"
      class="py-4 lg:block"
    >
      <ul class="menu flex flex-col lg:flex-row">
        <li class="sm:items-start" @click="closeMenu">
          <a class="middle text-xl w-full">
            <nuxt-link to="/">Inicio</nuxt-link>
          </a>
        </li>
        <li
          v-for="(itemMenu, index) in menuItems"
          :key="index"
          class="sm:items-start"
          @click="closeMenu"
        >
          <a class="middle text-xl w-full">
            <nuxt-link :to="`/${itemMenu.url}`">
              <em :class="`pi ${itemMenu.logo} px-2 lg:hidden`"></em>
              {{ itemMenu.title | menuFormat }}
            </nuxt-link>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'MenuComponent',
  filters: {
    menuFormat(text) {
      return `${text[0].toUpperCase()}${text.slice(1)}`
    },
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menuItems: [
        { title: 'tienda', url: 'tienda', logo: 'pi-shopping-cart' },
        { title: 'blog', url: 'blog', logo: 'pi-file-o' },
        { title: 'historia', url: 'historia', logo: 'pi-id-card' },
        {
          title: 'información',
          url: 'informacion',
          logo: 'pi-question-circle',
        },
      ],
    }
  },
  methods: {
    closeMenu() {
      setTimeout(() => this.$emit('close'), 300)
    },
  },
}
</script>

<style lang="scss" scoped>
#menu-toggle:checked + #menu {
  display: block;
}
.principal-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
  &__icon {
    display: flex;
    padding: 0 10%;
    justify-content: flex-end;
    .pi.pi-align-justify {
      font-size: 40px;
    }
  }
}
.box-shadow-menu:before {
  content: '';
  position: absolute;
  width: 2em;
  height: 0.35em;
  background: #0afc16;
  -webkit-box-shadow: 0 0.25em 0 0 #0afc16, 0 0.5em 0 0 #0afc16;
  box-shadow: 0 0.65em 0 0 #0afc16, 0 1.3em 0 0 #0afc16;
}
ul.menu,
.menu {
  background: black;
  margin: 0;
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

@media (min-width: 1024px) {
  a.middle {
    .pi {
      display: none;
    }
  }
}
</style>
