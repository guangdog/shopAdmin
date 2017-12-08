<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名" v-model.trim="listQuery.username">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="用户名" prop="username"></el-table-column>
      <el-table-column width="110px" align="center" label="性别" prop="sex"></el-table-column>
      <el-table-column min-width="150px" align="center" label="电子邮箱" prop="email"></el-table-column>
      <el-table-column width="280px" label="手机号" prop="phone"></el-table-column>
      <el-table-column align="center" label="操作" width="220" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[5,10,20,30]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="temp.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="temp.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { selectData, updateData, addData, delectData } from '@/api/user'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

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
      listQuery: {
        page: 1,
        limit: 10,
        username: ''
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        id: '',
        username: '',
        password: '123456',
        sex: '',
        email: '',
        phone: ''
      },
      dialogFormVisible: false,
      dialogTitle: '',
      dialogPvVisible: false,
      pvData: [],
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }]
      }
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
      selectData(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.count
        this.listLoading = false
      })
    },
    // 模糊查询用户信息
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.listQuery.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 重置数据
    resetTemp() {
      this.temp = {
        username: '',
        password: '123456',
        sex: '男',
        email: '',
        phone: ''
      }
    },
    // 添加按钮模态框
    handleCreate() {
      this.resetTemp()
      this.dialogTitle = '添加'
      this.dialogFormVisible = true
      // 清除模态框表单验证提示
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改按钮模态框
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogTitle = '修改'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新数据
    update() {
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          if (!this.temp.id) { // 添加数据
            addData(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          } else { // 修改数据
            updateData(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        }
      })
    },
    // 删除数据
    handleDelete(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        var obj = { userId: id }
        delectData(obj).then(response => {
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
    },
    // 导出excel
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = ['编号', '用户名', '性别', '电子邮箱', '手机号']
        const filterVal = ['id', 'username', 'sex', 'email', 'phone']
        const data = this.formatJson(filterVal, this.list)
        export_json_to_excel(tHeader, data, '用户信息')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
