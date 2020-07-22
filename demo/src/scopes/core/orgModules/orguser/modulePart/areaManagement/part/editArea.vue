<template>
  <ta-form :autoFormCreate="(form)=>{this.form = form}">
    <ta-form-item
      label='行政区划名称'
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      fieldDecoratorId="areaName"
      :fieldDecoratorOptions="{rules: [{ required: true, whitespace: true, message: '行政区划名称不能为空' }]}"
    >
      <ta-input :disabled="flag"/>
    </ta-form-item>
    <ta-form-item
      label='行政区划编码'
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      fieldDecoratorId="areaCode"
      :fieldDecoratorOptions="{rules: [{ required: true, whitespace: true, message: '行政区划编码不能为空' }, { pattern: '^[1-9][0-9]{5,11}$', message: '请输入正确的行政区划编码' }]}"
    >
      <ta-input :disabled="flag"/>
    </ta-form-item>
    <ta-form-item
      label='排序号'
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      fieldDecoratorId="areaOrder"
      :fieldDecoratorOptions="{rules: [{ required: false, message: '排序号不能为空!' }]}"
    >
      <ta-input :disabled="flag"/>
    </ta-form-item>

    <ta-form-item
      label='区划层级'
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      fieldDecoratorId="areaLevel"
    >
      <ta-radio-group size="small" buttonStyle="solid" :disabled="flag">
        <ta-radio-button v-for="item in CollectionData('AREALEVEL')" :key='item.value' :value='item.value'>{{item.label}}</ta-radio-button>
      </ta-radio-group>
    </ta-form-item>

    <ta-form-item
      label='状态'
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      fieldDecoratorId="effective">
      <ta-switch checkedChildren="有效" unCheckedChildren="无效" v-model="effective" :disabled="flag"/>
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
  name: 'editAreaInfo',
  props: ['area', 'flag'],

  mounted () {
    this.initForm()
  },
  data () {
    return {
      form: null,
      effective: true,
      formItemLayout
    }
  },
  methods: {
    // 提交表单
    onSubmitForm () {
      let data = this.form.getFieldsValue()
      const {areaId, parentId, idPath, namePath} = this.area
      data.areaId = areaId
      data.parentId = parentId
      data.idPath = idPath
      data.namePath = namePath
      data.effective = this.effective === true ? '1' : '0'
      $api.updateArea(this.form, data, (dd) => {
        this.$message.success('更新操作成功')
        this.$emit('editSuccess', data)
      })
    },
    // 重置表单
    onResetForm () {
      this.initForm()
    },
    initForm () {
      // 设置一组控件的值
      const {areaName, areaCode, areaOrder, areaLevel, effective} = this.area
      this.form.setFieldsValue({
        areaName: areaName,
        areaCode: areaCode,
        areaOrder: areaOrder,
        areaLevel: areaLevel.toString()
      })
      this.effective = effective == '1'
    }
  }
}
</script>
