<template>
  <ta-drawer title="角色信息" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item label='角色名称'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol">
        {{formData.roleName}}
      </ta-form-item>
      <ta-form-item label='所属组织'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol">
        {{formData.namePath}}
      </ta-form-item>
      <ta-form-item label='有效时间'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol">
        {{formData.effectiveTime}}
      </ta-form-item>
      <ta-form-item label='角色类型'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol">
        {{CollectionLabel('ROLESIGN',formData.roleSign)}}
      </ta-form-item>
      <ta-form-item label='角色描述'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol">
        {{formData.roleDesc}}
      </ta-form-item>
    </ta-form>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'
export default {
  name: 'showAddRole',
  props: ['visible', 'rowData', 'chooseRoleResult', 'adminRole'],
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      formData: {}
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          this.formData = result.data[this.chooseRoleResult][0]
          // 管理员角色
          if (this.adminRole) {
            this.formData['roleSign'] = '管理员角色'
          }
        })
      }
    }
  },
  methods: {
    closeDrawer () {
      this.$emit('close')
    }
  }
}
</script>
