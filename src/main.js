import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* 全局配置 https://blog.csdn.net/FireBird_one/article/details/80295229 */
import config from './lib/config.js'

import AOS from '@/lib/aos/src/js/aos'
import 'aos/dist/aos.css'

import '@/assets/style/global.scss'

import './plugin/element.js'

import VueScrollTo from 'vue-scrollto'
import infiniteScroll from 'vue-infinite-scroll'
import VueLazyComponent from '@xunlei/vue-lazy-component'
import VueProgressBar from 'vue-progressbar'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/radar'

import VueMeta from 'vue-meta'
import VueJsonLD from 'vue-jsonld'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBox, faListOl, faPlus, faTimes, faCheck, faUser, faFire, faAward, faSmile, faSearch, faHeart, faThList, faPenAlt, faChevronLeft, faSlash, faPepperHot, faMeteor, faBolt, faChalkboard, faBalanceScaleRight, faVoteYea, faDiagnoses, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartR, faBell } from '@fortawesome/free-regular-svg-icons'
import {
  faFacebookMessenger,
  faFacebookF,
  faLine,
  faTelegramPlane,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
library.add(
  faBox,
  faListOl,
  faPlus,
  faTimes,
  faCheck,
  faChalkboard,
  faBalanceScaleRight,
  faUser,
  faFire,
  faAward,
  faSmile,
  faSearch,
  faHeart,
  faHeartR,
  faThList,
  faPenAlt,
  faChevronLeft,
  faSlash,
  faPepperHot,
  faMeteor,
  faVoteYea,
  faDiagnoses,
  faBolt,
  faBell,
  faExternalLinkAlt,

  faFacebookMessenger,
  faFacebookF,
  faGoogle,
  faLine,
  faTelegramPlane
)

Vue.component('font-awesome', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(config)

Vue.use(VueMeta)
Vue.use(VueJsonLD)

Vue.use(VueScrollTo)
Vue.use(infiniteScroll)
Vue.use(VueLazyComponent)
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '10px'
})

Vue.component('v-chart', ECharts)

export default new Vue({
  router,
  store,
  created() {
    AOS.init()
  },
  render: (h) => h(App),
}).$mount('#app')
