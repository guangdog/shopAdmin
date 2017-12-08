<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入搜索商品的名称" v-model="listQuery.goodsname">
      </el-input>
      <el-select clearable style="width: 200px" @change="showSale_ty" class="filter-item" v-model="listQuery.importance" placeholder="推荐类型">
        <el-option v-for="item in importanceOptions" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="商品编号" width="100" prop="id"></el-table-column>
      <el-table-column min-width="200px" align="center" label="商品名称" prop="goodsname"></el-table-column>
      <el-table-column width="150px" align="center" label="商品价格" prop="price"></el-table-column>
      <el-table-column width="200px" align="center" label="商品库存量" prop="stock"></el-table-column>
      <el-table-column width="200px" align="center" label="推荐类型" prop="sale_ty" :formatter="saletyformatter"></el-table-column>
      <el-table-column width="200px" align="center" label="商品状态" prop="status" :formatter="statusformatter"></el-table-column>
      <el-table-column align="center" label="操作" width="220" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { selectGoods, delGoods } from '@/api/goods'
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
        goodsname: ''
      },
      importanceOptions: [
        { key: 0, value: '本周推荐' },
        { key: 1, value: '本月推荐' },
        { key: 2, value: '套装推荐' },
        { key: 3, value: '推荐列表' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showAuditor: false,
      temp: {
        id: undefined,
        goodsname: '',
        price: '',
        stock: '',
        sale_ty: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
    saletyformatter(row) { // 最多4-5个 超过不起作用
      return row.sale_ty === 0 ? '本周推荐' : row.sale_ty === 1 ? '本月推荐' : row.sale_ty === 2 ? '套装推荐' : '推荐列表'
    },
    statusformatter(row) {
      return row.sale_ty === 0 ? '未上架' : row.sale_ty === 1 ? '审核中' : '已上架'
    },
    showSale_ty(val) {
      console.log(val)
      // this.getList()
      this.list = this.list.filter((item) => {
        if (item.sale_ty === val) {
          return true
        }
      })
    },
    getList() {
      this.listLoading = true
      selectGoods(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = Number(response.data.count)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      console.log(typeof this.listQuery.goodsname)
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetTemp() {
      this.temp = {
        goodsname: '',
        price: '',
        stock: '',
        sale_ty: ''
      }
    },
    handleCreate() {
      this.$router.push('/product/productUpdate/0')
    },
    handleDelete(row) {
      delGoods({ id: row.id }).then(res => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleUpdate(id) {
      this.$router.push('/product/productUpdate/' + id)
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = ['时间', '地区', '类型', '标题', '重要性']
        const filterVal = ['timestamp', 'province', 'type', 'title', 'importance']
        const data = this.formatJson(filterVal, this.list)
        export_json_to_excel(tHeader, data, 'table数据')
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
