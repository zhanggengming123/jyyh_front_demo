<template>
  <ta-form :autoFormCreate="(form)=>{this.form = form}">
    <template v-if="form">
      <ta-form-item label='页面' v-if="pageInfo.pageName && templateInfo.type != 'ParentPage'" :labelCol="formItemLayout.labelCol" :wrapperCol="formItemLayout.wrapperCol" class="mg-b">{{pageInfo.pageName}}</ta-form-item>
      <ta-form-item label='模板' v-if="templateInfo.templateName" :labelCol="formItemLayout.labelCol" :wrapperCol="formItemLayout.wrapperCol" class="mg-b">{{templateInfo.templateName}}</ta-form-item>
      <ta-form-item v-for="(item,index) in serverList" :label='item' :key="index" :fieldDecoratorId="item" :labelCol="formItemLayout.labelCol" :wrapperCol="formItemLayout.wrapperCol" :fieldDecoratorOptions="{initialValue: serverFormData[item]}">
        <ta-tree-select style="width: 100%" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="serviceList" treeDefaultExpandAll treeDataValue="id">
          <span style="color: @primary-color" slot="label" slot-scope="{name}">
            <ta-icon type="folder" style="margin-right: 6px;"/>{{name}}
          </span>
        </ta-tree-select>
      </ta-form-item>
    </template>
    <div style="text-align: center" v-if="pageInfo.pageId && templateInfo.type != 'ParentPage'">
      <ta-button type='primary' @click="saveServer">保存</ta-button>
    </div>
  </ta-form>
</template>
<script>
import $api from '../../api/appPageRestService'
import {mapGetters} from 'vuex'
export default {
  name: 'assemble-right',
  data () {
    return {
      appId: this.$route.query.appId,
      form: null,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      serviceList: [],
      urlList: {}
    }
  },
  computed: {
    ...mapGetters({
      pageInfo: 'getPageInfo',
      templateInfo: 'getTemplateInfo'
    }),
    // 表单标题
    serverList () {
      let result = []
      if (this.templateInfo.templateContent) {
        result = this.getList()
      }
      return result
    },
    // 表单默认值
    serverFormData () {
      let result = {}
      this.form.resetFields()
      const {pageCode, templateId} = this.templateInfo
      if (pageCode) {
        let formData = this.getFormData(), serverMap = {}
        if (formData.templateId == templateId || templateId == 'onlineDevCode') {
          serverMap = formData.serverMap || {}
        }
        let formKey = Object.keys(serverMap), urlList = Object.keys(this.urlList)
        if (formKey.length) {
          for (let i = 0; i < formKey.length; i++) {
            for (let j = 0; j < urlList.length; j++) {
              if (serverMap[formKey[i]] == this.urlList[urlList[j]]) {
                result[formKey[i]] = urlList[j]
                break
              }
            }
          }
        }
      }
      return result
    }
  },
  mounted () {
    this.queryServiceList()
  },
  methods: {
    // 获取表单标题
    getList () {
      let result = [], param = 'var defaultServerMap ='
      let str = this.templateInfo.templateContent
      if (str && str.indexOf(param) != -1) {
        str = str.substr(str.indexOf(param))
        str = str.substr(0, str.indexOf('}') + 1)
        str = str.substr(str.indexOf('{'))
        result = Object.keys(eval('(' + str + ')'))
      }
      return result
    },
    // 获取表单默认值
    getFormData () {
      let result = {}, param = 'var application ='
      let str = this.templateInfo.pageCode
      if (str && str.indexOf(param) != -1) {
        str = str.substr(str.indexOf(param))
        str = str.substr(0, str.indexOf('}') + 1)
        str = str.substr(str.indexOf('{'))
        str += '}'
        result = eval('(' + str + ')')
      }
      return result
    },
    // 查询模板功能目录下的模板
    queryServiceList () {
      $api.getOnlineServiceList({}, (data) => {
        let temp = data.data.serviceTree
        this.urlList = {}
        this.serviceList = this.getTreeData(temp)
      })
    },
    // 转换为下拉树格式
    getTreeData (data) {
      if (data.length) {
        data.map((item) => {
          if (item.code) {
            item.label = item.name
            this.urlList[item.id] = item.url
          } else {
            item.disabled = true
            item.scopedSlots = { label: 'label' }
          }
          if (item.children && item.children.length) {
            this.getTreeData(item.children)
          }
        })
      }
      return data
    },
    // 保存
    saveServer () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const {templateId, templateType} = this.templateInfo
          const {pageId} = this.pageInfo
          if (!pageId) {
            this.$message.warning('请先选择页面')
            return false
          }
          if (!templateId) {
            this.$message.warning('请先选择模板')
            return false
          }
          let param = {}
          param.appId = this.appId
          param.pageId = pageId
          param.templateId = templateId
          let tempMap = {}
          this.serverList.map((item) => {
            tempMap[item] = this.urlList[values[item]]
          })
          param.serverMap = tempMap
          if (templateType == '3') {
            param.templateId = ''
            $api.saveOnlineDevServer({templateId: '', application: JSON.stringify(param), pageId: param.pageId }, (data) => {
              this.$message.success('保存服务关联成功')
            })
          } else {
            $api.savePageTemplate({templateId: templateId, application: JSON.stringify(param), pageId: param.pageId }, (data) => {
              this.$message.success('保存服务关联成功')
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped type="text/less">
  .assemble-right {
    .mg-b { margin-bottom: 0px; }
  }
</style>
