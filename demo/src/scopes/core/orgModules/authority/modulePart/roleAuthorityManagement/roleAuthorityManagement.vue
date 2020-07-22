<template>
  <div id="roleAuthorityManagement" class="fit">
    <ta-tabs @tabClick="onRadioClick" :activeKey="value" class="tab-style">
      <ta-tab-pane key="1" tab="角色维度"></ta-tab-pane>
      <ta-tab-pane key="2" tab="人员维度"></ta-tab-pane>
    </ta-tabs>
    <div style="height: calc(100% - 59px)">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'roleAuthorityManagement',
  data () {
    return {
      value: '1'
    }
  },
  methods: {
    onRadioClick (key) {
      this.value = key
      if (key == 1) {
        this.$router.push({ name: 'publicRoleManager' })
      } else if (key == 2) {
        this.$router.push({ name: 'userRole' })
      }
    }
  },
  activated () {
    if (this.$route.name === 'publicRoleManager') {
      this.value = '1'
    } else if (this.$route.name === 'userRole') {
      this.value = '2'
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  #roleAuthorityManagement {
    position: relative;
    background: @background-color-light;}
  .tab-style {
    height: 59px;
    border-bottom: 0;
    padding: 14px 14px 0px 14px;}
</style>
