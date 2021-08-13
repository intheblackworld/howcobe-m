/** axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios'
import router from '@/router'
import store from '@/store'
import app from '@/main'
import md5 from 'crypto-js/md5'
// import qs from 'qs'
const devApi = 'https://f4257e2a06af.ngrok.io'
// let user = {
//   id: responseUserDataJSON.sub,
//   email:responseUserDataJSON.email||'', 
//   line_open_id:responseUserDataJSON.sub,
//   login_type:'line',
//   social_name:responseUserDataJSON.name||'',
//   social_pic:responseUserDataJSON.picture||'',
//   updated_time:new Date()
// }
// let user_create = {
//   name:responseUserDataJSON.name||'',
//   created_time:new Date(),
// }
const prdApi = 'https://api.howcobe.com'

const baseURL = process.env.NODE_ENV === 'development' ? devApi : prdApi

// 环境的切换
// if (process.env.NODE_ENV === 'development') {
//   axios.defaults.baseURL = '/api'
// } else if (process.env.NODE_ENV === 'debug') {
//   axios.defaults.baseURL = ''
// } else if (process.env.NODE_ENV === 'production') {
//   axios.defaults.baseURL = baseURL
// }
axios.defaults.baseURL = baseURL

// 请求超时时间
axios.defaults.timeout = 100000

// post请求头
axios.defaults.headers.post['Content-Type'] =
  'application/json'

// 请求拦截器
axios.interceptors.request.use(
  async (config) => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    // tslint:disable-next-line: no-unused-expression
    // const token = store.state.layouts.token
    const token = store.state.user.token
    let secret_word = store.state.user.secret_word
    // tslint:disable-next-line: no-unused-expression
    // var url = pm.environment.get('url')
    var getSecretWordAPI = '/secret-word'
    let res
    if (config.url === '/courses') {
      res = await get(getSecretWordAPI)
      secret_word = await md5(res.secret_word).toString()
      config.params.secret_word = secret_word
      store.state.user.secret_word = secret_word
    }
    // secret_word && (config.params.secret_word = store.state.user.secret_word)
    token && (config.headers.Authorization = `Bearer ${token}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是200的情况
  async (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 400:
          if (error.response.data.message === '神秘驗證碼錯誤') {
            var getSecretWordAPI = '/secret-word'
            const res = await get(getSecretWordAPI)
            const secret_word = await md5(res.secret_word).toString()
            store.state.user.secret_word = secret_word
            window.reload()
          } else {
            window.alert(error.response.data.message)
          }
          break
        case 401:
          // 拿 access_token
          if (error.response.config.url === '/token') {
            // 連 refresh_token 也過期，跳轉登入頁面
            store.commit('user/setInfo', { key: 'token', value: '' })
            app.$message({
              message: '請登入帳號',
              type: 'warning',
            })
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.fullPath },
            })
          } else {
            post('/token', { refresh_token: store.state.user.refresh_token }).then(res => {
              if (res.token) {
                store.commit('user/setInfo', { key: 'token', value: res.token })
                store.dispatch('user/getUserInfo')
                window.location.reload()
              }
            })
          }
          break
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        // case 403:
        //   //   Toast({
        //   //     message: '登录过期，请重新登录',
        //   //     duration: 1000,
        //   //     forbidClick: true,
        //   //   })
        //   // 清除token
        //   localStorage.removeItem('token')
        //   store.commit('loginSuccess', null)
        //   // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
        //   setTimeout(() => {
        //     router.replace({
        //       path: '/login',
        //       query: {
        //         redirect: router.currentRoute.fullPath,
        //       },
        //     })
        //   }, 1000)
        //   break
        // 404请求不存在
        case 404:
          // router.replace({
          //   path: '/404',
          // })
          break
        // 其他错误，直接抛出错误提示
        default:
        //   Toast({
        //     message: error.response.data.message,
        //     duration: 1500,
        //     forbidClick: true,
        //   })
      }
      return Promise.reject(error.response)
    }
  },
)
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  // store.commit('setLoading', true)
  // app.$Progress.start()

  return new Promise((resolve, reject) => {
    // console.log(params)
    axios
      .get(url, {
        params,
        // paramsSerializer: params => {
        //   const keys = Object.keys(params)
        //   if (keys.length > 0) {
        //     console.log(keys)
        //     keys.forEach(params, key => {
        //       params[key] = params[key].toString()
        //       // console.log(params[key], '123123')
        //       // if (Array.isArray(params[key])) {
        //       // } else {
        //       //   params[key] = qs.stringify(params[key])
        //       // }
        //     })
        //   }
        //   console.log(params, '123123213')
        //   return params
        // }
      })
      .then((res) => {
        // store.commit('setLoading', false)
        // app.$Progress.finish()
        resolve(res.data)
      })
      .catch((err) => {
        // store.commit('setLoading', false)
        // app.$Progress.fail()
        reject(err.data)
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  // store.commit('setLoading', true)
  // app.$Progress.start()
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then((res) => {
        // store.commit('setLoading', false)
        // app.$Progress.finish()
        resolve(res.data)
      })
      .catch((err) => {
        // store.commit('setLoading', false)
        // app.$Progress.fail()
        reject(err.data)
      })
  })
}

/**
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function remove(url, params) {
  // store.commit('setLoading', true)
  // app.$Progress.start()
  return new Promise((resolve, reject) => {
    axios
      .delete(url, params)
      .then((res) => {
        // store.commit('setLoading', false)
        // app.$Progress.finish()
        resolve(res.data)
      })
      .catch((err) => {
        // store.commit('setLoading', false)
        // app.$Progress.fail()
        reject(err.data)
      })
  })
}
