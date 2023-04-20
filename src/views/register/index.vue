<template>
  <div class="outside">
    <div class="inside">
      <div class="title"></div>
      <el-form ref="regRef" :model="regForm" :rules="regRules">
        <el-form-item prop="username">
          <el-input v-model="regForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="regForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input type="password" v-model="regForm.repassword" placeholder="请再次确认密码"></el-input>
        </el-form-item>
        <el-button type="primary" @click='registerFn'>注册</el-button>
        <el-link type="info" @click="login">去登录</el-link>
      </el-form>
    </div>
  </div>
</template>

<script>
import { registerAPI } from '@/api'
export default {
  name: 'my_register',
  data () {
    // 密码自定义校验
    const samPwd = (rule, value, callback) => {
      if (value !== this.regForm.password) {
        callback(new Error('两次输入的密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      regForm: {
        username: '',
        password: '',
        repassword: ''
      },
      regRules: {
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
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15位的非空字符串',
            trigger: 'blur'
          },
          { validator: samPwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    registerFn () {
      this.$refs.regRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await registerAPI(this.regForm)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.$router.push('/login')
      })
    },
    login () {
      this.$router.push('/login')
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
  height: 335px;
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
