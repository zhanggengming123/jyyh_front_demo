<template>
  <ta-drawer title="新增组织范围权限" width="500" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose>
      <ta-alert :message="'当前角色为：'+ roleName" type="info" showIcon class="notice-box"/>
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item label='组织名称'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol">
        {{formData.orgName}}
      </ta-form-item>
      <ta-form-item label='组织路径'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol">
        {{formData.namePath}}
      </ta-form-item>
    </ta-form>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'

export default {
  name: 'showOrgScope',
  props: ['visible', 'rowData'],
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      formData: {},
      roleName: ''
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          this.formData = result.data.before
          this.roleName = result.data.before['roleName']
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
