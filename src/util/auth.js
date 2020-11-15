import router from '@/router'
import store from '@/store/index.js'

export const logout = (context, isLogout = true, params) => {
  // 清空資料狀態
  // const { user } = store.state
  store.commit('user/setInfo', { key: 'isLogin', value: isLogout })
  store.commit('user/clearInfo', ['refresh_token', 'token', 'name', 'email'])
  router.replace({ name: 'home', params })
}
