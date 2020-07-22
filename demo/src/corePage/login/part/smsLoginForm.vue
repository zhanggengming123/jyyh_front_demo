<template>
  <ta-form :autoFormCreate="(form)=>{this.form = form}" layout="vertical">
    <ta-form-item
      fieldDecoratorId="mobile"
      :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入手机号!' }]}"
    >
      <ta-input placeholder="手机号" :disabled="disablePhoneInput">
        <ta-icon slot="prefix" type="phone"/>
      </ta-input>
    </ta-form-item>

    <ta-form-item
      fieldDecoratorId="smsCode"
      :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入验证码!' }]}"
    >
      <ta-input placeholder="验证码" style="width: 50%">
        <ta-icon slot="prefix" type="lock"/>
      </ta-input>

      <ta-button @click="fireSendMessage"
                 style="width: 50%;font-size: 12px;border:none;" :disabled="time ? true:false">{{time == false ? '发送验证码' :
        time+'秒后可重发'}}
      </ta-button>
    </ta-form-item>
    <ta-form-item v-if="showUserSelector">
      <ta-select id="loginIdSelector" :options="loginIds" mode="default" placeholder="请选择用户名" @select="handleChange">
      </ta-select>
    </ta-form-item>

    <ta-form-item>
      <ta-button :disabled="disableSubmitButton" id="sbbtn" type="primary" block @click="handleSubmit" @keyup.enter="handleSubmit">立即登录</ta-button>
    </ta-form-item>
  </ta-form>
</template>

<script>
export default {
  name: 'smsLoginForm',
  components: {},
  data () {
    return {
      showFireSendMessageButton: true,
      showUserSelector: false,
      disablePhoneInput: false,
      disableSubmitButton: true,
      time: false,
      loginIds: [],
      loginId: ''
    }
  },
  methods: {
    // checkMobile and sendMessage
    fireSendMessage () {
      const mobile = this.form.getFieldValue('mobile')
      if (!(mobile == null)) {
        this.Base.submit(null, {
          url: 'loginRestService/checkMobile',
          data: {
            mobile: mobile
          }
        }, {
          successCallback: (data) => {
            this.loginIds = data.data.loginIds
            console.log(this.loginIds)
            // var loginIdSelector = document.getElementById('loginIdSelector')
            // if (data.data.justOne == true) {
            //   loginIdSelector.defaultValue = this.loginIds[0]
            // } else {
            //   loginIdSelector.defaultValue = this.loginIds[0]
            //   this.showUserSelector = true
            // }
            this.showUserSelector = true
            this.sendSms(mobile)
            this.showFireSendMessageButton = !this.showFireSendMessageButton
          },
          failCallback: (data) => {
          }
        })
      }
    },
    sendSms (mobile) {
      this.Base.submit(null, {
        url: '/code/sms',
        // content_type: 'application/json;charset=UTF-8',
        data: {
          mobile: mobile
        }
      }, {
        successCallback: (data) => {
          this.disablePhoneInput = true
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
    handleSubmit () {
      const mobile = this.form.getFieldValue('mobile')
      const smsCode = this.form.getFieldValue('smsCode')
      this.Base.submit(null, {
        url: '/authentication/mobile',
        data: {
          mobile: mobile,
          smsCode: smsCode,
          loginId: this.loginId
        }
      }, {
        successCallback: (data) => {
          const accessToken = data.data['TA-JTOKEN']
          const refreshToken = data.data['TA-RJTOKEN']
          if (accessToken != null && accessToken != '') {
            Base.setCookie(faceConfig.basePath + 'TA-JTOKEN', accessToken, 0, '/')
          }
          if (refreshToken != null && refreshToken != '') {
            Base.setCookie(faceConfig.basePath + 'TA-RJTOKEN', refreshToken, 0, '/')
          }

          window.location.href = 'index.html'
        },
        failCallback: (data) => {
        }
      })
    },
    handleChange (value) {
      this.loginId = value
      this.disableSubmitButton = false
    },
    gotoDeal (e, nextEl) {
      const event = e || window.event
      const el = event.target || event.srcElement
      if (el.value) {
        document.getElementById(nextEl).focus()
      } else {
        el.focus()
      }
    }
  }
}
</script>

<style scoped>

</style>
