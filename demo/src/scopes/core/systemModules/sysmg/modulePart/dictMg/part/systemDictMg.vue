<template>
  <ta-form id="dictForm" :autoFormCreate="(form)=>{this.form = form}">
    <ta-form-item label='字典类型'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="type"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: '字典类型不能为空!' }]}">
      <ta-input :disabled="!edit"/>
    </ta-form-item>
    <ta-form-item label='字典名称'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="name"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: '字典名称不能为空' }]}">
      <ta-input :disabled="!edit"/>
    </ta-form-item>
    <ta-form-item v-if="dict.parentValue && dict.parentValue !== ''"
                  label='父级字典'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol">
      <ta-input :disabled=true v-model="parentLabel"/>
    </ta-form-item>
    <ta-form-item label='字典标签'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="label"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: '字典标签不能为空' }]}">
      <ta-input/>
    </ta-form-item>
    <ta-form-item label='字典键值'
                  :labelCol="{ span: 6 }"
                  :wrapperCol="{ span: 18}"
                  fieldDecoratorId="value"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: '字典键值不能为空' }]}">
      <ta-input/>
    </ta-form-item>
    <ta-form-item label='排序号'
                  :labelCol="{ span: 6}"
                  :wrapperCol="{ span: 18 }"
                  fieldDecoratorId="sort"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: '排序号不能为空' }, {type: 'number', min: 0, max: 200000000, message: '排序号需在0~200000000之间！'}]}">
      <ta-input/>
    </ta-form-item>
    <ta-form-item label='CSS样式'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="cssStyle">
      <ta-input/>
    </ta-form-item>
    <ta-form-item label='CSS Class'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="cssClass">
      <ta-input/>
    </ta-form-item>
    <!--    <ta-form-item label='权限标识'-->
    <!--                  :labelCol="formItemLayout.labelCol"-->
    <!--                  :wrapperCol="formItemLayout.wrapperCol"-->
    <!--                  fieldDecoratorId="authority"-->
    <!--                  :fieldDecoratorOptions="{rules: [{ required: true, message: '权限标识不能为空' }]}">-->
    <!--      <ta-input :disabled="!edit"/>-->
    <!--    </ta-form-item>-->

    <ta-form-item id="status" label='是否有效'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol">
      <ta-switch v-model="dictStatus" checkedChildren="有效" unCheckedChildren="无效"/>
    </ta-form-item>
  </ta-form>
</template>
<script>

import $api from '../api/index'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

export default {
  name: 'systemDictMg',
  props: ['dict'],
  data () {
    return {
      edit: false, // 是否是编辑
      formItemLayout,
      parentValueSelect: false,
      parentValueList: [], // 父级字典列表
      parentValue: undefined, // 父级字典
      parentLabel: '',
      dictStatus: true, // 是否有效,默认为true
      authority: this.dict.authority
    }
  },

  mounted: function () {
    if (this.dict.drawerType && this.dict.drawerType !== 'edit') {
      this.fnLoadParentValue()
    }
    this.fnBindForm()
  },

  methods: {
    // 加载父级字典
    fnLoadParentValue () {
      const { type, authority, value, parentValue, parentLabel, drawerType } = this.dict
      let data = {
        type: type,
        authority: authority,
        value: value
      }
      if (parentValue && parentValue !== '') {
        this.parentLabel = parentLabel
        this.parentValue = parentValue
      }
      $api.queryDictInfo(data, (data) => {
        if (drawerType === 'add') {
          this.form.setFieldsValue({ sort: data.data.sort })
        }
      })
    },

    // 重置表单
    resetForm: function () {
      this.fnBindForm()
    },

    // 保存字典
    saveDict () {
      this.form.validateFields((err) => {
        if (!err) {
          let type = this.dict.drawerType
          let system = this.dict.system
          let formVal = this.form.getFieldsValue()
          let data = formVal
          let parentValue = this.parentValue
          let dictStatus = this.dictStatus == true ? '1' : '0'
          data.oldType = this.dict.type
          data.oldValue = this.dict.value
          data.parentValue = parentValue
          data.status = dictStatus
          data.system = system
          data.authority = this.authority

          if (type == 'add') {
            $api.saveDict(data, (data) => {
              this.$message.success('新增字典成功！')
              this.$emit('closeSystemDictMgDrawer')
            })
          } else {
            $api.updateDict(data, (data) => {
              this.$message.success('更新字典成功！')
              this.$emit('closeSystemDictMgDrawer')
            })
          }
        }
      })
    },

    // 绑定form表单
    fnBindForm () {
      const { type, name, label, value, sort, cssStyle, cssClass, authority, status } = this.dict
      this.form.setFieldsValue({
        type: type,
        name: name,
        label: label,
        value: value,
        sort: sort,
        cssStyle: cssStyle,
        cssClass: cssClass,
        authority: authority
      })
      if (status && status == '1') {
        this.dictStatus = true
      } else if (status && status == '0') {
        this.dictStatus = false
      }
    }
  }
}
</script>
