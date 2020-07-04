<template>
  <div v-if="pageData" class="home">
    <div v-if="pageData.video" class="home__video">
      <video :src="videoUrl" controls />
    </div>
    <div
      v-if="pageData.description"
      ref="description"
      class="home__description text-white"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="pageData.description"></span>
    </div>
    <div class="home__cya">
      <div v-if="cyaPromoted" class="cya-promoted">
        <Carousel
          :value="cyaPromoted"
          :num-visible="4"
          :num-scroll="3"
          :circular="true"
          :autoplay-interval="3000"
          :responsive-options="$config.carouselResponsiveOptions"
          class="w-full"
        >
          <template #header>
            <h1 class="text-2xl text-white py-8">Colecciones y Accesorios</h1>
          </template>
          <template #item="slotProps">
            <router-link :to="`/product/${slotProps.data.id}`">
              <div class="cya-promoted__card">
                <div class="cya-promoted__card-image">
                  <img
                    :src="introImageSrc(slotProps.data)"
                    :alt="slotProps.data.name"
                  />
                </div>
                <div class="cya-promoted__card-content">
                  <div cya-promoted__card-content-title>
                    {{ slotProps.data.title }}
                  </div>
                </div>
              </div>
            </router-link>
          </template>
        </Carousel>
      </div>
    </div>
    <div class="home__news"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HomePage',
  computed: {
    videoUrl() {
      return `${this.$config.SERVER_PATH}${this.pageData.video.media_video_file}`
    },
    ...mapGetters({ cyaPromoted: 'cyaPromoted', pageData: 'homePage' }),
  },
  methods: {
    introImageSrc(data) {
      return data.intro_image.media_image
    },
  },
  scrollToTop: true,
  head() {
    return {
      title: 'Errres Home Page',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Errres Home Page',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  &__video {
    display: flex;
    flex-direction: column;
    video {
      width: 100%;
    }
  }
}
.cya-promoted {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    &-content {
      padding: 5% 0;
      color: white;
      &-title {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
    &-image {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50%;
      img {
        width: 100%;
      }
    }
  }
}
</style>
