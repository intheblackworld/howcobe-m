import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import App from '@/App'
import DefaultLayout from '@/layouts/Default.vue' // 有 search
import DetailLayout from '@/layouts/Detail.vue' // 沒 search
import AdminLayout from '@/layouts/Admin.vue'
import LoginLayout from '@/layouts/Login.vue'
import is_need_access from './access_check'

import { isPC } from '@/util/device.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '',
        name: 'layout',
        redirect: '/home',
        component: DefaultLayout,
        children: [
          {
            path: '/home',
            name: 'home',
            component: () => import(/* webpackChunkName: "about" */ '@/pages/Home.vue'),
          },

          // 課程列表頁
          {
            path: '/courses',
            name: 'courses',
            component: () => import(/* webpackChunkName: "about" */ '@/pages/Courses.vue'),
          },

          // 比課專區（自選/熱門/最新）
          {
            path: '/compares',
            name: 'compares',
            component: () => import(/* webpackChunkName: "about" */ '@/pages/Compares.vue'),
          },

          // 投票列表頁
          {
            path: '/votes',
            name: 'votes',
            component: () => import(/* webpackChunkName: "about" */ '@/pages/Votes.vue'),
          },
        ]
      },
      {
        path: '/detail',
        name: 'detail',
        // redirect: '/',
        component: DetailLayout,
        children: [
          {
            path: 'course',
            name: 'course_detail',
            component: () => import(/* webpackChunkName: "about" */ '@/pages/CourseDetail.vue'),
          },
          {
            path: 'vote',
            name: 'vote_detail',
            component: () => import(/* webpackChunkName: "about" */ '@/pages/VoteDetail.vue'),
          },
        ],
      },
      {
        path: '/admin',
        name: 'admin',
        redirect: '/admin',
        component: AdminLayout,
        children: [
          {
            path: '/',
            name: 'admin_center',
            component: () => import(/* webpackChunkName: "about" */ '@/pages/Admin.vue'),
          },
        ],
      },
      {
        path: 'login',
        component: LoginLayout,
        children: [
          {
            path: '',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ '@/pages/Login.vue'),
          }
        ]
      },
    ],
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log(to, from ,savedPosition)
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (isPC) {
    window.location.href = window.location.href.replace('m.howcobe.com', 'howcobe.com')
  }
  const { token, refresh_token } = to.query
  if (!to.matched.length) {
    window.location = '/404'
    return
  }
  if (token && refresh_token) {
    store.commit('user/setInfo', { key: 'token', value: token })
    store.commit('user/setInfo', { key: 'refresh_token', value: refresh_token })
    next('/')
  } else {
    next()
  }
})

router.afterEach(to => {
  if (is_need_access(to.path) && !store.state.user.token) {
    router.replace('/login')
  }
  store.commit('setCompare', false)
  // setTimeout(() => store.commit('updatePageStatus', { pageLoading: false }), 300)
})
export default router