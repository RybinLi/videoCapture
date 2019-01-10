import Vue from 'vue'
import Router from 'vue-router'
import VideoShow from '@/components/video_show/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'VideoShow',
      component: VideoShow
    }
  ]
})
