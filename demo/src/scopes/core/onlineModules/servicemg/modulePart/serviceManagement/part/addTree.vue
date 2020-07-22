<template>
  <ta-modal :title="addType == '1' ? '编辑服务项':'新增服务项'" v-model="visibleModal" @ok="save" @cancel="fnClose">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
        <ta-form-item label='服务项名称'
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      fieldDecoratorId="serviceName"
                      :fieldDecoratorOptions="{initialValue: initServiceName, rules: [{ required: true, message: '服务项名称不能为空!' },{ max: 300, message: '服务项名称超过限制长度!' }]}">
          <ta-input/>
        </ta-form-item>
    </ta-form>
  </ta-modal>
</template>
<script>
import $api from '../api/index'
export default {
  name: 'addTree',
  props: ['visible', 'idPath', 'addType', 'row'],
  data () {
    return {
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18}
      },
      form: null,
      initServiceName: '',
      visibleModal: false
    }
  },
  watch: {
    visible (val) {
      this.visibleModal = val
      if (this.visibleModal && this.addType == '1') {
        this.initServiceName = this.row.serviceName
      } else {
        this.initServiceName = ''
      }
    }
  },
  methods: {
    fnClose (type, obj) {
      this.form.resetFields()
      this.$emit('close', type, obj)
    },
    save () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.addType == '1') {
            $api.updateOnlineServiceName({serviceName: values.serviceName, serviceNameId: this.row.serviceNameId, parentId: this.row.parentId}, (data) => {
              if (data.serviceSuccess) {
                this.fnClose('edit', {serviceName: values.serviceName})
              }
            })
          } else {
            $api.addOnlineServiceName({serviceName: values.serviceName, idPath: this.idPath}, (data) => {
              if (data.serviceSuccess) {
                this.fnClose('add', data.data.result)
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="less" type="text/less">
  .tag-select { .user-select() }
</style>
