<template>
  <div v-if="pageData" class="history">
    <div class="history__content">
      <div class="history__video">
        <video v-if="pageData.video" :src="videoUrl" controls />
      </div>
      <div class="w-full text-white flex flex-col">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="space-y-4" v-html="pageData.description"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HistoryPage',
  scrollToTop: true,
  computed: {
    ...mapGetters({
      pageData: 'informationPage',
      articles: 'articles/articles',
    }),
    videoUrl() {
      return `${this.pageData.video.media_video_file.url}`
    },
  },
  head() {
    return {
      title: 'Errres Information Page',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Errres Information page, general information about errres',
        },
      ],
    }
  },
}
</script>
