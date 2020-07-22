<template>
<div>
<!--  <div id="jump">-->
<!--  <ta-button style="border-bottom-color: #0f990f" @click="doRedict">点击跳转</ta-button>-->
<!--  </div>-->
  <div id="placeholder"></div>
  <div id="a">
  <label id="reminder">{{'提示：'+this.info}}</label>
  </div>
  <div id="b">
  <label id="countDown" v-if="showCountDown">{{'正在跳转……'+this.time}}</label>
  </div>
</div>
</template>

<script>
export default {
  name: 'uiredirect',
  mounted () {
    this.doRedict()
  },
  data () {
    return {
      infos: {
        binding: '绑定账号中……',
        binded: '账号绑定成功',
        notBinded: '账号未关联系统账号，请先登录系统账号绑定'
      },
      time: 3,
      info: 'xxx',
      showCountDown: true
    }
  },
  methods: {
    doRedict () {
      var who = this.getQueryVariable('who')
      if (who == 'TOKEN_AGAIN') {
        this.tokenAgain()
      } else if (who == 'SESSION_SUCCESS') {
        this.sessionSuccess()
      } else if (who == 'NOT_BINDED') {
        this.notBinded()
      }
    },
    tokenAgain () {
      this.info = this.infos.binding
      this.showCountDown = false
      var code = this.getQueryVariable('code')
      var providerId = this.getQueryVariable('providerId')
      const mode = 'tokenMode'
      this.Base.submit(null, {
        url: 'connect/again/' + providerId,
        method: 'GET',
        params: {
          code: code,
          mode: mode
        }
      }, {
        successCallback: (data) => {
          this.info = this.infos.binded
          this.showCountDown = true
          this.countDown(data.redirectUrl)
        }
      })
    },
    sessionSuccess () {
      this.info = this.infos.binded
      var domainPageUrl = this.getQueryVariable('domainPageUrl')
      this.countDown(domainPageUrl)
    },
    notBinded () {
      this.info = this.infos.notBinded
      var loginPageUrl = this.getQueryVariable('loginPageUrl')
      this.countDown(loginPageUrl)
    },
    getQueryVariable (variable) {
      var query = window.location.search.substring(1)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == variable) { return pair[1] }
      }
      return (false)
    },
    countDown (url) {
      let canResendTime = 3
      const timeInterval = setInterval(() => {
        if (canResendTime == 0) {
          clearInterval(timeInterval)
          window.location.href = url
        } else {
          this.time = canResendTime--
        }
      }, 1000)
    }
  }
}

</script>

<style scoped type="text/less" lang="less">
  #placeholder{
    position: relative;
    padding-top: 10%;
  }
  #a{
    position: relative;
    padding: 20px;
    text-align: center;
  }
  #b{
    position: relative;
    padding: 20px;
    text-align: center;
  }
  #reminder {
    background: #fff;
    padding: 10px;
    font-size: 20px;
    color: @text-color;
  }
  #countDown {
    background: #fff;
    padding: 10px;
    font-size: 20px;
    color: @text-color;
  }
  #jump{
    position: relative;
    /*padding: 20px;*/
    text-align: center;
    border-color: #000c17;
    border-style: solid;
  }
</style>
