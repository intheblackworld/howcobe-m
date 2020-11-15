// import { get } from '@/http/axios'
// import Vue from 'vue'
import { getLearningMaps, getLearningMapDetail } from '@/http/api'
// import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    official_maps: [],
    user_maps: [],
    own_maps: [],
    current_map: {
      owner: '',
      coverImage: '',
      platform: 'hahow',
    },

  },
  getters: {
    // userRole: (state, getters, { user }) => user.role || {},
  },
  actions: {
    getLearningMaps(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getLearningMaps({ ...props }).then((data) => {
          // const courses = check_is_collect(context, data)
          context.commit('setLearningMaps', data.data)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },
    getLearningMapDetail(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getLearningMapDetail({ ...props }).then((data) => {
          // const courses = check_is_collect(context, data)
          context.commit('setLearningMapDetail', data.data)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },
    // 加入比課
  },
  mutations: {
    setLearningMaps(state, data) {
      state.official_maps = data.official_recommend
      state.user_maps = data.user_create
    },

    setLearningMapDetail(state, data) {
      console.log(data)
      state.current_map = data
    }
  }
}
