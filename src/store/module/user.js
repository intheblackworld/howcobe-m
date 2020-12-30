// import { post } from '@/http/axios'
import { getUserInfo } from '@/http/api'

export default {
  namespaced: true,
  state: {
    register: [],
    token: '',
    refresh_token: '',
    interests: null,

    name: '',
    email: '',
    bank_code: '',
    bank_account: '',
    hasPassNewBie: false,
    // 適性測驗結果
    result: null,
  },
  getters: {
    userRole: (state, getters, { user }) => user.role || {},
    isLogin: (state) => !!state.token,
    hasInterest: (state) => state.interests ? state.interests.length > 0 : true,
    isNewBie: (state) => {
      // 不會彈新手彈窗的情況
      // 沒有會員登入的時候，檢查 local storage，看是否 hasPassNewBie，沒做過就彈
      // 有會員登入的時候不彈
      // 其他都彈
      if (state.token) {
        // 有會員登入的時候不彈
        return false
      } else {
        if (state.hasPassNewBie) {
          return false
        } else {
          return true
        }
      }
    }
  },
  actions: {

    async getUserInfo(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getUserInfo({ ...props }).then((res) => {
          context.commit('setUser', res.data)
          resolve(res.data)
        }, error => {
          reject(error)
        })
      })
    },
  },
  mutations: {
    regist(state, list) {
      state.register = list
    },
    setInfo(state, { key, value }) {
      state[key] = value
    },
    setUser(state, { name, email, id, bank, draw_status = false, interests = [] }) {
      state.name = name
      state.email = email
      state.id = id
      state.draw_status = draw_status
      state.interests = interests
      if (bank) {
        state.bank_code = bank.bank_code
        state.bank_account = bank.bank_account
      }
    },

    clearInfo(state, list) {
      list.forEach(key => (state[key] = ''))
    },

    passQuiz(state) {
      state.hasPassNewBie = true
    },

    saveResult(state, data) {
      state.result = data
    },

    clearResult(state) {
      state.result = null
    },
  }
}
