<template>
  <div>
  <div v-if="sysInfo.openSocialLogin" class="social-binding">
    <p>第三方账号</p>
    <div class="bind-list">
      <div class="bind-item" v-for="(item, index) in bindinglist" :key="index">
        <div class="bind-icon" :class="item.isBinding ? 'color-'+ item.providerId:''"><ta-icon :type="item.providerId" /></div>
        <div :style="{lineHeight: item.isBinding ? '20px': '40px'}" >
          <div class="bind-provider">{{item.providerId}}</div>
          <div class="bind-name" v-if="item.isBinding">{{item.displayname}}</div>
        </div>
        <a :class="{'color-unbind': !!item.isBinding }" @click="handleSocialBinding(item)">{{item.isBinding ? '解绑':'绑定'}}</a>
      </div>
    </div>
  </div>

  <div v-if="sysInfo.openSmsLogin" class="phone-binding">
    <p>手机号码</p>
    <div v-if="!phonebinded">
      <ta-tag>还未绑定哦！</ta-tag>
      <ta-button @click="showPhoneBindingPane=true">绑定手机</ta-button>
    </div>
    <div v-if="phonebinded">
      <ta-tag>{{phone}}</ta-tag>
      <ta-button @click="showPhoneDebindingPane=true">解绑</ta-button>
    </div>

    <ta-modal
      title="绑定手机"
      :visible="showPhoneBindingPane"
      :footer="null"
      @cancel="showPhoneBindingPane=false"
      width="450px"
      :bodyStyle="{paddingBottom:'10px'}"
    >
      <phone-Binding :show.sync="showPhoneBindingPane" :showPhoneBindingPane="showPhoneBindingPane" passState="1"></phone-Binding>
    </ta-modal>

    <ta-modal
      title="解绑手机"
      :visible="showPhoneDebindingPane"
      :footer="null"
      @cancel="showPhoneDebindingPane=false"
      width="450px"
      :bodyStyle="{paddingBottom:'10px'}"
    >
      <phone-debinding :show.sync="showPhoneDebindingPane" :phone="phone" passState="1"></phone-debinding>
    </ta-modal>
  </div>
  </div>
</template>
<script>
import phoneBinding from './phoneBinding'
import PhoneDebinding from './phoneDebinding'

export default {
  components: { PhoneDebinding, phoneBinding },
  data () {
    return {
      bindinglist: [],
      phonebinded: false,
      phone: '',
      showPhoneBindingPane: false,
      showPhoneDebindingPane: false
    }
  },
  mounted () {
    this.socialBindingQurey()
    this.phonebindingQurey()
  },
  computed: {
    sysInfo () {
      return this.$store.state.indexStore.sysInfo
    }
  },
  watch: {
    showPhoneBindingPane (newValue, oldValue) {
      this.phonebindingQurey()
    },
    showPhoneDebindingPane (newValue, oldValue) {
      this.phonebindingQurey()
    }
  },
  methods: {
    // 查询数据
    socialBindingQurey () {
      if (this.sysInfo.openSocialLogin == false) {
        return
      }
      this.Base.submit(null, {
        url: 'connect',
        method: 'GET'
      }, {
        successCallback: (data) => {
          this.bindinglist = data.data.bindinglist
        }
      })
    },
    handleSocialBinding ({ isBinding, providerId, providerUserId }) {
      if (isBinding) {
        /* 解绑 */
        this.Base.submit(null, {
          url: 'connect/' + providerId + '/' + providerUserId,
          method: 'DELETE'
        }, {
          successCallback: (data) => {
            // this.$notification.open({
            //   message: data.data.msg,
            //   description: '解绑后您可以点击绑定重新绑定对应平台账号'
            // })
            const modal = this.$success({
              title: data.data.msg,
              content: '提示将在 3 秒后关闭'
            })
            setTimeout(() => modal.destroy(), 3000)
            this.socialBindingQurey()
          }
        })
      } else {
        /* 绑定 */
        this.Base.submit(null, {
          url: 'connect/' + providerId
        }, {
          successCallback: (data) => {
            window.open(data.redirectUrl)
            window.close()
          }
        })
      }
    },
    phonebindingQurey () {
      if (this.sysInfo.openSmsLogin == false) {
        return
      }
      this.Base.submit(null, {
        url: '/phone/query'
      }, {
        successCallback: (data) => {
          var isBinded = data.data.isBinded
          var phone = data.data.phone
          if (isBinded == true) {
            this.phonebinded = true
            this.phone = phone
          } else {
            this.phonebinded = false
            this.phone = ''
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
  .social-binding {
    padding: 10px;
    p { color: #606266; margin-bottom: 20px;font-size: 20px }
    .bind-item {
      padding: 0 10px;
      margin-bottom: 15px;
      height: 40px;
      line-height: 40px;
      .user-select();
      > div {
        float: left;
      }
      .bind-icon {
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-radius: 100%;
        background: #ccc;
        color: #fff;
        font-size: 20px;
        margin: 4px 10px 0 0;
      }
      .color-qq { background: #00b0fb; }
      .color-wechat { background: #53d86f; }
      .color-alipay { background: #41aaee; }
      .color-unbind { color: @error-color; }
      .bind-provider {
        font-size: 14px;
      }
      .bind-name {
        font-size: 12px;
        color: #888;
      }
      a {
        float: right;
        cursor: pointer;
      }
      &:after {
        width: 0px;
        height: 0px;
        content: ".";
        display: block;
        clear: both;
        visibility: hidden;
      }
    }
  }
  .phone-binding{
    padding: 10px;
    p { color: #606266; margin-bottom: 20px;font-size: 20px }
  }
</style>
