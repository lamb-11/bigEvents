<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>文章分类</span>
      <el-button style="float: right" size="mini" type="primary" @click="addCate">添加分类</el-button>
    </div>
    <el-table border style="width: 100%" :data="artCate">
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="cate_name" label="分类名称">
      </el-table-column>
      <el-table-column prop="cate_alias" label="分类别名">
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot="scope">
          <el-button type="primary" size="mini" @click="updateFn(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteFn(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :title="isEdit?'修改文章分类':'添加文章分类'" :visible.sync="dialogVisible" width="30%" @closed="onClosed">
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateForm" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input type="text" v-model="addCateForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input type="text" v-model="addCateForm.cate_alias"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="addFn">添 加</el-button>
        <el-button size="mini" @click="cancelFn">取 消</el-button>

      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { getArtCateAPI, addArtCateAPI, updateArtCateAPI, deleteArtCateAPI } from '@/api'
export default {
  name: 'art_cate',
  data () {
    return {
      dialogVisible: false,
      // 文章分类的表单
      artCate: [],
      // 添加分类的表单
      addCateForm: {
        cate_name: '',
        cate_alias: ''
      },
      editId: '', // 要修改的文章id
      isEdit: false, // 保存编辑状态（false新增，true编辑）
      addCateRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur'
          }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          {
            pattern: /^[0-9a-zA-Z]{1,15}$/,
            message: '分类别名必须是1-15位的字母和数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getArtCate()
  },
  methods: {
    // 获取表单
    async getArtCate () {
      const { data: res } = await getArtCateAPI()
      this.artCate = res.data
    },
    // 添加分类表单
    addCate () {
      this.dialogVisible = true
      this.editId = ''
      this.isEdit = false
    },
    // 添加按钮
    addFn () {
      this.$refs.addCateForm.validate(async valid => {
        if (valid) {
          if (this.isEdit) { // 编辑
            const { data: res } = await updateArtCateAPI({ id: this.editId, ...this.addCateForm })
            if (res.code !== 0) return this.$message.error('文章修改失败')
            this.$message.success('文章修改成功')
          } else { // 新增
            const { data: res } = await addArtCateAPI(this.addCateForm)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          }
          this.getArtCate()
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    // 删除按钮
    async deleteFn (id) {
      const { data: res } = await deleteArtCateAPI(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getArtCate()
    },
    // 取消按钮
    cancelFn () {
      this.dialogVisible = false
    },
    // 修改表单
    updateFn (obj) {
      this.editId = obj.id
      this.isEdit = true
      this.dialogVisible = true
      this.$nextTick(() => {
        this.addCateForm.cate_name = obj.cate_name
        this.addCateForm.cate_alias = obj.cate_alias
      })
    },
    // 对话框关闭时
    onClosed () {
      this.$refs.addCateForm.resetFields()
    }

  }
}
</script>

<style lang="less" scoped>
.clearfix{
  height: 30px;
  line-height: 30px;
}

.el-input{
  box-sizing: border-box;
  padding-left: 5px;
}
</style>
