import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/layout',
    component: () => import('@/views/layout')
  }
]

const router = new VueRouter({
  routes
})
// 无需验证token的页面
const whiteList = ['/reg', '/login']

// 每次切换路由组件都可以访问到用户信息
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    if (!store.state.userInfo.username) {
      // 请求用户信息保存到vuex里
      store.dispatch('initUserInfo')
    }
    next()
  } else {
    // 如果是白名单里的直接放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
