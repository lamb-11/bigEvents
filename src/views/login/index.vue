<template>
  <div class="outside">
    <div class="inside">
      <div class="title"></div>
      <el-form ref="loginRef" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-button type="primary" @click="loginFn">登录</el-button>
        <el-link type="info" @click="resiger">去注册</el-link>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { mapMutations } from 'vuex'
export default {
  name: 'my_login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10位的大小写字母数字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15位的非空字符串',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['updateToken']),
    loginFn () {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await loginAPI(this.loginForm)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.updateToken(res.token)
        this.$router.push('/layout')
      })
    },
    resiger () {
      this.$router.push('/reg')
    }
  }
}
</script>

<style lang="less" scoped>
.outside{
  background: url('@/assets/images/login_bg.jpg') center;
  height: 100%;
  background-size: cover;

  .inside{
  position: absolute;
  width: 400px;
  height: 270px;
  background-color: #fff;
  border-radius: 5px;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  box-sizing: border-box;
  padding:0 30px;

  .title{
    height: 60px;
    background: url('@/assets/images/login_title.png') center no-repeat;
  }

  .el-button{
    width: 100%;
    margin-bottom:5px ;
  }
}
}

</style>
