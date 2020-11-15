import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import course from './module/course'
import learningmap from './module/learningmap'
import vote from './module/vote'
import createPersistedState from 'vuex-persistedstate'
import persisState from './plugin/persisState'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 控制導覽列狀態用
    viewIndex: 0,

    // 控制全局狀態用
    isFetchingData: false,

    // 電腦版比課程大頁面
    isCompare: false,

    // 比課程彈窗
    isCompareDialog: false,

    // 手機版找課程彈窗
    isSearchDialogM: false,

    // 適性分析彈窗
    openAdaptiveDialog: false,

    // 登入彈窗
    openLoginDialog: false,

    // 模式
    pattern: 'normal', // pick 點選模式

    search: '', // 搜尋框的值
  },

  plugins: [createPersistedState(persisState)],

  mutations: {
    setPattern(state, val) {
      state.pattern = val
    },
    setViewIndex(state, val) {
      state.viewIndex = val
    },

    setCompare(state, val) {
      state.isCompare = val
    },

    setCompareDialog(state, val) {
      state.isCompareDialog = val
    },

    setSearchDialogM(state, val) {
      state.isSearchDialogM = val
    },

    setLoading(state, val) {
      state.isFetchingData = val
    },

    openLoginDialog(state) {
      state.openLoginDialog = true
    },

    openAdaptiveDialog(state) {
      state.openAdaptiveDialog = true
    },

    closeLoginDialog(state) {
      state.openLoginDialog = false
    },

    closeAdaptiveDialog(state) {
      state.openAdaptiveDialog = false
    },

    updateSearch(state, val) {
      state.search = val
    }
  },
  actions: {
  },
  modules: {
    user,
    course,
    learningmap,
    vote
  },
})
