<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="序号" width="65" prop="id"></el-table-column>
      <el-table-column width="100px" align="center" label="缩略图">
        <template slot-scope="scope" >
          <img class="bannerImg" :src="scope.row.imgpath">
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="图片标题" prop="title"></el-table-column>
      <el-table-column width="150px" align="center" label="是否显示" prop="isshow"></el-table-column>
      <el-table-column min-width="200px" label="图片描述" >
        <template slot-scope="scope">
          <div v-html="scope.row.description"></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { selectBanner, delectBanner } from '@/api/banner'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      temp: {
        id: '',
        title: '',
        imgpath: '',
        isshow: '',
        description: ''
      },
      pvData: []
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 分页查询数据
    getList() {
      this.listLoading = true
      selectBanner().then(response => {
        this.list = response.data.data
        this.total = response.data.count
        this.listLoading = false
        for (const key in this.list) {
          if (this.list[key].imgpath.substr(0, 4) !== 'http') {
            this.list[key].imgpath = 'http://114.55.249.153:8028' + this.list[key].imgpath
          }
        }
      })
    },
    // 模糊查询用户信息
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      this.getList()
    },
    handleCurrentChange(val) {
      this.getList()
    },
    // 重置数据
    resetTemp() {
      this.temp = {
        title: '',
        imgpath: '',
        isshow: '',
        description: ''
      }
    },
    // 添加按钮模态框
    handleCreate() {
      this.$router.push('/banner/bannerUpdate/0')
    },
    // 修改按钮模态框
    handleUpdate(row) {
      this.$router.push('/banner/bannerUpdate/' + row.id)
    },
    // 删除数据
    handleDelete(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        var obj = { id: id }
        delectBanner(obj).then(response => {
          this.listLoading = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .bannerImg{
    width: 50px;
    height: 50px;
  }
</style>

