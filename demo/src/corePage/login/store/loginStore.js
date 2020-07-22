import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const loginStore = new Vuex.Store({
  state: {
    sysCfg: {
      passwordRSA: true,
      userCheckCode: true,
      checkCodeType: 'simple',
      passwordValidationErrorNumber: 2,
      sessionPasswordErrorNumber: 0,
      openSocialLogin: false,
      openSmsLogin: false
    }
  },
  getters: {
    // 登录是否显示验证码
    simpleCheckCodeState: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType == 'simple' && (state.sysCfg.sessionPasswordErrorNumber >= state.sysCfg.passwordValidationErrorNumber)) {
        return true
      }
      return false
    },
    slideCheckCodeState: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType == 'slide' && (state.sysCfg.sessionPasswordErrorNumber >= state.sysCfg.passwordValidationErrorNumber)) {
        return true
      }
      return false
    },
    // 是否配置显示验证码
    showSimpleCheckCode: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType == 'simple') {
        return true
      }
      return false
    },
    showSlideCheckCode: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType == 'slide') {
        return true
      }
      return false
    },
    // 是否RSA加密
    passwordRSAState: (state) => {
      if (state.sysCfg.passwordRSA === true || state.sysCfg.passwordRSA === 'true') {
        return true
      }
      return false
    },
    // 是否开启social登录
    openSocialLogin: (state) => {
      if (state.sysCfg.openSocialLogin === true || state.sysCfg.openSocialLogin === 'true') {
        return true
      }
      return false
    },
    // 是否开启短信验证码登录
    openSmsLogin: (state) => {
      if (state.sysCfg.openSmsLogin === true || state.sysCfg.openSmsLogin === 'true') {
        return true
      }
      return false
    }
  },
  actions: {
    getSysCfg ({ commit }) {
      Base.submit(null, {
        url: 'loginRestService/getConfig',
        withCredentials: false
      }, {
        successCallback: (data) => {
          commit('setSysCfg', data.data.configMap || {})
        }
      })
    }
  },
  mutations: {
    setSysCfg (state, cfg) {
      state.sysCfg = { ...state.sysCfg, ...cfg }
    }
  }

})

export default loginStore
