<template>
  <ta-form :autoFormCreate="(form)=>{this.form = form}">
    <ta-form-item v-if="area === '0'?false:true" label="上级行政区划" :labelCol="formItemLayout.labelCol" :wrapperCol="formItemLayout.wrapperCol">
      <ta-input :value="area.areaName" disabled/>
    </ta-form-item>
    <ta-form-item label='行政区划名称' :labelCol="formItemLayout.labelCol" :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="areaName"
                  :fieldDecoratorOptions="{rules: [{ required: true, whitespace: true, message: '行政区划名称不能为空' }]}">
      <ta-input placeholder="请输入行政区划名称"/>
    </ta-form-item>
    <ta-form-item label='行政区划编码' :labelCol="formItemLayout.labelCol" :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="areaCode"
                  :fieldDecoratorOptions="{rules: [{ required: true, whitespace: true, message: '行政区划编码不能为空' }, { pattern: '^[1-9][0-9]{5,11}$', message: '请输入正确的行政区划编码' }]}">
      <ta-input placeholder="请输入行政区划编码"/>
    </ta-form-item>
  </ta-form>
</template>
<script>
import $api from '../api/index'
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18}
}
export default {
  props: ['area'],
  data () {
    return {
      form: null,
      editFlag: false, // 是否是编辑行政区划
      formItemLayout
    }
  },
  methods: {
    // 重置表单
    onResetForm () {
      this.form.resetFields()
    },
    handleSubmit () {
      let data = this.form.getFieldsValue()
      data.parentId = this.area.areaId
      $api.addArea(this.form, data, (data) => {
        this.$emit('addSuccess', this.area, data.data.result)
        this.$message.success('新增行政区划成功')
      })
    }
  }
}
</script>
