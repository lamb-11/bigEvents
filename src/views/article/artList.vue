<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>文章列表</span>
    </div>
    <div class="searchBox">
      <el-form :inline="true" :model="q">
        <el-form-item label="文章分类">
          <el-select size="small" placeholder="请选择分类" v-model="q.cate_id">
            <el-option v-for="item in artCate" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态" style="margin-left:15px">
          <el-select size="small" placeholder="请选择状态" v-model="q.state">
            <el-option label="已发布" value="已发布"></el-option>
            <el-option label="草稿" value="草稿"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="filterFn">筛选</el-button>
          <el-button type="info" size="small" @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button size="small" type="primary" @click="pubArt">发布文章</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格区域 -->
      <el-table border style="width: 100%" :data="artList">
        <el-table-column prop="title" label="文章标题">
          <template v-slot="scope">
            <el-link type="primary" @click="getArtDetail(scope.row.id)">{{scope.row.title}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="cate_name" label="分类">
        </el-table-column>
        <el-table-column prop="pub_date" label="发表时间">
          <template v-slot="scope">
            <span>{{$formatDate(scope.row.pub_date)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button type="danger" size="mini" @click="deteleFn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChangeFn" :current-page.sync="q.pagenum" :page-sizes="[2,3,5,10]" :page-size.sync="q.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 发布文章对话框 -->
      <el-dialog title="发表文章" :page-size.sync="q.pagesize" fullscreen :current-page="this.q.pagenum" :visible.sync="dialogVisible" :before-close="handleClose" @close="closeDialog">
        <el-form :model="pubArtFrom" :rules="pubArtrules" ref="pubArtFrom" label-width="100px">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="pubArtFrom.title" autocomplete="off" placeholder="请选择标题"></el-input>
          </el-form-item>
          <el-form-item label="文章分类" prop="cate_id">
            <el-select v-model="pubArtFrom.cate_id" placeholder="请选择分类" style="width:100%">
              <el-option v-for="item in artCate" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章内容" prop="content">
            <quill-editor v-model="pubArtFrom.content"></quill-editor>
          </el-form-item>
          <el-form-item label="文章封面" prop="cover_img">
            <img src="@/assets/images/cover.jpg" alt="" ref="picRef"><br>
            <input type="file" style="display:none" ref="file" @change="changeFile">
            <el-link type="primary" :underline="false" @click="triggerFile">+ 选择封面</el-link>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
            <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 文章详情对话框 -->
      <el-dialog title="文章预览" :visible.sync="detailDialog" width="80%" :before-close="detailClose">
        <div class="content">
          <h2>{{artDetail.title}}</h2>
          <div class="info">
            作者：{{artDetail.nickname||artDetail.username}}&nbsp;&nbsp;发布时间：{{$formatDate(artDetail.pub_date)}}&nbsp;&nbsp;所属分类：{{artDetail.cate_name}}&nbsp;&nbsp;状态：{{artDetail.state}}
          </div>
            <el-divider></el-divider>
            <img :src="baseURL+artDetail.cover_img" alt="">
            <div v-html="artDetail.content" class="detail-box"></div>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
// 因为后台返回的图片地址只有后半段，需要自己拼接前缀服务器地址，也就是基地址
import { baseURL } from '@/utils/request'
import defaultPic from '@/assets/images/cover.jpg'
import { getArtCateAPI, publishArtAPI, getArtListAPI, getArtDetailAPI, deteleArtAPI } from '@/api'
export default {
  name: 'art-list',
  data () {
    return {
      q: {
        pagenum: 1, // 当前页码数
        pagesize: 2, // 当前页码的数据条数
        cate_id: '', // 文章分类ID
        state: ''// 文章分类状态
      },
      artCate: [], // 文章分类数据
      artList: [], // 文章列表数据
      artDetail: {}, // 文章详情
      total: 0,
      pubArtFrom: {
        title: '',
        cate_id: '',
        content: '',
        cover_img: null,
        state: ''
      },
      pubArtrules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          { required: true, message: '请选择文章标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        cover_img: [
          { required: true, message: '请选择文章封面', trigger: 'blur' }
        ]
      },
      dialogVisible: false, // 添加文章对话框
      detailDialog: false,
      baseURL
    }
  },
  methods: {
    pubArt () {
      this.dialogVisible = true
    },
    handleClose (done) {
      this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.closeDialog()
      })
    },
    // 对话框关闭时触发
    closeDialog () {
      this.$refs.pubArtFrom.resetFields()
      this.$refs.picRef.setAttribute('src', defaultPic)
      this.dialogVisible = false
    },
    // 获取文章分类
    async getArtCate () {
      const { data: res } = await getArtCateAPI()
      if (res.code === 0) {
        this.artCate = res.data
      }
    },
    triggerFile () {
      this.$refs.file.click()
    },
    // 照片文件夹变更时触发
    changeFile (e) {
      const files = e.target.files
      if (files.length === 0) {
        this.pubArtFrom.cover_img = null
        this.$refs.picRef.setAttribute('src', defaultPic)
      } else {
        this.pubArtFrom.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.picRef.setAttribute('src', url)
      }
    },
    // 获取文章列表
    async getArtList () {
      const { data: res } = await getArtListAPI(this.q)
      if (res.code !== 0) return this.$message.error(res.message)
      this.artList = res.data
      this.total = res.total
    },
    // 发布/存为草稿
    pubArticleFn (state) {
      this.pubArtFrom.state = state
      this.$refs.pubArtFrom.validate(async valid => {
        if (valid) {
          const fd = new FormData()
          fd.append('title', this.pubArtFrom.title)
          fd.append('cate_id', this.pubArtFrom.cate_id)
          fd.append('content', this.pubArtFrom.content)
          fd.append('cover_img', this.pubArtFrom.cover_img)
          fd.append('state', this.pubArtFrom.state)
          const { data: res } = await publishArtAPI(fd)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.dialogVisible = false
          this.getArtList()
        }
      })
    },
    // 页码条数变化
    handleSizeChangeFn (newSize) {
      this.q.pagesize = newSize
      this.q.pagenum = 1
      this.getArtList()
    },
    // 当前页码数变化
    handleCurrentChange (newNum) {
      this.q.pagenum = newNum
      this.getArtList()
    },
    // 获取文章详情
    async getArtDetail (id) {
      this.detailDialog = true
      const { data: res } = await getArtDetailAPI(id)
      if (res.code !== 0) return this.$message.error('获取文章详情失败！')
      this.artDetail = res.data
      console.log(this.artDetail)
    },
    // 重置按钮
    reset () {
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      this.getArtList()
    },
    // 筛选按钮
    filterFn () {
      this.pagenum = 1
      this.q.size = 2
      this.getArtList()
    },
    detailClose () {
      this.detailDialog = false
    },
    // 删除按钮
    async deteleFn (id) {
      const { data: res } = await deteleArtAPI(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      console.log(this.artList)
      if (this.artList.length <= 1) {
        this.q.pagenum--
      }
      this.getArtList()
    }

  },
  created () {
    this.getArtCate()
    this.getArtList()
  }

}
</script>

<style lang="less" scoped>
img{
  width: 400px;
  height: 280px;
  object-fit: cover;
}

::v-deep .ql-editor {
  min-height: 300px;
}

::v-deep .detail-box {
  width: 500px;
}

h2{
  text-align: center;
}
</style>
