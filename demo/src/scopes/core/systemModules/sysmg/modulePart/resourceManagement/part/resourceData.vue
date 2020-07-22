<template>
  <div id="restUrlSelectTagContainer">
    <ta-form :autoFormCreate="(form)=>{this.form = form}" :layout="formLayout">
      <template v-for="formSetting in formNormalSettings">
        <renderFormItem :key="formSetting.id" :formSetting="formSetting" :isShowParentItem="isShowParentItem" :renderType="renderType" :renderProp="renderProp">
          <rest-url-select-tag v-if="formSetting.id == 'restUrl'"
                              new-label="添加服务"></rest-url-select-tag>
          <ta-radio-group v-else-if="formSetting.id == 'resourceType'" buttonStyle="solid">
            <ta-radio-button v-for="item in  resourceTypeEditable" :value="item.value" :key="item.value"
                             :disabled="item.editable == false">
              {{item.label}}
            </ta-radio-button>
          </ta-radio-group>
          <ta-select v-else-if="formSetting.id == 'sysCode'">
            <ta-select-option v-for="item in systemList" :value="item.sysCode" :key="item.sysCode">
              {{item.sysName}}
            </ta-select-option>
          </ta-select>
          <ta-switch v-else-if="formSetting.id == 'effectiveFlag'" checkedChildren="有效" unCheckedChildren="无效"/>
          <div class="menu-image" v-if="formSetting.id == 'menuImage'">
            <div v-if="imageUrl" class="menu-image-show" :style="{ backgroundImage: 'url('+imageUrl+')'}"></div>
            <ta-icon class="icon-upload" v-else :type="loading ? 'loading' : 'user'"/>
            <input @change="uploadPhoto($event)" id="uploadPhotoId" type="file" class="hide-input" accept="image/gif,image/jpeg,image/jpg,image/png">
          </div>
          <ta-color-picker v-else-if="formSetting.id == 'iconColor'" verticalPosition="top"></ta-color-picker>
        </renderFormItem>
      </template>
      <ta-collapse :bordered="false" v-if="formMoreSettings.length > 0">
        <ta-collapse-panel header="更多功能信息" key="1" style="border:none">
          <template v-for="formSetting in formMoreSettings">
            <renderFormItem :key="formSetting.id" :formSetting="formSetting" :renderType="renderType" :renderProp="renderProp">
              <ta-color-picker v-if="formSetting.id == 'iconColor'" verticalPosition="top"></ta-color-picker>
            </renderFormItem>
          </template>
        </ta-collapse-panel>
      </ta-collapse>
    </ta-form>
  </div>
</template>
<script>
import rapi from '../api/index'
import api from '../api/resourceApi'
import restUrlSelectTag from './restUrlSelectTag'
import renderFormItem from '@projectCommon/components/renderFormItem'
import mixins from '../mixins'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'resourceData',
  props: {
    initData: {
      type: Object,
      required: true
    },
    operationType: {
      validator: (value) => {
        // 判断新增还是修改 1新增  2修改
        return ['1', '2'].indexOf(value) !== -1
      }
    }
  },
  components: { renderFormItem, restUrlSelectTag },
  mixins: [mixins],
  data () {
    return {
      // form布局配置
      formLayout: 'horizontal',
      isShowParentItem: true,
      // 原始数据备份
      operationResourceData: {},
      // 可选系统列表
      systemList: [],
      // 可选菜单类型
      resourceTypeEditable: [
        { value: '0', label: '通用菜单', editable: true },
        { value: '1', label: '管理菜单', editable: true },
        { value: '2', label: '经办菜单', editable: true }
      ],
      loading: false,
      imageUrl: ''
    }
  },
  computed: {
    renderType () {
      return this.operationType == '2' ? 'EDIT' : 'ADD'
    },
    renderProp () {
      return {
        authRequest: (param, resolve) => {
          const { resourceId } = this.initData
          api.authRequestForResourceInfo({
            ...param,
            resourceId
          }, (data) => { resolve(data.resourceInfo[param.inputKey]) })
        }
      }
    }
  },
  methods: {
    // 重置功能资源 表单
    fnResetForm () {
      this.fnLoadResourceData(this.operationResourceData)
    },
    // 保存
    fnSaveResource () {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // 判断 是新增下级还是修改当前组织机构
          if (this.operationType == '1') {
            if (!values.pResourceId) {
              this.$message.warning('请选择上级功能资源!', 2)
              return
            }
          } else if (this.operationType == '2') {
            if (!values.resourceId) {
              this.$message.warning('功能资源唯一标识不能为空!', 2)
              return
            }
          }
          if (this.imageUrl.length) {
            values.image = this.imageUrl
          }
          // 界面元素授权,该版本默认
          values.uiAuthorityPolicy = '0'
          api.saveResource({
            ...values,
            effective: values.effectiveFlag ? '1' : '0',
            operationType: this.operationType
          }, (data) => {
            this.operationResourceData.image = this.imageUrl
            this.$emit('close', true)
          })
        }
      })
    },
    // 初始化数据
    fnInitResource () {
      if (this.systemList.length == 0) {
        rapi.queryAllAccessSystem((data) => {
          this.systemList = eval('(' + data.systemList + ')')
        })
      }
      api.queryResource({
        resourceId: this.initData.resourceId,
        operationType: this.operationType
      }, (data) => {
        this.operationResourceData = data
        this.buildForm(this.initData)
        this.fnLoadResourceData(data)
      })
    },
    // 加载数据处理  区分编辑和添加
    fnLoadResourceData (data) {
      this.resourceTypeEditable = data.resourceTypeList
      this.isShowParentItem = true
      const obj = document.getElementById('uploadPhotoId')
      if (obj) { obj.value = '' }
      this.loading = false
      if (this.operationType == '2') {
        this.imageUrl = data.image || ''
        this.isShowParentItem = (this.initData.pResourceId != '0')
        // 编辑
        this.$nextTick(function () {
          // form赋值
          this.form.resetFields()
          this.form.setFieldsValue(data.taResource)
          this.form.setFieldsValue({
            effectiveFlag: data.taResource.effective == '1',
            securityLevel: data.taResource.securityLevel.toString()
          })
        })
      } else if (this.operationType == '1') {
        // 新增
        this.$nextTick(function () {
          // 重置form
          this.imageUrl = ''
          this.form.resetFields()
          this.form.setFieldsValue({
            pResourceId: this.initData.resourceId,
            pResourceName: this.initData.name,
            orderNo: data.taResource.orderNo
          })
          // 处理只有一个可选菜单类型时, 默认选中
          const editableResources = this.resourceTypeEditable.filter(item => {
            return item.editable
          })
          if (editableResources.length == 0) {
            this.$message.error('未加载到可用的菜单类型')
          }
          if (editableResources.length == 1) {
            this.form.setFieldsValue({ resourceType: editableResources[0].value })
          }
        })
      }
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
        getBase64(file, (imageUrl) => { this.imageUrl = imageUrl; this.loading = false })
      }
    }
  },
  watch: {
    // 维持prop数据的向下传递性
    initData: {
      immediate: true,
      handler: function (now, old) {
        if (this.loadStatus == true) return
        this.loadStatus = true
        this.fnInitResource()
        setTimeout(() => {
          this.loadStatus = false
        }, 1000)
      }
    },
    operationType: {
      immediate: true,
      handler: function (now, old) {
        if (this.loadStatus == true) return
        this.loadStatus = true
        this.fnInitResource()
        setTimeout(() => {
          this.loadStatus = false
        }, 1000)
      }
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .menu-image { position: relative; overflow: hidden; width: 64px; height: 64px; line-height: 64px; margin-left: 10px; font-size: 32px; text-align: center; background: #ccc; color: #fff; border-radius: 100%; cursor: pointer;
    &:hover .icon-upload:before { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='plus' width='1em' height='1em' fill='currentColor' aria-hidden='true' focusable='false' class=''%3E%3Cpath d='M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z'%3E%3C/path%3E%3Cpath d='M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z'%3E%3C/path%3E%3C/svg%3E");}
  }
  .menu-image-show { width: 64px; height: 64px; background-repeat: no-repeat; background-size: cover; background-position: center; }
  .hide-input { width: 64px; height: 64px; position: absolute; left: 0; top: 0; opacity: 0; z-index: 1; background: transparent; cursor: pointer; }
  .tag-select { .user-select() }
</style>
