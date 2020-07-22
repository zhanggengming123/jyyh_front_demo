<template>
  <div id="adminAuthority" class="fit">
    <ta-tabs @tabClick="onRadioClick" :activeKey="value" class="tab-style">
      <ta-tab-pane key="1" tab="角色维度" ></ta-tab-pane>
      <ta-tab-pane key="2" tab="人员维度" ></ta-tab-pane>
    </ta-tabs>
    <div style="height: calc(100% - 59px)">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import AdminRoleManagement from './part/role/adminRoleManagement'
import AdminUserManagement from './part/user/adminUserManagement'

const ROLE = '1'// 角色维度
const USER = '2'// 人员维度
export default {
  name: 'adminAuthority',
  components: { AdminUserManagement, AdminRoleManagement },
  data () {
    return {
      value: ROLE// 设置默认的tab选项，默认显示角色维度
    }
  },
  methods: {
    onRadioClick (key) {
      this.value = key
      if (key == ROLE) {
        this.$router.push({ name: 'adminRoleManagement' })
      } else if (key == USER) {
        this.$router.push({ name: 'adminUserManagement' })
      }
    }
  },
  activated () {
    if (this.$route.name === 'adminRoleManagement') {
      this.value = '1'
    } else if (this.$route.name === 'adminUserManagement') {
      this.value = '2'
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  #adminAuthority {
    /*border: 14px solid #f0f2f5;*/
    position: relative;
    background: @background-color-light;
  }

  .tab-style {
    height: 59px;
    border-bottom: 0;
    padding: 14px 14px 0px 14px;
  }
</style>
