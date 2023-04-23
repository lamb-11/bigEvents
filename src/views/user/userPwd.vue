<template>
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>重置密码</span>
  </div>
  <el-form :model="pwdForm" :rules="pwdrules" ref="pwdForm" label-width="100px">
  <el-form-item label="原密码" prop="old_pwd">
    <el-input type="password" v-model="pwdForm.old_pwd" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="新密码" prop="new_pwd">
    <el-input type="password" v-model="pwdForm.new_pwd" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="re_pwd">
    <el-input type="password" v-model="pwdForm.re_pwd" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitPwd">提交</el-button>
    <el-button @click="resetFn">重置</el-button>
  </el-form-item>
</el-form>
</el-card>
</template>

<script>
import { updatePwdAPI } from '@/api'
export default {
  name: 'user_Pwd',
  data () {
    const samePwd = (rule, value, callback) => {
      if (value === this.pwdForm.old_pwd) {
        callback(new Error('新旧密码不能相同'))
      } else {
        callback()
      }
    }
    const rePwd = (rule, value, callback) => {
      if (value !== this.pwdForm.new_pwd) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      pwdrules: {
        old_pwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须为6-15位的非空字符串',
            trigger: 'blur'
          }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须为6-15位的非空字符串',
            trigger: 'blur'
          },
          { validator: samePwd, trigger: 'blur' }
        ],
        re_pwd: [
          { required: true, message: '请再确认新密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须为6-15位的非空字符串',
            trigger: 'blur'
          },
          { validator: rePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetFn () {
      this.$refs.pwdForm.resetFields()
    },
    submitPwd () {
      this.$refs.pwdForm.validate(async valid => {
        if (valid) {
          const { data: res } = await updatePwdAPI(this.pwdForm)
          console.log(res)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.$router.push('login')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-input{
  width: 300px;
}
</style>
