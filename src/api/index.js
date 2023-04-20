import request from '@/utils/request'

/**
 * 注册
 * @param {*} param0 {username：用户名, password:密码, repassword:确认密码}
 * @returns Promise
 */
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 * 登录
 * @param {*} param0 {username：用户名, password：密码}
 * @returns Peomise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

/**
 * 获取用户信息
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
  })
}

/**
 * 获取侧边栏数据
 * @returns Promise对象
 */
export const getSidebarInfoAPI = () => {
  return request({
    url: '/my/menus'
  })
}
