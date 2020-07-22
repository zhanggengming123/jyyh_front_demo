<template>
  <ta-drawer :destroyOnClose="true" width="500" :title="rowData.appId? '编辑应用':'新增应用'" placement="right" :closable="true" @close="closeDrawer" :visible="visible">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item label="应用名称"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="appName"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '应用名称不能为空' }], initialValue: formData.appName}">
        <ta-input placeholder="请输入应用名称"/>
      </ta-form-item>
      <ta-form-item label="应用类型"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="appType"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '请选择应用类型' }], initialValue: formData.appType}">
        <ta-radio-group buttonStyle="solid">
          <ta-radio-button v-for="item in CollectionData('SITETYPE')" :key="item.value" :value="item.value">{{item.label}}</ta-radio-button>
        </ta-radio-group>
      </ta-form-item>
      <ta-form-item label="可用标识"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="appEffective"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '请选择可用标识' }], initialValue: formData.appEffective}">
        <ta-radio-group buttonStyle="solid">
          <ta-radio-button v-for="item in CollectionData('AVAILABLE')" :key="item.value" :value="item.value">{{item.label}}</ta-radio-button>
        </ta-radio-group>
      </ta-form-item>
    </ta-form>
    <div slot="footer">
      <ta-button-group>
        <ta-button @click="form.resetFields()">重置</ta-button>
        <ta-button type="primary" @click="fnSave">保存</ta-button>
      </ta-button-group>
    </div>
  </ta-drawer>
</template>
<script>
import $api from '../api/index'
export default {
  name: 'editTag',
  props: ['visible', 'rowData', 'editType'],
  data () {
    return {
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18}
      },
      formData: {}
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
      const { appId, appName, appType, appEffective } = this.rowData
      if (appId == undefined) {
        this.formData = {
          appType: '0',
          appEffective: '1'
        }
      } else {
        this.formData = {
          appId: appId,
          appName: appName,
          appType: appType,
          appEffective: appEffective
        }
      }
    },
    // 提交修改或者新增应用
    fnSave () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.rowData.appId == undefined) {
            $api.addApp(values, (data) => {
              this.$message.success('新增应用成功')
              this.$emit('search')
              this.closeDrawer()
            })
          } else {
            values.appId = this.rowData.appId
            $api.updateAppByCondition(values, (data) => {
              this.$message.success('修改应用成功')
              this.$emit('editSuccess', values)
              this.closeDrawer()
            })
          }
        }
      })
    },
    closeDrawer () {
      this.formData = {}
      this.$emit('close')
    }
  }
}
</script>
