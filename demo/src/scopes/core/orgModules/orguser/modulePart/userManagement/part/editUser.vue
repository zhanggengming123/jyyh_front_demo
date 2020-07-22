<template>
  <ta-drawer :getContainer="setContainer" :title="editType == '1'? '添加人员信息':'编辑人员信息'" placement="right" :closable="true" @close="closeEdit" :visible="visible" destroyOnClose width="500px">
    <ta-form id="userForm" :autoFormCreate="(form)=>{this.form = form}">
      <template v-if="form">
        <template v-for="formSetting in formNormalSettings">
          <renderFormItem :key="formSetting.id" :formSetting="formSetting" :renderType="renderType" :renderProp="renderProp">
            <div class="pos-avatar" v-if="formSetting.id == 'avatar'">
              <div v-if="imageUrl" class="img-avatar" :style="{ backgroundImage: 'url('+imageUrl+')'}"></div>
              <ta-icon v-if="imageUrl" class="clear-image" type="close" title="清空图片" @click="clearImage"/>
              <ta-icon class="icon-upload" v-else :type="loading ? 'loading' : 'user'"/>
              <input @change="uploadPhoto($event)" id="uploadPhotoId" type="file" class="hide-input" accept="image/gif,image/jpeg,image/jpg,image/png">
            </div>
            <ta-cascader
              v-else-if="formSetting.id == 'orgId'"
              url="org/orguser/orgManagementRestService/getOrgByAsync"
              treeId="orgTreeData"
              :options.sync="options"
              expandTrigger="hover"
              changeOnSelect
              :fieldNames="{ label: 'orgName', value: 'orgId', children: 'children' }"
              placeholder=""
            />
            <template v-else-if="formSetting.id == 'orgIdShow'">{{formData.namePath}}</template>
            <ta-input v-else-if="formSetting.id == 'password'" type='password' @blur="handleConfirmBlurs"/>
            <ta-input v-else-if="formSetting.id == 'password_2'" type='password'/>
            <template v-else-if="formSetting.id == 'tags'" v-for="tag in tags">
              <ta-tag :key="tag.tagid" @click="tagClick(tag.tagid)" :class="{'tag-active': selectedTags.indexOf(tag.tagid) > -1}" class="tag-select">
                {{tag.tagname}}<ta-icon type="check" v-if="selectedTags.indexOf(tag.tagid) > -1" style="margin-left: 5px;" />
              </ta-tag>
            </template>
          </renderFormItem>
        </template>
        <ta-collapse :bordered="false" v-if="formMoreSettings.length > 0">
          <ta-collapse-panel header="更多个人信息" key="1" style="border:none; padding: 0px;">
            <template v-for="formSetting in formMoreSettings">
              <renderFormItem :key="formSetting.id" :formSetting="formSetting" :renderType="renderType" :renderProp="renderProp">
                <div class="pos-avatar" v-if="formSetting.id == 'avatar'">
                  <div v-if="imageUrl" class="img-avatar" :style="{ backgroundImage: 'url('+imageUrl+')'}"></div>
                  <ta-icon v-if="imageUrl" class="clear-image" type="close" title="清空图片" @click="clearImage"/>
                  <ta-icon class="icon-upload" v-else :type="loading ? 'loading' : 'user'"/>
                  <input  @change="uploadPhoto($event)" id="uploadPhotoId" type="file" class="hide-input" accept="image/gif,image/jpeg,image/jpg,image/png">
                </div>
                <ta-cascader
                  v-else-if="formSetting.id == 'orgId'"
                  url="org/orguser/orgManagementRestService/getOrgByAsync"
                  treeId="orgTreeData"
                  :options.sync="options"
                  expandTrigger="hover"
                  changeOnSelect
                  :fieldNames="{ label: 'orgName', value: 'orgId', children: 'children' }"
                  placeholder=""
                />
                <template v-else-if="formSetting.id == 'orgIdShow'">{{formData.namePath}}</template>
                <ta-input v-else-if="formSetting.id == 'password'" type='password' @blur="handleConfirmBlurs"/>
                <ta-input v-else-if="formSetting.id == 'password_2'" type='password'/>
                <template v-else-if="formSetting.id == 'tags'" v-for="tag in tags">
                  <ta-tag :key="tag.tagid" @click="tagClick(tag.tagid)" :class="{'tag-active': selectedTags.indexOf(tag.tagid) > -1}" class="tag-select">
                    {{tag.tagname}}<ta-icon type="check" v-if="selectedTags.indexOf(tag.tagid) > -1" style="margin-left: 5px;" />
                  </ta-tag>
                </template>
              </renderFormItem>
            </template>
          </ta-collapse-panel>
        </ta-collapse>
      </template>
    </ta-form>
    <div slot="footer">
      <ta-button-group>
        <ta-button @click="onResetForm()">重置</ta-button>
        <ta-button @click="onSubmitForm()" type="primary">保存</ta-button>
      </ta-button-group>
    </div>
  </ta-drawer>
</template>
<script>
import $api from '../api/index'
import renderFormItem from '@projectCommon/components/renderFormItem'
import mixins from '../mixins'
import pwdStr from '@yh/ta404-ui/es/utils/js/encryption'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'editUser',
  props: ['visible', 'editType', 'rowData'],
  components: { renderFormItem },
  mixins: [mixins],
  data () {
    return {
      form: null,
      formData: {},
      tags: [],
      initTags: [],
      selectedTags: [],
      // 密码规则校验
      pwdRules: {
        rules: [{
          required: true, message: '请输入登录口令'
        }, {
          min: 6, message: '登录口令不能少于6位字符'
        }, {
          validator: this.validatePwd
        }]
      },
      confirmDirty: false,
      loading: false,
      imageUrl: '',
      initImg: '',
      options: [],
      rsaKey: {},
      initForm: {}
    }
  },
  mounted () {
    this.setValue()
  },
  computed: {
    renderType () {
      return this.editType == '2' ? 'EDIT' : 'ADD'
    },
    renderProp () {
      return {
        authRequest: (param, resolve) => {
          const { userId } = this.rowData
          $api.authRequestForUserInfo({
            ...param,
            userId
          }, (data) => { resolve(data.userInfo[param.inputKey]) })
        }
      }
    }
  },
  methods: {
    setContainer () {
      return this.$el.parentNode
    },
    setValue () {
      // type = 1 新增，type=2 编辑
      const { userId, jobNumber, mobile, email, address, zipCode, workplace } = this.rowData
      if (this.editType == '2') {
        Object.keys(this.rowData).forEach(field => {
          this.formData[field] = this.rowData[field] || ''
        })
        this.queryPortrait({ userId: userId })
      } else {
        this.formData.sex = '0'
      }
      this.initForm = Object.assign({}, this.formData, {
        jobNumber: jobNumber || '',
        mobile: mobile || '',
        email: email || '',
        address: address || '',
        zipCode: zipCode || '',
        workplace: workplace || ''
      })
      this.buildForm(this.formData)
      this.getUserTags({ userId: userId })
    },
    // 获取用户标签
    getUserTags (obj) {
      $api.queryTagByUserId(obj, (data) => {
        this.tags = data.data.tagList
        this.initTags = []
        this.selectedTags = []
        for (let i = 0; i < this.tags.length; i++) {
          if (this.tags[i].ischecked == 1) {
            this.initTags.push(this.tags[i].tagid)
          }
        }
        if (this.initTags.length) {
          this.selectedTags = this.initTags
        }
      })
    },
    queryPortrait (obj) {
      $api.queryAvatar(obj, (data) => {
        this.imageUrl = data.data.portrait || ''
        this.initImg = this.imageUrl
      })
    },
    validatePwd (rule, value, callback) {
      if (value && this.confirmDirty) {
        this.form.validateFields(['password_2'], { force: true })
      }
      callback()
    },
    compareToFirstPwd (rule, value, callback) {
      if (value && value !== this.form.getFieldValue('password')) {
        callback('两次口令输入不一致')
      } else {
        callback()
      }
    },
    handleConfirmBlurs  (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    tagClick (tagid) {
      const { selectedTags } = this
      const checked = selectedTags.some(t => t == tagid)
      this.selectedTags = checked ? selectedTags.filter(t => t !== tagid) : [...selectedTags, tagid]
    },
    closeEdit () {
      this.$emit('close')
      this.form.resetFields()
      this.formData = {}
      this.imageUrl = ''
      this.initImg = ''
    },
    onResetForm () {
      this.form.resetFields()
      this.imageUrl = ''
      this.selectedTags = this.initTags
      if (this.editType == '2') {
        this.queryPortrait({ userId: this.formData.userId })
      }
      document.getElementById('uploadPhotoId').value = ''
    },
    uploadPhoto (e) {
      const file = e.target.files[0]
      var obj = document.getElementById('uploadPhotoId')
      if (file) {
        this.loading = true
        if (file.size > 51200) {
          this.$message.error('用户头像大小不能超过50kb')
          this.loading = false
          obj.value = ''
          return false
        }
        getBase64(file, (imageUrl) => { this.imageUrl = imageUrl || ''; this.loading = false })
      }
    },
    clearImage () {
      this.imageUrl = ''
      document.getElementById('uploadPhotoId').value = ''
    },
    onSubmitForm () {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.selectedTags.length) {
            values.tags = this.selectedTags.join(',')
          }
          values.portrait = this.imageUrl || ''
          delete values.password_2
          values.password = pwdStr.encryptString(values.password)
          if (this.editType == '2') {
            values.userId = this.formData.userId
            values.orgId = this.formData.orgId
            values.jobNumber = values.jobNumber || ''
            values.mobile = values.mobile || ''
            values.email = values.email || ''
            values.address = values.address || ''
            values.zipCode = values.zipCode || ''
            values.workplace = values.workplace || ''

            /* 判断提交时有无改变 */
            const tempValue = { ...values }, keys = Object.keys(tempValue), { initForm } = this
            let editFlag = false
            if (this.initImg == tempValue.portrait) {
              for (let i = 0; i < keys.length; i++) {
                if (keys[i] != 'password' && keys[i] != 'portrait' && initForm[keys[i]] != tempValue[keys[i]]) {
                  editFlag = true; break
                }
              }
            } else {
              editFlag = true
            }
            if (editFlag) {
              $api.updateUserByUserId(values, (data) => {
                this.$message.success('更新人员信息成功')
                this.$emit('editSuccess', values)
                this.closeEdit()
              })
            } else {
              this.$message.warning('没有需要保存的修改')
            }
          } else {
            values.orgId = values.orgId[values.orgId.length - 1]
            $api.addUser(values, (data) => {
              if (data.data.addUser) {
                this.showConfirm()
              }
            })
          }
        }
      })
    },
    // 提示
    showConfirm () {
      this.$confirm({
        title: '保存人员信息成功',
        content: '保存成功。是否继续新增人员?',
        onOk: () => {
          this.form.resetFields()
          this.selectedTags = []
          this.imageUrl = ''
          document.getElementById('uploadPhotoId').value = ''
          this.$emit('queryTable')
        },
        onCancel: () => {
          this.closeEdit()
          this.$emit('queryTable')
        }
      })
    }
  }
}
</script>
<style type="text/less" lang="less">
  .avatar-form-item .ant-form-item-label { margin-top: 12px; }
</style>
<style scoped type="text/less" lang="less">
  .pos-avatar { position: relative; width: 64px; height: 64px; line-height: 64px; margin-left: 10px; font-size: 32px; text-align: center; background: #ccc; color: #fff; border-radius: 100%; cursor: pointer;
    &:hover .icon-upload:before { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='plus' width='1em' height='1em' fill='currentColor' aria-hidden='true' focusable='false' class=''%3E%3Cpath d='M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z'%3E%3C/path%3E%3Cpath d='M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z'%3E%3C/path%3E%3C/svg%3E");}
  }
  .img-avatar { width: 64px; height: 64px; background-repeat: no-repeat; background-size: cover; background-position: center; border-radius: 100%; }
  .hide-input { width: 64px; height: 64px; position: absolute; left: 0; top: 0; opacity: 0; z-index: 1; background: transparent; cursor: pointer; border-radius: 100%; }
  .tag-select { border-color: @primary-color; color: @primary-color; .user-select() }
  .tag-active { background-color: @primary-color; color: #fff; }
  .clear-image { position: absolute; color: #F56C6C; top: 0; right: -20px; font-size: 16px; }
</style>
