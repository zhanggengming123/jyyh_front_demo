<template>
  <ta-form  :autoFormCreate="(form)=>{this.form = form}" layout="vertical">
    <ta-form-item
      fieldDecoratorId="username"
      :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入用户名!' }]}"
    >
      <ta-input placeholder="用户名" @blur="checkUser" @pressEnter="gotoDeal($event,'password')">
        <ta-icon slot="prefix" type="user"/>
      </ta-input>
    </ta-form-item>
    <ta-form-item
      fieldDecoratorId="password"
      :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码!' }]}"
    >
      <ta-input placeholder="密码" type="password" style="width: 70%"
                @pressEnter="gotoDeal($event,simpleCheckCodeState?'checkCode':'sbbtn')" autocomplete="new-password">
        <ta-icon slot="prefix" type="lock"/>
      </ta-input>
      <ta-button @click="showModifyPasswordPane" style="width: 30%; font-size: 12px; border:none; margin: 0; box-shadow: none;">密码修改</ta-button>
    </ta-form-item>
    <ta-form-item
      v-if="simpleCheckCodeState"
      fieldDecoratorId="checkCode"
      :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入验证码!' }]}"
    >
      <ta-input style="width: 60%" placeholder="验证码" ref="checkCode" @pressEnter="gotoDeal($event,'sbbtn')">
        <ta-icon slot="prefix" type="appstore"/>
      </ta-input>
      <img style="width: 40%" @click="refreshCode();" :src="imgSrc" title="点击获取验证码"/>
    </ta-form-item>

    <div id="loginCheckCodeDiv" v-show="slideCheckCodeState">
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
      <ta-button id="sbbtn" type="primary" block @click="handleSubmit" @keyup.enter="handleSubmit">立即登录</ta-button>
    </ta-form-item>
  </ta-form>
</template>

<script>
import '../css/SlideCheckCode.less'
import pwdStr from '@yh/ta404-ui/es/utils/js/encryption'
import getCodeSrc from '../js/getCodeSrc'
import systemInfo from '../js/clientEnvironment'
import slideCheckCode from '../js/SlideCheckCode'
import { mapGetters } from 'vuex'

export default {
  name: 'loginForm',
  data () {
    return {
      imgSrc: getCodeSrc(),
      slideCode: null
    }
  },
  computed: {
    ...mapGetters({
      showSimpleCheckCode: 'showSimpleCheckCode',
      simpleCheckCodeState: 'simpleCheckCodeState',
      slideCheckCodeState: 'slideCheckCodeState',
      showSlideCheckCode: 'showSlideCheckCode',
      passwordRSAState: 'passwordRSAState'
    })
  },
  mounted () {
    document.getElementById('username').focus()

    if (this.showSlideCheckCode) {
      const obj = this
      this.slideCode = new SlideCheckCode('loginCheckCodeDiv', {
        successCallBack: function () {
          obj.handleSubmit()
        }
      })
    }
  },
  methods: {
    // checkUser
    checkUser (e) {
      const value = e.target.value
      if (value) {
        this.Base.submit(null, {
          url: 'loginRestService/checkUser',
          showPageLoading: false,
          withCredentials: false,
          data: {
            username: value
          }
        }).then((data) => {
          // 校验成功处理次数
          this.$store.commit('setSysCfg', {
            sessionPasswordErrorNumber: data.data.sessionPasswordErrorNumber
          })
        })
      }
    },
    refreshCode () {
      if (this.showSimpleCheckCode) {
        this.imgSrc = getCodeSrc()
      }

      if (this.showSlideCheckCode && this.slideCode != null) {
        this.slideCode.refreshSlideCheckCode()
      }
    },
    handleSubmit () {
      let formData = this.form.getFieldsValue()
      // 系统信息
      formData = Object.assign(formData, systemInfo)
      // 加密
      this.passwordRSAState && (formData.password = pwdStr.encryptString(formData.password))

      this.Base.submit(
        this.form, {
          url: '/login',
          data: formData,
          autoValid: true
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
            document.getElementById('username').focus()
            // 修改次数
            data.data.passwordDefaultNum !== null &&
              this.$store.commit('setSysCfg', {
                sessionPasswordErrorNumber: data.data.passwordDefaultNum
              })
            this.refreshCode()
          }
        })
    },
    gotoDeal (e, nextEl) {
      const event = e || window.event
      const el = event.target || event.srcElement
      if (el.value) {
        document.getElementById(nextEl).focus()
      } else {
        el.focus()
      }
    },
    showModifyPasswordPane () {
      this.$emit('modifyPasswordPaneCtr')
    }
  },
  watch: {
    simpleCheckCodeState (now, old) {
      this.refreshCode()
    }
  }
}
</script>
