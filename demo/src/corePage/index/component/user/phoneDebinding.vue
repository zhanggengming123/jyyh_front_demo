<template>
  <div>
    <p>您正在操作敏感数据，请输入密码和手机号获取验证码：</p>
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item
        label='密码'
        fieldDecoratorId="password"
        :require="{message:'请输入密码!'}"
      >
        <ta-input :disabled="lockInput" type="password" placeholder='当前登录者密码' />
      </ta-form-item>
      <p>将向{{phone}}发送验证码：</p>
      <ta-form-item
        label='验证码'
        fieldDecoratorId="smsCode"
        :require="{message:'请输入验证码!'}"
      >
        <ta-input style="width: 50%" type="input" placeholder='收到的验证码' />
        <ta-button @click="sendSms"
                   style="width: 50%;font-size: 12px;border:none;" :disabled="time">{{time == false ? '发送验证码' : time+'秒后可重发'}}
        </ta-button>
      </ta-form-item>

      <ta-form-item :wrapperCol="{span: 18,offset: 6}">
        <ta-button :disabled="lockSubmitButton" type='primary' @click="doDebinding" block="true">提交</ta-button>
      </ta-form-item>
    </ta-form>
  </div>
</template>

<script>
import pwdStr from '@yh/ta404-ui/es/utils/js/encryption'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'phone-debinding',
  data () {
    return {
      time: false,
      lockInput: false,
      lockSubmitButton: true
    }
  },
  computed: {
    ...mapGetters({
      passwordRSAState: 'passwordRSAState'
    })
  },
  props: {
    phone: {
      type: String
    }
  },
  methods: {
    sendSms () {
      const mobile = this.phone
      var password = this.form.getFieldValue('password')
      // 加密
      // this.passwordRSAState && (password = pwdStr.encryptString(password))
      password = pwdStr.encryptString(password)
      this.Base.submit(null, {
        url: '/phone/sendSms',
        data: {
          mobile: mobile,
          password: password
        }
      }, {
        successCallback: (data) => {
          this.lockInput = true
          this.lockSubmitButton = false
          let canResendTime = data.data.canResendTime
          const timeInterval = setInterval(() => {
            if (canResendTime == 0) {
              clearInterval(timeInterval)
              this.time = false
            } else {
              this.time = canResendTime--
            }
          }, 1000)
          console.log(data)
        }
      })
    },
    doDebinding () {
      const mobile = this.phone
      const smsCode = this.form.getFieldValue('smsCode')
      this.Base.submit(null, {
        url: '/phone/debinding',
        data: {
          mobile: mobile,
          smsCode: smsCode
        }
      }, {
        successCallback: (data) => {
          this.cancelThis()
          const modal = this.$success({
            title: '提示将在 2 秒后关闭',
            content: data.data.msg
          })
          setTimeout(() => modal.destroy(), 2000)
        },
        failCallback: (data) => {
          const modal = this.$success({
            title: '提示将在 2 秒后关闭',
            content: data.Error
          })
          setTimeout(() => modal.destroy(), 2000)
        }
      })
    },
    cancelThis () {
      this.form.resetFields()
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped>

</style>
