<template>
    <ta-drawer title="添加注册中心" placement="right" :closable="true" @close="closeEdit"
               :visible="visible" destroyOnClose width="500px">
        <ta-form id="zkForm" :autoFormCreate="(form)=>{this.form = form}">
            <ta-form-item
                    label='注册中心名称'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="appName"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入注册中心名称' }]}"
            >
                <ta-input/>
            </ta-form-item>
            <ta-form-item
                    label='注册中心地址'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="zkAddress"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入注册中心地址' }]}"
            >
                <ta-input/>
            </ta-form-item>
            <ta-form-item
                    label='命名空间'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="appNamespace"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入命名空间' }]}"
            >
                <ta-input/>
            </ta-form-item>
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

import api from '../api/index'

export default {
  name: 'editZk',
  props: ['visible'],
  data () {
    return {
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18}
      },
      formData: {}
    }
  },

  methods: {
    closeEdit () {
      this.$emit('close')
      this.form.resetFields()
    },

    onResetForm () {
      this.form.resetFields()
    },

    onSubmitForm () {
      this.form.validateFields((err, values) => {
        if (!err) {
          api.addZookeeperRegistryCenter(values, (result) => {
            this.showConfirm()
          })
        }
      })
    },

    showConfirm () {
      this.$confirm({
        title: '保存成功',
        content: '保存成功。是否继续新增注册中心?',
        onOk: () => {
          this.form.resetFields()
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
