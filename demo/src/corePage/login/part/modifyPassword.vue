<template>
  <ta-form :autoFormCreate="(form)=>{this.form = form}" layout="vertical">
    <ta-form-item
      fieldDecoratorId="loginId"
      :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入用户名!' }]}"
    >
      <ta-input placeholder="用户名">
        <ta-icon slot="prefix" type="user"/>
      </ta-input>
    </ta-form-item>
    <ta-form-item
      fieldDecoratorId="oldPassword"
      :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入原始密码!' }]}"
    >
      <ta-input placeholder="密码" type="password" autocomplete="new-password">
        <ta-icon slot="prefix" type="lock"/>
      </ta-input>

    </ta-form-item>
    <ta-form-item
      fieldDecoratorId="newPassword"
      :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入新密码!' },{validator:checkPasswordNext}]}"
    >
      <ta-input placeholder="新密码" type="password" @blur="handleConfirmBlur">
        <ta-icon slot="prefix" type="lock"/>
      </ta-input>

    </ta-form-item>

    <ta-form-item
      fieldDecoratorId="newPasswordConfirm"
      :fieldDecoratorOptions="{rules: [{ required: true, message: '再次输入新密码!' },{validator:checkPasswordPre}]}"
    >
      <ta-input placeholder="再次输入新密码" type="password">
        <ta-icon slot="prefix" type="lock"/>
      </ta-input>

    </ta-form-item>

    <ta-form-item
      v-if="showSimpleCheckCode"
      fieldDecoratorId="checkCode"
      :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入验证码!' }]}"
    >

      <ta-input style="width: 60%" placeholder="验证码">
        <ta-icon slot="prefix" type="appstore"/>
      </ta-input>
      <img style="width: 40%" @click="refreshCode();" :src="imgSrc" title="点击获取验证码"/>
    </ta-form-item>

    <div id="modifyCheckCodeDiv" v-show="showSlideCheckCode">
      <div class="codeDragValidate-layout-div" >
        <div class="codeDragBar-drag-div">
          <div class="codeDrag-win-div">
            <div class="codeDrag-win-div-body">
              <div class="codeDrag-bg-img-div">
                <img class="codeDrag-code-img" src="#" alt="背景图"/>
                <img class="codeDrag-darg-img" src="#" alt="拖动图"/>
              </div>
              <div class="codeDrag-code-refresh" ></div>
            </div>
          </div>
          <div class="dragBar">
            <span></span>
          </div>
          <div class="dragBar-inDrag-bg"></div>
          <div class="dragBar-base-bg">
            <span>向右滑动确认修改</span>
          </div>
        </div>
        </div>
    </div>

    <ta-form-item>
        <span style="float: right">
        <ta-button @click="cancelModify">取消</ta-button>
        <ta-button style="margin-left: 10px" type="primary" @click="handleSubmit">确定</ta-button>
        </span>
    </ta-form-item>

  </ta-form>
</template>

<script>
import '../css/SlideCheckCode.less'
import pwdStr from '@yh/ta404-ui/es/utils/js/encryption'
import getCodeSrc from '../js/getCodeSrc'
import { mapGetters } from 'vuex'
import slideCheckCode from '../js/SlideCheckCode'

export default {
  name: 'modify-password',
  props: {
    show: {
      type: Boolean
    },
    // 是不是登录页
    passState: {
      type: String
    }
  },
  data () {
    return {
      confirmDirty: false,
      modes: 0,
      imgSrc: getCodeSrc(),
      modifySlideCode: null
    }
  },
  mounted () {
    if (this.showSlideCheckCode) {
      const obj = this
      this.modifySlideCode = new SlideCheckCode('modifyCheckCodeDiv', {
        successCallBack: function () {
          obj.handleSubmit()
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      showSimpleCheckCode: 'showSimpleCheckCode',
      showSlideCheckCode: 'showSlideCheckCode',
      passwordRSAState: 'passwordRSAState'
    })
  },
  methods: {
    // 提交数据
    handleSubmit () {
      const formData = this.form.getFieldsValue()
      if (this.passwordRSAState) {
        formData.oldPassword = pwdStr.encryptString(formData.oldPassword)
        formData.newPassword = pwdStr.encryptString(formData.newPassword)
      }
      if (formData.newPasswordConfirm) {
        delete formData.newPasswordConfirm
      }

      // 是否为登录页修改密码
      formData.indexChangePass = this.passState
      this.Base.submit(this.form, {
        url: 'loginRestService/changePassword',
        data: formData,
        autoValid: true
      }, {
        successCallback: (data) => {
          this.$message.success('密码修改成功!')
          this.cancelModify()
        },
        failCallback: (data) => {
          this.refreshCode()
        }
      })
    },
    cancelModify () {
      this.form.resetFields()
      this.$emit('update:show', false)
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    checkPasswordNext (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['newPasswordConfirm'], { force: true })
      }
      // 检查并提示密码强度
      const modes = this.checkPassWord(value)
      if (modes < 2) {
        callback('请至少包含大写字母、小写字母、数字、特殊字符(_或-)中的两种，且长度为8~18位')
      } else {
        callback()
      }
    },
    checkPasswordPre (rule, value, callback) {
      const pwd = this.form.getFieldValue('newPassword')
      if (value && value != pwd) {
        callback('两次密码不同!')
      } else {
        callback()
      }
    },
    refreshCode () {
      if (this.showSimpleCheckCode) {
        this.imgSrc = getCodeSrc()
      }

      if (this.showSlideCheckCode && this.modifySlideCode != null) {
        this.modifySlideCode.refreshSlideCheckCode()
      }
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
      if (/[_-]/.test(value)) { // 如果是特殊字符
        modes++
      }
      return modes
    }
  },
  watch: {
    show (newValue, oldValue) {
      if (newValue == true) {
        this.form.resetFields()
        this.refreshCode()
      }
    }
  }

}
</script>
