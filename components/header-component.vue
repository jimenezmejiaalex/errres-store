<template>
  <div class="p-grid">
    <router-link to="/inicio" class="p-grid p-sm-12 p-md-7 p-lg-8 p-xl-9">
      <div class="p-sm-3 p-md-3 p-lg-2 p-xl-2">
        <img :src="`${$config.IMAGES}/logo.png`" alt="Erres" class="p-col-12" />
      </div>
      <div class="p-sm-9 p-md-9 p-lg-10 p-xl-10">
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
    </router-link>
    <div class="p-sm-12 p-md-5 p-lg-4 p-xl-3">
      <login />
    </div>
  </div>
</template>

<script>
import Login from './login-component'
export default {
  name: 'HeaderComponent',
  components: {
    Login,
  },
}
</script>

<style lang="scss">
.header {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__logo-lema {
    display: flex;
    flex-direction: row;
    width: 80%;
    .header__logo {
      width: 250px;
      justify-self: flex-end;
      align-self: center;
      &-image {
        width: 100%;
      }
    }
    .header__lema {
      display: flex;
      align-items: flex-end;
      width: fit-content;
    }
  }
  @media (min-width: 900px) {
    flex-direction: row;
  }
}
</style>
