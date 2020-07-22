<template>
  <ta-drawer title="角色复制" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item label='原角色名称'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol">
        {{formData.roleName}}
      </ta-form-item>
      <ta-form-item label='新角色名称'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol">
        {{formData.newRoleName}}
      </ta-form-item>
      <ta-form-item label='新角色组织'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol">
        {{formData.orgNamePath}}
      </ta-form-item>
    </ta-form>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'
export default {
  name: 'showCopyRole',
  props: ['visible', 'rowData'],
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
          this.formData = result.data.before
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
<style scoped type="text/less" lang="less">
  .avatar-form-item .ant-form-item-label { margin-top: 12px; }
</style>
