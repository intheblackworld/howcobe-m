// import { get } from '@/http/axios'
// import Vue from 'vue'
import { getVotes, getMyVotes, getVoteDetail } from '@/http/api'
// import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    votes: [],
    currents: [],
    detail_context: {},
  },
  getters: {
    // userRole: (state, getters, { user }) => user.role || {},
  },
  actions: {
    getMyVotes(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getMyVotes({ ...props }).then((data) => {
          // const courses = check_is_collect(context, data)
          // context.commit('setMyVoteList', data)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },
    getVotes(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getVotes({ ...props }).then((data) => {
          // const courses = check_is_collect(context, data)
          context.commit('setVoteList', data)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },
    getVoteDetail(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getVoteDetail({ ...props }).then((data) => {
          context.commit('setCurrentVote', data)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },
    // 加入比課
  },
  mutations: {
    setVoteList(state, data) {
      state.votes = data.voteCompareCourses
    },

    setCurrentVote(state, result) {
      state.currents = result.courses
      state.detail_context = result
    },
  }
}
