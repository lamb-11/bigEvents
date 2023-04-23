<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <img src="@/assets/images/logo.png" alt="">
      <el-menu class="el-menu-demo" mode="horizontal" background-color="#23262e" text-color="#fff" active-text-color="#ffd04b">
        <el-submenu index="1">
          <template slot="title">
            <img class="avatar" src="@/assets/images/avatar.jpg" alt="" v-if="!user_pic">
            <img class="avatar" :src="user_pic" alt="" v-else>
            个人中心
          </template>
          <el-menu-item index="1-1" @click="baseInfo">基本资料</el-menu-item>
          <el-menu-item index="1-2" @click="changeAvatar">更换头像</el-menu-item>
          <el-menu-item index="1-3" @click="resetPwd">重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="logoutFn"> <i class="el-icon-switch-button"></i> 退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 个人信息 -->
        <div class="personal">
          <img class="avatar" src="@/assets/images/avatar.jpg" alt="" v-if="!user_pic">
          <img class="avatar" :src="user_pic" alt="" v-else>
          欢迎 {{nickname||username}}
        </div>
        <!-- 导航栏 -->
        <el-menu default-active="/home" router class="sideNav" background-color="#23262e" unique-opened text-color="#fff" active-text-color="#ffd04b">
          <template v-for="(item,index) in menus">
            <el-menu-item :index="item.indexPath" v-if="!item.children" :key="index">
              <i :class="item.icon"></i>
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
            <el-submenu :index="item.indexPath" :key="index" v-else>
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item v-for="(subItem,index) in item.children" :index="subItem.indexPath" :key=index>
                <i :class="subItem.icon"></i>{{subItem.title}}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 尾部 -->
        <el-footer>
          © www.itheima.com - 黑马程序员
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { getSidebarInfoAPI } from '@/api'
export default {
  name: 'my_Layout',
  data () {
    return {
      menus: []
    }
  },
  methods: {
    ...mapMutations(['updateToken', 'updateUserInfo']),
    // 退出登录 清除token
    logoutFn () {
      this.$confirm('确定要退出吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
        .then(() => {
          this.updateToken('')
          this.updateUserInfo({})
          this.$router.push('/login')
        })
        .catch((err) => err)
    },
    async getSidebarInfo () {
      const { data: res } = await getSidebarInfoAPI()
      this.menus = res.data
      // console.log(this.menus)
    },
    baseInfo () {
      this.$router.push('/user-info')
    },
    changeAvatar () {
      this.$router.push('/user-avatar')
    },
    resetPwd () {
      this.$router.push('/user-pwd')
    }
  },
  computed: {
    ...mapGetters(['nickname', 'username', 'user_pic'])
  },
  created () {
    this.getSidebarInfo()
  }
}
</script>

<style lang="less" scoped>
.el-container{
  height: 100%;
  color: #ffffff;
  overflow: hidden;

  .el-header,
  .el-aside {
    background-color: #23262e;
  }

  .el-header{
    padding:0;
    display: flex;
    justify-content: space-between;

    .avatar{
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
  }

  .el-aside{
    overflow: hidden;

    .personal{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70px;
      border: 1px solid black;
      font-size: 12px;

      .avatar{
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }

    .sideNav{
      width: 200px;
    }

  }

  .el-main {
    background-color: #eeeeee;
    color: #333;
  }

  .el-footer{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eeeeee;
    color: #333;
    font-size: 12px;
  }

}

</style>
