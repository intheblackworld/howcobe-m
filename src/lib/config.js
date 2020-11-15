import info from '@/info/index.js'

export default {
  install(Vue) {
    Vue.prototype.$gtmCode = info.gtmCode
  }
}
