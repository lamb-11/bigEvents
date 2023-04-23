<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <el-form :model="userInfo" :rules="rules" ref="userInfoRef" label-width="100px">
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click='submitFn'>提交修改</el-button>
        <el-button @click='resetFn'>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updateUserInfoAPI } from '@/api'
export default {
  name: 'user_info',
  data () {
    return {
      userInfo: {
        username: this.$store.state.userInfo.username,
        nickname: '',
        email: ''
      },
      rules: {
        username: [],
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          {
            pattern: /^\S{1,10}$/,
            message: '昵称必须是1-10位的非空字符串'
          }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetFn () {
      this.$refs.userInfoRef.resetFields()
    },
    submitFn () {
      this.$refs.userInfoRef.validate(async valid => {
        if (valid) {
          this.userInfo.id = this.$store.state.userInfo.id
          const { data: res } = await updateUserInfoAPI(this.userInfo)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.$store.dispatch('initUserInfo')
          this.$refs.userInfoRef.resetFields()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.el-input{
  width: 400px;
}
</style>
