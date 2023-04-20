import axios from 'axios'
import store from '@/store'
import router from '@/router'

const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

// 白名单
const whiteAPIList = ['/api/reg', '/api/login']

// 请求拦截器
myAxios.interceptors.request.use(function (config) {
  if (!whiteAPIList.includes(config.url)) {
    // 为请求头挂载Authorization字段
    config.headers.Authorization = store.state.token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
myAxios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    store.commit('updateToken', '')
    router.push('/login')
  }
  return Promise.reject(error)
})

export default myAxios
