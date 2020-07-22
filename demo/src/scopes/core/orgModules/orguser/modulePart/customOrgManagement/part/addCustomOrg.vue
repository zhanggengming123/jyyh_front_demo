<template>
  <div>
    <ta-form layout="horizontal" :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item label='组织分类'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="customOrgTypeNameId"
                    :initValue="org.customOrgTypeNameId"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '组织分类不能为空' }]}">
        <!--判断新增组织属于哪种类型,如果是添加顶级组织则加载下拉选项,如果是修改或者新增下级,则使用传值过来的值-->
        <ta-select showSearch
                   allowClear
                   notFoundContent="无数据显示"
                   placeholder="请选择组织类别"
                   optionFilterProp="children"
                   disabled>
          <ta-select-option v-for="(item, index) in orgTypeNameList"
                            :key="index"
                            :value="item.customOrgTypeNameId">
            {{item.customOrgTypeName}}
          </ta-select-option>
        </ta-select>
      </ta-form-item>
      <ta-form-item v-if="this.org.type!='addTop'&&this.org.parentId!='0'"
                    label="父级组织"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="customOrgPath"
                    :initValue="customOrgPath">
        <ta-input :disabled="this.org.type!='addTop'"/>
      </ta-form-item>
      <ta-form-item label="组织名称"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="customOrgName"
                    :initValue="this.org.type=='edit'?org.customOrgName:''"
                    :fieldDecoratorOptions="{rules: [{ required: true, whitespace: true, message: '组织名称不能为空' }]}">
        <ta-input-search placeholder="请输入组织名称" @search="treeVisible=true">
          <ta-button slot="enterButton" icon="plus"></ta-button>
        </ta-input-search>
      </ta-form-item>
      <ta-form-item label="自定义编码"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    :initValue="this.org.type=='edit'?org.customCode:''"
                    fieldDecoratorId="customCode">
        <ta-input placeholder='请输入自定义编码'/>
      </ta-form-item>
      <ta-form-item label="是否有效"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="effective"
                    :fieldDecoratorOptions="{initialValue: org.effective ? org.effective=='1' : true, valuePropName: 'checked'}">
        <ta-switch checkedChildren="有效" unCheckedChildren="无效"/>
      </ta-form-item>
      <ta-form-item v-show="this.org.type!='edit'" label="关联人员"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol">
        <custom-org-user-select-tag v-model="userIds"></custom-org-user-select-tag>
      </ta-form-item>
    </ta-form>
    <custom-org-modal-tree :visible="treeVisible" @close="fnCloseOrgTreeModal"></custom-org-modal-tree>
  </div>
</template>
<script>
import $api from '../api/index'
import CustomOrgModalTree from './customOrgModalTree'
import CustomOrgUserSelectTag from './customOrgUserSelectTag'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

export default {
  components: { CustomOrgUserSelectTag, CustomOrgModalTree },
  props: ['org'],
  name: 'addCustomOrg',
  data () {
    return {
      orgTypeNameList: [],
      formItemLayout,
      treeVisible: false, // 是否显示组织树模态框
      userIds: '', // 选中的用户id
      customOrgPath: ''
    }
  },
  mounted () {
    if (this.org.type != 'addTop') {
      let oldPath = this.org.customOrgPath
      let index = oldPath.lastIndexOf('\/')
      let customOrgPath
      if (this.org.type === 'edit' && index > -1) { // 如果为编辑,则截取上一级的组织
        customOrgPath = oldPath.substr(0, index)
      } else if (this.org.type === 'add') {
        // 如果为新增下级,则当前组织为父级组织
        customOrgPath = oldPath
      }
      this.customOrgPath = customOrgPath
    }
    this.fnQueryAllCustomOrgTypeName()
  },
  methods: {
    fnResetForm () {
      this.form.resetFields()
    },
    // 查询所有自定义组织名称
    fnQueryAllCustomOrgTypeName () {
      $api.queryCustomOrgTypeName(null, (data) => {
        this.orgTypeNameList = data.data.customOrgTypeNameList
      })
    },
    // 关闭组织树模态框
    fnCloseOrgTreeModal (val) {
      this.treeVisible = false
      if (val) {
        this.form.setFieldsValue({
          customOrgName: val
        })
      }
    },
    // 点击更新或者保存组织
    fnUpdateOrSaveOrg () {
      this.form.validateFields((err) => {
        if (!err) {
          let data = this.form.getFieldsValue()
          let customOrgPath = this.customOrgPath
          let customOrgName = this.form.getFieldValue('customOrgName')
          if (!customOrgPath) {
            data.customOrgPath = customOrgName
          } else {
            data.customOrgPath = customOrgPath + '/' + customOrgName
          }
          data.effective = data.effective ? '1' : '0'
          if (this.org.type == 'addTop') {
            data.userIds = this.userIds
            data.addTop = true
            $api.addCustomOrg(data, (dd) => {
              this.$emit('closeCustomOrgDrawer', data)
              this.$message.success('更新数据成功')
            })
          }

          if (this.org.type == 'add') {
            data.customOrgPathId = this.org.customOrgPathId
            data.parentId = this.org.customOrgId
            data.userIds = this.userIds
            $api.addCustomOrg(data, (data) => {
              // 将新增结果添加到表格中
              this.$emit('closeCustomOrgDrawer', data.data.result)
              this.$message.success('更新数据成功')
            })
          }
          if (this.org.type == 'edit') {
            data.parentId = this.org.customOrgId
            data.customOrgPathId = this.org.customOrgPathId
            data.customOrgId = this.org.customOrgId
            $api.updateCustomOrg(data, (dd) => {
              this.$emit('closeCustomOrgDrawer', data)
              this.$message.success('更新数据成功')
            })
          }
        }
      })
    },
    // 点击返回上传上级组件
    closeCustomOrgDrawer () {
      this.$emit('closeCustomOrgDrawer')
    }
  }
}
</script>
