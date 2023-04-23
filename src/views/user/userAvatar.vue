<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <img src="@/assets/images/avatar.jpg" alt="" v-if="!avatar">
    <img :src="avatar" alt="" v-else><br>
    <div class="button-box">
      <input type="file" style="display:none" ref="picFile" @change="choosePic">
      <el-button type="primary" @click='triggerPic'><i class="el-icon-plus"></i> 选择图片</el-button>
    <el-button type="success" :disabled="avatar===''" @click='updateAvatar'><i class="el-icon-upload"></i>上传头像</el-button>
    </div>

  </el-card>
</template>

<script>
import { updateUserAvatarAPI } from '@/api'
export default {
  name: 'user_avatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    triggerPic () {
      this.$refs.picFile.click()
    },
    choosePic (e) {
      const files = e.target.files
      if (files.length === 0) {
        this.avatar = ''
      } else {
        // 利用FileReader读取选择的文件，转为base64字符串
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.onload = e => {
          this.avatar = e.target.result
        }
      }
    },
    async updateAvatar () {
      const { data: res } = await updateUserAvatarAPI(this.avatar)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.$store.dispatch('initUserInfo')
    }
  }
}
</script>

<style lang="less" scoped>
img{
  width: 350px;
  height: 350px;
}
.button-box{
  margin-top: 30px;
}

</style>
