<template>
  <div v-if="pageData" class="blog">
    <div class="blog__content">
      <div v-if="pageData.video" class="blog__video">
        <video :src="videoUrl" controls />
      </div>
      <div
        class="flex flex-row sm:flex-col md:flex-col lg:flex-row xl:flex-row space-x-6 text-white"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="space-y-4" v-html="pageData.description"></span>
      </div>
      <sidebar @set-filter="setFilter" />
      <div
        class="flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row flex-wrap -mx-4"
      >
        <nuxt-link
          v-for="(article, index) in articlesFiltered"
          :key="index"
          class="sm:w-full md:w-1/2 lg:w-1/4 bg-cover bg-transparent h-40 p-4"
          :to="`article/${article.id}`"
        >
          <div
            class="bg-cover bg-transparent h-full rounded-md"
            :style="`background-image: url('${article.intro_image.media_image}'); background-origin: padding-box;`"
          >
            <h5 class="h-full flex items-center justify-center">
              <span class="info-box-teaser-link text-xl text-green-900">
                {{ article.title }}
              </span>
            </h5>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebar from '~/components/sidebar-component'
export default {
  name: 'BlogPage',
  scrollToTop: true,
  components: {
    sidebar,
  },
  async asyncData({ store }) {
    await store.dispatch('articles/getBlogArticles')
    return {}
  },
  data() {
    return {
      selected: [],
    }
  },
  computed: {
    ...mapGetters({
      pageData: 'blogPage',
      articles: 'articles/articles',
      articlesByCategory: 'articles/articlesByCategory',
      categories: 'articles/categories',
    }),
    articlesFiltered() {
      return this.articles.filter(({ categories }) =>
        categories.some(({ id }) => this.selected.includes(id))
      )
    },
    videoUrl() {
      return `${this.pageData.video.media_video_file.url}`
    },
  },
  methods: {
    setFilter(selected) {
      this.selected = selected
    },
  },
  head() {
    return {
      title: 'Errres Blog Page',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Errres Blog page, information about errres and other activities',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.blog {
  display: flex;
  flex-direction: row;
  &__article {
    width: 46%;
  }
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    &__article {
      width: 100%;
    }
    .blog__content {
      width: 100%;
    }
    .blog__sidebar {
      width: 100%;
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    width: 100%;
    &-articles {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-self: center;
      width: 100%;
    }
  }
  &__video {
    display: flex;
    flex-direction: column;
    video {
      width: 100%;
    }
  }
}

.text-wrapper {
  width: 80%;
  position: relative;
  margin-top: -40%;
}

.info-box-teaser-link:hover {
  font-weight: 700 !important;
  letter-spacing: 2px;
  transition: all 0.3s ease 0s;
}

.text-wrapper h1 {
  text-align: center;
}

.image-item {
  width: 29%;
  padding: 0 20px 0;
}
.images {
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  align-items: baseline;
  padding: 50px 0;
}

/* Style the Image Used to Trigger the Modal */
#myImg {
  transition: 0.3s;
}

#myImg:hover {
  opacity: 0.7;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.9); /* Black w/ opacity */
}

/* Modal Content (Image) */
.modal-content {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
}

/* Caption of Modal Image (Image Text) - Same Width as the Image */
#caption {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
  text-align: center;
  color: #ccc;
  padding: 10px 0;
  height: 150px;
}

/* Add Animation - Zoom in the Modal */
.modal-content,
#caption {
  animation-name: zoom;
  animation-duration: 0.6s;
}

@keyframes zoom {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

/* The Close Button */
.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px) {
  .modal-content {
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .image-item {
    width: 100%;
    padding: 20px 0;
  }
  .images {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 50px 0;
  }
}
</style>
