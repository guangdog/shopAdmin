<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <div class="createPost-main-container">
        
        <el-row>
          <el-col :span="21">

            <div class="postInfo-container">
              <el-row>
                <el-col :span='12' class="left">
                  <div>
                    <el-form-item label-width="100px" label="图片标题:" class="postInfo-container-item" prop="title">
                      <el-input placeholder="请输入商品名称" style='min-width:150px;' v-model="postForm.title">
                      </el-input>
                    </el-form-item>
                  </div>
                  <div>  
                    <el-form-item label-width="100px" label="是否显示:" class="postInfo-container-item" prop="isshow">
                      <el-radio-group v-model="postForm.isshow">
                        <el-radio v-for="item in status" :key="item.key" :label="item.key" :value="item.key">{{item.name}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span='12'>
                  <!-- <p prop="imgpath">上传图片：</p> -->
                  <el-form-item label-width="100px" label="上传图片:"  prop="imgpath">
                    <div style="margin-left: 20px; width: 400px;">
                      <el-upload
                        action="http://114.55.249.153:8028/goods/singleUpload"
                        list-type="picture-card" :on-preview="handlePictureCardPreview"
                        :before-upload="beforeAvatarUpload" :on-error="handleAvatarError" :on-success="handleAvatarSuccess"
                        :on-remove="handleRemove" :limit=1  :file-list="imgShowList">
                        <i class="el-icon-plus"></i>
                      </el-upload>
                      <el-dialog :visible.sync="dialogVisible" size="tiny">
                        <img width="100%" :src="baseUrl + postForm.imgpath"  alt="">
                      </el-dialog>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        
        <p>图片描述：</p>
        <div class="editor-container">
          <tinymce :height=300 ref="editor" v-model="postForm.description"></tinymce>
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
import { addBanner, getBannerById, updateBanner } from '@/api/banner'
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  title: '',
  imgpath: '',
  description: '',
  isshow: ''
}

export default {
  components: { Tinymce },
  data() {
    return {
      imgShowList: [],
      status: [
        { key: 0, name: '不显示' },
        { key: 1, name: '显示' }
      ],
      dialogVisible: false,
      baseUrl: '',
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      rules: {
        title: [{ required: true, message: '请输入banner标题', trigger: 'blur' }],
        imgpath: [{ required: true, message: '请输入图片路径', trigger: 'blur' }],
        isshow: [{ required: true, message: '请输入是否显示', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.postForm = Object.assign({}, defaultForm)
    const id = this.$route.params.id
    if (id > 0) {
      getBannerById({ id: id }).then(res => {
        this.postForm = res.data.data
        if (!this.postForm.description) {
          this.postForm.description = ''
        }
        this.baseUrl = this.postForm.imgpath.substr(0, 4) === 'http' ? '' : 'http://114.55.249.153:8028'
        this.imgShowList = [{ url: this.baseUrl + this.postForm.imgpath }]
      })
    }
  },
  methods: {
    // 点击图片放大
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传成功时的钩子
    handleAvatarSuccess(response, file, fileList) {
      console.log()
      this.postForm.imgpath = response.url
      this.baseUrl = 'http://114.55.249.153:8028'
      this.imgShowList = [{ url: this.baseUrl + this.postForm.imgpath }]
    },
    // 上传失败时的钩子
    handleAvatarError(response, file, fileList) {
      this.$message.error('上传图片失败')
    },
    // 图片移除文件时的钩子
    handleRemove() {
      console.log('呜呜呜，我被pass了')
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
    // 确定修改
    submitForm() {
      this.postForm.isshow = String(this.postForm.isshow)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (!this.postForm.id) {
            addBanner(this.postForm).then(res => { // 添加
              this.$notify({
                title: '成功',
                message: '添加商品成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$store.state.app.visitedViews.pop()
              this.$router.push('/banner/bannerList')
            })
          } else {
            updateBanner(this.postForm).then(res => { // 修改
              this.$notify({
                title: '成功',
                message: '修改商品成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$store.state.app.visitedViews.pop()
              this.$router.push('/banner/bannerList')
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
      this.$router.push('/banner/bannerList')
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
    .left .el-form-item{
      margin-top: 20px;
    }
    .el-form-item{
      width: 300px;
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

