<template>
  <ta-drawer destroyOnClose title="编辑接入系统" width="500" placement="right" :closable="true" @close="closeDrawer" :visible="visible">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item id="sysName" label='系统名称'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="sysName"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入系统名称' },{max:10,message:'不能超过10个字符'}],initialValue: systemData.sysName}">
        <ta-input placeholder="请输入接入系统名称"/>
      </ta-form-item>
      <ta-form-item
        label="系统标识"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="sysCode"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入系统标识' },{max:10,message:'不能超过10个字符'},{pattern:new RegExp('^[a-z0-9]*$'),message:'输入格式错误,只能有小写字母或数字'}],initialValue: systemData.sysCode}"
      >
        <ta-input placeholder="请输入接入系统标识"/>
      </ta-form-item>
      <ta-form-item
        label="协议"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="protocol"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入协议' },{max:10,message:'不能超过5个字符'},{pattern:new RegExp('^http$|^https$'),message:'输入格式错误'}],initialValue: systemData.protocol}"
      >
        <ta-select defaultValue="http" placeholder="例如:http,https">
          <ta-select-option value="http">http</ta-select-option>
          <ta-select-option value="https">https</ta-select-option>
        </ta-select>
      </ta-form-item>
      <ta-form-item
        label="前端地址"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="domain"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入前端地址' },{max:100,message:'不能超过100个字符'},{pattern:new RegExp(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/),message:'输入格式错误'}],initialValue: systemData.domain}"
      >
        <ta-input placeholder="IP"/>
      </ta-form-item>
      <ta-form-item
        label="端口"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="port"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入端口' },{pattern:new RegExp('^[0-9]{1,5}$'),message:'输入格式不正确'}],initialValue: systemData.port}"
      >
        <ta-input placeholder="请输入端口"/>
      </ta-form-item>
      <ta-form-item
        label="后台地址"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="backgroundAddress"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入后台地址' },{max:100,message:'不能超过100个字符'},{pattern:new RegExp(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/),message:'输入格式错误'}],initialValue: systemData.backgroundAddress}"
      >
        <ta-input placeholder="包括IP与端口"/>
      </ta-form-item>
      <ta-form-item
        label="上下文"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="contextPath"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入上下文' },{max:10,message:'不能超过10个字符'},{pattern: new RegExp(/^[a-zA-Z][a-zA-Z\d]{0,9}$/),message:'请输入以英文字母开始的字符串'}],initialValue: systemData.contextPath}"
      >
        <ta-input placeholder="请输入上下文"/>
      </ta-form-item>
      <ta-form-item
        label="系统提供者"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="provider"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入系统提供者' },{max:10,message:'不能超过10个字符'}],initialValue: systemData.provider}"
      >
        <ta-input placeholder="请输入系统提供者"/>
      </ta-form-item>
    </ta-form>
    <div slot="footer">
      <ta-button-group>
        <ta-button @click="form.resetFields()">重置</ta-button>
        <ta-button type="primary" @click="onSubmitForm">保存</ta-button>
      </ta-button-group>
    </div>
  </ta-drawer>
</template>
<script>
import $api from '../api/index'
export default {
  name: 'editSystem',
  props: ['visible', 'rowData'],
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      isPortal: true,
      systemData: {}
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.initForm()
      }
    }
  },
  methods: {
    // 重置表单
    onResetForm () {
      this.initForm()
    },
    closeDrawer () {
      this.$emit('close')
      this.systemData = {}
    },
    initForm () {
      this.systemData = this.rowData
    },
    // 提交表单
    onSubmitForm () {
      this.form.validateFields((err) => {
        if (!err) {
          // 赋值给要提交的数据
          const formVal = this.form.getFieldsValue()
          var param = formVal
          // 将未修改过的值赋值给submitData
          param.id = this.rowData.id
          param.address = formVal.protocol + '://' + formVal.domain + ':' + formVal.port + '/' + formVal.contextPath
          $api.updateTaAccessSystemById(param, (data) => {
            this.$message.success('编辑成功')
            this.$emit('editSuccess', param)
          })
        }
      })
    }
  }
}
</script>
