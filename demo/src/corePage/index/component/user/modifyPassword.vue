<template>
  <ta-form :autoFormCreate="(form)=>{this.form = form}" layout="horizontal" style="padding: 10px">
    <ta-form-item label='原密码'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="oldPassword"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: '原密码不能为空' }]}"
    >
      <ta-input placeholder="原密码" type="password"/>
    </ta-form-item>
    <ta-form-item label='新密码'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="newPassword"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: '新密码不能为空' },
                        {validator: compareToNextPassword}]}"

    >
      <ta-input placeholder="新密码" type="password" onpaste="return false" oncopy="return false" />
    </ta-form-item>
    <ta-form-item label='确认'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="confirm"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: '确认密码不能为空' },
                        {validator:compareToFirstPassword}]}"

    >
      <ta-input placeholder="确认密码" type="password" @blur="handleConfirmBlur" onpaste="return false" oncopy="return false" />
    </ta-form-item>
    <ta-form-item :wrapperCol="{ offset: 5 }">
      <ta-button type='primary' @click="closePane">取消</ta-button>
      <ta-button type='primary' style="margin-left: 20px" @click="handleSubmit">提交</ta-button>
    </ta-form-item>
  </ta-form>
</template>
<script>
import { mapGetters } from 'vuex'
import pwdStr from '@yh/ta404-ui/es/utils/js/encryption'
export default {
  name: 'modify-password',
  props: {},
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      confirmDirty: false
    }
  },
  computed: {
    ...mapGetters({
      state: 'getStateValue'
    }),
    userInfo () {
      return this.state.userInfo
    }
  },
  methods: {
    compareToNextPassword (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      // 检查并提示密码强度
      var modes = this.checkPassWord(value)
      if (modes < 2) {
        callback('请至少包含大写字母、小写字母、数字、特殊字符(-和_)中的两种，且长度为8~18位')
      } else {
        callback()
      }
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('newPassword')) {
        callback('两次密码不同!')
      } else {
        callback()
      }
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const formData = this.form.getFieldsValue()
          formData.userId = this.userInfo.userId || ''
          if (this.userInfo.passwordRSA) {
            formData.oldPassword = pwdStr.encryptString(formData.oldPassword)
            formData.newPassword = pwdStr.encryptString(formData.newPassword)
          }

          this.Base.submit(null, {
            url: 'indexRestService/changePassword',
            data: formData
          }, {
            successCallback: (data) => {
              this.$message.success('密码修改成功!')
              this.form.resetFields()
              this.closePane()
            }
          })
        }
      })
    },
    closePane () {
      this.$emit('close')
    },
    checkPassWord (value) {
      // 0： 表示第一个级别 1：表示第二个级别 2：表示第三个级别
      // 3： 表示第四个级别 4：表示第五个级别
      if (typeof value === 'undefined') {
        return
      }
      var modes = 0
      if (value.length < 8 || value.length > 18) { // 最初级别
        return modes
      }
      if (/[\u2E80-\u9FFF]/.test(value)) { // 不能包含中文
        return modes
      }
      if (/\d/.test(value)) { // 如果用户输入的密码 包含了数字
        modes++
      }
      if (/[a-z]/.test(value)) { // 如果用户输入的密码 包含了小写的a到z
        modes++
      }
      if (/[A-Z]/.test(value)) { // 如果用户输入的密码 包含了大写的A到Z
        modes++
      }
      if (/[-_]/.test(value)) { // 如果是特殊字符
        modes++
      }
      return modes
    }
  }
}
</script>
