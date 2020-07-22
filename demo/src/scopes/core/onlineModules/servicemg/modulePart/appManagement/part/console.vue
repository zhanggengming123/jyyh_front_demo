<template>
  <div class="console">
    <div class="console-menu-box" v-if="!fullScreen">
      <div class="console-menu">
        <div class="console-logo">{{appInfo.appName}}</div>
        <ta-menu :defaultSelectedKeys="[selectedMenu]" mode="inline" theme="dark" @click="menuClick">
          <ta-menu-item key="dashboard">
            <ta-icon type="dashboard"/>
            <span>概览</span>
          </ta-menu-item>
          <ta-menu-item key="assemble">
            <ta-icon type="edit"/>
            <span>功能组装</span>
          </ta-menu-item>
          <ta-menu-item key="dataInfo" disabled>
            <ta-icon type="table"/>
            <span>数据</span>
          </ta-menu-item>
          <ta-menu-item key="siteSetting">
            <ta-icon type="setting"/>
            <span>设置</span>
          </ta-menu-item>
        </ta-menu>
      </div>
      <div class="console-content">
        <router-view v-if="!fullScreen"></router-view>
      </div>
    </div>
    <router-view v-if="fullScreen"></router-view>
  </div>
</template>
<script>
import $api from '../api/index'

export default {
  name: 'console',
  data () {
    return {
      appInfo: this.$route.query
    }
  },
  computed: {
    selectedMenu () {
      let result = ''
      if (this.$route.name == 'deploymentSetting') {
        result = 'siteSetting'
      } else {
        result = this.$route.name ? this.$route.name : 'dashboard'
      }
      return result
    },
    fullScreen () {
      return this.$route.name == 'assemble'
    }
  },
  mounted () {
    document.title = this.appInfo.appName
  },
  methods: {
    menuClick ({ item, key, keyPath }) {
      this.$router.push({ path: key, query: { appId: this.appInfo.appId, appName: this.appInfo.appName } })
    }
  }
}
</script>
<style lang="less" scoped type="text/less">
  @menu-color: #001529;
  @menu-width: 160px;
  .mg-t2 {
    margin-top: 20px;
  }

  .fl-r {
    float: right;
  }

  .fl-l {
    float: left;
  }

  .console, .console-menu-box {
    width: 100%;
    height: 100%;
  }

  .console-logo {
    width: 100%;
    height: 50px;
    color: #ffffff;
    line-height: 50px;
    padding-left: 24px;
    font-size: 18px;
  }

  .console-menu {
    width: @menu-width;
    height: 100%;
    background-color: @menu-color;
    box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
  }

  .console-content {
    position: absolute;
    left: @menu-width;
    top: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    background-color: #f0f2f5;
    padding: 20px;
  }
</style>
