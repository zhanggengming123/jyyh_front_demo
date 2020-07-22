<template>
  <div id="roleAuthority" class="fit">
    <ta-tabs @tabClick="onRadioClick" :activeKey="value" class="tab-style">
      <ta-tab-pane key="1" tab="角色维度" :forceRender="false"></ta-tab-pane>
      <ta-tab-pane key="2" tab="人员维度" :forceRender="false"></ta-tab-pane>
    </ta-tabs>
    <div style="height: calc(100% - 59px)">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import roleManagement from './part/role/roleManagement'
import userManagement from './part/user/userManagement'

const ROLE = '1'// 角色维度
const USER = '2'// 人员维度
export default {
  name: 'roleAuthority',
  components: { userManagement, roleManagement },
  data () {
    return {
      value: ROLE// 设置默认的tab选项，默认显示角色维度
    }
  },
  methods: {
    onRadioClick (key) {
      this.value = key
      if (key === ROLE) {
        this.$router.push({ name: 'roleManagement' })
      } else if (key === USER) {
        this.$router.push({ name: 'userManagement' })
      }
    }
  },
  activated () {
    if (this.$route.name === 'roleManagement') {
      this.value = '1'
    } else if (this.$route.name === 'userManagement') {
      this.value = '2'
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  #roleAuthority {
    border: 14px solid #f0f2f5
  }
  .tab-style {
    height: 59px;
    border-bottom: 0;
  }
</style>
