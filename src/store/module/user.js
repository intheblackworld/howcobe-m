// import { post } from '@/http/axios'
import { getUserInfo } from '@/http/api'

export default {
  namespaced: true,
  state: {
    register: [],
    token: '',
    refresh_token: '',
    interests: [],

    name: '',
    email: '',
    bank_code: '',
    bank_account: '',
  },
  getters: {
    userRole: (state, getters, { user }) => user.role || {},
    isLogin: (state) => !!state.token,
    hasInterest: (state) => state.interests.length > 0
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
  }
}
