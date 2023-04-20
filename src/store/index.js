import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '', // 登录成功后会返回token值
    userInfo: {} // 用户信息
  },
  getters: {
    /* nickname: function (state) {
      return state.userInfo.nickname
    }, */
    nickname: state => state.userInfo.nickname,
    username: state => state.userInfo.username,
    user_pic: state => state.userInfo.user_pic
  },
  mutations: {
    updateToken (state, newToken) {
      state.token = newToken
    },
    updateUserInfo (state, info) {
      state.userInfo = info
    }
  },
  actions: {
    async initUserInfo (store) {
      const { data: res } = await getUserInfoAPI()
      if (res.code === 0) {
        store.commit('updateUserInfo', res.data)
      }
    }
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
