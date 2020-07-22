<template>
    <ta-drawer title="添加数据源" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
        <ta-form id="userForm" :autoFormCreate="(form)=>{this.form = form}">
            <ta-form-item
                    label='数据源名称'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="datasourceName"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入数据源名称' }]}"
            >
                <ta-input/>
            </ta-form-item>
            <ta-form-item
                    label='数据源驱动'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="driver"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入数据源驱动' }]}"
            >
                <ta-select>
                    <ta-select-option value="com.informix.jdbc.IfxDriver">com.informix.jdbc.IfxDriver</ta-select-option>
                    <ta-select-option value="org.postgresql.Driver">org.postgresql.Driver</ta-select-option>
                    <ta-select-option value="oracle.jdbc.OracleDriver">oracle.jdbc.OracleDriver</ta-select-option>
                    <ta-select-option value="com.mysql.jdbc.Driver">com.mysql.jdbc.Driver</ta-select-option>
                </ta-select>
            </ta-form-item>
            <ta-form-item
                    label='数据源url'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="url"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入数据源url' }]}"
            >
                <ta-input/>
            </ta-form-item>
            <ta-form-item
                    label='数据源用户'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="userName"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入数据源用户' }]}"
            >
                <ta-input/>
            </ta-form-item>
            <ta-form-item
                    label='数据源密码'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="password"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入数据源密码' }]}"
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
  name: 'addDatasource',
  props: ['visible'],
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      formData: {}
    }
  },
  methods: {
    closeDrawer () {
      this.$emit('close')
      this.form.resetFields()
    },
    onResetForm () {
      this.form.resetFields()
    },
    onSubmitForm () {
      this.form.validateFields((err, values) => {
        if (!err) {
          api.addJobDatasource(values, (result) => {
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
          this.closeDrawer()
          this.$emit('queryTable')
        }
      })
    }
  }
}
</script>
