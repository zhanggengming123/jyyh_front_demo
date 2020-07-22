<template>
  <div>
    <ta-drawer :title="editType == '1'? '添加服务':'编辑服务'" width="500" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose>
      <ta-form :autoFormCreate="(form)=>{this.form = form}">
        <template v-if="form">
          <ta-form-item label='服务名称'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="serviceName"
                        :fieldDecoratorOptions="{ rules: [{ required: true, message: '服务名称不能为空!' },{ max: 300, message: '服务名称超过限制长度!' }], initialValue:formData.serviceName}">
            <ta-input/>
          </ta-form-item>
          <ta-form-item label='服务标识符'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="serviceType"
                        :fieldDecoratorOptions="{ initialValue: formData.serviceType }">
            <ta-input />
          </ta-form-item>
          <ta-form-item label='服务地址'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="serviceUrl"
                        :fieldDecoratorOptions="{rules: [{ type: 'url', message: '请输入正确的服务地址' },{ required: true, message: '服务地址不能为空!' }], initialValue: formData.serviceUrl}">
            <ta-input />
          </ta-form-item>
          <ta-form-item label='有效标识'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="effective" :fieldDecoratorOptions="{ valuePropName: 'checked', initialValue: formData.effective }">
            <ta-switch  checkedChildren="可用" unCheckedChildren="不可用"/>
          </ta-form-item>
          <ta-form-item label='服务描述'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="serviceDesc"
                        :fieldDecoratorOptions="{ initialValue: formData.serviceDesc }">
            <ta-textarea :autosize="{ minRows: 2, maxRows: 6 }" />
          </ta-form-item>
        </template>
      </ta-form>
      <div slot="footer">
        <ta-button-group>
          <ta-button  @click="form.resetFields()">重置</ta-button>
          <ta-button type="primary" @click="save" :loading="loading">保存</ta-button>
        </ta-button-group>
      </div>
    </ta-drawer>
  </div>
</template>
<script>
import $api from '../api/index'
export default {
  name: 'addService',
  props: ['visible', 'editType', 'rowData', 'serviceNameId'],
  data () {
    return {
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18}
      },
      form: null,
      formData: {},
      loading: false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.setValue()
      }
    }
  },
  methods: {
    setValue () {
      // type = 1 新增，type=2  编辑
      if (this.editType == '2') {
        const {serviceName, serviceType, serviceUrl, effective, serviceDesc} = this.rowData
        this.formData = {
          serviceName: serviceName,
          serviceType: serviceType,
          serviceUrl: serviceUrl,
          effective: effective == '1',
          serviceDesc: serviceDesc
        }
      } else {
        this.formData = {
          effective: true
        }
      }
    },
    closeDrawer () {
      this.formData = {}
      this.$emit('close')
      this.loading = false
    },
    save () {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.effective = values.effective ? '1' : '0'
          values.serviceNameId = this.serviceNameId
          this.loading = true
          if (this.editType == '2') {
            values.serviceId = this.rowData.serviceId
            $api.updateOnlineService(values, (data) => {
              if (data.data.result == 1) {
                this.$message.success('修改服务成功')
                this.$emit('success')
                this.closeDrawer()
              }
            })
          } else {
            $api.addOnlineService(values, (data) => {
              if (data.data.result == 1) {
                this.$message.success('新增服务成功')
                this.$emit('success')
                this.closeDrawer()
              }
            })
          }
        }
      })
    }
  }
}
</script>
