<template>
  <div v-if="article" v-cloak class="article">
    <h5 class="text-white text-xl font-bold p-4">{{ article.title }}</h5>
    <hr />
    <div class="flex flex-col">
      <div class="article__intro-image">
        <img v-if="article" :src="imageSrc(article.intro_image)" alt />
      </div>

      <div class="article__description text-white py-4">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="space-y-4" v-html="article.description"></span>
      </div>
    </div>
    <Galleria
      :value="article.images"
      :active-index.sync="activeIndex"
      :responsive-options="$config.carouselResponsiveOptions"
      :num-visible="7"
      :circular="true"
      :full-screen="true"
      :show-item-navigators="true"
      :show-thumbnails="false"
      :visible.sync="displayCustom"
    >
      <template #item="slotProps">
        <img
          :src="imageSrc(slotProps.item)"
          :alt="slotProps.item.title"
          class="w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl block"
        />
      </template>
      <template #thumbnail="slotProps">
        <img
          :src="imageSrc(slotProps.item)"
          :alt="slotProps.item.title"
          class="block"
        />
      </template>
      <template #caption="{item}">
        <h4 style="margin-bottom: 0.5rem;">{{ item.title }}</h4>
      </template>
    </Galleria>
    <div
      v-if="article.images"
      class="flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row flex-wrap -mx-4"
    >
      <div
        v-for="(image, index) of article.images"
        :key="index"
        class="mx-4 my-4 rounded-md"
      >
        <img
          :src="imageSrc(image)"
          :alt="image.title"
          class="w-full max-w-sm lg:max-w-md hover:opacity-25"
          @click="imageClick(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleComponent',
  async asyncData({ $axios, params, $config }) {
    const { data } = await $axios.get(
      `${$config.API_ARTICLES}/article/${params.id}`,
      $config.credentials
    )
    return { article: data.pop() }
  },
  data() {
    return {
      imageActive: null,
      activeIndex: 0,
      displayCustom: false,
    }
  },
  methods: {
    setImageActive(image) {
      this.imageActive = image
    },
    imageSrc(item) {
      return ` ${item.media_image}`
    },
    imageClick(index) {
      this.activeIndex = index
      this.displayCustom = true
    },
  },
  head() {
    return {
      title: this.article.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Errres Article',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.article {
  &__intro-image {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  &__active-image {
    width: 100%;
  }
  &__card-image:hover {
    opacity: 1;
  }
  &__description {
    font-size: 15px;
  }
  &__image {
    width: auto;
    img {
      width: fit-content;
    }
  }
  &__images {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .p-carousel-item.p-carousel-item-cloned:hover {
    opacity: 1;
  }
  &__image-active {
    width: 100%;
    display: flex;
    padding: 20px 20%;
    flex-direction: column;
    align-items: center;
  }
  &__thumbnail-image {
    display: block;
    width: 100px;
  }
  &__preview-image {
    height: 100%;
    width: 100%;
  }
  &__preview-container {
    min-height: 340px;
  }
  @media screen and (min-width: 770px) {
    &__preview-image {
      max-height: 540px;
      width: fit-content;
    }
    &__preview-container {
      min-height: 540px;
    }
  }
}
</style>
