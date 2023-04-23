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

/**
 * 更新用户信息
 * @param {*} param0 {id：id, username：用户名, nickname：昵称, email：用户邮箱, user_pic：头像地址 }
 * @returns Promise
 */
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}

/**
 * 更换用户头像
 * @param {*} avatar
 * @returns Promise
 */
export const updateUserAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: { avatar }
  })
}

/**
 * 更新用户密码
 * @param {*} param0 { old_pwd：旧密码, new_pwd：新密码, re_pwd：确认密码 }
 * @returns Promise对象
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

/**
 * 获取文章分类
 * @returns Promise对象
 */
export const getArtCateAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 增加文章分类
 * @param {*} param0 {cate_name：文章分类名字, cate_alias：文章分类别名}
 * @returns Promise对象
 */
export const addArtCateAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 * 更新文章分类
 * @param {*} param0 { id：文章分类id, cate_name：文章分类名字, cate_alias：文章分类别名 }
 * @returns Promise对象
 */
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: { id, cate_name, cate_alias }
  })
}

/**
 * 删除文章分类
 * @param {*} id
 * @returns Promise对象
 */
export const deleteArtCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: { id }
  })
}

/**
 * 发布文章
 * @param {*} param0 { title：文章标题, cate_id：文章分类id, content：文章内容, cover_img：文章封面, state：文章状态 }
 * @returns Promise对象
 */
export const publishArtAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd // 参数要的是表单对象，不能写成普通对象
  })
}

/**
 * 获取文章列表
 * @param {*} param0 { pagenum：当前页码数, pagesize：单前页面数据条数, cate_id：文章分类id, state：文章状态 }
 * @returns Promise对象
 */
export const getArtListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: { pagenum, pagesize, cate_id, state }
  })
}

/**
 * 获取文章详情
 * @param {*} id
 * @returns Promise
 */
export const getArtDetailAPI = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

/**
 * 删除文章
 * @param {*} id
 * @returns Promise对象
 */
export const deteleArtAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: { id }
  })
}
