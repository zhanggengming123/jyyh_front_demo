<template>
  <div id="app">
    <ta-form :autoFormCreate="(form)=>{this.form = form}" :layout="formLayout">
      <template v-for="formSetting in formNormalShowSettings">
        <renderFormItem :key="formSetting.id" :formSetting="formSetting" :isShow="true" :showValues="formData" :simpleShowSlot="simpleShowSlot" renderType="SHOW">
          <template v-if="formSetting.id == 'restUrl'">
            <div v-for="item in restUrls" :key="item.urlId" class="one-info">
              <p>服务名称：{{item.name}}</p>
              <p>服务路径：{{item.url}}</p>
              <p>独立授权：{{CollectionLabel('YESORNO',item.authorityPolicy)}}</p>
            </div>
          </template>
          <template v-else-if="formSetting.id == 'resourceType'">
            {{resourceType.label}}
          </template>
          <template v-else-if="formSetting.id == 'sysCode'">
            {{sysCode.sysName}}
          </template>
          <template v-else-if="formSetting.id == 'effectiveFlag'">
            {{effective}}
          </template>
          <template v-else-if="formSetting.id == 'iconColor'">
            <ta-row>
              <ta-col :span="12">
                {{formData.iconColor}}
              </ta-col>
              <ta-col :span="2" :offset="1">
                <ta-color-picker :value="formData.iconColor" :disabled="true" chooseType="box" verticalPosition="top"></ta-color-picker>
              </ta-col>
            </ta-row>
          </template>
          <div class="menu-image" v-if="formSetting.id == 'menuImage'">
            <div v-if="imageUrl" class="menu-image-show" :style="{ backgroundImage: 'url('+imageUrl+')'}"></div>
            <i v-else class="anticon anticon-setting icon-upload"></i>
          </div>
        </renderFormItem>
      </template>
      <ta-collapse :bordered="false" v-if="formMoreShowSettings.length > 0">
        <ta-collapse-panel header="更多功能信息" key="1" style="border:none">
          <template v-for="formSetting in formMoreShowSettings">
            <renderFormItem :key="formSetting.id" :formSetting="formSetting" :isShow="true" :showValues="formData" :simpleShowSlot="simpleShowSlot" renderType="SHOW">
              <template v-if="formSetting.id == 'iconColor'">
                <ta-row>
                  <ta-col :span="12">
                    {{formData.iconColor}}
                  </ta-col>
                  <ta-col :span="2" :offset="1">
                    <ta-color-picker :value="formData.iconColor" :disabled="true" chooseType="box" verticalPosition="top"></ta-color-picker>
                  </ta-col>
                </ta-row>
              </template>
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
import renderFormItem from '@projectCommon/components/renderFormItem'
import mixins from '../mixins'

const showColumnFilter = ['pResourceId', 'resourceId']
const simpleShowSlot = []

export default {
  name: 'resourceDataShow',
  props: {
    initData: {
      type: Object,
      required: true
    }
  },
  components: { renderFormItem },
  mixins: [mixins],
  data () {
    return {
      // form布局配置
      formLayout: 'horizontal',
      formData: {},
      simpleShowSlot,

      isShowParentItem: true,
      // 可选系统列表
      systemList: [],
      // 可选菜单类型
      resourceTypeEditable: [
        { value: '0', label: '通用菜单', editable: true },
        { value: '1', label: '管理菜单', editable: true },
        { value: '2', label: '经办菜单', editable: true }
      ],
      imageUrl: ''
    }
  },
  computed: {
    formNormalShowSettings () {
      return this.formNormalSettings.filter(a => showColumnFilter.indexOf(a.id) == -1) || []
    },
    formMoreShowSettings () {
      return this.formMoreSettings.filter(a => showColumnFilter.indexOf(a.id) == -1) || []
    },
    resourceType () {
      return this.resourceTypeEditable.find(item => item.value == this.formData.resourceType) || {}
    },
    sysCode () {
      return this.systemList.find(item => item.sysCode == this.formData.sysCode) || {}
    },
    effective () {
      return this.formData.effective == '1' ? '有效' : '无效'
    },
    restUrls () {
      return this.formData.restUrl ? JSON.parse(this.formData.restUrl) : []
    }
  },
  methods: {
    // 初始化数据
    fnInitResource () {
      if (this.systemList.length == 0) {
        rapi.queryAllAccessSystem((data) => {
          this.systemList = eval('(' + data.systemList + ')')
        })
      }
      api.queryResource({
        resourceId: this.initData.resourceId,
        operationType: '2'
      }, (data) => {
        this.fnLoadResourceData(data)
      })
    },
    // 加载数据处理  区分编辑和添加
    fnLoadResourceData (data) {
      this.resourceTypeEditable = data.resourceTypeList
      this.isShowParentItem = (this.initData.pResourceId != '0')
      this.formData = data.taResource
      this.buildForm(this.formData)
      this.imageUrl = data.image
    }
  },
  watch: {
    // 维持prop数据的向下传递性
    initData: {
      immediate: true,
      handler: function (now, old) {
        this.fnInitResource()
      }
    }
  }
}

</script>
<style scoped type="text/less" lang="less">
  .one-info {
    border-bottom: 1px solid #d9d9d9;
    > p { margin-bottom: 0 }
    &:last-child { border-bottom: none }
  }
  .menu-image { position: relative; overflow: hidden; width: 64px; height: 64px; line-height: 64px; margin-left: 10px; font-size: 32px; text-align: center; background: #ccc; color: #fff; border-radius: 100%; }
  .menu-image-show { width: 64px; height: 64px; background-repeat: no-repeat; background-size: cover; background-position: center; }
</style>
