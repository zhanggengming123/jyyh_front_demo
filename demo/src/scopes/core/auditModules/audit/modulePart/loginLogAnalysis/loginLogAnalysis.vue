<template>
  <div id="loginLogAnalysis" class="fit">
    <ta-tabs @change="tabChange" v-model="activeKey" class="fit">
      <ta-tab-pane tab="用户在线时点分析" key="online">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </ta-tab-pane>
      <ta-tab-pane tab="用户登录时点分析" key="loginHistory">
        <keep-alive>
          <router-view name="loginHistory"></router-view>
        </keep-alive>
      </ta-tab-pane>
      <ta-tab-pane tab="用户登录环境分析" key="environment">
        <keep-alive>
          <router-view name="environment"></router-view>
        </keep-alive>
      </ta-tab-pane>
    </ta-tabs>
  </div>
</template>
<script>
export default {
  name: 'loginLogAnalysis',
  data () {
    return {
      activeKey: 'online'
    }
  },
  methods: {
    tabChange (activeKey) {
      if (activeKey === 'online') {
        this.$router.push({ name: 'online' })
      } else if (activeKey === 'loginHistory') {
        this.$router.push({ name: 'loginHistory' })
      } else if (activeKey === 'environment') {
        this.$router.push({ name: 'environment' })
      }
    }
  },
  activated () {
    if (this.activeKey) {
      this.$router.push({ name: this.activeKey })
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  #loginLogAnalysis { border: 14px solid #f0f2f5 }
</style>
