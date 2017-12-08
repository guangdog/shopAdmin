<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">

            <div class="postInfo-container">
              <el-row>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" >
                  <!-- <el-tooltip class="item" effect="dark" content="将替换作者" placement="top"> -->
                    <el-form-item label-width="100px" label="商品名称:" class="postInfo-container-item">
                      <el-input placeholder="请输入商品名称" style='min-width:150px;' v-model="postForm.goodsname">
                      </el-input>
                    </el-form-item>
                  <!-- </el-tooltip> -->
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="8">
                  <el-form-item label-width="100px" label="推荐类型:" class="postInfo-container-item">
                    <el-select v-model="postForm.sale_ty" filterable placeholder="请选择">
                      <el-option
                        v-for="item in sale_ty"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="8">
                  <el-form-item label-width="100px" label="商品价格:" class="postInfo-container-item">
                    <el-input placeholder="请输入商品价格" style='min-width:150px;' v-model="postForm.price">
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="8">
                  <el-form-item label-width="100px" label="商品库存:" class="postInfo-container-item">
                    <el-input placeholder="请输入商品库存" style='min-width:150px;' v-model="postForm.stock">
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="16" :lg="16">
                  <el-form-item label-width="100px" label="商品状态:" class="postInfo-container-item">
                    <el-radio-group v-model="postForm.status">
                      <el-radio v-for="item in status" :key="item.key" :label="item.key" :value="item.key">{{item.name}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </el-col>
        </el-row>
        
        <p>商品概述：</p>
        <div class="editor-container">
          <tinymce :height=300 ref="editor" v-model="postForm.description"></tinymce>
        </div>
        <p>上传图片：</p>
        <div style="margin-bottom: 20px;">
          <el-upload
            action="http://114.55.249.153:8028/goods/singleUpload"
            list-type="picture-card" 
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove" :file-list="imgFileList" :limit=5 :on-success="sucImgUpload" :on-exceed="handleExceed" :multiple="true" :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
      </div>

      <div class="btn">
        <el-row >
          <el-col :span="12">
            <el-button v-loading="loading" class="submit" type="primary" @click="submitForm()">确认提交
            </el-button>
          </el-col>
          <el-col :span="12" >
            <el-button class="back" v-loading="loading" @click="back()" type="warning">返回</el-button>
          </el-col>
        </el-row>
      </div>

    </el-form>
  </div>
</template>

<script>
import { addGoods, selGoodsById, updateGoods } from '@/api/goods'
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  goodsname: '',
  price: undefined,
  stock: undefined,
  sale_ty: undefined,
  status: undefined
}

export default {
  components: { Tinymce },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    return {
      imgFileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      sale_ty: [
        { key: 0, name: '本周推荐' },
        { key: 1, name: '本月推荐' },
        { key: 2, name: '套装推荐' },
        { key: 3, name: '推荐列表' }
      ],
      status: [
        { key: 0, name: '未上架' },
        { key: 1, name: '审核中' },
        { key: 2, name: '已上架' }
      ],
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      rules: {
        name: [{ validator: validateRequire }],
        sale_ty: [{ validator: validateRequire }],
        status: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    this.postForm = Object.assign({}, defaultForm)
    const id = this.$route.params.id
    if (id > 0) {
      selGoodsById({ id: id }).then(res => {
        this.postForm = res.data.data
        console.log(this.postForm)
        for (let i = 0; i <= 4; i++) {
          if (this.postForm['pic' + i]) {
            this.imgFileList.push({ url: this.postForm['pic' + i] })
          }
        }
        if (!this.postForm.description) {
          this.postForm.description = ''
        }
      })
    }
  },
  methods: {
    // 上传成功时的钩子
    sucImgUpload(response, file, fileList) {
      for (const key in fileList) {
        this.postForm['pic' + key] = fileList[key].response.url
      }
    },
    // 限制用户上传的图片格式和大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG || isPNG && isLt2M
    },
    // 上传图片数量超出提示
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 确定修改
    submitForm() {
      this.postForm.price = parseFloat(this.postForm.price)
      this.postForm.stock = parseInt(this.postForm.stock)
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (!this.postForm.id) {
            addGoods(this.postForm).then(res => { // 添加
              this.$notify({
                title: '成功',
                message: '添加商品成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$store.state.app.visitedViews.pop()
              this.$router.push('/product/productList')
            })
          } else {
            updateGoods(this.postForm).then(res => { // 修改
              this.$notify({
                title: '成功',
                message: '修改商品成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$store.state.app.visitedViews.pop()
              this.$router.push('/product/productList')
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 返回按钮
    back() {
      this.$store.state.app.visitedViews.pop()
      this.$router.push('/product/productList')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item{
          float: left;
        }
      }
      .editor-container {
        min-height: 400px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
    .submit {
      float: right;
      margin: 10px;
    }
    .back {
      float: left;
      width: 98px;
      margin: 10px;
    }
}
</style>

