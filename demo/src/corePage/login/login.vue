<template>
  <div class="body">
    <header>
      <div class="logo">
        <img v-if="false" src="./img/logo.png" alt="log">
      </div>
    </header>

    <img src="./img/taimg.png" style="height:60%;margin-left: 10%"/>
    <!--    <article>-->
    <div class="login-con">
      <div v-if="!showSmsLogin">
        <div class="header1">
          系统登录
          <span>SYSTEM LOGIN</span>
        </div>
        <login-form ref="loginForm" @modifyPasswordPaneCtr="modifyPasswordPaneCtr"></login-form>
      </div>
      <div v-if="showSmsLogin">
        <div class="header1">
          短信登录
          <span>SMS LOGINING</span>
        </div>
        <sms-login-form></sms-login-form>
      </div>
      <div class="header2" v-if="this.openSocialLogin||this.openSmsLogin">
        其他登录
        <span>OTHER LOGIN</span>
      </div>
      <div>
        <ta-button v-if="this.openSmsLogin" @click="showSmsLoginMethod" style="float:left;font-size: 12px;border:none;">
          {{showSmsLogin?'用户名密码登录':'短信验证码登录'}}
        </ta-button>
        <div v-if="this.openSocialLogin" style="float: right">
          <social-list passState="1"></social-list>
        </div>
      </div>
    </div>

    <ta-modal
      title="修改密码"
      :visible="showModifyPasswordPane"
      :footer="null"
      @cancel="modifyPasswordPaneCtr"
      width="390px"
      :bodyStyle="{paddingBottom:'10px'}"
    >
      <modify-password :show.sync="showModifyPasswordPane" passState="1"></modify-password>
    </ta-modal>

    <!--    </article>-->

    <footer>
      <span>Ta+3 404开发框架</span>
    </footer>
  </div>

</template>

<script>

import loginForm from './part/loginForm'
import modifyPassword from './part/modifyPassword'
import socialList from './part/socialList'
import smsLoginForm from './part/smsLoginForm'
import { mapGetters } from 'vuex'

export default {
  name: 'login',
  components: { smsLoginForm, modifyPassword, loginForm, socialList },
  data () {
    return {
      showModifyPasswordPane: false,
      showSocialList: true,
      showSmsLogin: false
    }
  },
  computed: {
    ...mapGetters({
      openSocialLogin: 'openSocialLogin',
      openSmsLogin: 'openSmsLogin'
    })
  },
  created () {
    this.$store.dispatch('getSysCfg')
  },
  methods: {
    modifyPasswordPaneCtr () {
      this.showModifyPasswordPane = !this.showModifyPasswordPane
    },
    showSmsLoginMethod () {
      this.showSmsLogin = !this.showSmsLogin
    }

  },
  watch: {
    showModifyPasswordPane (value, old) {
      if (value === false) {
        this.$refs.loginForm.refreshCode()
      }
    }
  }

}
</script>

<style scoped type="text/less" lang="less">

  .body {
    background: @primary-color;
    height: 100%;
  }

  header {
    padding: 50px 50px;
  }

  footer {
    width: 100%;
    position: fixed;
    bottom: 0px;
    text-align: center;

    span {
      width: 576px;
      height: 13px;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 90px;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }

  .login-con {
    background: #fff;
    border-radius: 2px;
    padding: 50px;
    width: 366px;
    box-sizing: border-box;
    position: absolute;
    right: 15%;
    top: 25%;

    .header1 {
      height: 60px;
      font-size: 24px;
      color: @text-color;

      > span {
        margin-left: 10px;
        font-size: 16px;
        color: @text-color-secondary;
      }
    }

    .header2 {
      height: 60px;
      font-size: 20px;
      color: @text-color;

      > span {
        margin-left: 10px;
        font-size: 12px;
        color: @text-color-secondary;
      }
    }

  }

</style>
