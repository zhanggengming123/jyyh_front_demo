<template>
  <ta-form :autoFormCreate="(form)=>{this.form = form}">
    <ta-form-item label="包名称"
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="packageName"
                  :fieldDecoratorOptions="{ rules: [{ required: true, message: '请输入包名称' }]}">
      <ta-input/>
    </ta-form-item>
    <ta-form-item label="日志级别"
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="level"
                  :fieldDecoratorOptions="{ rules: [{ required: true, message: '请选择日志级别' }]}">
      <ta-select showSearch>
        <ta-select-option v-for="item in CollectionData('LOGLEVEL')" :key="item.key" :value="item.label">{{item.label}}</ta-select-option>
      </ta-select>
    </ta-form-item>
    <ta-form-item label="输出类型"
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="appenderType">
      <ta-select mode="multiple" :tokenSeparators="[',']" placeholder="支持多选">
        <ta-select-option v-for="item in output" :key="item.key" :disabled="item.disabled">{{item.value}}</ta-select-option>
      </ta-select>
    </ta-form-item>
  </ta-form>
</template>
<script>
import api from '../api'
const output = [{key: 'console', value: 'console'}, {key: 'file', value: 'file'}, {key: 'kafka', value: 'kafka'}]

export default {
  name: 'addLogConfig',
  props: ['bindData'],
  data () {
    return {
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18}
      },
      output
    }
  },
  methods: {
    saveLogConfig () {
      let params = this.form.getFieldsValue()
      params.appenderType = params.appenderType ? params.appenderType.join(',') : ''
      api.addLogConfig(this.form, params, (result) => {
        this.$message.success('新增成功')
        this.$emit('closeLogDrawer', true)
      })
    },
    handleReset () {
      this.form.resetFields()
    }
  }
}
</script>
