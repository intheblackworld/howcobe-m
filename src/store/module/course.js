// import { get } from '@/http/axios'
import Vue from 'vue'
import { getHotCourse, getQuickCourse, getCourseDetail, getNewCourse, getFiveStarCourse, getInterestsCourse, searchCourse, getCollectList, getCollectCompare, addCompareStack } from '@/http/api'
// import _ from 'lodash'

// const check_is_collect = (context, data) => {
//   const isLogin = context.rootGetters['user/isLogin']
//   let courses
//   if (isLogin) {
//     courses = data.courses.map(course => ({
//       ...course,
//       is_collect: !!_.find(context.state.collect_list, { id: course.id })
//     }))
//   } else {
//     courses = data.courses.map(course => ({
//       ...course,
//       is_collect: false
//     }))
//   }
//   return courses
// }
export default {
  namespaced: true,
  state: {
    hot_list: [], // 熱門課程
    new_list: [], // 最新課程
    fivestar_list: [], // 好評課程
    interest_list: [], // 興趣課程
    quick_list: [], // 搜尋用課程列表
    course_list: [], // 課程頁搜尋到的課程
    tinder_list: [], // 比課左滑右滑模式

    // 課程詳細頁當前課程
    current: {
      owner: '',

      coverImage: '',
      platform: 'hahow',
    },

    compare_list: [], // 當前的比課列表
    compare_course_id: '', // 當前個人比課列表id
    suggest_compare_list: [], // 推薦的比課列表
    collect_list: [], // 收藏列表
    collect_compare: [], // 收藏的比課列表
  },
  getters: {
    // userRole: (state, getters, { user }) => user.role || {},
  },
  actions: {
    searchCourse(context, { ...props }) {
      return new Promise((resolve, reject) => {
        searchCourse({ ...props }).then((data) => {
          // const courses = check_is_collect(context, data)
          context.commit('setSearchCourse', data.courses)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },
    getTinderCourse(context, { ...props }) {
      return new Promise((resolve, reject) => {
        searchCourse({ ...props }).then((data) => {
          // const courses = check_is_collect(context, data)
          context.commit('setTinderCourse', data.courses)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },
    getHotCourse(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getHotCourse({ ...props }).then((data) => {
          // const courses = check_is_collect(context, data)
          context.commit('setHotCourse', data.courses)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },

    getNewCourse(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getNewCourse({ ...props }).then((data) => {
          // const courses = check_is_collect(context, data)
          context.commit('setNewCourse', data.courses)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },

    getFiveStarCourse(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getFiveStarCourse({ ...props }).then((data) => {
          // const courses = check_is_collect(context, data)
          context.commit('setFiveStarCourse', data.courses)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },

    getInterestsCourse(context, { ...props }) {
      return new Promise((resolve, reject) => {
        const category = context.rootState.user.interests
        getInterestsCourse({ ...props, category }).then((data) => {
          // const courses = check_is_collect(context, data)
          context.commit('setInterestsCourse', data.courses)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },

    getQuickCourse(context, { ...props }) {
      getQuickCourse({ ...props }).then((data) => {
        context.commit('setQuickCourse', data)
      })
    },

    getCourseDetail(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getCourseDetail({ ...props }).then((data) => {
          context.commit('setCurrentCourse', data)
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },

    // 獲取收藏課程列表
    getCollectList(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getCollectList({ ...props }).then((data) => {
          if (data.error_question) {
            context.commit('setCollectList', [])
          } else {
            context.commit('setCollectList', data.likeCourses)
          }
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },

    // 獲取收藏比課列表
    getCollectCompare(context, { ...props }) {
      return new Promise((resolve, reject) => {
        getCollectCompare({ ...props }).then((data) => {
          if (data.error_question) {
            context.commit('setCollectCompare', [])
          } else {
            context.commit('setCollectCompare', data.my_like_compare_courses)
          }
          resolve(data)
        }, error => {
          reject(error)
        })
      })
    },

    // 加入比課
    async addCompareCourse(context, data) {
      // 加入比課的特殊案例， 這裡的資料從quick_list來，沒有章節的資料，傳id過來
      // if (typeof data === 'string') {
      //   data = await getCourseDetail({ id: data.id })
      // }

      let isRepeat = false
      context.state.compare_list.forEach(item => {
        if (item.id === data.id) {
          isRepeat = true
        }
      })
      if (isRepeat) {
        Vue.prototype.$message({
          message: '課程重複囉',
          type: 'warning'
        })
        return
      }

      if (context.state.compare_list.length === 5) {
        Vue.prototype.$message({
          message: '比課數量滿囉',
          type: 'warning'
        })
        return
      }

      data = await getCourseDetail({ id: data.id })
      context.commit('addCompareCourse', data)
      if (context.state.compare_list.length >= 2) {
        addCompareStack({
          course_ids: context.state.compare_list.map(item => item.id),
        }).then(res => {
          context.commit('setCompareId', res.documents.id)
        })
      }
    },
  },
  mutations: {
    setSearchCourse(state, list) {
      state.course_list = list
    },
    setTinderCourse(state, list) {
      state.tinder_list = list
    },
    setHotCourse(state, list) {
      state.hot_list = list
    },

    setNewCourse(state, list) {
      state.new_list = list
    },

    setFiveStarCourse(state, list) {
      state.fivestar_list = list
    },

    setInterestsCourse(state, list) {
      state.interest_list = list
    },

    setQuickCourse(state, list) {
      state.quick_list = list
    },

    setCurrentCourse(state, result) {
      state.current = result
    },

    addCompareCourse(state, result) {
      state.compare_list.push(result)
    },

    setCompareCourse(state, list) {
      state.compare_list = list
    },

    setCompareId(state, id) {
      state.compare_course_id = id
    },

    removeCompareCourse(state, id) {
      const index = state.compare_list.findIndex(item => item.id === id)
      if (index !== -1) state.compare_list.splice(index, 1)
    },

    setCollectList(state, result) {
      state.collect_list = result
    },

    setCollectCompare(state, result) {
      state.collect_compare = result
    }
  }
}
